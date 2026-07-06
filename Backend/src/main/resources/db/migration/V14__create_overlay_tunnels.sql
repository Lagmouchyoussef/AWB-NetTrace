CREATE TABLE overlay_tunnels (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    source_edge_id BIGINT NOT NULL REFERENCES sdwan_edges (id),
    target_edge_id BIGINT NOT NULL REFERENCES sdwan_edges (id),
    tunnel_type VARCHAR(30) NOT NULL,
    bandwidth_mbps INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    notes VARCHAR(1000),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
