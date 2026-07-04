CREATE TABLE overlay_networks (
    id BIGSERIAL PRIMARY KEY,
    datacenter_id BIGINT NOT NULL REFERENCES datacenters (id),
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    vni INTEGER NOT NULL UNIQUE,
    overlay_type VARCHAR(30) NOT NULL,
    vlan_id INTEGER,
    vrf_name VARCHAR(100),
    route_distinguisher VARCHAR(50),
    route_targets VARCHAR(200),
    status VARCHAR(20) NOT NULL,
    notes VARCHAR(1000),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
