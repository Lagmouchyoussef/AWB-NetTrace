CREATE TABLE telemetry_connectors (
    id BIGSERIAL PRIMARY KEY,
    device_id BIGINT NOT NULL REFERENCES devices (id),
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    protocol VARCHAR(30) NOT NULL,
    poll_interval_seconds INTEGER,
    status VARCHAR(20) NOT NULL,
    last_polled_at TIMESTAMPTZ,
    notes VARCHAR(1000),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
