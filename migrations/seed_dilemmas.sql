-- Migration: Seed Daily Dilemmas
-- Description: Inserts 10 Daily Dilemmas for the booster module

INSERT INTO assessment_questions (module, question_text, category, metadata, display_order)
VALUES
('dilemma', 'Deadlines', 'Conscientiousness', '{"optionA": "Ik werk het liefst ver voor de deadline", "optionB": "Ik presteer het best onder tijdsdruk", "scoreA": {"C": 1}, "scoreB": {"C": -1}}'::jsonb, 1),
('dilemma', 'Samenwerken', 'Extraversion', '{"optionA": "Ik werk liever alleen aan een taak", "optionB": "Ik overleg graag met collega''s", "scoreA": {"E": -1}, "scoreB": {"E": 1}}'::jsonb, 2),
('dilemma', 'Nieuwe ideeën', 'Openness', '{"optionA": "Ik hou vast aan wat werkt", "optionB": "Ik probeer graag iets nieuws", "scoreA": {"O": -1}, "scoreB": {"O": 1}}'::jsonb, 3),
('dilemma', 'Conflicten', 'Agreeableness', '{"optionA": "Ik vermijd discussies liever", "optionB": "Ik ga de confrontatie aan", "scoreA": {"A": 1}, "scoreB": {"A": -1}}'::jsonb, 4),
('dilemma', 'Stress', 'Stability', '{"optionA": "Ik raak snel van slag", "optionB": "Ik blijf rustig in chaos", "scoreA": {"S": -1}, "scoreB": {"S": 1}}'::jsonb, 5),
('dilemma', 'Leiderschap', 'Extraversion', '{"optionA": "Ik volg liever instructies", "optionB": "Ik neem graag de leiding", "scoreA": {"E": -1}, "scoreB": {"E": 1}}'::jsonb, 6),
('dilemma', 'Details', 'Conscientiousness', '{"optionA": "De grote lijnen zijn belangrijk", "optionB": "Elk detail moet kloppen", "scoreA": {"C": -1}, "scoreB": {"C": 1}}'::jsonb, 7),
('dilemma', 'Andere mensen', 'Agreeableness', '{"optionA": "Ik ben sceptisch over intenties", "optionB": "Ik vertrouw mensen direct", "scoreA": {"A": -1}, "scoreB": {"A": 1}}'::jsonb, 8),
('dilemma', 'Verandering', 'Openness', '{"optionA": "Ik hou van stabiliteit", "optionB": "Ik hou van afwisseling", "scoreA": {"O": -1}, "scoreB": {"O": 1}}'::jsonb, 9),
('dilemma', 'Emoties', 'Stability', '{"optionA": "Ik toon mijn emoties makkelijk", "optionB": "Ik hou mijn gevoelens voor mezelf", "scoreA": {"S": 0}, "scoreB": {"S": 1}}'::jsonb, 10);
