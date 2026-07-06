import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TechnologyCatalogEntry,
  TechnologyCatalogListParams,
  TechnologyCatalogPage,
  TechnologyCatalogRequest,
} from '../../roles/super-admin/pages/technology-catalog/technology-catalog-entry.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/technology-catalog`;

@Injectable({ providedIn: 'root' })
export class TechnologyCatalogService {
  private readonly http = inject(HttpClient);

  list(params: TechnologyCatalogListParams): Promise<TechnologyCatalogPage> {
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
    return firstValueFrom(this.http.get<TechnologyCatalogPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<TechnologyCatalogEntry> {
    return firstValueFrom(this.http.get<TechnologyCatalogEntry>(`${BASE_URL}/${id}`));
  }

  create(request: TechnologyCatalogRequest): Promise<TechnologyCatalogEntry> {
    return firstValueFrom(this.http.post<TechnologyCatalogEntry>(BASE_URL, request));
  }

  update(id: number, request: TechnologyCatalogRequest): Promise<TechnologyCatalogEntry> {
    return firstValueFrom(this.http.put<TechnologyCatalogEntry>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
