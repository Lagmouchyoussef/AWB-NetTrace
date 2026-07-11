CREATE TABLE intervention_technician_notes (
    id BIGSERIAL PRIMARY KEY,
    intervention_id BIGINT NOT NULL REFERENCES interventions (id),
    author_id BIGINT NOT NULL REFERENCES users (id),
    body VARCHAR(1000) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_intervention_technician_notes_intervention_id
    ON intervention_technician_notes (intervention_id);
