import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  EquipmentType,
  EquipmentTypeListParams,
  EquipmentTypePage,
  EquipmentTypeRequest,
} from '../../roles/super-admin/pages/equipment-types/equipment-type.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/equipment-types`;

@Injectable({ providedIn: 'root' })
export class EquipmentTypeService {
  private readonly http = inject(HttpClient);

  list(params: EquipmentTypeListParams): Promise<EquipmentTypePage> {
    let httpParams = new HttpParams().set('page', params.page).set('size', params.size);
    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    if (params.category) {
      httpParams = httpParams.set('category', params.category);
    }
    return firstValueFrom(this.http.get<EquipmentTypePage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<EquipmentType> {
    return firstValueFrom(this.http.get<EquipmentType>(`${BASE_URL}/${id}`));
  }

  create(request: EquipmentTypeRequest): Promise<EquipmentType> {
    return firstValueFrom(this.http.post<EquipmentType>(BASE_URL, request));
  }

  update(id: number, request: EquipmentTypeRequest): Promise<EquipmentType> {
    return firstValueFrom(this.http.put<EquipmentType>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
