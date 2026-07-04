CREATE TABLE datacenters (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    tier VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    total_power_kw DOUBLE PRECISION,
    total_space_sqm DOUBLE PRECISION,
    notes VARCHAR(1000),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
