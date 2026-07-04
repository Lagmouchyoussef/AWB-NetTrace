CREATE TABLE topology_links (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    source_role_id BIGINT NOT NULL REFERENCES network_roles (id),
    target_role_id BIGINT NOT NULL REFERENCES network_roles (id),
    link_type VARCHAR(30) NOT NULL,
    speed_gbps INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    notes VARCHAR(1000),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
