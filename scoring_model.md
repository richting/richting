# 🎯 SCORING MODEL - Richting App
## Van Theorie naar Baan-Match via O*NET Database

---

## 📚 INHOUDSOPGAVE

1. [Overzicht Scoringmodel](#overzicht)
2. [Data Structuur](#data-structuur)
3. [Pijler 1: RIASEC Scoring](#riasec-scoring)
4. [Pijler 2: Big Five Scoring](#big-five-scoring)
5. [Pijler 3: Werkwaarden Scoring](#werkwaarden-scoring)
6. [Pijler 4: SCCT Self-Efficacy Scoring](#scct-scoring)
7. [Master Matching Algoritme](#master-matching)
8. [O*NET Data Mapping](#onet-mapping)
9. [Implementatie Voorbeelden](#implementatie)
10. [Edge Cases & Validatie](#validatie)

---

## 1. OVERZICHT SCORINGMODEL {#overzicht}

### Conceptueel Model

```
User Input → Normalisatie → Theorie Scores → O*NET Mapping → Job Match Score
```

### Vier Theorie-Pijlers

| Pijler | Meting | O*NET Bron | Output Type |
|--------|--------|------------|-------------|
| RIASEC | Interesse | Interests | Vector (6 dimensies) |
| Big Five | Persoonlijkheid | Work Styles | Vector (5 dimensies) |
| Werkwaarden | Waarden | Work Values | Vector (6 dimensies) |
| SCCT | Self-Efficacy | Skills + Abilities | Confidence Score |

### Match Score Samenstelling

**Basis Formula:**
```
Total Match Score = (RIASEC_Score × W_R) + 
                   (BigFive_Score × W_B) + 
                   (Values_Score × W_V) + 
                   (SCCT_Modifier × W_S)
```

Waarbij:
- **W_R, W_B, W_V, W_S** = dynamische gewichten (zie Reliability Engine)
- **SCCT_Modifier** = Geen score maar een modifier (boost of penalty)

---

## 2. DATA STRUCTUUR {#data-structuur}

### User Profile Schema

```javascript
const userProfile = {
  // RIASEC (0-100 schaal per dimensie)
  riasec: {
    realistic: 45,
    investigative: 72,
    artistic: 88,
    social: 34,
    enterprising: 56,
    conventional: 23
  },
  
  // Big Five (-10 tot +10 schaal, genormaliseerd naar 0-20 in database)
  bigFive: {
    openness: 8,           // +8 = hoog open
    conscientiousness: 6,   // +6 = redelijk georganiseerd
    extraversion: -4,       // -4 = licht introvert
    agreeableness: 5,       // +5 = vriendelijk
    stability: 2            // +2 = emotioneel stabiel (lage neuroticism)
  },
  
  // Werkwaarden (1-10 schaal)
  workValues: {
    achievement: 8,
    independence: 7,
    recognition: 5,
    relationships: 6,
    support: 4,
    workingConditions: 7
  },
  
  // SCCT Self-Efficacy (1-10 schaal per skill cluster)
  selfEfficacy: {
    'critical_thinking': 7,
    'social_perceptiveness': 5,
    'complex_problem_solving': 8,
    'active_listening': 6,
    // ... meer skills
  },
  
  // Metadata
  reliabilityScore: 75,  // 0-100 (zie Reliability Engine)
  completedModules: ['swipes', 'personality', 'values']
}
```

### O*NET Job Schema

```javascript
const onetJob = {
  onetCode: "15-1252.00",
  title: "Software Developers",
  
  // RIASEC scores van O*NET (0-7 schaal)
  interests: {
    realistic: 2.33,
    investigative: 6.17,
    artistic: 4.00,
    social: 2.00,
    enterprising: 3.33,
    conventional: 3.00
  },
  
  // Work Styles (mapped naar Big Five)
  workStyles: {
    // Openness cluster
    innovation: 4.25,
    analyticalThinking: 4.75,
    adaptability: 4.00,
    
    // Conscientiousness cluster  
    attentionToDetail: 4.50,
    integrity: 4.00,
    dependability: 4.25,
    achievement: 4.50,
    
    // Extraversion cluster
    socialOrientation: 2.50,
    leadership: 2.75,
    initiative: 4.00,
    
    // Agreeableness cluster
    cooperation: 4.00,
    concernForOthers: 3.25,
    selfControl: 4.00,
    
    // Stability (inverse van Neuroticism)
    stressTolerance: 3.75
  },
  
  // Work Values (0-100 schaal in O*NET)
  workValues: {
    achievement: 78,
    independence: 72,
    recognition: 61,
    relationships: 44,
    support: 56,
    workingConditions: 52
  },
  
  // Top Skills (voor SCCT)
  topSkills: [
    { name: "Complex Problem Solving", level: 4.25, importance: 4.12 },
    { name: "Critical Thinking", level: 4.25, importance: 4.12 },
    { name: "Programming", level: 4.50, importance: 4.75 }
  ],
  
  // Top Abilities (voor SCCT)
  topAbilities: [
    { name: "Deductive Reasoning", level: 4.50, importance: 4.25 },
    { name: "Information Ordering", level: 4.25, importance: 4.00 },
    { name: "Written Comprehension", level: 4.25, importance: 3.88 }
  ]
}
```

---

## 3. PIJLER 1: RIASEC SCORING {#riasec-scoring}

### 3.1 User Data Verzameling

**Swipe Mechanisme:**
```javascript
// Bij elke "Ja" swipe
function updateRIASEC(userId, jobSwiped, action) {
  if (action === 'YES') {
    // Haal RIASEC profiel van dit beroep op
    const jobRIASEC = getJobRIASEC(jobSwiped);
    
    // Update user scores (additief)
    for (let dimension in jobRIASEC) {
      userProfile.riasec[dimension] += 1;
    }
  }
  // "NO" swipes doen niets
}

// Na N swipes: normaliseer naar 0-100
function normalizeRIASEC(userProfile) {
  const total = Object.values(userProfile.riasec).reduce((a,b) => a+b, 0);
  
  for (let dim in userProfile.riasec) {
    userProfile.riasec[dim] = (userProfile.riasec[dim] / total) * 100;
  }
}
```

**Minimum Swipes:** 30-50 swipes voor betrouwbaar profiel.

### 3.2 Normalisatie van O*NET Data

O*NET RIASEC scores lopen van 0-7. Normaliseer naar 0-100:

```javascript
function normalizeONET_RIASEC(onetInterests) {
  const normalized = {};
  const total = Object.values(onetInterests).reduce((a,b) => a+b, 0);
  
  for (let dim in onetInterests) {
    normalized[dim] = (onetInterests[dim] / total) * 100;
  }
  
  return normalized;
}
```

### 3.3 RIASEC Match Berekening

**Methode: Cosine Similarity**

```javascript
function calculateRIASEC_Match(userRIASEC, jobRIASEC) {
  // Beide moeten genormaliseerd zijn (0-100)
  
  // Dot product
  let dotProduct = 0;
  for (let dim of ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional']) {
    dotProduct += userRIASEC[dim] * jobRIASEC[dim];
  }
  
  // Magnitudes
  const userMagnitude = Math.sqrt(
    Object.values(userRIASEC).reduce((sum, val) => sum + val**2, 0)
  );
  
  const jobMagnitude = Math.sqrt(
    Object.values(jobRIASEC).reduce((sum, val) => sum + val**2, 0)
  );
  
  // Cosine similarity (0 tot 1)
  const cosineSimilarity = dotProduct / (userMagnitude * jobMagnitude);
  
  return cosineSimilarity; // Returns 0.0 - 1.0
}
```

**Interpretatie:**
- `0.0 - 0.3` = Slechte match (zeer verschillend profiel)
- `0.3 - 0.6` = Matige match (enige overlap)
- `0.6 - 0.8` = Goede match (veel overlap)
- `0.8 - 1.0` = Uitstekende match (zeer vergelijkbaar)

### 3.4 Holland Congruence Bonus (Hexagon Theory)

**Holland's Hexagon:**
```
        R(ealistic)
       /           \
     C              I(nvestigative)
    /                \
   /                  \
  Conventional    Artistic
   \                  /
    \                /
     E              S(ocial)
       \           /
        Enterprising
```

**Adjacent & Opposite Relaties:**
```javascript
const hollandRelations = {
  realistic: {
    adjacent: ['investigative', 'conventional'],
    opposite: 'social'
  },
  investigative: {
    adjacent: ['realistic', 'artistic'],
    opposite: 'enterprising'
  },
  artistic: {
    adjacent: ['investigative', 'social'],
    opposite: 'conventional'
  },
  social: {
    adjacent: ['artistic', 'enterprising'],
    opposite: 'realistic'
  },
  enterprising: {
    adjacent: ['social', 'conventional'],
    opposite: 'investigative'
  },
  conventional: {
    adjacent: ['enterprising', 'realistic'],
    opposite: 'artistic'
  }
};
```

**Congruence Bonus Berekening:**
```javascript
function calculateCongruenceBonus(userRIASEC, jobRIASEC) {
  // Bepaal primaire types (hoogste scores)
  const userPrimary = getTopDimension(userRIASEC);
  const jobPrimary = getTopDimension(jobRIASEC);
  
  let bonus = 0;
  
  // Perfect match op primair type
  if (userPrimary === jobPrimary) {
    bonus += 0.05; // +5% bonus
  }
  
  // Adjacent match
  else if (hollandRelations[userPrimary].adjacent.includes(jobPrimary)) {
    bonus += 0.03; // +3% bonus
  }
  
  // Opposite match (penalty!)
  else if (hollandRelations[userPrimary].opposite === jobPrimary) {
    bonus -= 0.15; // -15% penalty
  }
  
  return bonus; // -0.15 tot +0.05
}

function getTopDimension(riasecVector) {
  return Object.entries(riasecVector)
    .sort((a, b) => b[1] - a[1])[0][0];
}
```

---

## 4. PIJLER 2: BIG FIVE SCORING {#big-five-scoring}

### 4.1 User Data Verzameling

**Persoonlijkheidstest (5-point Likert scale per vraag):**

```javascript
// Voorbeeld vragen met mapping
const personalityQuestions = [
  {
    id: 1,
    text: "Ik probeer graag nieuwe dingen uit",
    dimension: "openness",
    direction: "positive"  // positive = hoger antwoord = hogere score
  },
  {
    id: 2,
    text: "Ik maak vaak todo-lijstjes",
    dimension: "conscientiousness",
    direction: "positive"
  },
  {
    id: 3,
    text: "Ik voel me vaak onzeker in sociale situaties",
    dimension: "extraversion",
    direction: "negative"  // negative = hoger antwoord = lagere score
  }
  // ... meer vragen
];

// Scoring (per dimensie, 4-6 vragen)
function calculateBigFive(answers) {
  const bigFive = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    stability: 0
  };
  
  answers.forEach(answer => {
    const question = personalityQuestions.find(q => q.id === answer.questionId);
    const score = question.direction === 'positive' 
      ? answer.value  // 1-5
      : (6 - answer.value);  // Reverse scoring
    
    bigFive[question.dimension] += score;
  });
  
  // Normaliseer naar -10 tot +10 schaal
  for (let dim in bigFive) {
    const questionCount = personalityQuestions.filter(q => q.dimension === dim).length;
    const rawScore = bigFive[dim]; // 4-20 range (bij 4 vragen)
    const midpoint = (questionCount * 5) / 2; // 10 bij 4 vragen
    
    bigFive[dim] = ((rawScore - midpoint) / midpoint) * 10; // -10 tot +10
  }
  
  return bigFive;
}
```

### 4.2 O*NET Work Styles Mapping naar Big Five

**Aggregatie Formule:**
```javascript
function mapWorkStylesToBigFive(onetWorkStyles) {
  const bigFive = {
    openness: average([
      onetWorkStyles.innovation,
      onetWorkStyles.analyticalThinking,
      onetWorkStyles.adaptability
    ]),
    
    conscientiousness: average([
      onetWorkStyles.attentionToDetail,
      onetWorkStyles.integrity,
      onetWorkStyles.dependability,
      onetWorkStyles.achievement
    ]),
    
    extraversion: average([
      onetWorkStyles.socialOrientation,
      onetWorkStyles.leadership,
      onetWorkStyles.initiative
    ]),
    
    agreeableness: average([
      onetWorkStyles.cooperation,
      onetWorkStyles.concernForOthers,
      onetWorkStyles.selfControl
    ]),
    
    stability: onetWorkStyles.stressTolerance
    // Note: O*NET meet positieve kant, dus hoog = stabiel (laag neuroticism)
  };
  
  // Normaliseer O*NET scores (1-5 schaal) naar -10 tot +10
  for (let dim in bigFive) {
    // O*NET: 1-5, middelpunt = 3
    // Gewenst: -10 tot +10, middelpunt = 0
    bigFive[dim] = ((bigFive[dim] - 3) / 2) * 10; // -10 tot +10
  }
  
  return bigFive;
}

function average(arr) {
  return arr.reduce((a,b) => a+b, 0) / arr.length;
}
```

### 4.3 Big Five Match Berekening

**Methode: Absolute Difference (niet Cosine!)**

Waarom? Big Five dimensies zijn bipolair (-10 tot +10). Een introvert (Extraversion = -8) past beter bij een job die introversie vereist (Job Extraversion = -7) dan bij een extravert job (+5).

```javascript
function calculateBigFive_Match(userBigFive, jobBigFive) {
  let totalDifference = 0;
  const dimensions = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'stability'];
  
  dimensions.forEach(dim => {
    const diff = Math.abs(userBigFive[dim] - jobBigFive[dim]);
    totalDifference += diff;
  });
  
  // Max mogelijke verschil per dimensie = 20 (van -10 naar +10)
  // Max totaal verschil = 20 * 5 = 100
  const maxDifference = 100;
  
  // Match score: 1.0 = perfect, 0.0 = maximaal verschillend
  const matchScore = 1 - (totalDifference / maxDifference);
  
  return matchScore; // 0.0 - 1.0
}
```

**Interpretatie:**
- `0.0 - 0.4` = Slechte match (persoonlijkheid botst)
- `0.4 - 0.7` = Matige match (enkele verschillen)
- `0.7 - 0.9` = Goede match (klein verschil)
- `0.9 - 1.0` = Uitstekende match (zeer vergelijkbaar)

---

## 5. PIJLER 3: WERKWAARDEN SCORING {#werkwaarden-scoring}

### 5.1 User Data Verzameling

**Sliders (1-10 schaal per waarde):**

```javascript
const workValuesInput = {
  achievement: 8,      // "Ik wil uitdagende doelen behalen"
  independence: 7,     // "Ik wil zelfstandig kunnen werken"
  recognition: 5,      // "Ik wil erkend worden voor mijn werk"
  relationships: 6,    // "Ik wil samenwerken met collega's"
  support: 4,          // "Ik wil ondersteuning van leidinggevenden"
  workingConditions: 7 // "Ik wil goede arbeidsomstandigheden"
};
```

### 5.2 O*NET Work Values Normalisatie

O*NET geeft Work Values op 0-100 schaal. Normaliseer naar 1-10:

```javascript
function normalizeONET_WorkValues(onetValues) {
  const normalized = {};
  
  for (let value in onetValues) {
    normalized[value] = (onetValues[value] / 100) * 9 + 1; // 0-100 → 1-10
  }
  
  return normalized;
}
```

### 5.3 Werkwaarden Match Berekening

**Methode: Weighted Importance**

Idee: Als gebruiker iets heel belangrijk vindt (hoge score), moet de job dat ook bieden. Als gebruiker iets niet belangrijk vindt (lage score), maakt het niet uit.

```javascript
function calculateWorkValues_Match(userValues, jobValues) {
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (let value in userValues) {
    const userImportance = userValues[value]; // 1-10
    const jobOffer = jobValues[value]; // 1-10 (genormaliseerd)
    
    // Bereken match voor deze waarde
    const difference = Math.abs(userImportance - jobOffer);
    const maxDiff = 9; // Max verschil op 1-10 schaal
    const valueMatch = 1 - (difference / maxDiff); // 0-1
    
    // Weeg met user importance
    weightedSum += valueMatch * userImportance;
    totalWeight += userImportance;
  }
  
  // Gewogen gemiddelde
  const matchScore = weightedSum / totalWeight;
  
  return matchScore; // 0.0 - 1.0
}
```

**Alternatieve Methode: Bonus System (zoals in huidige code)**

```javascript
function calculateWorkValues_Bonus(userValues, jobValues) {
  let bonusSum = 0;
  
  for (let value in userValues) {
    // Normaliseer user value naar -1 tot +1 (5 = neutraal)
    const userNormalized = (userValues[value] - 5) / 5; // -1 tot +1
    
    // Als user het belangrijk vindt (>5) EN job biedt het (>5)
    if (userNormalized > 0 && jobValues[value] > 5) {
      const jobNormalized = (jobValues[value] - 5) / 5;
      bonusSum += userNormalized * jobNormalized; // Product
    }
  }
  
  // Normaliseer bonus naar 0-1
  const maxBonus = 6; // 6 waarden × max product (1×1)
  const bonus = bonusSum / maxBonus;
  
  return bonus; // 0.0 - 1.0
}
```

**Aanbeveling:** Gebruik **Weighted Importance** methode - intuïtiever en stabieler.

---

## 6. PIJLER 4: SCCT SELF-EFFICACY SCORING {#scct-scoring}

### 6.1 Conceptueel Model

SCCT (Social Cognitive Career Theory) focust op **self-efficacy**: hoe zeker ben je van je kunnen?

**Niet een match score, maar een MODIFIER:**
- Hoge RIASEC match + lage self-efficacy = "Groeipotentieel" (learning curve)
- Hoge RIASEC match + hoge self-efficacy = "Direct Match" (ready to go)

### 6.2 User Data Verzameling

**Top 3 Skills van job presenteren:**

```javascript
// Voor Software Developer
const topSkills = [
  { name: "Complex Problem Solving", userConfidence: null },
  { name: "Critical Thinking", userConfidence: null },
  { name: "Programming", userConfidence: null }
];

// Vraag: "Hoe zeker ben je van je kunnen in [skill]?" (1-10 schaal)
```

**Data opslag:**
```javascript
userProfile.selfEfficacy = {
  'complex_problem_solving': 8,   // Heel zeker
  'critical_thinking': 7,          // Redelijk zeker
  'programming': 4,                // Niet zo zeker
  'social_perceptiveness': 6,
  // ... meer skills
};
```

### 6.3 O*NET Skills/Abilities Data

O*NET geeft:
- **Level** (1-7): Hoe hoog moet je niveau zijn?
- **Importance** (1-5): Hoe belangrijk is deze skill?

```javascript
const jobSkills = [
  { 
    name: "Complex Problem Solving", 
    level: 4.25,        // 1-7 schaal
    importance: 4.12    // 1-5 schaal
  },
  { 
    name: "Programming", 
    level: 4.50, 
    importance: 4.75 
  }
  // etc.
];
```

### 6.4 SCCT Modifier Berekening

```javascript
function calculateSCCT_Modifier(userEfficacy, jobSkills) {
  // Selecteer top 3 belangrijkste skills van de job
  const topSkills = jobSkills
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 3);
  
  let efficacyGap = 0;
  
  topSkills.forEach(skill => {
    const skillKey = skill.name.toLowerCase().replace(/ /g, '_');
    const userConfidence = userEfficacy[skillKey] || 5; // Default = gemiddeld
    
    // Normaliseer O*NET level naar 1-10 schaal
    const requiredLevel = (skill.level / 7) * 10; // 1-7 → 1-10
    
    // Bereken gap (kan negatief zijn als user hoger scoort)
    const gap = requiredLevel - userConfidence;
    
    // Weeg gap met importance van skill
    efficacyGap += gap * (skill.importance / 5); // Normaliseer importance naar 0-1
  });
  
  // Gemiddelde gap over top 3 skills
  const avgGap = efficacyGap / 3;
  
  // Converteer naar modifier (-0.2 tot +0.2)
  // Negative gap (user > required) = boost
  // Positive gap (required > user) = penalty
  const modifier = -avgGap / 10; // -2 tot +2 gap → -0.2 tot +0.2 modifier
  
  // Clamp tussen -0.2 en +0.2
  return Math.max(-0.2, Math.min(0.2, modifier));
}
```

**Classificatie op basis van modifier:**
```javascript
function classifyMatch(riasecScore, scctModifier) {
  if (riasecScore < 0.6) {
    return "poor_match"; // Niet eens RIASEC match
  }
  
  if (scctModifier >= 0.05) {
    return "overqualified"; // User heeft meer skills dan nodig
  } else if (scctModifier >= -0.05) {
    return "direct_match"; // User heeft juiste skills
  } else if (scctModifier >= -0.15) {
    return "growth_potential"; // Learning curve, maar haalbaar
  } else {
    return "steep_learning_curve"; // Grote skill gap
  }
}
```

**UI Labels:**
- `direct_match`: ✅ "Direct Match - Je bent er klaar voor!"
- `growth_potential`: 🌱 "Groeipotentieel - Met wat leren perfect voor jou"
- `steep_learning_curve`: 📚 "Uitdagend - Flinke learning curve"
- `overqualified`: 🚀 "Overqualified - Dit wordt makkelijk voor jou"

---

## 7. MASTER MATCHING ALGORITME {#master-matching}

### 7.1 Dynamische Weging (Reliability Engine)

**Reliability Score Berekening:**
```javascript
function calculateReliabilityScore(userProfile) {
  let score = 0;
  
  // Onboarding swipes voltooid
  if (userProfile.completedModules.includes('swipes')) {
    score += 30;
  }
  
  // Persoonlijkheidstest voltooid
  if (userProfile.completedModules.includes('personality')) {
    score += 20;
  }
  
  // Werkwaarden module voltooid
  if (userProfile.completedModules.includes('values')) {
    score += 20;
  }
  
  // Daily dilemma's (max 30 punten = 6 dilemma's)
  const dilemmasCompleted = userProfile.dilemmasCompleted || 0;
  score += Math.min(dilemmasCompleted * 5, 30);
  
  return Math.min(score, 100); // Max 100
}
```

**Gewichten per Fase:**
```javascript
function getDynamicWeights(reliabilityScore) {
  let weights = {
    riasec: 0,
    bigFive: 0,
    workValues: 0,
    scct: 0
  };
  
  if (reliabilityScore < 40) {
    // Fase 1: Alleen RIASEC
    weights.riasec = 1.0;
    weights.bigFive = 0;
    weights.workValues = 0;
    weights.scct = 0;
  } 
  else if (reliabilityScore < 60) {
    // Fase 2: RIASEC + Big Five
    weights.riasec = 0.6;
    weights.bigFive = 0.4;
    weights.workValues = 0;
    weights.scct = 0;
  } 
  else {
    // Fase 3: Alles
    weights.riasec = 0.4;
    weights.bigFive = 0.3;
    weights.workValues = 0.2;
    weights.scct = 0.1;
  }
  
  return weights;
}
```

### 7.2 Job Match Score Berekening

**Basis Matching:**
```javascript
function calculateJobMatch(userProfile, onetJob) {
  // 1. Bereken individuele scores
  const riasecScore = calculateRIASEC_Match(
    userProfile.riasec, 
    normalizeONET_RIASEC(onetJob.interests)
  );
  
  const bigFiveScore = calculateBigFive_Match(
    userProfile.bigFive,
    mapWorkStylesToBigFive(onetJob.workStyles)
  );
  
  const valuesScore = calculateWorkValues_Match(
    userProfile.workValues,
    normalizeONET_WorkValues(onetJob.workValues)
  );
  
  const scctModifier = calculateSCCT_Modifier(
    userProfile.selfEfficacy,
    onetJob.topSkills
  );
  
  // 2. Haal dynamische gewichten op
  const weights = getDynamicWeights(userProfile.reliabilityScore);
  
  // 3. Bereken gewogen totaal (zonder SCCT)
  const baseScore = 
    (riasecScore * weights.riasec) +
    (bigFiveScore * weights.bigFive) +
    (valuesScore * weights.workValues);
  
  // 4. Pas SCCT modifier toe (additief)
  const finalScore = baseScore + (scctModifier * weights.scct);
  
  // 5. Clamp tussen 0 en 1
  return Math.max(0, Math.min(1, finalScore));
}
```

### 7.3 Enhanced Sector Matching (Hybrid Score)

**Voor sectoren: combineer directe sector match + aggregatie van beroepen:**

```javascript
function calculateSectorMatch(userProfile, sector) {
  // 1. Directe sector RIASEC match (60%)
  const directMatch = calculateRIASEC_Match(
    userProfile.riasec,
    sector.riasecProfile
  );
  
  // 2. Top 10 beroepen in sector (30%)
  const topJobs = sector.jobs
    .map(job => calculateJobMatch(userProfile, job))
    .sort((a, b) => b - a)
    .slice(0, 10);
  
  const careerAvg = average(topJobs);
  
  // 3. Holland Congruence Bonus (10%)
  const congruenceBonus = calculateCongruenceBonus(
    userProfile.riasec,
    sector.riasecProfile
  );
  
  // 4. Combine
  const hybridScore = 
    (directMatch * 0.6) +
    (careerAvg * 0.3) +
    (congruenceBonus * 0.1) +
    0.10; // Offset voor negatieve penalty
  
  return Math.max(0, Math.min(1, hybridScore));
}
```

---

## 8. O*NET DATA MAPPING {#onet-mapping}

### 8.1 Benodigde O*NET Files

Download van [O*NET Online](https://www.onetcenter.org/database.html):

| File | Data |
|------|------|
| `Interests.txt` | RIASEC scores per job (Scale 1-7) |
| `Work Styles.txt` | Work Style scores (Scale 1-5) |
| `Work Values.txt` | Work Values scores (Scale 0-100) |
| `Skills.txt` | Skill levels + importance (Scale 1-7 / 1-5) |
| `Abilities.txt` | Ability levels + importance (Scale 1-7 / 1-5) |
| `Occupation Data.txt` | Job titles + descriptions |

### 8.2 Database Schema

**Jobs Table:**
```sql
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  onet_code VARCHAR(10) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- RIASEC (normalized 0-100)
  riasec_realistic DECIMAL(5,2),
  riasec_investigative DECIMAL(5,2),
  riasec_artistic DECIMAL(5,2),
  riasec_social DECIMAL(5,2),
  riasec_enterprising DECIMAL(5,2),
  riasec_conventional DECIMAL(5,2),
  
  -- Big Five (computed from work styles, -10 to +10)
  bigfive_openness DECIMAL(5,2),
  bigfive_conscientiousness DECIMAL(5,2),
  bigfive_extraversion DECIMAL(5,2),
  bigfive_agreeableness DECIMAL(5,2),
  bigfive_stability DECIMAL(5,2),
  
  -- Work Values (normalized 1-10)
  value_achievement DECIMAL(5,2),
  value_independence DECIMAL(5,2),
  value_recognition DECIMAL(5,2),
  value_relationships DECIMAL(5,2),
  value_support DECIMAL(5,2),
  value_working_conditions DECIMAL(5,2),
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Skills Table (voor SCCT):**
```sql
CREATE TABLE job_skills (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id),
  skill_name VARCHAR(100),
  skill_level DECIMAL(3,2),  -- 1-7 scale
  importance DECIMAL(3,2),   -- 1-5 scale
  skill_type VARCHAR(20)     -- 'skill' or 'ability'
);

CREATE INDEX idx_job_skills ON job_skills(job_id, importance DESC);
```

### 8.3 Data Import Script (Pseudocode)

```python
import pandas as pd

# 1. Load O*NET data
interests = pd.read_csv('Interests.txt', sep='\t')
work_styles = pd.read_csv('Work Styles.txt', sep='\t')
work_values = pd.read_csv('Work Values.txt', sep='\t')
skills = pd.read_csv('Skills.txt', sep='\t')

# 2. Pivot RIASEC data
riasec_pivot = interests.pivot(
    index='O*NET-SOC Code',
    columns='Element Name',
    values='Data Value'
)

# 3. Normalize RIASEC (per job, naar 0-100)
riasec_normalized = riasec_pivot.div(riasec_pivot.sum(axis=1), axis=0) * 100

# 4. Map Work Styles to Big Five
def map_to_bigfive(work_styles_row):
    openness = np.mean([
        work_styles_row.get('Innovation', 3),
        work_styles_row.get('Analytical Thinking', 3),
        work_styles_row.get('Adaptability/Flexibility', 3)
    ])
    # ... repeat for other dimensions
    
    # Normalize to -10 to +10
    return {
        'openness': ((openness - 3) / 2) * 10,
        # ...
    }

# 5. Normalize Work Values (0-100 → 1-10)
work_values_normalized = (work_values['Data Value'] / 100) * 9 + 1

# 6. Insert into database
for onet_code in riasec_normalized.index:
    db.execute("""
        INSERT INTO jobs (onet_code, riasec_realistic, ...)
        VALUES (%s, %s, ...)
    """, (onet_code, riasec_normalized.loc[onet_code, 'Realistic'], ...))
```

---

## 9. IMPLEMENTATIE VOORBEELDEN {#implementatie}

### 9.1 Complete Match Flow

```javascript
// User completes profile
const user = {
  id: 'user_123',
  riasec: { realistic: 20, investigative: 85, artistic: 70, ... },
  bigFive: { openness: 8, conscientiousness: 5, ... },
  workValues: { achievement: 9, independence: 8, ... },
  selfEfficacy: { 'programming': 7, 'critical_thinking': 8, ... },
  reliabilityScore: 70
};

// Fetch all jobs from database
const jobs = await db.query('SELECT * FROM jobs');

// Calculate matches
const matches = jobs.map(job => {
  const matchScore = calculateJobMatch(user, job);
  const classification = classifyMatch(
    calculateRIASEC_Match(user.riasec, job.riasec),
    calculateSCCT_Modifier(user.selfEfficacy, job.topSkills)
  );
  
  return {
    jobId: job.id,
    jobTitle: job.title,
    matchScore: matchScore,
    matchPercentage: Math.round(matchScore * 100),
    classification: classification,
    
    // Breakdown voor UI
    breakdown: {
      riasec: calculateRIASEC_Match(user.riasec, job.riasec),
      personality: calculateBigFive_Match(user.bigFive, job.bigFive),
      values: calculateWorkValues_Match(user.workValues, job.workValues),
      scctModifier: calculateSCCT_Modifier(user.selfEfficacy, job.topSkills)
    }
  };
});

// Sort descending
matches.sort((a, b) => b.matchScore - a.matchScore);

// Return top 10
return matches.slice(0, 10);
```

### 9.2 API Endpoint Voorbeeld

```javascript
// GET /api/matches/:userId
app.get('/api/matches/:userId', async (req, res) => {
  try {
    // 1. Fetch user profile
    const user = await db.query(
      'SELECT * FROM user_profiles WHERE id = $1',
      [req.params.userId]
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // 2. Check reliability score
    const reliabilityScore = calculateReliabilityScore(user);
    
    if (reliabilityScore < 30) {
      return res.status(400).json({
        error: 'Profile incomplete',
        message: 'Please complete at least the swipe module',
        reliabilityScore: reliabilityScore
      });
    }
    
    // 3. Fetch jobs
    const jobs = await db.query('SELECT * FROM jobs LIMIT 500');
    
    // 4. Calculate matches (with caching)
    const cacheKey = `matches:${user.id}:${user.updated_at}`;
    let matches = await cache.get(cacheKey);
    
    if (!matches) {
      matches = jobs.map(job => calculateJobMatch(user, job));
      matches.sort((a, b) => b.matchScore - a.matchScore);
      await cache.set(cacheKey, matches, 3600); // Cache 1 hour
    }
    
    // 5. Return top 20
    res.json({
      userId: user.id,
      reliabilityScore: reliabilityScore,
      totalMatches: matches.length,
      topMatches: matches.slice(0, 20)
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

---

## 10. EDGE CASES & VALIDATIE {#validatie}

### 10.1 Bekende Edge Cases

**1. Flat RIASEC Profile (alle scores ~16-17%)**

Probleem: Gebruiker heeft geen duidelijke voorkeur.

Oplossing:
```javascript
function detectFlatProfile(riasec) {
  const values = Object.values(riasec);
  const mean = values.reduce((a,b) => a+b) / values.length;
  const variance = values.reduce((sum, val) => sum + (val - mean)**2, 0) / values.length;
  
  if (variance < 50) {  // Threshold: zeer lage spreiding
    return {
      isFlat: true,
      message: "Je profiel is breed - je hebt interesse in veel richtingen! Kijk naar je persoonlijkheid en waarden voor meer richting."
    };
  }
  
  return { isFlat: false };
}
```

**2. Contradictoire Persoonlijkheid**

Probleem: User scoort hoog extravert maar solliciteert naar jobs met lage sociale orientatie.

Oplossing: Flag als "Unexpected Match" en toon waarschuwing:
```javascript
if (user.bigFive.extraversion > 5 && job.bigFive.extraversion < -3) {
  addWarning("Deze baan vereist weinig sociale interactie. Weet je zeker dat dit bij je past?");
}
```

**3. Missing O*NET Data**

Probleem: Sommige jobs hebben incomplete O*NET data.

Oplossing:
```javascript
function validateJobData(job) {
  const required = ['riasec', 'workStyles', 'workValues'];
  const missing = required.filter(field => !job[field] || Object.keys(job[field]).length === 0);
  
  if (missing.length > 0) {
    console.warn(`Job ${job.onetCode} missing data:`, missing);
    return false; // Exclude from matching
  }
  
  return true;
}
```

### 10.2 Validatie Metrics

**Match Distribution Check:**
```javascript
// Verwachte distributie: normaal curve met mean ~0.5
function validateMatchDistribution(matches) {
  const scores = matches.map(m => m.matchScore);
  const mean = average(scores);
  const stdDev = Math.sqrt(
    scores.reduce((sum, s) => sum + (s - mean)**2, 0) / scores.length
  );
  
  console.log({
    mean: mean,           // Verwacht: 0.45 - 0.55
    stdDev: stdDev,       // Verwacht: 0.15 - 0.25
    min: Math.min(...scores),
    max: Math.max(...scores)
  });
  
  // Alert als distributie abnormaal is
  if (mean < 0.3 || mean > 0.7) {
    console.error('⚠️  Abnormal match distribution detected!');
  }
}
```

**Inter-Rater Reliability (Human Validation):**
```javascript
// Test met 10 gebruikers die handmatig hun top 3 jobs kiezen
// Vergelijk met algoritme top 10
function calculatePrecisionAtK(humanTopJobs, algoTopJobs, k=10) {
  const algoTop10 = algoTopJobs.slice(0, k);
  const hits = humanTopJobs.filter(job => algoTop10.includes(job)).length;
  
  return hits / Math.min(humanTopJobs.length, k); // Precision
}

// Target: Precision@10 > 0.6 (60% overlap)
```

### 10.3 A/B Testing Varianten

**Test verschillende matching formules:**

```javascript
const variants = {
  // Variant A: Current model
  A: {
    weights: { riasec: 0.4, bigFive: 0.3, values: 0.2, scct: 0.1 }
  },
  
  // Variant B: RIASEC heavy
  B: {
    weights: { riasec: 0.6, bigFive: 0.2, values: 0.2, scct: 0.0 }
  },
  
  // Variant C: Equal weights
  C: {
    weights: { riasec: 0.33, bigFive: 0.33, values: 0.34, scct: 0.0 }
  }
};

// Track per user welke variant ze zien
// Meet: click-through rate, NPS, match satisfaction
```

---

## 📊 SAMENVATTING & NEXT STEPS

### Wat je nu hebt:

✅ **Complete scoring formules** voor alle 4 theorie-pijlers  
✅ **O*NET mapping strategie** (van raw data naar matches)  
✅ **Dynamische weging** op basis van reliability score  
✅ **SCCT modifier** voor skill gap analyse  
✅ **Sector matching** met hybrid score  
✅ **Database schema** en import strategie  
✅ **Edge case handling** en validatie metrics  

### Implementatie Checklist:

- [ ] **Database setup**: Maak jobs + job_skills tables
- [ ] **O*NET import**: Download data + run import script
- [ ] **User profile schema**: Implementeer in database
- [ ] **Matching engine**: Bouw core algoritme (start met RIASEC)
- [ ] **API endpoints**: `/matches`, `/profile`, `/sectors`
- [ ] **Caching layer**: Redis voor match results
- [ ] **A/B testing**: Implementeer variants voor formule tuning
- [ ] **Monitoring**: Log match distributions + user feedback
- [ ] **Beta testing**: Test met 50 users, valideer precision

### Volgende Stap:

Wil je dat ik:
1. **Code genereer** voor een specifiek deel (bijv. matching engine in Node.js)?
2. **Database migrations** schrijf voor PostgreSQL?
3. **O*NET import script** volledig uitwerk in Python?
4. **API documentation** maak met Swagger/OpenAPI spec?
5. **Test data** genereer voor validatie?

Laat weten wat je als eerste nodig hebt!
