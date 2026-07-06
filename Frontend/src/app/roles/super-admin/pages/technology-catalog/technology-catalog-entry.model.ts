export type TechnologyCategory =
  'NETWORKING_PROTOCOL' | 'SECURITY' | 'VIRTUALIZATION' | 'MONITORING' | 'STORAGE' | 'CLOUD';

export type TechnologyCatalogStatus = 'ACTIVE' | 'EVALUATION' | 'DEPRECATED';

export const TECHNOLOGY_CATEGORIES: TechnologyCategory[] = [
  'NETWORKING_PROTOCOL',
  'SECURITY',
  'VIRTUALIZATION',
  'MONITORING',
  'STORAGE',
  'CLOUD',
];

export const TECHNOLOGY_CATALOG_STATUSES: TechnologyCatalogStatus[] = [
  'ACTIVE',
  'EVALUATION',
  'DEPRECATED',
];

export interface TechnologyCatalogEntry {
  id: number;
  name: string;
  code: string;
  category: TechnologyCategory;
  vendor: string | null;
  version: string | null;
  description: string | null;
  status: TechnologyCatalogStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologyCatalogRequest {
  name: string;
  code: string;
  category: TechnologyCategory;
  vendor?: string | null;
  version?: string | null;
  description?: string | null;
  status: TechnologyCatalogStatus;
  notes?: string | null;
}

export interface TechnologyCatalogPage {
  content: TechnologyCatalogEntry[];
  totalElements: number;
}

export interface TechnologyCatalogListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: TechnologyCatalogStatus;
  category?: TechnologyCategory;
}
