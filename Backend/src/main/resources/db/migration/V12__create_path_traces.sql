CREATE TABLE path_traces (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    source_device_id BIGINT NOT NULL REFERENCES devices (id),
    target_device_id BIGINT NOT NULL REFERENCES devices (id),
    hop_count INTEGER NOT NULL,
    total_length_meters DOUBLE PRECISION,
    status VARCHAR(20) NOT NULL,
    traced_at TIMESTAMPTZ,
    notes VARCHAR(1000),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
