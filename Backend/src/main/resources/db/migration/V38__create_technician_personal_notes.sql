CREATE TABLE technician_personal_notes (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL REFERENCES users (id),
    title VARCHAR(150),
    body VARCHAR(2000) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_technician_personal_notes_author_id
    ON technician_personal_notes (author_id);
