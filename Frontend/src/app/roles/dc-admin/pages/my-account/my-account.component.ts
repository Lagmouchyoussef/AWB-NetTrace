import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { DcAdminMyAccountService } from '../../../../core/services/dc-admin-my-account.service';
import { AllowedIp, MyAccount } from '../../../super-admin/pages/my-account/my-account.model';

@Component({
  selector: 'app-dc-admin-my-account',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css',
})
export class DcAdminMyAccountComponent implements OnInit {
  private readonly myAccountService = inject(DcAdminMyAccountService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly account = signal<MyAccount | null>(null);
  protected readonly allowedIps = signal<AllowedIp[]>([]);
  protected readonly photoPreview = signal<string | null>(null);
  protected readonly loading = signal(true);
  protected readonly loadErrorKey = signal<string | null>(null);

  protected readonly profileSaving = signal(false);
  protected readonly profileErrorKey = signal<string | null>(null);
  protected readonly profileSavedMessage = signal(false);

  protected readonly passwordSaving = signal(false);
  protected readonly passwordErrorKey = signal<string | null>(null);
  protected readonly passwordSavedMessage = signal(false);

  protected readonly newIpAddress = signal('');
  protected readonly ipErrorKey = signal<string | null>(null);

  protected readonly profileForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    fullName: new FormControl(''),
    email: new FormControl('', { validators: [Validators.email] }),
    phone: new FormControl(''),
    matricule: new FormControl(''),
  });

  protected readonly passwordForm = new FormGroup({
    currentPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    this.loadErrorKey.set(null);
    try {
      await this.loadAccount();
      await this.loadAllowedIps();
    } catch {
      this.loadErrorKey.set('myAccount.loadError');
    } finally {
      this.loading.set(false);
    }
  }

  protected onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  protected onRemovePhoto(): void {
    this.photoPreview.set(null);
  }

  protected async onSaveProfile(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.profileSaving.set(true);
    this.profileErrorKey.set(null);
    this.profileSavedMessage.set(false);
    const value = this.profileForm.getRawValue();
    try {
      const updated = await this.myAccountService.update({
        ...value,
        profilePhoto: this.photoPreview(),
      });
      this.account.set(updated);
      this.profileSavedMessage.set(true);
    } catch {
      this.profileErrorKey.set('myAccount.saveError');
    } finally {
      this.profileSaving.set(false);
    }
  }

  protected async onChangePassword(): Promise<void> {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const value = this.passwordForm.getRawValue();
    if (value.newPassword !== value.confirmPassword) {
      this.passwordErrorKey.set('myAccount.passwordMismatch');
      return;
    }

    this.passwordSaving.set(true);
    this.passwordErrorKey.set(null);
    this.passwordSavedMessage.set(false);
    try {
      await this.myAccountService.changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      });
      this.passwordForm.reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
      this.passwordSavedMessage.set(true);
    } catch {
      this.passwordErrorKey.set('myAccount.passwordError');
    } finally {
      this.passwordSaving.set(false);
    }
  }

  protected async onToggleIpRestriction(): Promise<void> {
    const current = this.account();
    if (!current) {
      return;
    }
    const next = !current.ipRestrictionEnabled;
    await this.myAccountService.setIpRestrictionEnabled(next);
    this.account.set({ ...current, ipRestrictionEnabled: next });
  }

  protected onNewIpAddressChange(value: string): void {
    this.newIpAddress.set(value);
  }

  protected async onAddAllowedIp(): Promise<void> {
    const ipAddress = this.newIpAddress().trim();
    if (!ipAddress) {
      return;
    }
    this.ipErrorKey.set(null);
    try {
      const created = await this.myAccountService.addAllowedIp({ ipAddress });
      this.allowedIps.update((list) => [...list, created]);
      this.newIpAddress.set('');
    } catch {
      this.ipErrorKey.set('myAccount.ipSaveError');
    }
  }

  protected async onDeleteAllowedIp(allowedIp: AllowedIp): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'myAccount.deleteIpTitle',
      messageKey: 'myAccount.deleteIpMessage',
      messageParams: { name: allowedIp.ipAddress },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.myAccountService.deleteAllowedIp(allowedIp.id);
      this.allowedIps.update((list) => list.filter((ip) => ip.id !== allowedIp.id));
    }
  }

  protected roleLabel(): string {
    const role = this.account()?.role;
    return role ? this.translateService.instant(`users.role.${role}`) : '';
  }

  private async loadAccount(): Promise<void> {
    const account = await this.myAccountService.get();
    this.account.set(account);
    this.photoPreview.set(account.profilePhoto);
    this.profileForm.setValue({
      username: account.username,
      fullName: account.fullName ?? '',
      email: account.email ?? '',
      phone: account.phone ?? '',
      matricule: account.matricule ?? '',
    });
  }

  private async loadAllowedIps(): Promise<void> {
    const ips = await this.myAccountService.listAllowedIps();
    this.allowedIps.set(ips);
  }
}
