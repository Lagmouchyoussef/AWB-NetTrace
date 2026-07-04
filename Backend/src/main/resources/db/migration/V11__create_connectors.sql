CREATE TABLE connectors (
    id BIGSERIAL PRIMARY KEY,
    device_id BIGINT NOT NULL REFERENCES devices (id),
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    form_factor VARCHAR(30) NOT NULL,
    connector_type VARCHAR(30) NOT NULL,
    speed_gbps INTEGER NOT NULL,
    wavelength_nm INTEGER,
    status VARCHAR(20) NOT NULL,
    notes VARCHAR(1000),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
