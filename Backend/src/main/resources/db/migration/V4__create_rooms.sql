CREATE TABLE rooms (
    id BIGSERIAL PRIMARY KEY,
    datacenter_id BIGINT NOT NULL REFERENCES datacenters (id),
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    room_type VARCHAR(30) NOT NULL,
    floor VARCHAR(30),
    area_sqm DOUBLE PRECISION,
    max_power_kw DOUBLE PRECISION,
    cooling_type VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL,
    notes VARCHAR(1000),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
