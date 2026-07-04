CREATE TABLE devices (
    id BIGSERIAL PRIMARY KEY,
    rack_id BIGINT NOT NULL REFERENCES racks (id),
    name VARCHAR(150) NOT NULL,
    device_type VARCHAR(30) NOT NULL,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    position_u_start INTEGER NOT NULL,
    height_u INTEGER NOT NULL,
    power_consumption_w DOUBLE PRECISION,
    management_ip VARCHAR(45),
    status VARCHAR(20) NOT NULL,
    notes VARCHAR(1000),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
