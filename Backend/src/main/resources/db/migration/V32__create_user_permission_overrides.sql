CREATE TABLE user_permission_overrides (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users (id),
    module VARCHAR(30) NOT NULL,
    granted BOOLEAN NOT NULL,
    notes VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, module)
);

CREATE INDEX idx_user_permission_overrides_user_id ON user_permission_overrides (user_id);
