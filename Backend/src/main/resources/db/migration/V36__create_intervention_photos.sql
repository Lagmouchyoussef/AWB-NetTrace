CREATE TABLE intervention_photos (
    id BIGSERIAL PRIMARY KEY,
    intervention_id BIGINT NOT NULL REFERENCES interventions (id),
    phase VARCHAR(10) NOT NULL,
    stored_file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    uploaded_by BIGINT NOT NULL REFERENCES users (id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_intervention_photos_intervention_id ON intervention_photos (intervention_id);
