-- Migration: Seed RIASEC Cards
-- Description: Inserts 60 RIASEC cards into the assessment_questions table

INSERT INTO assessment_questions (module, question_text, category, metadata, display_order)
VALUES
-- REALISTIC (R) - Doers (10 cards)
('riasec', 'Een machine of motor repareren', 'Realistic', '{"tag": "R", "emoji": "🔧", "gradient": "from-orange-400 to-red-500", "description": "Praktisch werken met tools en technische apparatuur"}'::jsonb, 1),
('riasec', 'Buiten werken in de natuur', 'Realistic', '{"tag": "R", "emoji": "🌲", "gradient": "from-green-500 to-emerald-600", "description": "Fysiek actief zijn met planten of dieren"}'::jsonb, 2),
('riasec', 'Meubels maken van hout', 'Realistic', '{"tag": "R", "emoji": "🪑", "gradient": "from-amber-600 to-orange-800", "description": "Ambachtelijk werken en dingen bouwen"}'::jsonb, 3),
('riasec', 'Een computer in elkaar zetten', 'Realistic', '{"tag": "R", "emoji": "🖥️", "gradient": "from-slate-600 to-zinc-800", "description": "Hardware installeren en testen"}'::jsonb, 4),
('riasec', 'Sporten of fysiek trainen', 'Realistic', '{"tag": "R", "emoji": "🏋️", "gradient": "from-red-500 to-rose-600", "description": "Je lichaam gebruiken en fit blijven"}'::jsonb, 5),
('riasec', 'Dieren verzorgen', 'Realistic', '{"tag": "R", "emoji": "🐕", "gradient": "from-amber-400 to-orange-500", "description": "Werken met honden, paarden of vee"}'::jsonb, 6),
('riasec', 'Een vliegtuig besturen', 'Realistic', '{"tag": "R", "emoji": "✈️", "gradient": "from-sky-500 to-blue-600", "description": "Machines bedienen en navigeren"}'::jsonb, 7),
('riasec', 'Tuinen ontwerpen en aanleggen', 'Realistic', '{"tag": "R", "emoji": "🌻", "gradient": "from-lime-500 to-green-700", "description": "Groenvoorziening en buitenwerk"}'::jsonb, 8),
('riasec', 'Elektrische installaties aanleggen', 'Realistic', '{"tag": "R", "emoji": "⚡", "gradient": "from-yellow-400 to-amber-500", "description": "Technisch werk met elektriciteit"}'::jsonb, 9),
('riasec', 'Koken in een drukke keuken', 'Realistic', '{"tag": "R", "emoji": "🍳", "gradient": "from-orange-500 to-red-600", "description": "Praktisch en creatief met eten werken"}'::jsonb, 10),

-- INVESTIGATIVE (I) - Thinkers (10 cards)
('riasec', 'Een wetenschappelijk experiment doen', 'Investigative', '{"tag": "I", "emoji": "🧪", "gradient": "from-blue-400 to-indigo-600", "description": "Onderzoek doen en nieuwe dingen ontdekken"}'::jsonb, 11),
('riasec', 'Complexe problemen oplossen', 'Investigative', '{"tag": "I", "emoji": "🧩", "gradient": "from-indigo-400 to-violet-600", "description": "Analyseren en logisch nadenken"}'::jsonb, 12),
('riasec', 'Medicijnen ontwikkelen', 'Investigative', '{"tag": "I", "emoji": "💊", "gradient": "from-teal-400 to-cyan-600", "description": "Ziekten bestrijden door wetenschap"}'::jsonb, 13),
('riasec', 'Sterren en planeten bestuderen', 'Investigative', '{"tag": "I", "emoji": "🔭", "gradient": "from-slate-800 to-black", "description": "Het heelal begrijpen"}'::jsonb, 14),
('riasec', 'Gegevens en statistieken analyseren', 'Investigative', '{"tag": "I", "emoji": "📊", "gradient": "from-blue-500 to-sky-600", "description": "Patronen vinden in data"}'::jsonb, 15),
('riasec', 'Een nieuwe taal leren', 'Investigative', '{"tag": "I", "emoji": "🗣️", "gradient": "from-pink-400 to-rose-500", "description": "Structuren en grammatica begrijpen"}'::jsonb, 16),
('riasec', 'De geschiedenis onderzoeken', 'Investigative', '{"tag": "I", "emoji": "📜", "gradient": "from-amber-200 to-yellow-400", "description": "Het verleden uitpluizen"}'::jsonb, 17),
('riasec', 'Software bugs opsporen', 'Investigative', '{"tag": "I", "emoji": "🐛", "gradient": "from-green-400 to-emerald-600", "description": "Fouten vinden in code"}'::jsonb, 18),
('riasec', 'Gedrag van mensen bestuderen', 'Investigative', '{"tag": "I", "emoji": "🧠", "gradient": "from-purple-400 to-fuchsia-500", "description": "Psychologie en menselijk denken"}'::jsonb, 19),
('riasec', 'Dinosaurussen opgraven', 'Investigative', '{"tag": "I", "emoji": "🦕", "gradient": "from-stone-500 to-stone-700", "description": "Archeologie en oudheid"}'::jsonb, 20),

