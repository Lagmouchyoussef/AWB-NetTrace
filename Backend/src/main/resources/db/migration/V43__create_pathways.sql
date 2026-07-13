-- Physical cable-routing infrastructure between racks: trays, ladder racks, conduits, raised-floor
-- routes. A pathway is subdivided into ordered segments, and a cable's physical route through the
-- facility is recorded as an ordered traversal of those segments.
CREATE TABLE pathways (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    type VARCHAR(30) NOT NULL,
    datacenter_id BIGINT NOT NULL REFERENCES datacenters (id),
    room_id BIGINT REFERENCES rooms (id),
    capacity_cable_count INTEGER NOT NULL,
    fill_threshold_percent INTEGER NOT NULL DEFAULT 80,
    status VARCHAR(20) NOT NULL,
    notes VARCHAR(1000),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pathway_segments (
    id BIGSERIAL PRIMARY KEY,
    pathway_id BIGINT NOT NULL REFERENCES pathways (id),
    name VARCHAR(150) NOT NULL,
    ordinal INTEGER NOT NULL,
    length_meters DOUBLE PRECISION,
    capacity_cable_count INTEGER,
    notes VARCHAR(1000),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pure routing metadata (no deleted/updated_at): a cable's ordered traversal of pathway segments.
CREATE TABLE cable_pathway_segments (
    id BIGSERIAL PRIMARY KEY,
    cable_id BIGINT NOT NULL REFERENCES cables (id),
    pathway_segment_id BIGINT NOT NULL REFERENCES pathway_segments (id),
    sequence_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_cable_pathway_segments_cable_segment UNIQUE (cable_id, pathway_segment_id),
    CONSTRAINT uq_cable_pathway_segments_cable_sequence UNIQUE (cable_id, sequence_order)
);
