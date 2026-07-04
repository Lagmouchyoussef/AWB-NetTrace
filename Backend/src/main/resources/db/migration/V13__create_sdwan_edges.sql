CREATE TABLE sdwan_edges (
    id BIGSERIAL PRIMARY KEY,
    datacenter_id BIGINT NOT NULL REFERENCES datacenters (id),
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    vendor VARCHAR(100) NOT NULL,
    model VARCHAR(100),
    wan_link_count INTEGER NOT NULL,
    management_ip VARCHAR(45),
    status VARCHAR(20) NOT NULL,
    notes VARCHAR(1000),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
