import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Datacenter,
  DatacenterListParams,
  DatacenterPage,
  DatacenterRequest,
} from '../../roles/super-admin/pages/datacenters/datacenter.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/datacenters`;

@Injectable({ providedIn: 'root' })
export class DatacenterService {
  private readonly http = inject(HttpClient);

  list(params: DatacenterListParams): Promise<DatacenterPage> {
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
    if (params.tier) {
      httpParams = httpParams.set('tier', params.tier);
    }
    return firstValueFrom(this.http.get<DatacenterPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<Datacenter> {
    return firstValueFrom(this.http.get<Datacenter>(`${BASE_URL}/${id}`));
  }

  create(request: DatacenterRequest): Promise<Datacenter> {
    return firstValueFrom(this.http.post<Datacenter>(BASE_URL, request));
  }

  update(id: number, request: DatacenterRequest): Promise<Datacenter> {
    return firstValueFrom(this.http.put<Datacenter>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
