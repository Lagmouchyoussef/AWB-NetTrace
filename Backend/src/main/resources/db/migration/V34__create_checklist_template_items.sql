CREATE TABLE checklist_template_items (
    id BIGSERIAL PRIMARY KEY,
    intervention_type VARCHAR(30) NOT NULL,
    step_order INT NOT NULL,
    label VARCHAR(300) NOT NULL,
    UNIQUE (intervention_type, step_order)
);

INSERT INTO checklist_template_items (intervention_type, step_order, label) VALUES
    ('PREVENTIVE_MAINTENANCE', 1, 'Verifier l''etat physique de l''equipement'),
    ('PREVENTIVE_MAINTENANCE', 2, 'Controler les ventilateurs et la temperature'),
    ('PREVENTIVE_MAINTENANCE', 3, 'Mettre a jour le firmware si necessaire'),
    ('PREVENTIVE_MAINTENANCE', 4, 'Nettoyer les filtres a poussiere'),
    ('PREVENTIVE_MAINTENANCE', 5, 'Documenter les releves dans les notes'),

    ('CORRECTIVE_MAINTENANCE', 1, 'Diagnostiquer la panne signalee'),
    ('CORRECTIVE_MAINTENANCE', 2, 'Isoler l''equipement du trafic actif si necessaire'),
    ('CORRECTIVE_MAINTENANCE', 3, 'Remplacer ou reparer le composant defectueux'),
    ('CORRECTIVE_MAINTENANCE', 4, 'Tester le bon fonctionnement apres intervention'),
    ('CORRECTIVE_MAINTENANCE', 5, 'Reintegrer l''equipement au trafic actif'),

    ('INCIDENT_RESPONSE', 1, 'Confirmer l''impact et la portee de l''incident'),
    ('INCIDENT_RESPONSE', 2, 'Appliquer la mesure de contournement immediate si disponible'),
    ('INCIDENT_RESPONSE', 3, 'Resoudre la cause racine'),
    ('INCIDENT_RESPONSE', 4, 'Verifier le retablissement du service'),
    ('INCIDENT_RESPONSE', 5, 'Consigner l''incident et les actions menees'),

    ('INSTALLATION', 1, 'Verifier la disponibilite de l''emplacement en baie'),
    ('INSTALLATION', 2, 'Monter physiquement l''equipement'),
    ('INSTALLATION', 3, 'Raccorder l''alimentation et les cables reseau'),
    ('INSTALLATION', 4, 'Mettre sous tension et verifier le demarrage'),
    ('INSTALLATION', 5, 'Valider la connectivite reseau'),

    ('DECOMMISSIONING', 1, 'Confirmer que l''equipement n''est plus en production'),
    ('DECOMMISSIONING', 2, 'Debrancher les cables reseau et l''alimentation'),
    ('DECOMMISSIONING', 3, 'Retirer physiquement l''equipement de la baie'),
    ('DECOMMISSIONING', 4, 'Mettre a jour l''inventaire (statut Decommissionne)'),
    ('DECOMMISSIONING', 5, 'Securiser ou effacer les donnees si applicable'),

    ('INSPECTION', 1, 'Controler l''etat visuel general'),
    ('INSPECTION', 2, 'Verifier les voyants d''etat et alarmes'),
    ('INSPECTION', 3, 'Controler le cablage et les connecteurs'),
    ('INSPECTION', 4, 'Verifier la temperature et la ventilation'),
    ('INSPECTION', 5, 'Consigner les observations');
