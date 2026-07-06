import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CarrierCircuit,
  CarrierCircuitListParams,
  CarrierCircuitPage,
  CarrierCircuitRequest,
} from '../../roles/super-admin/pages/carrier-circuits/carrier-circuit.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/carrier-circuits`;

@Injectable({ providedIn: 'root' })
export class CarrierCircuitService {
  private readonly http = inject(HttpClient);

  list(params: CarrierCircuitListParams): Promise<CarrierCircuitPage> {
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
    if (params.edgeId) {
      httpParams = httpParams.set('edgeId', params.edgeId);
    }
    return firstValueFrom(this.http.get<CarrierCircuitPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<CarrierCircuit> {
    return firstValueFrom(this.http.get<CarrierCircuit>(`${BASE_URL}/${id}`));
  }

  create(request: CarrierCircuitRequest): Promise<CarrierCircuit> {
    return firstValueFrom(this.http.post<CarrierCircuit>(BASE_URL, request));
  }

  update(id: number, request: CarrierCircuitRequest): Promise<CarrierCircuit> {
    return firstValueFrom(this.http.put<CarrierCircuit>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
