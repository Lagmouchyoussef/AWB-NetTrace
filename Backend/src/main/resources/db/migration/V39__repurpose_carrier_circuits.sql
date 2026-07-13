-- Carrier circuits are repurposed from an SD-WAN carrier-circuit concept to the physical
-- landing point of an external circuit inside the data center (meet-me-room record).
-- Drop the SD-WAN edge link and the bandwidth-tier field, add an optional physical
-- termination point on a Connector.
ALTER TABLE carrier_circuits DROP COLUMN edge_id;
ALTER TABLE carrier_circuits DROP COLUMN bandwidth_mbps;
ALTER TABLE carrier_circuits
    ADD COLUMN terminates_at_connector_id BIGINT REFERENCES connectors (id);
