CREATE TABLE racks (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT NOT NULL REFERENCES rooms (id),
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    height_u INTEGER NOT NULL,
    power_capacity_kw DOUBLE PRECISION NOT NULL,
    current_power_draw_kw DOUBLE PRECISION,
    max_weight_kg DOUBLE PRECISION,
    containment VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    notes VARCHAR(1000),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
