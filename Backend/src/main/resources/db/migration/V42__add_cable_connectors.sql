-- Cables previously only linked device-to-device. Add optional port-level (connector) endpoints
-- so a cable can record exactly which transceiver/port it plugs into on each side. Nullable and
-- not backfilled: there is no reliable way to infer which specific connector an existing cable
-- used, so existing rows are simply left with null connectors.
ALTER TABLE cables ADD COLUMN source_connector_id BIGINT REFERENCES connectors (id);
ALTER TABLE cables ADD COLUMN target_connector_id BIGINT REFERENCES connectors (id);
