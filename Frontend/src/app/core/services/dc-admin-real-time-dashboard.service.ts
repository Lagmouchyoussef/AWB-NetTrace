import { Injectable } from '@angular/core';
import {
  RealTimeDashboard,
  RealTimeDashboardListParams,
  RealTimeDashboardPage,
  RealTimeDashboardRequest,
} from '../../roles/super-admin/pages/real-time-dashboards/real-time-dashboard.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminRealTimeDashboardService {
  private readonly crud = createScopedCrudService<
    RealTimeDashboard,
    RealTimeDashboardRequest,
    RealTimeDashboardListParams
  >('/api/roles/dc-admin/real-time-dashboards');

  list(params: RealTimeDashboardListParams): Promise<RealTimeDashboardPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<RealTimeDashboard> {
    return this.crud.getById(id);
  }

  create(request: RealTimeDashboardRequest): Promise<RealTimeDashboard> {
    return this.crud.create(request);
  }

  update(id: number, request: RealTimeDashboardRequest): Promise<RealTimeDashboard> {
    return this.crud.update(id, request);
  }

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