-- ARTISTIC (A) - Creators (10 cards)
('riasec', 'Een kunstwerk schilderen', 'Artistic', '{"tag": "A", "emoji": "🎨", "gradient": "from-purple-400 to-pink-500", "description": "Jezelf uiten met verf en kleur"}'::jsonb, 21),
('riasec', 'Muziek maken of mixen', 'Artistic', '{"tag": "A", "emoji": "🎵", "gradient": "from-violet-500 to-indigo-600", "description": "Creatief zijn met geluid"}'::jsonb, 22),
('riasec', 'Een verhaal of boek schrijven', 'Artistic', '{"tag": "A", "emoji": "✍️", "gradient": "from-rose-400 to-pink-600", "description": "Fantasie gebruiken voor tekst"}'::jsonb, 23),
('riasec', 'Kleding ontwerpen', 'Artistic', '{"tag": "A", "emoji": "👗", "gradient": "from-fuchsia-400 to-purple-500", "description": "Mode en stijl bedenken"}'::jsonb, 24),
('riasec', 'Acteren in een film of toneelstuk', 'Artistic', '{"tag": "A", "emoji": "🎭", "gradient": "from-red-400 to-orange-500", "description": "In een andere rol kruipen"}'::jsonb, 25),
('riasec', 'Websites of apps ontwerpen', 'Artistic', '{"tag": "A", "emoji": "💻", "gradient": "from-cyan-400 to-blue-500", "description": "Digitale creativiteit en design"}'::jsonb, 26),
('riasec', 'Fotograferen', 'Artistic', '{"tag": "A", "emoji": "📷", "gradient": "from-gray-400 to-zinc-600", "description": "De wereld vastleggen in beelden"}'::jsonb, 27),
('riasec', 'Interieurs inrichten', 'Artistic', '{"tag": "A", "emoji": "🛋️", "gradient": "from-amber-300 to-orange-400", "description": "Ruimtes mooi en sfeervol maken"}'::jsonb, 28),
('riasec', 'Dansen of choreografie maken', 'Artistic', '{"tag": "A", "emoji": "💃", "gradient": "from-pink-500 to-rose-600", "description": "Bewegen op muziek"}'::jsonb, 29),
('riasec', 'Video''s editen', 'Artistic', '{"tag": "A", "emoji": "🎬", "gradient": "from-indigo-500 to-violet-700", "description": "Beelden monteren tot een verhaal"}'::jsonb, 30),

-- SOCIAL (S) - Helpers (10 cards)
('riasec', 'Mensen helpen met problemen', 'Social', '{"tag": "S", "emoji": "💚", "gradient": "from-green-400 to-teal-500", "description": "Luisteren en ondersteunen"}'::jsonb, 31),
('riasec', 'Kinderen lesgeven', 'Social', '{"tag": "S", "emoji": "👨‍🏫", "gradient": "from-yellow-400 to-orange-500", "description": "Kennis overdragen en uitleggen"}'::jsonb, 32),
('riasec', 'Zieken verzorgen', 'Social', '{"tag": "S", "emoji": "🏥", "gradient": "from-red-400 to-rose-500", "description": "Zorgen voor patiënten"}'::jsonb, 33),
('riasec', 'Sporttraining geven', 'Social', '{"tag": "S", "emoji": "⚽", "gradient": "from-emerald-400 to-green-600", "description": "Coachen en motiveren"}'::jsonb, 34),
('riasec', 'Vrijwilligerswerk doen', 'Social', '{"tag": "S", "emoji": "🤝", "gradient": "from-cyan-400 to-blue-500", "description": "Iets goeds doen voor de maatschappij"}'::jsonb, 35),
('riasec', 'Ruzies oplossen', 'Social', '{"tag": "S", "emoji": "⚖️", "gradient": "from-indigo-400 to-purple-500", "description": "Bemiddelen tussen mensen"}'::jsonb, 36),
('riasec', 'Ouderen helpen', 'Social', '{"tag": "S", "emoji": "👵", "gradient": "from-teal-500 to-emerald-600", "description": "Ondersteuning bieden in de zorg"}'::jsonb, 37),
('riasec', 'In een team samenwerken', 'Social', '{"tag": "S", "emoji": "👥", "gradient": "from-blue-400 to-indigo-500", "description": "Samen doelen bereiken"}'::jsonb, 38),
('riasec', 'Advies geven over kleding/stijl', 'Social', '{"tag": "S", "emoji": "🛍️", "gradient": "from-pink-400 to-fuchsia-500", "description": "Anderen helpen kiezen"}'::jsonb, 39),
('riasec', 'Feestjes organiseren voor anderen', 'Social', '{"tag": "S", "emoji": "🎉", "gradient": "from-purple-500 to-violet-600", "description": "Zorgen dat iedereen het leuk heeft"}'::jsonb, 40),

