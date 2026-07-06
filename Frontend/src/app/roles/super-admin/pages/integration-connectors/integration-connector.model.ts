export type IntegrationProtocol = 'SNMP_V2C' | 'SNMP_V3' | 'NETCONF' | 'RESTCONF' | 'GNMI';

export type AutomationType =
  'CONFIG_BACKUP' | 'CONFIG_PUSH' | 'COMPLIANCE_CHECK' | 'ZERO_TOUCH_PROVISIONING';

export type IntegrationConnectorStatus = 'ACTIVE' | 'PAUSED' | 'ERROR' | 'DECOMMISSIONED';

export const INTEGRATION_PROTOCOLS: IntegrationProtocol[] = [
  'SNMP_V2C',
  'SNMP_V3',
  'NETCONF',
  'RESTCONF',
  'GNMI',
];

export const AUTOMATION_TYPES: AutomationType[] = [
  'CONFIG_BACKUP',
  'CONFIG_PUSH',
  'COMPLIANCE_CHECK',
  'ZERO_TOUCH_PROVISIONING',
];

export const INTEGRATION_CONNECTOR_STATUSES: IntegrationConnectorStatus[] = [
  'ACTIVE',
  'PAUSED',
  'ERROR',
  'DECOMMISSIONED',
];

export interface IntegrationConnector {
  id: number;
  deviceId: number;
  deviceName: string;
  name: string;
  code: string;
  protocol: IntegrationProtocol;
  automationType: AutomationType;
  status: IntegrationConnectorStatus;
  lastSyncAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationConnectorRequest {
  deviceId: number;
  name: string;
  code: string;
  protocol: IntegrationProtocol;
  automationType: AutomationType;
  status: IntegrationConnectorStatus;
  lastSyncAt?: string | null;
  notes?: string | null;
}

export interface IntegrationConnectorPage {
  content: IntegrationConnector[];
  totalElements: number;
}

export interface IntegrationConnectorListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: IntegrationConnectorStatus;
}
