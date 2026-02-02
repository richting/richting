// O*NET Occupations Database with RIASEC Vectors
// Based on O*NET Interest Profiler data
// All titles and descriptions translated to Dutch

export const onetOccupations = [
    // REALISTIC-DOMINANT OCCUPATIONS
    {
        onet_soc_code: "49-3023.00",
        title: "Automonteur",
        description: "Repareren en onderhouden van auto's, trucks en andere voertuigen",
        riasec_vector: { R: 1.0, I: 0.5, A: 0.2, S: 0.3, E: 0.3, C: 0.6 },
        career_direction: "Wetenschap & Techniek",
        education_level: "MBO",
        work_values: ["security", "independence"]
    },
    {
        onet_soc_code: "47-2111.00",
        title: "Elektricien",
        description: "Installeren en onderhouden van elektrische systemen in gebouwen",
        riasec_vector: { R: 0.9, I: 0.6, A: 0.2, S: 0.3, E: 0.3, C: 0.7 },
        career_direction: "Wetenschap & Techniek",
        education_level: "MBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "17-2141.00",
        title: "Werktuigbouwkundig Ingenieur",
        description: "Ontwerpen en ontwikkelen van mechanische systemen en apparaten",
        riasec_vector: { R: 0.8, I: 0.9, A: 0.4, S: 0.2, E: 0.4, C: 0.6 },
        career_direction: "Wetenschap & Techniek",
        education_level: "WO",
        work_values: ["achievement", "autonomy"]
    },
    {
        onet_soc_code: "45-2092.00",
        title: "Landbouwer",
        description: "Beheren van landbouwgrond en teelt van gewassen",
        riasec_vector: { R: 0.9, I: 0.4, A: 0.2, S: 0.3, E: 0.6, C: 0.5 },
        career_direction: "Wetenschap & Techniek",
        education_level: "MBO",
        work_values: ["independence", "security"]
    },
    {
        onet_soc_code: "51-4041.00",
        title: "Machinebankwerker",
        description: "Bedienen van gereedschapsmachines om metalen onderdelen te maken",
        riasec_vector: { R: 0.95, I: 0.5, A: 0.2, S: 0.2, E: 0.2, C: 0.8 },
        career_direction: "Wetenschap & Techniek",
        education_level: "MBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "17-2051.00",
        title: "Civiel Ingenieur",
        description: "Ontwerpen en superviseren van infrastructuurprojecten",
        riasec_vector: { R: 0.7, I: 0.9, A: 0.3, S: 0.3, E: 0.5, C: 0.7 },
        career_direction: "Wetenschap & Techniek",
        education_level: "WO",
        work_values: ["achievement", "security"]
    },

    // INVESTIGATIVE-DOMINANT OCCUPATIONS
    {
        onet_soc_code: "15-1252.00",
        title: "Software Developer",
        description: "Ontwikkelen en testen van computersoftware en applicaties",
        riasec_vector: { R: 0.3, I: 1.0, A: 0.5, S: 0.2, E: 0.3, C: 0.7 },
        career_direction: "IT & Data",
        education_level: "HBO",
        work_values: ["autonomy", "achievement", "creativity"]
    },
    {
        onet_soc_code: "19-1042.00",
        title: "Medisch Wetenschapper",
        description: "Onderzoeken van ziektes en ontwikkelen van behandelingen",
        riasec_vector: { R: 0.2, I: 1.0, A: 0.3, S: 0.4, E: 0.3, C: 0.7 },
        career_direction: "IT & Data",
        education_level: "WO",
        work_values: ["achievement", "altruism"]
    },
    {
        onet_soc_code: "15-2021.00",
        title: "Wiskundige",
        description: "Ontwikkelen van wiskundige theorieën en modellen",
        riasec_vector: { R: 0.1, I: 1.0, A: 0.4, S: 0.1, E: 0.2, C: 0.6 },
        career_direction: "IT & Data",
        education_level: "WO",
        work_values: ["autonomy", "achievement"]
    },
    {
        onet_soc_code: "19-2012.00",
        title: "Natuurkundige",
        description: "Bestuderen van materie, energie en hun interacties",
        riasec_vector: { R: 0.3, I: 1.0, A: 0.3, S: 0.2, E: 0.2, C: 0.7 },
        career_direction: "IT & Data",
        education_level: "WO",
        work_values: ["autonomy", "achievement"]
    },
    {
        onet_soc_code: "15-2051.00",
        title: "Data Scientist",
        description: "Analyseren van complexe datasets om inzichten te verkrijgen",
        riasec_vector: { R: 0.2, I: 0.95, A: 0.4, S: 0.2, E: 0.4, C: 0.8 },
        career_direction: "IT & Data",
        education_level: "WO",
        work_values: ["autonomy", "achievement"]
    },
    {
        onet_soc_code: "19-1029.00",
        title: "Biomedisch Onderzoeker",
        description: "Onderzoeken van biologische processen en ziektemechanismen",
        riasec_vector: { R: 0.3, I: 0.95, A: 0.3, S: 0.3, E: 0.3, C: 0.8 },
        career_direction: "IT & Data",
        education_level: "WO",
        work_values: ["achievement", "altruism"]
    },
    {
        onet_soc_code: "19-4021.00",
        title: "Laborant",
        description: "Uitvoeren van wetenschappelijke tests en experimenten",
        riasec_vector: { R: 0.5, I: 0.9, A: 0.2, S: 0.3, E: 0.2, C: 0.9 },
        career_direction: "IT & Data",
        education_level: "MBO",
        work_values: ["achievement", "security"]
    },

    // ARTISTIC-DOMINANT OCCUPATIONS
    {
        onet_soc_code: "27-1024.00",
        title: "Grafisch Ontwerper",
        description: "Creëren van visuele concepten voor communicatie en marketing",
        riasec_vector: { R: 0.3, I: 0.5, A: 1.0, S: 0.3, E: 0.5, C: 0.4 },
        career_direction: "Kunst & Media",
        education_level: "HBO",
        work_values: ["creativity", "achievement"]
    },
    {
        onet_soc_code: "27-1011.00",
        title: "Kunstenaar",
        description: "Maken van originele kunstwerken in diverse media",
        riasec_vector: { R: 0.4, I: 0.4, A: 1.0, S: 0.2, E: 0.4, C: 0.3 },
        career_direction: "Kunst & Media",
        education_level: "HBO",
        work_values: ["creativity", "independence"]
    },
    {
        onet_soc_code: "17-1011.00",
        title: "Architect",
        description: "Ontwerpen van gebouwen en structuren",
        riasec_vector: { R: 0.5, I: 0.7, A: 0.95, S: 0.3, E: 0.5, C: 0.6 },
        career_direction: "Kunst & Media",
        education_level: "WO",
        work_values: ["creativity", "achievement"]
    },
    {
        onet_soc_code: "27-2041.00",
        title: "Muzikant",
        description: "Componeren, arrangeren en uitvoeren van muziek",
        riasec_vector: { R: 0.3, I: 0.4, A: 1.0, S: 0.4, E: 0.5, C: 0.3 },
        career_direction: "Kunst & Media",
        education_level: "HBO",
        work_values: ["creativity", "independence"]
    },
    {
        onet_soc_code: "27-3043.00",
        title: "Schrijver/Auteur",
        description: "Schrijven van originele content voor publicatie",
        riasec_vector: { R: 0.1, I: 0.6, A: 0.95, S: 0.3, E: 0.4, C: 0.4 },
        career_direction: "Kunst & Media",
        education_level: "HBO",
        work_values: ["creativity", "autonomy"]
    },
    {
        onet_soc_code: "15-1255.00",
        title: "Game Developer",
        description: "Ontwerpen en programmeren van computergames",
        riasec_vector: { R: 0.4, I: 0.8, A: 0.9, S: 0.3, E: 0.4, C: 0.5 },
        career_direction: "Kunst & Media",
        education_level: "HBO",
        work_values: ["creativity", "achievement"]
    },
    {
        onet_soc_code: "27-1025.00",
        title: "Interieurontwerper",
        description: "Ontwerpen van functionele en esthetische binnenruimtes",
        riasec_vector: { R: 0.4, I: 0.5, A: 0.95, S: 0.5, E: 0.6, C: 0.5 },
        career_direction: "Kunst & Media",
        education_level: "HBO",
        work_values: ["creativity", "achievement"]
    },

    // SOCIAL-DOMINANT OCCUPATIONS
    {
        onet_soc_code: "29-1141.00",
        title: "Verpleegkundige",
        description: "Verzorgen van patiënten en coördineren van medische zorg",
        riasec_vector: { R: 0.4, I: 0.6, A: 0.3, S: 1.0, E: 0.4, C: 0.6 },
        career_direction: "Zorg & Welzijn",
        education_level: "HBO",
        work_values: ["altruism", "team"]
    },
    {
        onet_soc_code: "19-3031.00",
        title: "Psycholoog",
        description: "Diagnosticeren en behandelen van mentale gezondheidsproblemen",
        riasec_vector: { R: 0.1, I: 0.8, A: 0.4, S: 0.95, E: 0.3, C: 0.5 },
        career_direction: "Zorg & Welzijn",
        education_level: "WO",
        work_values: ["altruism", "achievement"]
    },
    {
        onet_soc_code: "25-2021.00",
        title: "Basisschoolleraar",
        description: "Lesgeven aan kinderen in de basisschool",
        riasec_vector: { R: 0.2, I: 0.5, A: 0.6, S: 1.0, E: 0.5, C: 0.5 },
        career_direction: "Zorg & Welzijn",
        education_level: "HBO",
        work_values: ["altruism", "team"]
    },
    {
        onet_soc_code: "21-1022.00",
        title: "Maatschappelijk Werker",
        description: "Ondersteunen van mensen met sociale en persoonlijke problemen",
        riasec_vector: { R: 0.1, I: 0.5, A: 0.4, S: 1.0, E: 0.4, C: 0.5 },
        career_direction: "Zorg & Welzijn",
        education_level: "HBO",
        work_values: ["altruism", "team"]
    },
    {
        onet_soc_code: "29-1123.00",
        title: "Fysiotherapeut",
        description: "Behandelen van bewegingsproblemen en pijn",
        riasec_vector: { R: 0.5, I: 0.6, A: 0.3, S: 0.95, E: 0.4, C: 0.5 },
        career_direction: "Zorg & Welzijn",
        education_level: "HBO",
        work_values: ["altruism", "achievement"]
    },
    {
        onet_soc_code: "21-1014.00",
        title: "Counselor",
        description: "Begeleiden van mensen bij persoonlijke en sociale problemen",
        riasec_vector: { R: 0.1, I: 0.6, A: 0.5, S: 0.95, E: 0.3, C: 0.4 },
        career_direction: "Zorg & Welzijn",
        education_level: "HBO",
        work_values: ["altruism", "team"]
    },
    {
        onet_soc_code: "25-1071.00",
        title: "Docent Hoger Onderwijs",
        description: "Lesgeven en onderzoek doen aan universiteiten",
        riasec_vector: { R: 0.1, I: 0.8, A: 0.5, S: 0.9, E: 0.4, C: 0.5 },
        career_direction: "Zorg & Welzijn",
        education_level: "WO",
        work_values: ["altruism", "autonomy", "achievement"]
    },

    // ENTERPRISING-DOMINANT OCCUPATIONS
    {
        onet_soc_code: "11-2021.00",
        title: "Marketing Manager",
        description: "Ontwikkelen en uitvoeren van marketingstrategieën",
        riasec_vector: { R: 0.2, I: 0.6, A: 0.7, S: 0.6, E: 1.0, C: 0.5 },
        career_direction: "Business & Management",
        education_level: "HBO",
        work_values: ["achievement", "dynamic"]
    },
    {
        onet_soc_code: "11-1021.00",
        title: "General Manager",
        description: "Leiden en coördineren van bedrijfsactiviteiten",
        riasec_vector: { R: 0.2, I: 0.6, A: 0.4, S: 0.7, E: 1.0, C: 0.6 },
        career_direction: "Business & Management",
        education_level: "WO",
        work_values: ["achievement", "dynamic"]
    },
    {
        onet_soc_code: "41-3099.00",
        title: "Verkoper",
        description: "Verkopen van producten en diensten aan klanten",
        riasec_vector: { R: 0.2, I: 0.3, A: 0.4, S: 0.7, E: 0.95, C: 0.4 },
        career_direction: "Business & Management",
        education_level: "MBO",
        work_values: ["dynamic", "achievement"]
    },
    {
        onet_soc_code: "13-1161.00",
        title: "Marktonderzoeker",
        description: "Analyseren van markttrends en consumentengedrag",
        riasec_vector: { R: 0.1, I: 0.8, A: 0.5, S: 0.4, E: 0.9, C: 0.7 },
        career_direction: "Business & Management",
        education_level: "HBO",
        work_values: ["achievement", "autonomy"]
    },
    {
        onet_soc_code: "11-3121.00",
        title: "HR Manager",
        description: "Leiden van personeelsbeleid en werving",
        riasec_vector: { R: 0.1, I: 0.5, A: 0.4, S: 0.8, E: 0.95, C: 0.6 },
        career_direction: "Business & Management",
        education_level: "HBO",
        work_values: ["team", "achievement"]
    },
    {
        onet_soc_code: "13-1111.00",
        title: "Bedrijfsadviseur",
        description: "Adviseren van organisaties over efficiëntie en strategie",
        riasec_vector: { R: 0.1, I: 0.7, A: 0.5, S: 0.6, E: 0.95, C: 0.6 },
        career_direction: "Business & Management",
        education_level: "WO",
        work_values: ["achievement", "autonomy"]
    },
    {
        onet_soc_code: "11-2022.00",
        title: "Sales Manager",
        description: "Leiden van verkoopteams en ontwikkelen van verkoopstrategieën",
        riasec_vector: { R: 0.2, I: 0.5, A: 0.4, S: 0.7, E: 1.0, C: 0.5 },
        career_direction: "Business & Management",
        education_level: "HBO",
        work_values: ["achievement", "dynamic"]
    },

    // CONVENTIONAL-DOMINANT OCCUPATIONS
    {
        onet_soc_code: "13-2011.00",
        title: "Accountant",
        description: "Voorbereiden en controleren van financiële documenten",
        riasec_vector: { R: 0.1, I: 0.6, A: 0.2, S: 0.3, E: 0.4, C: 1.0 },
        career_direction: "Financiën & Administratie",
        education_level: "HBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "43-6014.00",
        title: "Administratief Medewerker",
        description: "Uitvoeren van administratieve en secretariële taken",
        riasec_vector: { R: 0.1, I: 0.3, A: 0.2, S: 0.5, E: 0.3, C: 0.95 },
        career_direction: "Financiën & Administratie",
        education_level: "MBO",
        work_values: ["security", "team"]
    },
    {
        onet_soc_code: "13-2051.00",
        title: "Financieel Analist",
        description: "Analyseren van financiële data voor investeringsbeslissingen",
        riasec_vector: { R: 0.1, I: 0.8, A: 0.3, S: 0.3, E: 0.5, C: 0.95 },
        career_direction: "Financiën & Administratie",
        education_level: "WO",
        work_values: ["achievement", "security"]
    },
    {
        onet_soc_code: "23-1011.00",
        title: "Advocaat",
        description: "Vertegenwoordigen van klanten in juridische zaken",
        riasec_vector: { R: 0.1, I: 0.7, A: 0.4, S: 0.5, E: 0.8, C: 0.9 },
        career_direction: "Financiën & Administratie",
        education_level: "WO",
        work_values: ["achievement", "autonomy"]
    },
    {
        onet_soc_code: "15-1244.00",
        title: "Database Administrator",
        description: "Beheren en onderhouden van databases",
        riasec_vector: { R: 0.3, I: 0.7, A: 0.3, S: 0.3, E: 0.3, C: 0.95 },
        career_direction: "Financiën & Administratie",
        education_level: "HBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "13-1051.00",
        title: "Kostendeskundige",
        description: "Analyseren van kosten en budgetten voor projecten",
        riasec_vector: { R: 0.2, I: 0.7, A: 0.2, S: 0.3, E: 0.4, C: 0.95 },
        career_direction: "Financiën & Administratie",
        education_level: "HBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "11-3031.00",
        title: "Financieel Manager",
        description: "Leiden van financiële planning en rapportage",
        riasec_vector: { R: 0.1, I: 0.6, A: 0.3, S: 0.4, E: 0.7, C: 1.0 },
        career_direction: "Financiën & Administratie",
        education_level: "WO",
        work_values: ["achievement", "security"]
    },

    // MIXED/BALANCED OCCUPATIONS
    {
        onet_soc_code: "15-1299.00",
        title: "UX Designer",
        description: "Ontwerpen van gebruiksvriendelijke digitale interfaces",
        riasec_vector: { R: 0.3, I: 0.7, A: 0.9, S: 0.5, E: 0.5, C: 0.5 },
        career_direction: "Creatie & Design",
        education_level: "HBO",
        work_values: ["creativity", "achievement"]
    },
    {
        onet_soc_code: "27-3031.00",
        title: "PR Specialist",
        description: "Beheren van publieke relaties en communicatie",
        riasec_vector: { R: 0.1, I: 0.5, A: 0.7, S: 0.7, E: 0.8, C: 0.5 },
        career_direction: "Business & Management",
        education_level: "HBO",
        work_values: ["dynamic", "team"]
    },
    {
        onet_soc_code: "19-3011.00",
        title: "Econoom",
        description: "Bestuderen van economische trends en beleid",
        riasec_vector: { R: 0.1, I: 0.9, A: 0.3, S: 0.3, E: 0.5, C: 0.8 },
        career_direction: "Onderzoek & Data",
        education_level: "WO",
        work_values: ["autonomy", "achievement"]
    },
    {
        onet_soc_code: "29-1071.00",
        title: "Physician Assistant",
        description: "Medische zorg verlenen onder supervisie van artsen",
        riasec_vector: { R: 0.4, I: 0.8, A: 0.3, S: 0.9, E: 0.4, C: 0.6 },
        career_direction: "Zorg & Welzijn",
        education_level: "WO",
        work_values: ["altruism", "achievement"]
    },
    {
        onet_soc_code: "13-1199.00",
        title: "Duurzaamheidsadviseur",
        description: "Adviseren over milieuvriendelijke bedrijfspraktijken",
        riasec_vector: { R: 0.4, I: 0.7, A: 0.5, S: 0.6, E: 0.7, C: 0.6 },
        career_direction: "Business & Management",
        education_level: "HBO",
        work_values: ["altruism", "achievement"]
    },

    // ADDITIONAL REALISTIC OCCUPATIONS
    {
        onet_soc_code: "47-2031.00",
        title: "Timmerman",
        description: "Bouwen en repareren van houten constructies en meubels",
        riasec_vector: { R: 0.95, I: 0.4, A: 0.5, S: 0.3, E: 0.3, C: 0.6 },
        career_direction: "Wetenschap & Techniek",
        education_level: "MBO",
        work_values: ["achievement", "independence"]
    },
    {
        onet_soc_code: "49-9071.00",
        title: "HVAC Technicus",
        description: "Installeren en onderhouden van verwarmings- en airconditioningsystemen",
        riasec_vector: { R: 0.9, I: 0.6, A: 0.2, S: 0.3, E: 0.3, C: 0.7 },
        career_direction: "Wetenschap & Techniek",
        education_level: "MBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "17-2071.00",
        title: "Elektrotechnisch Ingenieur",
        description: "Ontwerpen van elektrische systemen en apparatuur",
        riasec_vector: { R: 0.7, I: 0.95, A: 0.4, S: 0.2, E: 0.4, C: 0.7 },
        career_direction: "Wetenschap & Techniek",
        education_level: "WO",
        work_values: ["achievement", "autonomy"]
    },
    {
        onet_soc_code: "51-9061.00",
        title: "Chemisch Procesoperator",
        description: "Bedienen van apparatuur voor chemische productie",
        riasec_vector: { R: 0.85, I: 0.6, A: 0.2, S: 0.2, E: 0.3, C: 0.8 },
        career_direction: "Wetenschap & Techniek",
        education_level: "MBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "53-2012.00",
        title: "Piloot",
        description: "Besturen van vliegtuigen voor passagiers- of vrachttransport",
        riasec_vector: { R: 0.8, I: 0.7, A: 0.3, S: 0.4, E: 0.5, C: 0.7 },
        career_direction: "Wetenschap & Techniek",
        education_level: "HBO",
        work_values: ["achievement", "independence"]
    },

    // ADDITIONAL INVESTIGATIVE OCCUPATIONS
    {
        onet_soc_code: "15-1211.00",
        title: "Cybersecurity Specialist",
        description: "Beschermen van computersystemen tegen digitale aanvallen",
        riasec_vector: { R: 0.4, I: 0.95, A: 0.4, S: 0.2, E: 0.3, C: 0.8 },
        career_direction: "IT & Data",
        education_level: "HBO",
        work_values: ["achievement", "autonomy"]
    },
    {
        onet_soc_code: "19-2041.00",
        title: "Milieukundige",
        description: "Onderzoeken van milieuproblemen en ontwikkelen van oplossingen",
        riasec_vector: { R: 0.5, I: 0.9, A: 0.3, S: 0.4, E: 0.4, C: 0.7 },
        career_direction: "IT & Data",
        education_level: "WO",
        work_values: ["altruism", "achievement"]
    },
    {
        onet_soc_code: "19-1021.00",
        title: "Biochemicus",
        description: "Bestuderen van chemische processen in levende organismen",
        riasec_vector: { R: 0.3, I: 1.0, A: 0.3, S: 0.2, E: 0.2, C: 0.8 },
        career_direction: "IT & Data",
        education_level: "WO",
        work_values: ["achievement", "autonomy"]
    },
    {
        onet_soc_code: "15-2041.00",
        title: "Statisticus",
        description: "Verzamelen en analyseren van data voor onderzoek en besluitvorming",
        riasec_vector: { R: 0.1, I: 0.95, A: 0.3, S: 0.2, E: 0.3, C: 0.9 },
        career_direction: "IT & Data",
        education_level: "WO",
        work_values: ["autonomy", "achievement"]
    },
    {
        onet_soc_code: "29-1069.00",
        title: "Arts",
        description: "Diagnosticeren en behandelen van ziektes en verwondingen",
        riasec_vector: { R: 0.3, I: 0.95, A: 0.3, S: 0.8, E: 0.4, C: 0.6 },
        career_direction: "Zorg & Welzijn",
        education_level: "WO",
        work_values: ["altruism", "achievement"]
    },

    // ADDITIONAL ARTISTIC OCCUPATIONS
    {
        onet_soc_code: "27-1022.00",
        title: "Modeontwerper",
        description: "Ontwerpen van kleding en accessoires",
        riasec_vector: { R: 0.3, I: 0.5, A: 1.0, S: 0.3, E: 0.6, C: 0.4 },
        career_direction: "Kunst & Media",
        education_level: "HBO",
        work_values: ["creativity", "achievement"]
    },
    {
        onet_soc_code: "27-3042.00",
        title: "Technisch Schrijver",
        description: "Schrijven van technische documentatie en handleidingen",
        riasec_vector: { R: 0.2, I: 0.7, A: 0.8, S: 0.3, E: 0.3, C: 0.6 },
        career_direction: "Kunst & Media",
        education_level: "HBO",
        work_values: ["autonomy", "achievement"]
    },
    {
        onet_soc_code: "27-1014.00",
        title: "Multimediakunstenaar",
        description: "Creëren van visuele effecten en animaties",
        riasec_vector: { R: 0.4, I: 0.6, A: 0.95, S: 0.2, E: 0.4, C: 0.5 },
        career_direction: "Kunst & Media",
        education_level: "HBO",
        work_values: ["creativity", "achievement"]
    },
    {
        onet_soc_code: "27-2012.00",
        title: "Regisseur",
        description: "Leiden van film-, theater- of televisieproducties",
        riasec_vector: { R: 0.2, I: 0.6, A: 0.95, S: 0.6, E: 0.8, C: 0.4 },
        career_direction: "Kunst & Media",
        education_level: "HBO",
        work_values: ["creativity", "achievement"]
    },
    {
        onet_soc_code: "27-1027.00",
        title: "Landschapsarchitect",
        description: "Ontwerpen van buitenruimtes en landschappen",
        riasec_vector: { R: 0.5, I: 0.6, A: 0.9, S: 0.4, E: 0.5, C: 0.5 },
        career_direction: "Kunst & Media",
        education_level: "WO",
        work_values: ["creativity", "achievement"]
    },

    // ADDITIONAL SOCIAL OCCUPATIONS
    {
        onet_soc_code: "21-1012.00",
        title: "Pedagogisch Medewerker",
        description: "Begeleiden en ondersteunen van kinderen in opvang en onderwijs",
        riasec_vector: { R: 0.2, I: 0.4, A: 0.5, S: 0.95, E: 0.3, C: 0.4 },
        career_direction: "Zorg & Welzijn",
        education_level: "MBO",
        work_values: ["altruism", "team"]
    },
    {
        onet_soc_code: "29-1181.00",
        title: "Diëtist",
        description: "Adviseren over voeding en gezonde eetgewoonten",
        riasec_vector: { R: 0.2, I: 0.7, A: 0.3, S: 0.9, E: 0.4, C: 0.6 },
        career_direction: "Zorg & Welzijn",
        education_level: "HBO",
        work_values: ["altruism", "achievement"]
    },
    {
        onet_soc_code: "25-3011.00",
        title: "Volwasseneneducator",
        description: "Lesgeven aan volwassenen in diverse vakgebieden",
        riasec_vector: { R: 0.1, I: 0.6, A: 0.5, S: 0.95, E: 0.4, C: 0.4 },
        career_direction: "Zorg & Welzijn",
        education_level: "HBO",
        work_values: ["altruism", "autonomy"]
    },
    {
        onet_soc_code: "21-1093.00",
        title: "Sociaal Werker Gezondheidszorg",
        description: "Ondersteunen van patiënten met medische en sociale problemen",
        riasec_vector: { R: 0.1, I: 0.6, A: 0.4, S: 1.0, E: 0.3, C: 0.5 },
        career_direction: "Zorg & Welzijn",
        education_level: "HBO",
        work_values: ["altruism", "team"]
    },
    {
        onet_soc_code: "29-1122.00",
        title: "Ergotherapeut",
        description: "Helpen mensen bij het ontwikkelen van dagelijkse vaardigheden",
        riasec_vector: { R: 0.4, I: 0.6, A: 0.4, S: 0.95, E: 0.3, C: 0.5 },
        career_direction: "Zorg & Welzijn",
        education_level: "HBO",
        work_values: ["altruism", "achievement"]
    },

    // ADDITIONAL ENTERPRISING OCCUPATIONS
    {
        onet_soc_code: "11-2031.00",
        title: "PR Manager",
        description: "Leiden van public relations en communicatiestrategieën",
        riasec_vector: { R: 0.1, I: 0.6, A: 0.7, S: 0.7, E: 0.95, C: 0.5 },
        career_direction: "Business & Management",
        education_level: "HBO",
        work_values: ["dynamic", "achievement"]
    },
    {
        onet_soc_code: "13-1071.00",
        title: "HR Specialist",
        description: "Werven en selecteren van personeel",
        riasec_vector: { R: 0.1, I: 0.5, A: 0.4, S: 0.7, E: 0.85, C: 0.6 },
        career_direction: "Business & Management",
        education_level: "HBO",
        work_values: ["team", "achievement"]
    },
    {
        onet_soc_code: "41-4011.00",
        title: "Vertegenwoordiger",
        description: "Verkopen van producten aan bedrijven en organisaties",
        riasec_vector: { R: 0.2, I: 0.4, A: 0.4, S: 0.6, E: 0.95, C: 0.4 },
        career_direction: "Business & Management",
        education_level: "MBO",
        work_values: ["dynamic", "achievement"]
    },
    {
        onet_soc_code: "11-9199.00",
        title: "Projectmanager",
        description: "Plannen en coördineren van projecten binnen organisaties",
        riasec_vector: { R: 0.2, I: 0.6, A: 0.4, S: 0.6, E: 0.9, C: 0.7 },
        career_direction: "Business & Management",
        education_level: "HBO",
        work_values: ["achievement", "dynamic"]
    },
    {
        onet_soc_code: "13-1151.00",
        title: "Trainings- en Ontwikkelingsspecialist",
        description: "Ontwikkelen en geven van trainingen aan medewerkers",
        riasec_vector: { R: 0.1, I: 0.6, A: 0.6, S: 0.8, E: 0.85, C: 0.5 },
        career_direction: "Business & Management",
        education_level: "HBO",
        work_values: ["team", "achievement"]
    },

    // ADDITIONAL CONVENTIONAL OCCUPATIONS
    {
        onet_soc_code: "43-3031.00",
        title: "Boekhouder",
        description: "Bijhouden van financiële administratie",
        riasec_vector: { R: 0.1, I: 0.5, A: 0.2, S: 0.3, E: 0.3, C: 0.95 },
        career_direction: "Financiën & Administratie",
        education_level: "MBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "13-2072.00",
        title: "Kredietanalist",
        description: "Beoordelen van kredietaanvragen en financiële risico's",
        riasec_vector: { R: 0.1, I: 0.7, A: 0.2, S: 0.3, E: 0.4, C: 0.95 },
        career_direction: "Financiën & Administratie",
        education_level: "HBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "43-4171.00",
        title: "Receptionist",
        description: "Ontvangen van bezoekers en afhandelen van telefoongesprekken",
        riasec_vector: { R: 0.1, I: 0.3, A: 0.3, S: 0.6, E: 0.4, C: 0.9 },
        career_direction: "Financiën & Administratie",
        education_level: "MBO",
        work_values: ["team", "security"]
    },
    {
        onet_soc_code: "13-1141.00",
        title: "Compensatie en Benefits Specialist",
        description: "Beheren van salarisstructuren en secundaire arbeidsvoorwaarden",
        riasec_vector: { R: 0.1, I: 0.6, A: 0.2, S: 0.4, E: 0.4, C: 0.95 },
        career_direction: "Financiën & Administratie",
        education_level: "HBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "15-1243.00",
        title: "Database Architect",
        description: "Ontwerpen van database structuren en systemen",
        riasec_vector: { R: 0.3, I: 0.8, A: 0.4, S: 0.2, E: 0.4, C: 0.95 },
        career_direction: "Onderzoek & Data",
        education_level: "WO",
        work_values: ["achievement", "autonomy"]
    },

    // ADDITIONAL MIXED/BALANCED OCCUPATIONS
    {
        onet_soc_code: "27-3091.00",
        title: "Tolk/Vertaler",
        description: "Vertalen van gesproken of geschreven teksten tussen talen",
        riasec_vector: { R: 0.1, I: 0.6, A: 0.7, S: 0.5, E: 0.4, C: 0.6 },
        career_direction: "Kunst & Media",
        education_level: "HBO",
        work_values: ["autonomy", "achievement"]
    },
    {
        onet_soc_code: "19-3039.00",
        title: "Socioloog",
        description: "Bestuderen van menselijk gedrag en sociale structuren",
        riasec_vector: { R: 0.1, I: 0.9, A: 0.4, S: 0.6, E: 0.4, C: 0.7 },
        career_direction: "IT & Data",
        education_level: "WO",
        work_values: ["autonomy", "achievement"]
    },
    {
        onet_soc_code: "13-1041.00",
        title: "Compliance Officer",
        description: "Zorgen voor naleving van wet- en regelgeving binnen organisaties",
        riasec_vector: { R: 0.1, I: 0.7, A: 0.3, S: 0.4, E: 0.6, C: 0.9 },
        career_direction: "Financiën & Administratie",
        education_level: "WO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "15-1256.00",
        title: "Software Quality Assurance Analist",
        description: "Testen van software op fouten en kwaliteit",
        riasec_vector: { R: 0.3, I: 0.8, A: 0.4, S: 0.3, E: 0.4, C: 0.9 },
        career_direction: "IT & Data",
        education_level: "HBO",
        work_values: ["achievement", "security"]
    },

    // SECTOR 01: LANDBOUW & NATUUR
    {
        onet_soc_code: "11-9013.00",
        title: "Agrarisch Ondernemer",
        description: "Leiden en beheren van landbouwbedrijven en veehouderijen",
        riasec_vector: { R: 0.85, I: 0.5, A: 0.3, S: 0.4, E: 0.8, C: 0.6 },
        career_direction: "Landbouw & Natuur",
        education_level: "MBO",
        work_values: ["independence", "achievement", "security"]
    },
    {
        onet_soc_code: "45-2091.00",
        title: "Landbouwmachinist",
        description: "Bedienen van landbouwmachines en tractoren",
        riasec_vector: { R: 0.9, I: 0.4, A: 0.2, S: 0.3, E: 0.3, C: 0.7 },
        career_direction: "Landbouw & Natuur",
        education_level: "MBO",
        work_values: ["independence", "security"]
    },
    {
        onet_soc_code: "45-2092.00",
        title: "Tuinder",
        description: "Kweken van groenten, fruit en bloemen in kassen of open teelt",
        riasec_vector: { R: 0.85, I: 0.5, A: 0.3, S: 0.3, E: 0.4, C: 0.6 },
        career_direction: "Landbouw & Natuur",
        education_level: "MBO",
        work_values: ["independence", "achievement"]
    },
    {
        onet_soc_code: "33-9011.00",
        title: "Boswachter",
        description: "Beheren en beschermen van bossen en natuurgebieden",
        riasec_vector: { R: 0.8, I: 0.6, A: 0.3, S: 0.5, E: 0.4, C: 0.6 },
        career_direction: "Landbouw & Natuur",
        education_level: "HBO",
        work_values: ["altruism", "independence", "security"]
    },
    {
        onet_soc_code: "19-1031.00",
        title: "Conservatiebioloog",
        description: "Onderzoeken en beschermen van bedreigde soorten en ecosystemen",
        riasec_vector: { R: 0.6, I: 0.9, A: 0.4, S: 0.5, E: 0.4, C: 0.7 },
        career_direction: "Landbouw & Natuur",
        education_level: "WO",
        work_values: ["altruism", "achievement", "autonomy"]
    },
    {
        onet_soc_code: "37-3011.00",
        title: "Landschapsarchitect",
        description: "Ontwerpen van tuinen, parken en groene buitenruimtes",
        riasec_vector: { R: 0.6, I: 0.6, A: 0.85, S: 0.4, E: 0.5, C: 0.6 },
        career_direction: "Landbouw & Natuur",
        education_level: "HBO",
        work_values: ["creativity", "achievement"]
    },

    // SECTOR 02: BOUW & CONSTRUCTIE
    {
        onet_soc_code: "47-2152.00",
        title: "Loodgieter",
        description: "Installeren en repareren van waterleiding- en verwarmingssystemen",
        riasec_vector: { R: 0.95, I: 0.5, A: 0.2, S: 0.3, E: 0.3, C: 0.7 },
        career_direction: "Bouw & Constructie",
        education_level: "MBO",
        work_values: ["achievement", "security", "independence"]
    },
    {
        onet_soc_code: "47-2051.00",
        title: "Metselaar",
        description: "Bouwen van muren en andere constructies met stenen en baksteen",
        riasec_vector: { R: 0.95, I: 0.4, A: 0.3, S: 0.3, E: 0.3, C: 0.7 },
        career_direction: "Bouw & Constructie",
        education_level: "MBO",
        work_values: ["achievement", "security"]
    },
    {
        onet_soc_code: "47-2081.00",
        title: "Stukadoor",
        description: "Aanbrengen van pleisterwerk op muren en plafonds",
        riasec_vector: { R: 0.9, I: 0.4, A: 0.5, S: 0.3, E: 0.3, C: 0.6 },
        career_direction: "Bouw & Constructie",
        education_level: "MBO",
        work_values: ["achievement", "independence"]
    },
    {
        onet_soc_code: "17-3011.00",
        title: "Bouwkundig Tekenaar",
        description: "Maken van technische tekeningen voor bouwprojecten",
        riasec_vector: { R: 0.6, I: 0.7, A: 0.6, S: 0.3, E: 0.4, C: 0.8 },
        career_direction: "Bouw & Constructie",
        education_level: "MBO",
        work_values: ["achievement", "autonomy"]
    },
    {
        onet_soc_code: "53-7021.00",
        title: "Kraanmachinist",
        description: "Bedienen van bouwkranen voor zware lasten",
        riasec_vector: { R: 0.9, I: 0.5, A: 0.2, S: 0.3, E: 0.3, C: 0.7 },
        career_direction: "Bouw & Constructie",
        education_level: "MBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "11-9021.00",
        title: "Bouwplaatsmanager",
        description: "Leiden en coördineren van bouwprojecten op locatie",
        riasec_vector: { R: 0.7, I: 0.6, A: 0.4, S: 0.5, E: 0.85, C: 0.7 },
        career_direction: "Bouw & Constructie",
        education_level: "HBO",
        work_values: ["achievement", "dynamic", "security"]
    },

    // SECTOR 05: ONDERWIJS & TRAINING
    {
        onet_soc_code: "25-2031.00",
        title: "Docent Voortgezet Onderwijs",
        description: "Lesgeven aan middelbare scholieren in diverse vakken",
        riasec_vector: { R: 0.2, I: 0.7, A: 0.6, S: 0.95, E: 0.5, C: 0.5 },
        career_direction: "Onderwijs & Training",
        education_level: "WO",
        work_values: ["altruism", "achievement", "autonomy"]
    },
    {
        onet_soc_code: "25-9031.00",
        title: "Instructeur",
        description: "Verzorgen van praktijkgerichte trainingen en workshops",
        riasec_vector: { R: 0.4, I: 0.5, A: 0.5, S: 0.9, E: 0.6, C: 0.5 },
        career_direction: "Onderwijs & Training",
        education_level: "HBO",
        work_values: ["altruism", "team", "achievement"]
    },
    {
        onet_soc_code: "13-1151.00",
        title: "Trainings- en Ontwikkelingsspecialist",
        description: "Ontwikkelen en geven van trainingen aan medewerkers",
        riasec_vector: { R: 0.2, I: 0.6, A: 0.6, S: 0.85, E: 0.7, C: 0.5 },
        career_direction: "Onderwijs & Training",
        education_level: "HBO",
        work_values: ["team", "achievement", "altruism"]
    },
    {
        onet_soc_code: "25-4021.00",
        title: "Bibliothecaris",
        description: "Beheren van bibliotheken en assisteren van bezoekers",
        riasec_vector: { R: 0.2, I: 0.6, A: 0.5, S: 0.8, E: 0.4, C: 0.8 },
        career_direction: "Onderwijs & Training",
        education_level: "HBO",
        work_values: ["altruism", "autonomy", "security"]
    },
    {
        onet_soc_code: "27-3043.00",
        title: "Educatief Schrijver",
        description: "Schrijven en ontwikkelen van educatieve materialen en curricula",
        riasec_vector: { R: 0.1, I: 0.7, A: 0.8, S: 0.6, E: 0.4, C: 0.6 },
        career_direction: "Onderwijs & Training",
        education_level: "HBO",
        work_values: ["creativity", "achievement", "altruism"]
    },

    // SECTOR 07: OVERHEID & PUBLIEKE DIENSTEN
    {
        onet_soc_code: "11-1031.00",
        title: "Gemeentesecretaris",
        description: "Leiden van gemeentelijke administratie en dienstverlening",
        riasec_vector: { R: 0.2, I: 0.6, A: 0.4, S: 0.7, E: 0.8, C: 0.9 },
        career_direction: "Overheid & Publieke Diensten",
        education_level: "WO",
        work_values: ["altruism", "security", "achievement"]
    },
    {
        onet_soc_code: "13-1041.00",
        title: "Beleidsmedewerker",
        description: "Ontwikkelen en implementeren van overheidsbeleid",
        riasec_vector: { R: 0.2, I: 0.8, A: 0.4, S: 0.6, E: 0.6, C: 0.85 },
        career_direction: "Overheid & Publieke Diensten",
        education_level: "WO",
        work_values: ["altruism", "achievement", "security"]
    },
    {
        onet_soc_code: "43-4061.00",
        title: "Gemeenteambtenaar",
        description: "Verstrekken van informatie en diensten aan burgers",
        riasec_vector: { R: 0.2, I: 0.4, A: 0.3, S: 0.75, E: 0.4, C: 0.9 },
        career_direction: "Overheid & Publieke Diensten",
        education_level: "MBO",
        work_values: ["altruism", "security", "team"]
    },
    {
        onet_soc_code: "13-1199.01",
        title: "Openbaar Bestuurder",
        description: "Leiden van publieke organisaties en overheidsinstellingen",
        riasec_vector: { R: 0.2, I: 0.6, A: 0.4, S: 0.75, E: 0.9, C: 0.8 },
        career_direction: "Overheid & Publieke Diensten",
        education_level: "WO",
        work_values: ["altruism", "achievement", "dynamic"]
    },

    // SECTOR 09: HORECA & TOERISME
    {
        onet_soc_code: "11-9081.00",
        title: "Hotelmanager",
        description: "Leiden van hotel operaties en gastvrijheidsdiensten",
        riasec_vector: { R: 0.3, I: 0.4, A: 0.5, S: 0.8, E: 0.9, C: 0.7 },
        career_direction: "Horeca & Toerisme",
        education_level: "HBO",
        work_values: ["dynamic", "team", "achievement"]
    },
    {
        onet_soc_code: "35-1011.00",
        title: "Chef-kok",
        description: "Leiden van keukens en ontwikkelen van menu's",
        riasec_vector: { R: 0.7, I: 0.5, A: 0.8, S: 0.6, E: 0.7, C: 0.5 },
        career_direction: "Horeca & Toerisme",
        education_level: "MBO",
        work_values: ["creativity", "achievement", "dynamic"]
    },
    {
        onet_soc_code: "35-3031.00",
        title: "Kelner/Serveerster",
        description: "Bedienen van gasten in restaurants en cafés",
        riasec_vector: { R: 0.3, I: 0.2, A: 0.4, S: 0.85, E: 0.6, C: 0.5 },
        career_direction: "Horeca & Toerisme",
        education_level: "MBO",
        work_values: ["team", "dynamic", "altruism"]
    },
    {
        onet_soc_code: "39-6012.00",
        title: "Reisagent",
        description: "Adviseren en organiseren van reizen en vakanties",
        riasec_vector: { R: 0.2, I: 0.4, A: 0.5, S: 0.8, E: 0.85, C: 0.6 },
        career_direction: "Horeca & Toerisme",
        education_level: "MBO",
        work_values: ["team", "dynamic", "achievement"]
    },
    {
        onet_soc_code: "13-1121.00",
        title: "Eventcoördinator",
        description: "Organiseren en coördineren van evenementen en bijeenkomsten",
        riasec_vector: { R: 0.3, I: 0.5, A: 0.7, S: 0.75, E: 0.9, C: 0.6 },
        career_direction: "Horeca & Toerisme",
        education_level: "HBO",
        work_values: ["dynamic", "achievement", "team"]
    },
    {
        onet_soc_code: "35-2014.00",
        title: "Zelfstandig Kok",
        description: "Bereiden van gerechten volgens recepten en standaarden",
        riasec_vector: { R: 0.7, I: 0.4, A: 0.7, S: 0.5, E: 0.4, C: 0.6 },
        career_direction: "Horeca & Toerisme",
        education_level: "MBO",
        work_values: ["creativity", "achievement"]
    },

    // SECTOR 10: MAATSCHAPPELIJKE DIENSTEN
    {
        onet_soc_code: "21-1021.00",
        title: "Jeugdzorgwerker",
        description: "Begeleiden en ondersteunen van jongeren in moeilijke situaties",
        riasec_vector: { R: 0.2, I: 0.5, A: 0.5, S: 0.95, E: 0.4, C: 0.5 },
        career_direction: "Maatschappelijke Diensten",
        education_level: "HBO",
        work_values: ["altruism", "team", "achievement"]
    },
    {
        onet_soc_code: "21-1015.00",
        title: "Gezinsbegeleider",
        description: "Ondersteunen van gezinnen bij opvoeding en huishoudelijke problemen",
        riasec_vector: { R: 0.2, I: 0.5, A: 0.4, S: 0.95, E: 0.4, C: 0.5 },
        career_direction: "Maatschappelijke Diensten",
        education_level: "HBO",
        work_values: ["altruism", "team"]
    },
    {
        onet_soc_code: "21-1094.00",
        title: "Buurtcoach",
        description: "Ondersteunen van bewoners bij participatie en zelfredzaamheid",
        riasec_vector: { R: 0.2, I: 0.5, A: 0.5, S: 0.9, E: 0.5, C: 0.4 },
        career_direction: "Maatschappelijke Diensten",
        education_level: "HBO",
        work_values: ["altruism", "team", "autonomy"]
    },
    {
        onet_soc_code: "21-1011.00",
        title: "Begeleider Gehandicaptenzorg",
        description: "Ondersteunen van mensen met een beperking bij dagelijkse activiteiten",
        riasec_vector: { R: 0.3, I: 0.4, A: 0.4, S: 0.95, E: 0.3, C: 0.5 },
        career_direction: "Maatschappelijke Diensten",
        education_level: "MBO",
        work_values: ["altruism", "team"]
    },

    // SECTOR 12: RECHT & VEILIGHEID
    {
        onet_soc_code: "33-3051.00",
        title: "Politieagent",
        description: "Handhaven van wet en orde en beschermen van burgers",
        riasec_vector: { R: 0.6, I: 0.5, A: 0.3, S: 0.7, E: 0.7, C: 0.8 },
        career_direction: "Recht & Veiligheid",
        education_level: "MBO",
        work_values: ["altruism", "security", "achievement"]
    },
    {
        onet_soc_code: "33-2011.00",
        title: "Brandweerman",
        description: "Blussen van branden en verlenen van hulp bij calamiteiten",
        riasec_vector: { R: 0.8, I: 0.5, A: 0.3, S: 0.7, E: 0.6, C: 0.7 },
        career_direction: "Recht & Veiligheid",
        education_level: "MBO",
        work_values: ["altruism", "team", "achievement"]
    },
    {
        onet_soc_code: "23-1023.00",
        title: "Rechter",
        description: "Leiden van rechtszaken en uitspraken doen in juridische kwesties",
        riasec_vector: { R: 0.1, I: 0.8, A: 0.4, S: 0.6, E: 0.7, C: 0.95 },
        career_direction: "Recht & Veiligheid",
        education_level: "WO",
        work_values: ["achievement", "security", "altruism"]
    },
    {
        onet_soc_code: "33-9032.00",
        title: "Beveiligingsspecialist",
        description: "Beschermen van mensen, eigendommen en informatie",
        riasec_vector: { R: 0.6, I: 0.6, A: 0.3, S: 0.5, E: 0.6, C: 0.85 },
        career_direction: "Recht & Veiligheid",
        education_level: "MBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "33-3012.00",
        title: "Correctioneel Officer",
        description: "Bewaken en begeleiden van gedetineerden in gevangenissen",
        riasec_vector: { R: 0.5, I: 0.4, A: 0.3, S: 0.65, E: 0.6, C: 0.85 },
        career_direction: "Recht & Veiligheid",
        education_level: "MBO",
        work_values: ["security", "altruism", "team"]
    },
    {
        onet_soc_code: "23-2011.00",
        title: "Juridisch Adviseur",
        description: "Adviseren van organisaties over juridische vraagstukken",
        riasec_vector: { R: 0.1, I: 0.8, A: 0.4, S: 0.5, E: 0.7, C: 0.9 },
        career_direction: "Recht & Veiligheid",
        education_level: "WO",
        work_values: ["achievement", "autonomy", "security"]
    },

    // SECTOR 13: PRODUCTIE & FABRICAGE
    {
        onet_soc_code: "51-1011.00",
        title: "Productiemanager",
        description: "Leiden van productieprocessen en teams in fabrieken",
        riasec_vector: { R: 0.7, I: 0.6, A: 0.3, S: 0.5, E: 0.8, C: 0.8 },
        career_direction: "Productie & Fabricage",
        education_level: "HBO",
        work_values: ["achievement", "dynamic", "security"]
    },
    {
        onet_soc_code: "51-9061.00",
        title: "Procesoperator Chemie",
        description: "Bedienen van apparatuur voor chemische productieprocessen",
        riasec_vector: { R: 0.9, I: 0.6, A: 0.2, S: 0.3, E: 0.3, C: 0.85 },
        career_direction: "Productie & Fabricage",
        education_level: "MBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "51-9061.00",
        title: "Kwaliteitscontroleur",
        description: "Controleren van producten op kwaliteit en specificaties",
        riasec_vector: { R: 0.7, I: 0.7, A: 0.2, S: 0.3, E: 0.3, C: 0.95 },
        career_direction: "Productie & Fabricage",
        education_level: "MBO",
        work_values: ["achievement", "security"]
    },
    {
        onet_soc_code: "49-9041.00",
        title: "Industrieel Monteur",
        description: "Onderhouden en repareren van industriële machines",
        riasec_vector: { R: 0.95, I: 0.6, A: 0.2, S: 0.3, E: 0.3, C: 0.7 },
        career_direction: "Productie & Fabricage",
        education_level: "MBO",
        work_values: ["achievement", "independence", "security"]
    },
    {
        onet_soc_code: "17-2112.00",
        title: "Industrial Engineer",
        description: "Optimaliseren van productieprocessen en systemen",
        riasec_vector: { R: 0.6, I: 0.9, A: 0.3, S: 0.3, E: 0.5, C: 0.8 },
        career_direction: "Productie & Fabricage",
        education_level: "WO",
        work_values: ["achievement", "autonomy"]
    },

    // SECTOR 14: MARKETING & SALES
    {
        onet_soc_code: "41-3031.00",
        title: "Accountmanager",
        description: "Beheren van klantrelaties en verkooptrajecten",
        riasec_vector: { R: 0.2, I: 0.5, A: 0.6, S: 0.75, E: 0.95, C: 0.5 },
        career_direction: "Marketing & Sales",
        education_level: "HBO",
        work_values: ["achievement", "dynamic", "team"]
    },
    {
        onet_soc_code: "27-3031.00",
        title: "Copywriter",
        description: "Schrijven van overtuigende teksten voor marketing en reclame",
        riasec_vector: { R: 0.1, I: 0.5, A: 0.9, S: 0.4, E: 0.7, C: 0.4 },
        career_direction: "Marketing & Sales",
        education_level: "HBO",
        work_values: ["creativity", "achievement", "autonomy"]
    },
    {
        onet_soc_code: "27-3031.00",
        title: "Social Media Manager",
        description: "Beheren van social media kanalen en online communities",
        riasec_vector: { R: 0.2, I: 0.5, A: 0.8, S: 0.7, E: 0.85, C: 0.5 },
        career_direction: "Marketing & Sales",
        education_level: "HBO",
        work_values: ["creativity", "dynamic", "achievement"]
    },
    {
        onet_soc_code: "13-1161.00",
        title: "Marketingadviseur",
        description: "Adviseren over marketingstrategieën en campagnes",
        riasec_vector: { R: 0.2, I: 0.7, A: 0.7, S: 0.6, E: 0.9, C: 0.6 },
        career_direction: "Marketing & Sales",
        education_level: "HBO",
        work_values: ["achievement", "autonomy", "dynamic"]
    },
    {
        onet_soc_code: "27-1013.00",
        title: "Art Director",
        description: "Leiden van creatieve teams voor visuele communicatie",
        riasec_vector: { R: 0.2, I: 0.6, A: 0.95, S: 0.5, E: 0.8, C: 0.5 },
        career_direction: "Marketing & Sales",
        education_level: "HBO",
        work_values: ["creativity", "achievement", "dynamic"]
    },
    {
        onet_soc_code: "41-9031.00",
        title: "Verkoopmedewerker",
        description: "Verkopen van producten en adviseren van klanten in winkels",
        riasec_vector: { R: 0.3, I: 0.3, A: 0.4, S: 0.8, E: 0.85, C: 0.5 },
        career_direction: "Marketing & Sales",
        education_level: "MBO",
        work_values: ["team", "dynamic", "altruism"]
    },

    // SECTOR 16: TRANSPORT & LOGISTIEK
    {
        onet_soc_code: "53-3032.00",
        title: "Vrachtwagenchauffeur",
        description: "Vervoeren van goederen over lange afstanden",
        riasec_vector: { R: 0.85, I: 0.4, A: 0.2, S: 0.4, E: 0.5, C: 0.7 },
        career_direction: "Transport & Logistiek",
        education_level: "MBO",
        work_values: ["independence", "security"]
    },
    {
        onet_soc_code: "13-1081.00",
        title: "Logistiek Coördinator",
        description: "Coördineren van goederenstromen en transportprocessen",
        riasec_vector: { R: 0.4, I: 0.6, A: 0.3, S: 0.5, E: 0.7, C: 0.85 },
        career_direction: "Transport & Logistiek",
        education_level: "HBO",
        work_values: ["achievement", "dynamic", "security"]
    },
    {
        onet_soc_code: "43-5071.00",
        title: "Expediteur",
        description: "Organiseren van internationaal transport en douanezaken",
        riasec_vector: { R: 0.3, I: 0.6, A: 0.3, S: 0.5, E: 0.7, C: 0.9 },
        career_direction: "Transport & Logistiek",
        education_level: "MBO",
        work_values: ["achievement", "dynamic", "security"]
    },
    {
        onet_soc_code: "53-7062.00",
        title: "Magazijnbeheerder",
        description: "Beheren van voorraden en magazijnprocessen",
        riasec_vector: { R: 0.6, I: 0.5, A: 0.2, S: 0.4, E: 0.6, C: 0.9 },
        career_direction: "Transport & Logistiek",
        education_level: "MBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "53-7051.00",
        title: "Vorkheftruck Chauffeur",
        description: "Laden en lossen van goederen met heftrucks",
        riasec_vector: { R: 0.9, I: 0.4, A: 0.2, S: 0.3, E: 0.3, C: 0.7 },
        career_direction: "Transport & Logistiek",
        education_level: "MBO",
        work_values: ["security", "independence"]
    },
    {
        onet_soc_code: "11-3071.00",
        title: "Supply Chain Manager",
        description: "Leiden van supply chain strategie en operaties",
        riasec_vector: { R: 0.3, I: 0.7, A: 0.3, S: 0.5, E: 0.85, C: 0.8 },
        career_direction: "Transport & Logistiek",
        education_level: "WO",
        work_values: ["achievement", "dynamic", "autonomy"]
    },
    // SECTOR 03: KUNST & MEDIA
    {
        onet_soc_code: "27-4011.00",
        title: "Audio- en Videotechnicus",
        description: "Installeren en bedienen van audio- en videoapparatuur",
        riasec_vector: { R: 0.6, I: 0.4, A: 0.5, S: 0.3, E: 0.3, C: 0.6 },
        career_direction: "Kunst & Media",
        education_level: "MBO",
        work_values: ["achievement", "independence"]
    },
    {
        onet_soc_code: "27-3022.00",
        title: "Redacteur",
        description: "Bewerken en controleren van teksten voor publicatie",
        riasec_vector: { R: 0.1, I: 0.5, A: 0.8, S: 0.4, E: 0.5, C: 0.6 },
        career_direction: "Kunst & Media",
        education_level: "HBO",
        work_values: ["creativity", "achievement", "autonomy"]
    },
    {
        onet_soc_code: "27-4031.00",
        title: "Cameraman/vrouw",
        description: "Bedienen van camera's voor film, televisie of video",
        riasec_vector: { R: 0.5, I: 0.3, A: 0.8, S: 0.3, E: 0.4, C: 0.4 },
        career_direction: "Kunst & Media",
        education_level: "MBO",
        work_values: ["creativity", "achievement"]
    },
    {
        onet_soc_code: "27-4014.00",
        title: "Geluidsengineer",
        description: "Opnemen en mixen van geluid voor muziek en media",
        riasec_vector: { R: 0.5, I: 0.5, A: 0.7, S: 0.3, E: 0.4, C: 0.5 },
        career_direction: "Kunst & Media",
        education_level: "HBO",
        work_values: ["creativity", "achievement", "independence"]
    },
    {
        onet_soc_code: "27-1012.00",
        title: "Curator",
        description: "Beheren van collecties in musea en galerieën",
        riasec_vector: { R: 0.2, I: 0.6, A: 0.7, S: 0.5, E: 0.6, C: 0.7 },
        career_direction: "Kunst & Media",
        education_level: "WO",
        work_values: ["achievement", "autonomy", "creativity"]
    },

    // SECTOR 04: BUSINESS & MANAGEMENT
    {
        onet_soc_code: "11-3012.00",
        title: "Administratief Manager",
        description: "Plannen en coördineren van administratieve diensten",
        riasec_vector: { R: 0.1, I: 0.4, A: 0.3, S: 0.6, E: 0.9, C: 0.8 },
        career_direction: "Business & Management",
        education_level: "HBO",
        work_values: ["achievement", "security", "dynamic"]
    },
    {
        onet_soc_code: "11-3013.00",
        title: "Facility Manager",
        description: "Beheren van gebouwen en facilitaire diensten",
        riasec_vector: { R: 0.4, I: 0.5, A: 0.3, S: 0.5, E: 0.8, C: 0.7 },
        career_direction: "Business & Management",
        education_level: "HBO",
        work_values: ["achievement", "dynamic", "security"]
    },
    {
        onet_soc_code: "13-1111.00",
        title: "Management Consultant",
        description: "Adviseren van organisaties over prestatieverbetering",
        riasec_vector: { R: 0.1, I: 0.8, A: 0.4, S: 0.6, E: 0.9, C: 0.6 },
        career_direction: "Business & Management",
        education_level: "WO",
        work_values: ["achievement", "autonomy", "dynamic"]
    },
    {
        onet_soc_code: "43-6011.00",
        title: "Directiesecretaresse",
        description: "Ondersteunen van directieleden met administratieve taken",
        riasec_vector: { R: 0.1, I: 0.3, A: 0.3, S: 0.6, E: 0.5, C: 0.9 },
        career_direction: "Business & Management",
        education_level: "MBO",
        work_values: ["security", "team", "achievement"]
    },
    {
        onet_soc_code: "11-9151.00",
        title: "Sociaal Ondernemer",
        description: "Leiden van een onderneming met een maatschappelijk doel",
        riasec_vector: { R: 0.2, I: 0.6, A: 0.6, S: 0.8, E: 1.0, C: 0.5 },
        career_direction: "Business & Management",
        education_level: "HBO",
        work_values: ["altruism", "dynamic", "autonomy"]
    },
    // SECTOR 06: FINANCIËN & ADMINISTRATIE
    {
        onet_soc_code: "13-2011.02",
        title: "Auditor",
        description: "Controleren van financiële processen en rapportages",
        riasec_vector: { R: 0.1, I: 0.7, A: 0.2, S: 0.3, E: 0.5, C: 1.0 },
        career_direction: "Financiën & Administratie",
        education_level: "WO",
        work_values: ["achievement", "security", "independence"]
    },
    {
        onet_soc_code: "13-2081.00",
        title: "Belastingadviseur",
        description: "Adviseren over belastingwetgeving en fiscale planning",
        riasec_vector: { R: 0.1, I: 0.7, A: 0.2, S: 0.4, E: 0.6, C: 0.9 },
        career_direction: "Financiën & Administratie",
        education_level: "WO",
        work_values: ["achievement", "autonomy", "security"]
    },
    {
        onet_soc_code: "43-3051.00",
        title: "Salarisadministrateur",
        description: "Verwerken van salarisbetalingen en personeelsgegevens",
        riasec_vector: { R: 0.1, I: 0.5, A: 0.2, S: 0.3, E: 0.3, C: 1.0 },
        career_direction: "Financiën & Administratie",
        education_level: "MBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "11-3031.01",
        title: "Controller",
        description: "Bewaken van de financiële gezondheid van een organisatie",
        riasec_vector: { R: 0.1, I: 0.8, A: 0.3, S: 0.3, E: 0.7, C: 0.9 },
        career_direction: "Financiën & Administratie",
        education_level: "HBO",
        work_values: ["achievement", "security", "autonomy"]
    },
    {
        onet_soc_code: "13-1023.00",
        title: "Inkoopmanager",
        description: "Inkopen van producten en diensten voor organisaties",
        riasec_vector: { R: 0.2, I: 0.6, A: 0.2, S: 0.4, E: 0.9, C: 0.8 },
        career_direction: "Financiën & Administratie",
        education_level: "HBO",
        work_values: ["achievement", "dynamic", "security"]
    },

    // SECTOR 08: ZORG & WELZIJN
    {
        onet_soc_code: "29-1051.00",
        title: "Apotheker",
        description: "Bereiden en verstrekken van medicijnen en advies",
        riasec_vector: { R: 0.3, I: 0.9, A: 0.2, S: 0.6, E: 0.6, C: 0.8 },
        career_direction: "Zorg & Welzijn",
        education_level: "WO",
        work_values: ["achievement", "security", "altruism"]
    },
    {
        onet_soc_code: "29-1021.00",
        title: "Tandarts",
        description: "Behandelen van gebitsproblemen en mondzorg",
        riasec_vector: { R: 0.6, I: 0.9, A: 0.3, S: 0.7, E: 0.7, C: 0.6 },
        career_direction: "Zorg & Welzijn",
        education_level: "WO",
        work_values: ["achievement", "independence", "altruism"]
    },
    {
        onet_soc_code: "29-2034.00",
        title: "Radiodiagnostisch Laborant",
        description: "Maken van röntgenfoto's en scans voor diagnose",
        riasec_vector: { R: 0.7, I: 0.6, A: 0.2, S: 0.5, E: 0.3, C: 0.6 },
        career_direction: "Zorg & Welzijn",
        education_level: "HBO",
        work_values: ["security", "achievement", "altruism"]
    },
    {
        onet_soc_code: "29-2055.00",
        title: "Operatieassistent",
        description: "Assisteren van chirurgen tijdens operaties",
        riasec_vector: { R: 0.6, I: 0.5, A: 0.2, S: 0.7, E: 0.3, C: 0.8 },
        career_direction: "Zorg & Welzijn",
        education_level: "HBO",
        work_values: ["team", "achievement", "altruism"]
    },
    {
        onet_soc_code: "29-1215.00",
        title: "Huisarts",
        description: "Verlenen van eerstelijns medische zorg aan patiënten",
        riasec_vector: { R: 0.3, I: 0.9, A: 0.3, S: 0.9, E: 0.5, C: 0.6 },
        career_direction: "Zorg & Welzijn",
        education_level: "WO",
        work_values: ["altruism", "autonomy", "achievement"]
    },
    // SECTOR 11: IT & DATA
    {
        onet_soc_code: "15-1242.00",
        title: "Netwerkbeheerder",
        description: "Beheren en onderhouden van computernetwerken",
        riasec_vector: { R: 0.3, I: 0.6, A: 0.2, S: 0.3, E: 0.3, C: 0.8 },
        career_direction: "IT & Data",
        education_level: "HBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "15-1212.00",
        title: "Information Security Analyst",
        description: "Beveiligen van informatiesystemen en netwerken",
        riasec_vector: { R: 0.2, I: 0.8, A: 0.2, S: 0.3, E: 0.4, C: 0.8 },
        career_direction: "IT & Data",
        education_level: "HBO",
        work_values: ["achievement", "security", "autonomy"]
    },
    {
        onet_soc_code: "15-1241.00",
        title: "Systeembeheerder",
        description: "Installeren en beheren van computersystemen",
        riasec_vector: { R: 0.4, I: 0.6, A: 0.2, S: 0.4, E: 0.4, C: 0.7 },
        career_direction: "IT & Data",
        education_level: "MBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "15-2099.01",
        title: "Bio-informaticus",
        description: "Toepassen van IT op biologische data",
        riasec_vector: { R: 0.2, I: 0.9, A: 0.2, S: 0.2, E: 0.3, C: 0.7 },
        career_direction: "IT & Data",
        education_level: "WO",
        work_values: ["achievement", "autonomy"]
    },
    {
        onet_soc_code: "15-1221.00",
        title: "AI Specialist",
        description: "Ontwikkelen van kunstmatige intelligentie toepassingen",
        riasec_vector: { R: 0.2, I: 0.9, A: 0.4, S: 0.2, E: 0.4, C: 0.6 },
        career_direction: "IT & Data",
        education_level: "WO",
        work_values: ["creativity", "achievement", "autonomy"]
    },

    // SECTOR 15: WETENSCHAP & TECHNIEK
    {
        onet_soc_code: "19-1031.00",
        title: "Bodemonderzoeker",
        description: "Onderzoeken van bodemsamenstelling en -kwaliteit",
        riasec_vector: { R: 0.6, I: 0.8, A: 0.2, S: 0.2, E: 0.3, C: 0.6 },
        career_direction: "Wetenschap & Techniek",
        education_level: "HBO",
        work_values: ["achievement", "independence"]
    },
    {
        onet_soc_code: "19-2042.00",
        title: "Geoloog",
        description: "Bestuderen van de aarde en haar structuren",
        riasec_vector: { R: 0.6, I: 0.9, A: 0.3, S: 0.2, E: 0.3, C: 0.5 },
        career_direction: "Wetenschap & Techniek",
        education_level: "WO",
        work_values: ["independence", "achievement"]
    },
    {
        onet_soc_code: "19-2031.00",
        title: "Chemisch Analist",
        description: "Uitvoeren van chemische analyses in laboratoria",
        riasec_vector: { R: 0.5, I: 0.8, A: 0.2, S: 0.2, E: 0.2, C: 0.8 },
        career_direction: "Wetenschap & Techniek",
        education_level: "MBO",
        work_values: ["security", "achievement"]
    },
    {
        onet_soc_code: "19-4031.00",
        title: "Milieu-inspecteur",
        description: "Controleren van naleving van milieuwetgeving",
        riasec_vector: { R: 0.5, I: 0.7, A: 0.2, S: 0.4, E: 0.5, C: 0.8 },
        career_direction: "Wetenschap & Techniek",
        education_level: "HBO",
        work_values: ["security", "achievement", "altruism"]
    },
    {
        onet_soc_code: "11-9121.00",
        title: "Laboratoriummanager",
        description: "Leiden van een laboratorium en onderzoeksteam",
        riasec_vector: { R: 0.3, I: 0.7, A: 0.3, S: 0.5, E: 0.8, C: 0.7 },
        career_direction: "Wetenschap & Techniek",
        education_level: "HBO",
        work_values: ["achievement", "dynamic", "team"]
    }
];
