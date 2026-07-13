-- Merge the Technology Catalog into Device Types (equipment_types): add the descriptive
-- columns technology catalog entries had, then backfill one equipment_types row per existing
-- technology_catalog_entries row so no data is lost. The technology_catalog_entries table
-- itself is dropped in a later migration once the backfill has run.
ALTER TABLE equipment_types ADD COLUMN vendor VARCHAR(150);
ALTER TABLE equipment_types ADD COLUMN version VARCHAR(50);
ALTER TABLE equipment_types ADD COLUMN description VARCHAR(1000);

-- Category mapping (TechnologyCategory -> EquipmentCategory), best-effort where there is no
-- exact match:
--   NETWORKING_PROTOCOL -> NETWORKING (direct match)
--   SECURITY             -> SECURITY   (direct match)
--   STORAGE               -> STORAGE   (direct match)
--   VIRTUALIZATION        -> SERVER    (closest: virtualization runs on compute/server hardware)
--   CLOUD                 -> SERVER    (closest: cloud workloads run on compute/server hardware)
--   MONITORING            -> NETWORKING (closest: no monitoring/ops category exists; treated as
--                                        network/infra operations tooling)
--
-- Status mapping (TechnologyCatalogStatus -> EquipmentTypeStatus):
--   ACTIVE      -> ACTIVE
--   EVALUATION  -> ACTIVE    (closest: still in active use, not deprecated)
--   DEPRECATED  -> DEPRECATED
INSERT INTO equipment_types
    (name, code, category, manufacturer, default_rack_units, default_power_watts, status,
     vendor, version, description, notes, deleted, created_at, updated_at)
SELECT
    t.name,
    t.code,
    CASE t.category
        WHEN 'NETWORKING_PROTOCOL' THEN 'NETWORKING'
        WHEN 'SECURITY' THEN 'SECURITY'
        WHEN 'STORAGE' THEN 'STORAGE'
        WHEN 'VIRTUALIZATION' THEN 'SERVER'
        WHEN 'CLOUD' THEN 'SERVER'
        WHEN 'MONITORING' THEN 'NETWORKING'
        ELSE 'NETWORKING'
    END,
    NULL,
    NULL,
    NULL,
    CASE t.status
        WHEN 'ACTIVE' THEN 'ACTIVE'
        WHEN 'EVALUATION' THEN 'ACTIVE'
        WHEN 'DEPRECATED' THEN 'DEPRECATED'
        ELSE 'ACTIVE'
    END,
    t.vendor,
    t.version,
    t.description,
    t.notes,
    t.deleted,
    t.created_at,
    t.updated_at
FROM technology_catalog_entries t
WHERE NOT EXISTS (
    SELECT 1 FROM equipment_types e WHERE lower(e.code) = lower(t.code)
);
