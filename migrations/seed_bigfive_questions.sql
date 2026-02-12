-- Migration: Seed Big Five Questions
-- Description: Inserts 25 Big Five personality questions

INSERT INTO assessment_questions (module, question_text, category, metadata, display_order)
VALUES
-- OPENNESS (5 items)
('big5', 'Ik probeer graag nieuwe dingen uit', 'Openness', '{"reverse": false}'::jsonb, 1),
('big5', 'Ik heb een levendige fantasie', 'Openness', '{"reverse": false}'::jsonb, 2),
('big5', 'Ik hou van routines en herhaling', 'Openness', '{"reverse": true}'::jsonb, 3),
('big5', 'Ik ben geïnteresseerd in kunst en cultuur', 'Openness', '{"reverse": false}'::jsonb, 4),
('big5', 'Ik denk vaak na over abstracte concepten', 'Openness', '{"reverse": false}'::jsonb, 5),

-- CONSCIENTIOUSNESS (5 items)
('big5', 'Ik maak vaak todo-lijstjes of planningen', 'Conscientiousness', '{"reverse": false}'::jsonb, 6),
('big5', 'Ik ruim mijn kamer/spullen regelmatig op', 'Conscientiousness', '{"reverse": false}'::jsonb, 7),
('big5', 'Ik stel dingen vaak uit', 'Conscientiousness', '{"reverse": true}'::jsonb, 8),
('big5', 'Ik let op details en maak weinig fouten', 'Conscientiousness', '{"reverse": false}'::jsonb, 9),
('big5', 'Ik werk hard om mijn doelen te bereiken', 'Conscientiousness', '{"reverse": false}'::jsonb, 10),

-- EXTRAVERSION (5 items)
('big5', 'Ik voel me energiek na tijd met vrienden', 'Extraversion', '{"reverse": false}'::jsonb, 11),
('big5', 'Ik sta graag in het middelpunt van de belangstelling', 'Extraversion', '{"reverse": false}'::jsonb, 12),
('big5', 'Ik vind het fijn om alleen te zijn', 'Extraversion', '{"reverse": true}'::jsonb, 13),
('big5', 'Ik maak makkelijk contact met nieuwe mensen', 'Extraversion', '{"reverse": false}'::jsonb, 14),
('big5', 'Ik neem graag het initiatief in groepen', 'Extraversion', '{"reverse": false}'::jsonb, 15),

-- AGREEABLENESS (5 items)
('big5', 'Ik help anderen graag', 'Agreeableness', '{"reverse": false}'::jsonb, 16),
('big5', 'Ik vertrouw mensen snel', 'Agreeableness', '{"reverse": false}'::jsonb, 17),
('big5', 'Ik vind het lastig om mijn ongelijk toe te geven', 'Agreeableness', '{"reverse": true}'::jsonb, 18),
('big5', 'Ik let goed op de gevoelens van anderen', 'Agreeableness', '{"reverse": false}'::jsonb, 19),
('big5', 'Ik werk graag samen in een team', 'Agreeableness', '{"reverse": false}'::jsonb, 20),

-- STABILITY (Neuroticism reversed, high score = stable) (5 items)
('big5', 'Ik maak me vaak zorgen over dingen', 'Stability', '{"reverse": true}'::jsonb, 21),
('big5', 'I blijf kalm onder druk', 'Stability', '{"reverse": false}'::jsonb, 22),
('big5', 'Mijn stemming wisselt vaak', 'Stability', '{"reverse": true}'::jsonb, 23),
('big5', 'Ik raak snel gestrest', 'Stability', '{"reverse": true}'::jsonb, 24),
('big5', 'Ik herstel snel van teleurstellingen', 'Stability', '{"reverse": false}'::jsonb, 25);
