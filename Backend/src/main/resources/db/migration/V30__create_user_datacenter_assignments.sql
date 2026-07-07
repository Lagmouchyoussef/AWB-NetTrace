CREATE TABLE user_datacenter_assignments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users (id),
    datacenter_id BIGINT NOT NULL REFERENCES datacenters (id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, datacenter_id)
);

CREATE INDEX idx_user_datacenter_assignments_user_id ON user_datacenter_assignments (user_id);
