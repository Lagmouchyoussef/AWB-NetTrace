CREATE TABLE cables (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    source_device_id BIGINT NOT NULL REFERENCES devices (id),
    target_device_id BIGINT NOT NULL REFERENCES devices (id),
    cable_type VARCHAR(30) NOT NULL,
    length_meters DOUBLE PRECISION NOT NULL,
    status VARCHAR(20) NOT NULL,
    notes VARCHAR(1000),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
