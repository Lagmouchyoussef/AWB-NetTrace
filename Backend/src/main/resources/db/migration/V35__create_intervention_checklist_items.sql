-- Snapshot rows, not a live join to checklist_template_items: generated once (on first technician
-- access) by copying that intervention's template at that point in time, so later edits to the
-- template never retroactively alter a checklist already in progress or already audited.
CREATE TABLE intervention_checklist_items (
    id BIGSERIAL PRIMARY KEY,
    intervention_id BIGINT NOT NULL REFERENCES interventions (id),
    step_order INT NOT NULL,
    label VARCHAR(300) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    UNIQUE (intervention_id, step_order)
);

CREATE INDEX idx_intervention_checklist_items_intervention_id
    ON intervention_checklist_items (intervention_id);
