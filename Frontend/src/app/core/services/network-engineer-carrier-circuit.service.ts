import { Injectable } from '@angular/core';
import {
  CarrierCircuit,
  CarrierCircuitListParams,
  CarrierCircuitPage,
  CarrierCircuitRequest,
} from '../../roles/super-admin/pages/carrier-circuits/carrier-circuit.model';
import { createScopedCrudService } from './scoped-crud.factory';

// No delete() - decommission via status. See NetworkEngineerCarrierCircuitController.
@Injectable({ providedIn: 'root' })
export class NetworkEngineerCarrierCircuitService {
  private readonly crud = createScopedCrudService<
    CarrierCircuit,
    CarrierCircuitRequest,
    CarrierCircuitListParams
  >('/api/roles/network-engineer/carrier-circuits');

  list(params: CarrierCircuitListParams): Promise<CarrierCircuitPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<CarrierCircuit> {
    return this.crud.getById(id);
  }

  create(request: CarrierCircuitRequest): Promise<CarrierCircuit> {
    return this.crud.create(request);
  }

  update(id: number, request: CarrierCircuitRequest): Promise<CarrierCircuit> {
    return this.crud.update(id, request);
  }
}
