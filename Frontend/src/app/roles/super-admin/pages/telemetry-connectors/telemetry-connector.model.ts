export type TelemetryProtocol =
  'SNMP_V2C' | 'SNMP_V3' | 'GNMI_STREAMING' | 'NETCONF' | 'PROMETHEUS_EXPORTER' | 'OPENTELEMETRY';

export type TelemetryConnectorStatus = 'ACTIVE' | 'PAUSED' | 'ERROR' | 'DECOMMISSIONED';

export const TELEMETRY_PROTOCOLS: TelemetryProtocol[] = [
  'SNMP_V2C',
  'SNMP_V3',
  'GNMI_STREAMING',
  'NETCONF',
  'PROMETHEUS_EXPORTER',
  'OPENTELEMETRY',
];

export const TELEMETRY_CONNECTOR_STATUSES: TelemetryConnectorStatus[] = [
  'ACTIVE',
  'PAUSED',
  'ERROR',
  'DECOMMISSIONED',
];

export interface TelemetryConnector {
  id: number;
  deviceId: number;
  deviceName: string;
  name: string;
  code: string;
  protocol: TelemetryProtocol;
  pollIntervalSeconds: number | null;
  status: TelemetryConnectorStatus;
  lastPolledAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TelemetryConnectorRequest {
  deviceId: number;
  name: string;
  code: string;
  protocol: TelemetryProtocol;
  pollIntervalSeconds?: number | null;
  status: TelemetryConnectorStatus;
  lastPolledAt?: string | null;
  notes?: string | null;
}

export interface TelemetryConnectorPage {
  content: TelemetryConnector[];
  totalElements: number;
}

export interface TelemetryConnectorListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: TelemetryConnectorStatus;
}
