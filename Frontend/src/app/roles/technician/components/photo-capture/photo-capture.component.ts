import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TechnicianPhotoService } from '../../../../core/services/technician-photo.service';
import { InterventionPhotoMeta, PhotoPhase } from '../../technician-execution.model';

const MAX_DIMENSION_PX = 1600;
const JPEG_QUALITY = 0.75;

interface PhotoTile {
  meta: InterventionPhotoMeta;
  objectUrl: string | null;
}

// "Before"/"After" evidence capture. Uses the device camera directly via
// input[capture="environment"] rather than a plain file picker, and re-encodes every photo
// through a canvas before upload (resized + JPEG-compressed) so a phone's multi-megabyte camera
// output never hits the network at full size - field connectivity in a datacenter basement can't
// be assumed to be fast.
@Component({
  selector: 'app-photo-capture',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './photo-capture.component.html',
  styleUrl: './photo-capture.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoCaptureComponent implements OnInit, OnDestroy {
  readonly interventionId = input.required<number>();
  readonly phase = input.required<PhotoPhase>();
  readonly disabled = input<boolean>(false);

  protected readonly loading = signal(true);
  protected readonly uploading = signal(false);
  protected readonly tiles = signal<PhotoTile[]>([]);
  protected readonly error = signal<string | null>(null);

  private readonly photoService = inject(TechnicianPhotoService);

  async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  ngOnDestroy(): void {
    for (const tile of this.tiles()) {
      if (tile.objectUrl) {
        URL.revokeObjectURL(tile.objectUrl);
      }
    }
  }

  private async refresh(): Promise<void> {
    this.loading.set(true);
    try {
      const all = await this.photoService.list(this.interventionId());
      const forThisPhase = all.filter((p) => p.phase === this.phase());
      const tiles: PhotoTile[] = await Promise.all(
        forThisPhase.map(async (meta) => ({
          meta,
          objectUrl: await this.photoService.fetchObjectUrl(this.interventionId(), meta.id),
        })),
      );
      this.tiles.set(tiles);
    } finally {
      this.loading.set(false);
    }
  }

  protected async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    this.error.set(null);
    this.uploading.set(true);
    try {
      const compressed = await this.compress(file);
      await this.photoService.upload(this.interventionId(), this.phase(), compressed);
      await this.refresh();
    } catch {
      this.error.set('technician.interventionDetail.photoUploadError');
    } finally {
      this.uploading.set(false);
    }
  }

  protected async onDelete(tile: PhotoTile): Promise<void> {
    await this.photoService.delete(this.interventionId(), tile.meta.id);
    if (tile.objectUrl) {
      URL.revokeObjectURL(tile.objectUrl);
    }
    await this.refresh();
  }

  private async compress(file: File): Promise<Blob> {
    const dataUrl = await this.readAsDataUrl(file);
    const image = await this.loadImage(dataUrl);
    return this.encodeCompressed(image);
  }

  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('read failed'));
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  private loadImage(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onerror = () => reject(new Error('decode failed'));
      image.onload = () => resolve(image);
      image.src = dataUrl;
    });
  }

  private encodeCompressed(image: HTMLImageElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const scale = Math.min(1, MAX_DIMENSION_PX / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('canvas unsupported'));
        return;
      }
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('encode failed'))),
        'image/jpeg',
        JPEG_QUALITY,
      );
    });
  }
}
