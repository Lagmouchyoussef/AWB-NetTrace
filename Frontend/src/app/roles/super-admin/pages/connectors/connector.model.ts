export type ConnectorFormFactor = 'SFP_PLUS' | 'SFP28' | 'QSFP28' | 'QSFP_DD' | 'OSFP';

export type ConnectorType = 'LC' | 'MPO_MTP' | 'RJ45';

export type ConnectorStatus = 'ACTIVE' | 'SPARE' | 'FAULTY' | 'DECOMMISSIONED';

export const CONNECTOR_FORM_FACTORS: ConnectorFormFactor[] = [
  'SFP_PLUS',
  'SFP28',
  'QSFP28',
  'QSFP_DD',
  'OSFP',
];

export const CONNECTOR_TYPES: ConnectorType[] = ['LC', 'MPO_MTP', 'RJ45'];

export const CONNECTOR_STATUSES: ConnectorStatus[] = [
  'ACTIVE',
  'SPARE',
  'FAULTY',
  'DECOMMISSIONED',
];

export interface Connector {
  id: number;
  deviceId: number;
  deviceName: string;
  name: string;
  code: string;
  formFactor: ConnectorFormFactor;
  connectorType: ConnectorType;
  speedGbps: number;
  wavelengthNm: number | null;
  status: ConnectorStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectorRequest {
  deviceId: number;
  name: string;
  code: string;
  formFactor: ConnectorFormFactor;
  connectorType: ConnectorType;
  speedGbps: number;
  wavelengthNm?: number | null;
  status: ConnectorStatus;
  notes?: string | null;
}

export interface ConnectorPage {
  content: Connector[];
  totalElements: number;
}

export interface ConnectorListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: ConnectorStatus;
}
