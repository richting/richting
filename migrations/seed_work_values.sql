-- Migration: Seed Work Values
-- Description: Inserts 6 Work Values for the prioritizer module

INSERT INTO assessment_questions (module, question_text, category, metadata, display_order)
VALUES
('work_values', 'Prestatie & Uitdaging', 'Achievement', '{"icon": "🏆", "description": "Ik wil moeilijke doelen bereiken en uitgedaagd worden in mijn werk."}'::jsonb, 1),
('work_values', 'Zelfstandigheid', 'Independence', '{"icon": "🦅", "description": "Ik wil mijn eigen beslissingen kunnen nemen en vrij werken."}'::jsonb, 2),
('work_values', 'Erkenning & Status', 'Recognition', '{"icon": "⭐", "description": "Ik wil gewaardeerd worden en respect krijgen voor wat ik doe."}'::jsonb, 3),
('work_values', 'Samenwerking', 'Relationships', '{"icon": "👥", "description": "Ik vind een goede sfeer en werken met fijne collega''s belangrijk."}'::jsonb, 4),
('work_values', 'Ondersteuning', 'Support', '{"icon": "🤝", "description": "Ik wil begeleiding en een leidinggevende die achter me staat."}'::jsonb, 5),
('work_values', 'Arbeidsomstandigheden', 'Working Conditions', '{"icon": "🏢", "description": "Ik vind een fijn salaris, zekerheid en goede werktijden belangrijk."}'::jsonb, 6);
