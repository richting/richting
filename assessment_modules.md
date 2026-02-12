# 🎮 COMPLETE ASSESSMENT BATTERIJ - Richting App
## Alle Vragenlijsten & Games voor Volledig Profiel

---

## 📚 INHOUDSOPGAVE

1. [Overzicht Assessment Flow](#overzicht)
2. [Module 1: RIASEC Interest Explorer (Swipe Game)](#riasec-swipe)
3. [Module 2: Big Five Persoonlijkheidstest](#big-five-test)
4. [Module 3: Werkwaarden Prioritizer](#werkwaarden)
5. [Module 4: SCCT Self-Efficacy Scanner](#scct-scanner)
6. [Module 5: Daily Dilemma's (Ongoing)](#daily-dilemmas)
7. [Bonus: Optional Deepeners](#bonus-modules)
8. [Tijdsinschattingen & Volgorde](#timing)
9. [Gamification & Scout Integratie](#gamification)

---

## 1. OVERZICHT ASSESSMENT FLOW {#overzicht}

### Complete Journey

```
Onboarding (5 min)
    ↓
RIASEC Swipe Game (10-15 min) → 30 punten reliability
    ↓
Big Five Test (8-10 min) → +20 punten reliability
    ↓
Werkwaarden Sliders (3-5 min) → +20 punten reliability
    ↓
Results (Eerste inzichten) → 70 punten reliability
    ↓
SCCT Self-Efficacy (5-7 min) → +10 punten reliability
    ↓
Daily Dilemma's (2 min/dag) → +5 punten per dilemma
    ↓
Full Profile Complete (100 punten reliability)
```

### Minimum Viable Profile (MVP)

Voor bruikbare resultaten moet de gebruiker minimaal voltooien:
- ✅ **RIASEC Swipe Game** (30 swipes minimum)
- ✅ **Big Five Test** (20 vragen)
- ⚠️ Werkwaarden optioneel maar sterk aanbevolen

**Reliability threshold:** 50 punten (RIASEC + Big Five)

---

## 2. MODULE 1: RIASEC INTEREST EXPLORER (Swipe Game) {#riasec-swipe}

### 🎯 Doel
Meet interesse in zes Holland-dimensies via intuitieve swipes op beroepen/activiteiten.

### 🎮 Game Mechaniek

**Interface:** Tinder-style swipe cards

**Instructies:**
> "Je ziet straks verschillende beroepen en activiteiten. Swipe naar rechts als het je leuk lijkt, naar links als het niet voor jou is. Geen goed of fout - ga op je buikgevoel!"

**Card Inhoud:**
```
┌─────────────────────────┐
│   [Foto/Illustratie]    │
│                         │
│    🔧 Timmerman         │
│                         │
│  "Dingen bouwen met     │
│   je handen"            │
│                         │
│  💼 Sectoren:           │
│  Bouw • Techniek        │
└─────────────────────────┘
    👈  Swipe  👉
```

### 📊 Card Deck Samenstelling

**Totaal: 60 cards** (verplicht minimum: 30 swipes voor betrouwbaar profiel)

**Verdeling per RIASEC dimensie:**

| RIASEC | Aantal Cards | Voorbeelden |
|--------|--------------|-------------|
| **Realistic (R)** | 10 | Timmerman, Monteur, Kok, Politieagent, Tuinarchitect |
| **Investigative (I)** | 10 | Wetenschapper, Data-analist, Psycholoog, Apotheker, Archeoloog |
| **Artistic (A)** | 10 | Grafisch ontwerper, Muzikant, Acteur, Fotograaf, Interieurontwerper |
| **Social (S)** | 10 | Leraar, Verpleegkundige, Maatschappelijk werker, HR-manager, Coach |
| **Enterprising (E)** | 10 | Ondernemer, Verkoper, Marketeer, Projectmanager, Advocaat |
| **Conventional (C)** | 10 | Accountant, Administrateur, Logistiek medewerker, Boekhoudkundige, Planner |

**Mix Types:**
- 40 cards = Pure beroepen (scoren hoog op 1 dimensie)
- 20 cards = Hybride beroepen (scoren op 2-3 dimensies)
  - Voorbeeld: UX Designer = Artistic (6) + Investigative (4)

### 🎨 Card Design Varianten

**Variant A: Beroep Cards (40 stuks)**
```
Foto van het beroep
Titel: "Software Developer"
Tagline: "Code schrijven en problemen oplossen"
Sectoren: IT • Tech
RIASEC: I=7, A=3
```

**Variant B: Activiteit Cards (20 stuks)**
```
Illustratie van activiteit
Titel: "Problemen analyseren"
Beschrijving: "Complexe vraagstukken uitpluizen en oplossingen bedenken"
RIASEC: I=6, R=2
```

### ⚙️ Technische Specs

**Swipe Scoring Logica:**
```javascript
// Bij YES swipe
userProfile.riasec.realistic += cardData.riasec.realistic;
userProfile.riasec.investigative += cardData.riasec.investigative;
// ... etc voor alle 6

// Bij NO swipe
// Geen actie - scores blijven gelijk
// (Alternative: negatieve scoring → userProfile.riasec.realistic -= 0.5)

// Na elke 10 swipes: toon progress
if (swipeCount % 10 === 0) {
  Scout.say("Je bent al bij " + swipeCount + "! Nog " + (30 - swipeCount) + " te gaan voor je eerste inzichten 🎯");
}

// Na 30 swipes: normaliseer scores
if (swipeCount === 30) {
  normalizeRIASEC(userProfile.riasec);
  Scout.celebrate("Yes! Je hebt genoeg geswipet. Ik zie al een patroon! 🦅");
  unlockNextModule('personality');
}
```

**Card Shuffle Algoritme:**
```javascript
// Shuffle met constraint: max 3 cards van dezelfde categorie achter elkaar
function intelligentShuffle(cards) {
  const shuffled = [];
  const remaining = [...cards];
  let lastCategory = null;
  let categoryStreak = 0;
  
  while (remaining.length > 0) {
    // Filter: niet te veel van dezelfde categorie
    let available = categoryStreak >= 3 
      ? remaining.filter(c => c.primaryCategory !== lastCategory)
      : remaining;
    
    // Pick random
    const index = Math.floor(Math.random() * available.length);
    const card = available[index];
    
    shuffled.push(card);
    remaining.splice(remaining.indexOf(card), 1);
    
    // Update streak
    if (card.primaryCategory === lastCategory) {
      categoryStreak++;
    } else {
      categoryStreak = 1;
      lastCategory = card.primaryCategory;
    }
  }
  
  return shuffled;
}
```

### 🎯 UX Flow

1. **Intro Screen**
   - Scout: "Laten we ontdekken wat jou interesseert! 🎯"
   - Uitleg swipe mechaniek
   - Benadruk: "Geen goed of fout - vertrouw je gevoel"

2. **Swipe Interface**
   - Card centraal op scherm
   - Swipe left/right OF tap knoppen
   - Progress bar bovenaan (30/60 swipes)
   - Scout hoek: kleine animaties bij milestones

3. **Milestone Encouragements**
   - 10 swipes: "Goed bezig! 🚀"
   - 20 swipes: "Nog 10 te gaan! Ik zie al een patroon 👀"
   - 30 swipes: "Perfect! Je hebt genoeg voor eerste inzichten 🎉"
   - 40+ swipes: "Bonus punten! Hoe meer, hoe beter 💪"

4. **Early Exit Option**
   - Bij 30 swipes: "Genoeg voor nu! Of wil je doorgaan voor nog betere matches?"
   - Optie: "Laat me de resultaten zien" of "Nog 10 doen"

### 📝 Card Content Examples

**Realistic Cards:**
```json
[
  {
    "id": "R001",
    "title": "Timmerman",
    "tagline": "Bouwen met hout en gereedschap",
    "description": "Je maakt meubels, constructies en reparaties met je handen",
    "imageUrl": "/assets/cards/carpenter.jpg",
    "sectors": ["Bouw", "Ambacht"],
    "riasec": { "R": 7, "I": 1, "A": 2, "S": 1, "E": 1, "C": 1 }
  },
  {
    "id": "R002",
    "title": "Auto Monteur",
    "tagline": "Motoren repareren en onderhouden",
    "imageUrl": "/assets/cards/mechanic.jpg",
    "sectors": ["Techniek", "Transport"],
    "riasec": { "R": 6, "I": 3, "A": 0, "S": 1, "E": 1, "C": 2 }
  }
]
```

**Investigative Cards:**
```json
[
  {
    "id": "I001",
    "title": "Data Scientist",
    "tagline": "Patronen ontdekken in grote datasets",
    "imageUrl": "/assets/cards/data-scientist.jpg",
    "sectors": ["IT", "Wetenschap"],
    "riasec": { "R": 1, "I": 7, "A": 2, "S": 1, "E": 1, "C": 1 }
  },
  {
    "id": "I002",
    "title": "Bioloog",
    "tagline": "Leven bestuderen en onderzoek doen",
    "imageUrl": "/assets/cards/biologist.jpg",
    "sectors": ["Wetenschap", "Natuur"],
    "riasec": { "R": 2, "I": 7, "A": 1, "S": 1, "E": 0, "C": 2 }
  }
]
```

**Hybride Cards (Multi-dimensioneel):**
```json
[
  {
    "id": "H001",
    "title": "UX Designer",
    "tagline": "Gebruiksvriendelijke apps en websites ontwerpen",
    "imageUrl": "/assets/cards/ux-designer.jpg",
    "sectors": ["IT", "Design"],
    "riasec": { "R": 1, "I": 4, "A": 6, "S": 2, "E": 1, "C": 1 }
  },
  {
    "id": "H002",
    "title": "Architect",
    "tagline": "Gebouwen ontwerpen die mooi én functioneel zijn",
    "imageUrl": "/assets/cards/architect.jpg",
    "sectors": ["Bouw", "Design"],
    "riasec": { "R": 3, "I": 3, "A": 5, "S": 1, "E": 2, "C": 2 }
  }
]
```

---

## 3. MODULE 2: BIG FIVE PERSOONLIJKHEIDSTEST {#big-five-test}

### 🎯 Doel
Meet vijf persoonlijkheidsdimensies: Openheid, Consciëntieusheid, Extraversie, Vriendelijkheid, Stabiliteit.

### 📋 Vragenlijst Structuur

**Totaal: 25 vragen** (5 per dimensie)

**Format:** 5-punt Likert schaal
```
Helemaal mee oneens  [1] [2] [3] [4] [5]  Helemaal mee eens
```

**Vraag Types:**
- Positief geformuleerd (hogere score = hogere trait)
- Negatief geformuleerd (hogere score = lagere trait, reverse scoring)

### 🎨 Visuele Interface

**Design Optie A: Slider Interface**
```
┌──────────────────────────────┐
│  Ik probeer graag nieuwe     │
│  dingen uit                   │
│                               │
│  😐 ●────────────○ 😊        │
│  Oneens       Eens            │
└──────────────────────────────┘
```

**Design Optie B: Button Grid**
```
┌──────────────────────────────┐
│  Ik maak vaak todo-lijstjes  │
│                               │
│  [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5]│
│   Nee    →    →    →    Ja   │
└──────────────────────────────┘
```

**Scout Integratie:**
- Scout zit in hoek, kijkt mee
- Bij elke 5 vragen: "Interessant! Ik leer je steeds beter kennen 🦅"
- Bij vraag met hoge self-awareness: "Lastige vraag? Denk aan hoe je meestal bent 💭"

### 📝 Volledige Vragenlijst

**OPENNESS (5 vragen)**

| # | Vraag | Type |
|---|-------|------|
| 1 | Ik probeer graag nieuwe dingen uit | Positief |
| 2 | Ik heb een levendige fantasie | Positief |
| 3 | Ik hou van routines en herhaling | Negatief (reverse) |
| 4 | Ik ben geïnteresseerd in kunst en cultuur | Positief |
| 5 | Ik denk vaak na over abstracte ideeën | Positief |

**CONSCIENTIOUSNESS (5 vragen)**

| # | Vraag | Type |
|---|-------|------|
| 6 | Ik maak vaak todo-lijstjes of planningen | Positief |
| 7 | Ik ruim mijn kamer/spullen regelmatig op | Positief |
| 8 | Ik stel dingen vaak uit | Negatief (reverse) |
| 9 | Ik let op details en maak weinig fouten | Positief |
| 10 | Ik werk hard om mijn doelen te bereiken | Positief |

**EXTRAVERSION (5 vragen)**

| # | Vraag | Type |
|---|-------|------|
| 11 | Ik voel me energiek na tijd met vrienden | Positief |
| 12 | Ik ben vaak het middelpunt van de aandacht | Positief |
| 13 | Ik vind het fijn om alleen te zijn | Negatief (reverse) |
| 14 | Ik maak makkelijk nieuwe vrienden | Positief |
| 15 | Ik neem graag het initiatief in groepen | Positief |

**AGREEABLENESS (5 vragen)**

| # | Vraag | Type |
|---|-------|------|
| 16 | Ik help anderen graag | Positief |
| 17 | Ik vertrouw mensen snel | Positief |
| 18 | Ik vind het lastig om mijn ongelijk toe te geven | Negatief (reverse) |
| 19 | Ik let goed op de gevoelens van anderen | Positief |
| 20 | Ik werk graag samen in een team | Positief |

**STABILITY / Emotional Stability (5 vragen)**
*Let op: Dit meet lage Neuroticism (hoge score = stabiel)*

| # | Vraag | Type |
|---|-------|------|
| 21 | Ik maak me vaak zorgen over dingen | Negatief (reverse) |
| 22 | Ik blijf kalm onder druk | Positief |
| 23 | Mijn stemming wisselt vaak | Negatief (reverse) |
| 24 | Ik raak snel gestrest | Negatief (reverse) |
| 25 | Ik herstel snel van teleurstellingen | Positief |

### ⚙️ Scoring Algoritme

```javascript
function scoreBigFive(answers) {
  const questions = {
    openness: [
      { id: 1, reverse: false },
      { id: 2, reverse: false },
      { id: 3, reverse: true },
      { id: 4, reverse: false },
      { id: 5, reverse: false }
    ],
    conscientiousness: [
      { id: 6, reverse: false },
      { id: 7, reverse: false },
      { id: 8, reverse: true },
      { id: 9, reverse: false },
      { id: 10, reverse: false }
    ],
    // ... etc
  };
  
  const scores = {};
  
  for (let dimension in questions) {
    let rawScore = 0;
    
    questions[dimension].forEach(q => {
      const answer = answers.find(a => a.questionId === q.id).value; // 1-5
      const score = q.reverse ? (6 - answer) : answer; // Reverse if needed
      rawScore += score;
    });
    
    // Normaliseer naar -10 tot +10
    // Raw range: 5-25 (5 vragen × 1-5)
    // Midpoint: 15
    const normalized = ((rawScore - 15) / 5) * 10; // -10 tot +10
    scores[dimension] = Math.round(normalized * 10) / 10; // Round naar 1 decimaal
  }
  
  return scores;
  /*
  Voorbeeld output:
  {
    openness: 6.0,
    conscientiousness: -2.0,
    extraversion: 4.0,
    agreeableness: 8.0,
    stability: 1.0
  }
  */
}
```

### 🎯 UX Flow

1. **Intro**
   - Scout: "Tijd om te kijken hoe jij werkt! 💭"
   - "25 vragen over hoe je meestal bent"
   - "Dit is geen test - er zijn geen goede antwoorden"

2. **Progress Tracking**
   - Progress bar: "Vraag 8/25"
   - Elke 5 vragen: korte pauze optie
   - Scout reactions bij milestones

3. **Vraag Interface**
   - 1 vraag per scherm (geen lange lijst)
   - Auto-scroll naar volgende
   - Back button om antwoord te wijzigen

4. **Completion**
   - Scout viert voltooiing: "Wow! Ik begrijp je nu veel beter 🎉"
   - Quick preview: "Je bent creatief, georganiseerd en sociaal!"
   - Unlock next module

### 💡 Tips voor Goede Vragen

**DO:**
- ✅ Gebruik alledaagse taal ("Ik maak vaak todo-lijstjes" ipv "Ik toon consciëntieus gedrag")
- ✅ Focus op gedrag, niet op waarden ("Ik help anderen" ipv "Helpen is belangrijk")
- ✅ Concrete situaties ("Ik voel me energiek na tijd met vrienden")

**DON'T:**
- ❌ Dubbele ontkenningen ("Ik ben niet ongeorganiseerd")
- ❌ Extreme statements ("Ik ben ALTIJD vrolijk")
- ❌ Contextuele vragen ("Op school ben ik...") - vraag over algemeen

---

## 4. MODULE 3: WERKWAARDEN PRIORITIZER {#werkwaarden}

### 🎯 Doel
Meet wat de gebruiker belangrijk vindt in werk: Achievement, Independence, Recognition, Relationships, Support, Working Conditions.

### 🎮 Game Mechaniek: Interactive Sliders

**Interface Design:**
```
┌─────────────────────────────────────┐
│  Wat vind je belangrijk in werk?    │
│                                      │
│  🏆 Prestatie & Uitdaging           │
│  "Moeilijke doelen behalen"         │
│  ○────●────────────○                │
│  Niet belangrijk   Heel belangrijk  │
│                    [8/10]            │
└─────────────────────────────────────┘
```

### 📝 Volledige Werkwaarden Lijst

**6 Werkwaarden** (per waarde: slider 1-10)

| Waarde | Emoji | Titel | Beschrijving | Voorbeeldvraag |
|--------|-------|-------|--------------|----------------|
| **Achievement** | 🏆 | Prestatie & Uitdaging | "Ik wil moeilijke doelen bereiken en uitgedaagd worden" | Hoe belangrijk is het voor jou om steeds beter te worden in je werk? |
| **Independence** | 🦅 | Zelfstandigheid | "Ik wil mijn eigen beslissingen nemen en vrij werken" | Hoe belangrijk is het dat je je werk op je eigen manier kunt doen? |
| **Recognition** | ⭐ | Erkenning & Status | "Ik wil erkend worden voor mijn prestaties" | Hoe belangrijk is het om waardering te krijgen voor je werk? |
| **Relationships** | 👥 | Samenwerking | "Ik wil nauwe banden met collega's en klanten" | Hoe belangrijk is het om met leuke collega's te werken? |
| **Support** | 🤝 | Ondersteuning | "Ik wil begeleiding en een veilige werkomgeving" | Hoe belangrijk is het dat je leidinggevende je ondersteunt? |
| **Working Conditions** | 🏢 | Arbeidsomstandigheden | "Ik wil een prettige werkplek en goede voorwaarden" | Hoe belangrijk zijn goede werktijden en een fijne werkplek? |

### 🎨 Alternative Interface: Card Sorting

**Variant B: Prioriteit Ranking**

```
Sleep de kaarten in volgorde van belangrijkheid:

┌──────────────────┐
│  🏆 Prestatie    │  ← Meest belangrijk
├──────────────────┤
│  🦅 Zelfstandig  │
├──────────────────┤
│  👥 Samenwerking │
├──────────────────┤
│  ⭐ Erkenning    │
├──────────────────┤
│  🏢 Werkplek     │
├──────────────────┤
│  🤝 Ondersteuning│  ← Minst belangrijk
└──────────────────┘
```

Conversie naar 1-10 scores:
- Positie 1 (top) = 10
- Positie 2 = 8
- Positie 3 = 6
- Positie 4 = 5
- Positie 5 = 4
- Positie 6 (bottom) = 2

### ⚙️ Technische Implementatie

```javascript
const workValues = {
  achievement: {
    icon: "🏆",
    title: "Prestatie & Uitdaging",
    description: "Moeilijke doelen behalen en uitgedaagd worden",
    question: "Hoe belangrijk is het voor jou om steeds beter te worden?",
    examples: [
      "Complexe problemen oplossen",
      "Nieuwe vaardigheden leren",
      "Doelen overtreffen"
    ]
  },
  independence: {
    icon: "🦅",
    title: "Zelfstandigheid",
    description: "Je eigen beslissingen maken en vrij werken",
    question: "Hoe belangrijk is het om je werk op je eigen manier te doen?",
    examples: [
      "Zelf je planning maken",
      "Geen micromanagement",
      "Creatieve vrijheid"
    ]
  },
  // ... etc
};

// Slider component state
const [values, setValues] = useState({
  achievement: 5,
  independence: 5,
  recognition: 5,
  relationships: 5,
  support: 5,
  workingConditions: 5
});

// Save on completion
function saveWorkValues() {
  userProfile.workValues = values;
  userProfile.reliabilityScore += 20;
  
  Scout.celebrate("Perfect! Nu weet ik wat jou motiveert 💪");
  unlockNextModule('results');
}
```

### 🎯 UX Flow

1. **Intro**
   - Scout: "Wat maakt werk leuk voor jou? 🎯"
   - "6 sliders - sleep naar wat bij jou past"
   - "Geen goed of fout - puur jouw voorkeuren"

2. **Interactive Sliders**
   - Per waarde: slider met live preview score
   - Tap op emoji/titel voor meer uitleg + voorbeelden
   - Alle 6 sliders op één scherm (scroll mogelijk)

3. **Optional: Balance Check**
   - Toon totale som (moet niet té scheef zijn)
   - "Je hebt alles hoog - wat is echt belangrijk?"
   - Optie om te herbalanceren

4. **Confirmation**
   - Overzicht van top 3 waarden
   - "Jouw top 3: 🏆 Prestatie, 🦅 Zelfstandigheid, 👥 Samenwerking"
   - Bevestig of wijzig

### 💡 Psychologische Tips

**Prevent Response Bias:**
- Start alle sliders op 5 (midden) - niet op 0 of 10
- Vraag: "Verschuif alleen als het echt belangrijk/onbelangrijk is"
- Toon voorbeelden bij elke waarde voor concreetheid

**Cognitive Load:**
- Gebruik emoji's voor snelle herkenning
- Korte, krachtige beschrijvingen
- Optie om meer uitleg te lezen (collapse/expand)

---

## 5. MODULE 4: SCCT SELF-EFFICACY SCANNER {#scct-scanner}

### 🎯 Doel
Meet zelfvertrouwen in specifieke skills die relevant zijn voor top matches.

### 🔄 Dynamische Vraaglijst

**Timing:** Wordt UNLOCK na RIASEC + Big Five (als er al top matches zijn)

**Mechaniek:**
1. Algoritme bepaalt top 10 job matches op basis van RIASEC
2. Extract top 3 skills per job
3. Aggregeer meest voorkomende skills
4. Presenteer top 10-15 skills aan gebruiker

### 📋 Skill Confidence Vragenlijst

**Format per skill:**
```
┌────────────────────────────────────┐
│  💻 Programmeren                   │
│  "Code schrijven en debuggen"      │
│                                    │
│  Hoe zeker ben je van je kunnen?  │
│                                    │
│  😰 ○────────●──○ 😎             │
│   Helemaal niet   Heel zeker       │
│                  [7/10]             │
│                                    │
│  ℹ️ Geen ervaring? Schat in hoe   │
│     makkelijk je denkt te leren    │
└────────────────────────────────────┘
```

### 🎯 Skill Categories & Examples

**Top 20 Most Common O*NET Skills** (cover meeste beroepen)

| Skill Cluster | Skills | Icons |
|---------------|--------|-------|
| **Cognitief** | Critical Thinking, Complex Problem Solving, Active Learning, Judgment & Decision Making | 🧠💭🎓⚖️ |
| **Sociaal** | Social Perceptiveness, Coordination, Persuasion, Negotiation, Service Orientation | 👥🤝💬🤲🆘 |
| **Technisch** | Programming, Equipment Selection, Technology Design, Operations Analysis | 💻🔧⚙️📊 |
| **Communicatie** | Active Listening, Speaking, Writing, Reading Comprehension | 👂🗣️✍️📖 |
| **Management** | Time Management, Management of Personnel, Management of Financial Resources | ⏰👔💰 |
| **Creatief** | Creativity, Design, Visualization, Innovation | 🎨🖌️👁️💡 |

### 📝 Dynamische Vragenset

**Voorbeeld voor Software Developer Match:**

```javascript
// Gebruiker matcht met: Software Developer, Data Analyst, UX Designer

// Extract top skills van deze jobs
const topSkills = extractTopSkills([
  { job: 'Software Developer', skills: ['Programming', 'Critical Thinking', 'Complex Problem Solving'] },
  { job: 'Data Analyst', skills: ['Mathematics', 'Critical Thinking', 'Data Analysis'] },
  { job: 'UX Designer', skills: ['Design', 'Social Perceptiveness', 'Creativity'] }
]);

// Aggregeer + rank op frequency
const aggregated = {
  'Critical Thinking': 2, // Komt 2× voor
  'Programming': 1,
  'Complex Problem Solving': 1,
  'Design': 1,
  'Creativity': 1,
  'Social Perceptiveness': 1,
  'Mathematics': 1,
  'Data Analysis': 1
};

// Presenteer top 8-10 aan gebruiker
const questionsToAsk = [
  'Critical Thinking',
  'Programming', 
  'Complex Problem Solving',
  'Design',
  'Creativity',
  'Social Perceptiveness',
  'Mathematics',
  'Data Analysis'
];
```

### ⚙️ Alternative: Mini-Games

**Voor jongere doelgroep (13-15 jaar): gamified skill assessment**

**Example 1: Pattern Recognition (Investigative)**
```
Welk patroon volgt?
🔵 🔴 🔵 🔴 🔵 ?

A) 🔴  B) 🔵  C) 🟢

[Timer: 10 seconden]
```

**Example 2: Social Scenario (Social Skills)**
```
Je klasgenoot lijkt verdrietig. Wat doe je?

A) Meteen vragen: "Wat is er?"
B) Wachten tot ze erover beginnen
C) Later vragen: "Gaat het wel goed?"
D) Niks - niet mijn business

[Geen timer - persoonlijkheid vraag]
```

**Example 3: Design Challenge (Artistic)**
```
Maak deze kamer gezellig:
[Drag & drop items: lamp, plant, schilderij, kleed]

[Kies 3 items en plaats ze]
```

**Scoring:** Correlatie tussen game performance en zelfgerapporteerde confidence

### 🎯 UX Flow

1. **Intro met Context**
   - Scout: "Top matches gevonden! 🎯"
   - "Laten we kijken waar je goed in bent"
   - "8 skills die je vaak nodig hebt voor jouw matches"

2. **Skill Cards**
   - 1 skill per scherm
   - Icoon + titel + beschrijving
   - "Geen ervaring?" help text
   - Slider 1-10 met emoji's

3. **Examples toevoegen**
   - Per skill: concrete voorbeelden
   - "Programmeren: Code schrijven, bugs fixen, apps maken"
   - Helpt met zelf-assessment

4. **Completion**
   - Scout: "Super! Nu kan ik je leren-curve inschatten 📈"
   - Preview: "Je bent zeker van X, Y - en kunt Z nog leren"

### 💡 Psychologische Overwegingen

**Dunning-Kruger Effect:**
- Jongeren overschatten vaak hun kunnen
- Mitigatie: Voeg voorbeelden toe ("Kun je een website maken van scratch?")
- Acceptance: Het gaat om perceived efficacy, niet objective skill

**No Experience Case:**
- Veel jongeren hebben nog geen ervaring met skills
- Frame als: "Hoe makkelijk denk je dit te leren?"
- Alternatief: "Hoe leuk lijkt dit je om te leren?" (interest proxy)

---

## 6. MODULE 5: DAILY DILEMMA'S (Ongoing) {#daily-dilemmas}

### 🎯 Doel
- Verhoog reliability score (+5 punten per dilemma)
- Verfijn profiel met contextuele keuzes
- Engagement houden (daily return trigger)

### 🎮 Game Mechaniek

**Presentatie:** Korte scenario's met 2-4 keuzes

**Frequentie:** 1 per dag (notification om 19:00)

**Format:**
```
┌─────────────────────────────────────┐
│  🦅 Daily Dilemma                   │
│                                      │
│  Je moet een groepsproject doen.    │
│  Wat doe je?                         │
│                                      │
│  A) 🎯 Ik pak de leiding            │
│  B) 👥 Ik help mee, maar volg       │
│  C) 💭 Ik doe vooral het denk-      │
│        werk                          │
│  D) 🛠️ Ik neem praktische taken     │
│                                      │
│  [Timer: 24 uur] ⏰                  │
└─────────────────────────────────────┘
```

### 📝 Dilemma Categories

**30 Dilemma's** (1 maand content, daarna recyclen met variaties)

| Week | Focus | RIASEC/Big Five Link |
|------|-------|----------------------|
| Week 1 | Werkstijl voorkeuren | E, C, S (Extraversion, Conscientiousness) |
| Week 2 | Probleem-aanpak | I, R (Investigative, Realistic) |
| Week 3 | Sociale situaties | S, E (Social, Enterprising) |
| Week 4 | Creativiteit & Planning | A, C (Artistic, Conventional) |

### 🎯 Voorbeeld Dilemma's

**Dilemma 1: Leadership (Enterprising)**
```
Vraag: Je moet een groepsproject doen voor school. Wat is je voorkeur?

A) De leiding nemen en taken verdelen
B) Meedenken maar niet de baas spelen
C) Het uitvoerende werk doen
D) Solo werken aan een deeltaak

Mapping:
A → Enterprising +1, Extraversion +1
B → Social +1, Agreeableness +1
C → Realistic +1, Conscientiousness +1
D → Independence +1, Extraversion -1
```

**Dilemma 2: Problem-Solving (Investigative)**
```
Vraag: Je laptop werkt niet meer. Wat doe je?

A) Googlen en zelf proberen te fixen
B) Iemand vragen die er verstand van heeft
C) Meteen naar de reparatiewinkel
D) Gewoon een nieuwe kopen

Mapping:
A → Investigative +2, Independence +1
B → Social +1, Support +1
C → Conventional +1
D → Practical -1 (geen learning opportunity)
```

**Dilemma 3: Creative Expression (Artistic)**
```
Vraag: Je moet een presentatie maken. Hoe pak je het aan?

A) Mooie, visuele slides met animaties
B) Duidelijke bullet points en data
C) Video of interactieve demo
D) Zo simpel mogelijk, focus op inhoud

Mapping:
A → Artistic +2, Design +1
B → Conventional +1, Conscientiousness +1
C → Artistic +1, Technology +1
D → Minimalist -1 (geen creative expression)
```

**Dilemma 4: Work Environment (Working Conditions)**
```
Vraag: Wat is jouw ideale werkplek?

A) Thuis, in mijn eigen ruimte
B) Druk kantoor met veel collega's
C) Rustige bibliotheek/coworking space
D) Buiten of steeds wisselende plekken

Mapping:
A → Independence +2, Introversion +1
B → Relationships +2, Extraversion +1
C → Focus +1, Conventional +1
D → Flexibility +1, Adventurous +1
```

### ⚙️ Scoring & Impact

```javascript
function processDilemma(userId, dilemmaId, choiceId) {
  const dilemma = getDilemma(dilemmaId);
  const choice = dilemma.choices.find(c => c.id === choiceId);
  
  // Apply micro-adjustments to profile
  for (let trait in choice.impacts) {
    userProfile[trait] += choice.impacts[trait]; // Small increments (±1 to ±2)
  }
  
  // Increase reliability
  userProfile.reliabilityScore += 5;
  userProfile.dilemmasCompleted += 1;
  
  // Re-calculate matches (micro-adjustment)
  if (userProfile.reliabilityScore % 10 === 0) {
    // Every 2 dilemmas, recalculate
    recalculateMatches(userId);
  }
  
  // Reward
  Scout.say("Nice! Je bent nu " + userProfile.reliabilityScore + "% betrouwbaar 🎯");
  
  // Unlock next dilemma (24h timer)
  scheduleNextDilemma(userId, Date.now() + 24 * 60 * 60 * 1000);
}
```

### 🎯 UX Flow

1. **Notification (19:00)**
   - Push: "🦅 Scout heeft een vraag voor je!"
   - Badge op app icon

2. **In-App Prompt**
   - Scout animatie: "Nieuwe dilemma! 🎯"
   - Open dilemma screen

3. **Choice Interface**
   - Scenario bovenaan
   - 4 keuzes (buttons of cards)
   - Timer: "Nog 12 uur" (creates urgency)

4. **Immediate Feedback**
   - Scout reactie op keuze
   - Kort inzicht: "Interessant! Dit past bij je zelfstandige kant 🦅"
   - Reliability update: "+5 punten!"

5. **Streaks (Optional Gamification)**
   - "7 dagen streak! 🔥"
   - Bonus: Unlock special insight of extra dilemma

---

## 7. BONUS: OPTIONAL DEEPENERS {#bonus-modules}

### 🎯 Advanced Modules (Post-MVP)

**Voor gebruikers die méér willen / twijfelen:**

#### 7.1 Career Values Card Sort

**Methode:** Q-Sort (forceer ranking)

```
Je krijgt 20 kaarten met werkwaarden.
Sorteer ze in 5 kolommen:

[-2]      [-1]      [0]      [+1]      [+2]
Helemaal  Niet echt Neutraal Belangrijk Zeer
niet                                    belangrijk

Regel: Elke kolom moet exact aantal kaarten bevatten
[-2]: 3 kaarten
[-1]: 5 kaarten
[0]: 4 kaarten
[+1]: 5 kaarten
[+2]: 3 kaarten

Forces choices: Wat is ECHT belangrijk?
```

#### 7.2 Interest Profiler (Text-based)

**Voor users die niet van swipes houden:**

```
Lees de beschrijving. Rate je interesse (1-5):

"Machines repareren en onderhouden"
⭐ ⭐ ⭐ ⭐ ⭐

"Wetenschappelijk onderzoek doen"
⭐ ⭐ ⭐ ⭐ ⭐

[30 items, 5 per RIASEC categorie]
```

#### 7.3 Skills Inventory (Objective Test)

**Mini-games voor objective skill assessment:**

1. **Pattern Recognition** (Investigative)
2. **Verbal Reasoning** (Social/Enterprising)
3. **Spatial Reasoning** (Realistic/Artistic)
4. **Numerical Ability** (Conventional/Investigative)

**Duur:** 15-20 minuten extra

**Output:** Correleer scores met self-reported efficacy

#### 7.4 Life Goals Explorer

**Schwartz Values aanvulling op werkwaarden:**

```
Wat wil je bereiken in je leven?

🏆 Succes en prestatie
🌍 De wereld beter maken
👨‍👩‍👧 Tijd voor familie en vrienden
💰 Financiële zekerheid
🎨 Creativiteit en zelfexpressie
🔍 Kennis en wijsheid
⚖️ Rechtvaardigheid en eerlijkheid

[Rank top 5]
```

---

## 8. TIJDSINSCHATTINGEN & VOLGORDE {#timing}

### 📅 Complete Assessment Timeline

| Module | Tijd | Reliability | Cumulatief | Vereist? |
|--------|------|-------------|------------|----------|
| **Onboarding** | 3-5 min | +0 | 0 | ✅ Ja |
| **RIASEC Swipes** | 10-15 min | +30 | 30 | ✅ Ja |
| → *Early Results* | 2 min | - | 30 | Optioneel |
| **Big Five Test** | 8-10 min | +20 | 50 | ✅ Ja |
| **Werkwaarden** | 3-5 min | +20 | 70 | ⚠️ Aanbevolen |
| → *Full Results* | 5 min | - | 70 | - |
| **SCCT Efficacy** | 5-7 min | +10 | 80 | ⚠️ Aanbevolen |
| **Daily Dilemma 1** | 2 min | +5 | 85 | Optioneel |
| **Daily Dilemma 2** | 2 min | +5 | 90 | Optioneel |
| ... | | | | |
| **Daily Dilemma 6** | 2 min | +5 | 100+ | Optioneel |

**Totale kerntijd:** 30-40 minuten (RIASEC + Big Five + Waarden)

**Voor 100% reliability:** 30-40 min + 6 days (daily dilemmas)

### 🎯 Recommended User Flows

**Flow A: Speed Runner (Minimum Viable)**
```
Onboarding (5m) → RIASEC (10m) → Big Five (8m) → Results (3m)
Total: ~26 minuten
Reliability: 50 punten
Quality: Basis matches, betrouwbaar genoeg
```

**Flow B: Balanced (Recommended)**
```
Onboarding (5m) → RIASEC (12m) → Big Five (10m) → 
Waarden (4m) → Results (5m) → SCCT (6m)
Total: ~42 minuten (kan over meerdere sessies)
Reliability: 80 punten
Quality: Hoge kwaliteit matches + growth insights
```

**Flow C: Completionist**
```
Flow B + Daily Dilemmas (6 days × 2m) + Optional deepeners
Total: ~60 minuten + 6 dagen
Reliability: 100 punten
Quality: Maximum profiel diepte
```

### 🔄 Session Breaking Strategy

**Problem:** 40 minuten is lang voor jongeren in één sessie

**Solution: Multi-Session Flow**

```javascript
// Session 1 (15-20 min)
Onboarding → RIASEC Swipes (30 swipes) → Save progress
Scout: "Super gedaan! Morgen gaan we verder 🦅"

// Session 2 (10-15 min) - Next day
Big Five Test → Save progress
Scout: "Bijna daar! Nog één stap 💪"

// Session 3 (5-10 min) - Same day or next
Werkwaarden → Results unlock
Scout: "Yes! Kijk wat we ontdekt hebben 🎉"

// Session 4 (Optional, 5-10 min)
SCCT Efficacy → Enhanced results
```

**Retention Triggers:**
- Save progress automatically
- Push notification: "Scout mist je! Kom je resultaten zien? 🦅"
- Preview: "Je top match is bijna klaar... 1 test te gaan!"

---

## 9. GAMIFICATION & SCOUT INTEGRATIE {#gamification}

### 🦅 Scout's Role Per Module

| Module | Scout Behavior | Animations | Messages |
|--------|----------------|------------|----------|
| **RIASEC Swipes** | Flies around, comments on swipes | Excited flutter bij "Yes" swipes | "Oeh, dat past bij je!" |
| **Big Five** | Sits and observes, thinking | Thoughtful head tilt | "Interessant... ik leer je kennen" |
| **Werkwaarden** | Perched, attentive | Nods bij slider changes | "Dat snap ik!" |
| **SCCT** | Encouraging stance | Thumbs up animations | "Geloof in jezelf! 💪" |
| **Daily Dilemma** | Playful, curious | Question mark float | "Wat zou jij doen?" |

### 🎮 Gamification Elements

**Progress Tracking:**
```
┌────────────────────────────┐
│  🗺️ Je Journey             │
│                            │
│  ✅ RIASEC        30/100   │
│  ✅ Big Five      50/100   │
│  🔄 Waarden       70/100   │
│  🔒 Self-Efficacy 70/100   │
│  🔒 Daily Quest   70/100   │
│                            │
│  🦅 Scout Level: Jonge Vogel│
└────────────────────────────┘
```

**Achievements:**
- 🥚 "First Flight" - Eerste 10 swipes
- 🐣 "Explorer" - RIASEC voltooid
- 🦜 "Self-Aware" - Big Five voltooid
- 🦅 "Path Finder" - Alle modules voltooid
- 🔥 "Streak Master" - 7 dagen daily dilemmas
- 💯 "Completionist" - 100% reliability

**Scout Evolution:**
- 0-25: Kuiken (🥚→🐣)
- 25-50: Jonge vogel (🐦)
- 50-75: Tiener vogel (🦜)
- 75-100: Volwassen havik (🦅)

**Micro-Celebrations:**
```javascript
// After each milestone
function celebrate(milestone) {
  switch(milestone) {
    case 'riasec_complete':
      showConfetti();
      Scout.animate('celebration');
      Scout.say("Wow! Je eerste profiel is klaar! 🎉");
      unlockIsland('personality_island');
      break;
      
    case 'profile_50':
      Scout.evolve('young_bird');
      Scout.say("Kijk! Ik groei met je mee 🦜");
      break;
      
    // etc.
  }
}
```

### 🏆 Leaderboard (Optional - Careful with Competition)

**Friendboard (Not Global):**
- Compare met friends only (opt-in)
- Metric: Reliability score of modules completed
- Focus: "Support elkaar!" niet "Beat elkaar"

**Alternative: Collaborative Goals:**
- "100 users hebben vandaag hun profiel voltooid! 🎉"
- "Together we've made 10,000 swipes this week!"

---

## 📊 SAMENVATTING & IMPLEMENTATION CHECKLIST

### Wat je nu hebt:

✅ **RIASEC Swipe Game** (60 cards, 30 minimum, ~10-15 min)
✅ **Big Five Test** (25 vragen, 5 per dimensie, ~8-10 min)
✅ **Werkwaarden Sliders** (6 waarden, 1-10 schaal, ~3-5 min)
✅ **SCCT Efficacy Scanner** (8-10 skills, dynamisch, ~5-7 min)
✅ **Daily Dilemma's** (30 scenario's, 1/dag, ~2 min)
✅ **Scout integratie** in alle modules
✅ **Gamification elements** (progress, achievements, evolution)

### Content Creation Checklist:

**Prioriteit 1 (MVP):**
- [ ] 60 RIASEC swipe cards maken (foto's + beschrijvingen)
- [ ] 25 Big Five vragen schrijven + valideren
- [ ] 6 Werkwaarden beschrijvingen + voorbeelden
- [ ] Scout dialoog schrijven (50+ messages)
- [ ] Scout animaties ontwerpen (5 poses minimum)

**Prioriteit 2 (Post-MVP):**
- [ ] 10-15 SCCT skill beschrijvingen + voorbeelden
- [ ] 30 Daily Dilemma scenario's schrijven
- [ ] Achievement badges ontwerpen
- [ ] Advanced modules content (Q-Sort, etc.)

**Prioriteit 3 (Nice-to-Have):**
- [ ] Mini-games voor skills assessment
- [ ] Video tutorials per module
- [ ] Mentor intro video's

### Technical Implementation Checklist:

- [ ] Swipe card component (drag/tap interface)
- [ ] Slider component (1-10 schaal)
- [ ] Progress tracking systeem
- [ ] Scout animation engine
- [ ] Daily notification system
- [ ] Achievement/badge system
- [ ] Save/resume functionality

### Validation & Testing:

- [ ] Pilot test met 10 users (observeer struggles)
- [ ] A/B test verschillende vraag formuleringen
- [ ] Validate RIASEC cards tegen O*NET data
- [ ] Test completion rates per module
- [ ] Measure time per module (optimize if >target)

---

## 🎯 NEXT STEPS

Wil je dat ik nu:
1. **Alle 60 RIASEC cards** volledig uitwerk (tekst + RIASEC scores)?
2. **25 Big Five vragen** finaliseer met scoring logic?
3. **30 Daily Dilemma's** schrijf met antwoord mappings?
4. **Scout dialogue tree** maak voor alle modules?
5. **Technical specs** schrijf voor de swipe engine?

Kies wat je eerst nodig hebt en ik ga het uitwerken! 🚀