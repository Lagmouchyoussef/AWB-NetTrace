CREATE TABLE reports (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    report_type VARCHAR(30) NOT NULL,
    format VARCHAR(20) NOT NULL,
    schedule VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    last_generated_at TIMESTAMPTZ,
    description VARCHAR(500),
    notes VARCHAR(1000),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