-- ENTERPRISING (E) - Persuaders (10 cards)
('riasec', 'Een eigen bedrijf starten', 'Enterprising', '{"tag": "E", "emoji": "🚀", "gradient": "from-red-500 to-orange-600", "description": "Ondernemen en risico nemen"}'::jsonb, 41),
('riasec', 'Leiding geven aan een groep', 'Enterprising', '{"tag": "E", "emoji": "👔", "gradient": "from-blue-600 to-indigo-800", "description": "De baas zijn en beslissen"}'::jsonb, 42),
('riasec', 'Dingen verkopen', 'Enterprising', '{"tag": "E", "emoji": "💰", "gradient": "from-green-500 to-emerald-700", "description": "Mensen overtuigen om te kopen"}'::jsonb, 43),
('riasec', 'Een presentatie geven', 'Enterprising', '{"tag": "E", "emoji": "📢", "gradient": "from-orange-400 to-red-500", "description": "Spreken voor een groep"}'::jsonb, 44),
('riasec', 'Onderhandelen over een prijs', 'Enterprising', '{"tag": "E", "emoji": "🤝", "gradient": "from-slate-500 to-gray-700", "description": "De beste deal sluiten"}'::jsonb, 45),
('riasec', 'Campagne voeren', 'Enterprising', '{"tag": "E", "emoji": "🗳️", "gradient": "from-blue-500 to-cyan-600", "description": "Mensen winnen voor een idee"}'::jsonb, 46),
('riasec', 'Projecten managen', 'Enterprising', '{"tag": "E", "emoji": "📋", "gradient": "from-purple-500 to-indigo-600", "description": "Zorgen dat alles op tijd af is"}'::jsonb, 47),
('riasec', 'Debatteren', 'Enterprising', '{"tag": "E", "emoji": "🎤", "gradient": "from-red-400 to-rose-600", "description": "Discussiëren en gelijk krijgen"}'::jsonb, 48),
('riasec', 'Investeren in aandelen', 'Enterprising', '{"tag": "E", "emoji": "📈", "gradient": "from-green-400 to-teal-500", "description": "Geld laten groeien"}'::jsonb, 49),
('riasec', 'Netwerken met mensen', 'Enterprising', '{"tag": "E", "emoji": "🥂", "gradient": "from-yellow-500 to-amber-600", "description": "Connecties maken voor werk"}'::jsonb, 50),

-- CONVENTIONAL (C) - Organizers (10 cards)
('riasec', 'Administratie bijhouden', 'Conventional', '{"tag": "C", "emoji": "📂", "gradient": "from-gray-400 to-slate-500", "description": "Alles netjes documenteren"}'::jsonb, 51),
('riasec', 'Werken met cijfers en Excel', 'Conventional', '{"tag": "C", "emoji": "🔢", "gradient": "from-green-500 to-emerald-600", "description": "Nauwkeurig rekenen"}'::jsonb, 52),
('riasec', 'Dingen sorteren en ordenen', 'Conventional', '{"tag": "C", "emoji": "🗂️", "gradient": "from-blue-400 to-indigo-500", "description": "Structuur aanbrengen"}'::jsonb, 53),
('riasec', 'Regels en procedures volgen', 'Conventional', '{"tag": "C", "emoji": "⚖️", "gradient": "from-slate-600 to-zinc-700", "description": "Volgens vaste patronen werken"}'::jsonb, 54),
('riasec', 'Geld tellen en beheren', 'Conventional', '{"tag": "C", "emoji": "💵", "gradient": "from-green-600 to-teal-700", "description": "Financieel nauwkeurig zijn"}'::jsonb, 55),
('riasec', 'Vrachttarieven berekenen', 'Conventional', '{"tag": "C", "emoji": "🚛", "gradient": "from-orange-400 to-amber-500", "description": "Logistieke planning"}'::jsonb, 56),
('riasec', 'Teksten controleren op fouten', 'Conventional', '{"tag": "C", "emoji": "📝", "gradient": "from-red-400 to-rose-500", "description": "Redigeren en corrigeren"}'::jsonb, 57),
('riasec', 'Een magazijn beheren', 'Conventional', '{"tag": "C", "emoji": "📦", "gradient": "from-amber-500 to-orange-600", "description": "Voorraad bijhouden"}'::jsonb, 58),
('riasec', 'Schema''s en roosters maken', 'Conventional', '{"tag": "C", "emoji": "📅", "gradient": "from-blue-500 to-cyan-600", "description": "Plannen en organiseren"}'::jsonb, 59),
('riasec', 'Archiveren', 'Conventional', '{"tag": "C", "emoji": "🗄️", "gradient": "from-gray-500 to-zinc-600", "description": "Informatie veilig opbergen"}'::jsonb, 60);
