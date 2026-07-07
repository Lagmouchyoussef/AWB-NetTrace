import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PageParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
}

// Shared by every role-scoped CRUD service (e.g. DC Admin's) that mirrors an existing Super
// Admin entity endpoint 1:1, just under a different, role-gated base path. Must be called
// synchronously from within another @Injectable's field initializer/constructor so inject()
// resolves against that service's injection context.
export function createScopedCrudService<TResponse, TRequest, TParams extends PageParams>(
  basePath: string,
) {
  const http = inject(HttpClient);
  const baseUrl = `${environment.apiBaseUrl}${basePath}`;

  return {
    list(params: TParams): Promise<PageResult<TResponse>> {
      let httpParams = new HttpParams();
      for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
        if ((typeof value === 'string' && value !== '') || typeof value === 'number') {
          httpParams = httpParams.set(key, value);
        }
      }
      return firstValueFrom(http.get<PageResult<TResponse>>(baseUrl, { params: httpParams }));
    },

    getById(id: number): Promise<TResponse> {
      return firstValueFrom(http.get<TResponse>(`${baseUrl}/${id}`));
    },

    create(request: TRequest): Promise<TResponse> {
      return firstValueFrom(http.post<TResponse>(baseUrl, request));
    },

    update(id: number, request: TRequest): Promise<TResponse> {
      return firstValueFrom(http.put<TResponse>(`${baseUrl}/${id}`, request));
    },

    delete(id: number): Promise<void> {
      return firstValueFrom(http.delete<void>(`${baseUrl}/${id}`));
    },
  };
}
