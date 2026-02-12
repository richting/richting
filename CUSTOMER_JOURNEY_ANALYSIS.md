# 🔍 CUSTOMER JOURNEY ANALYSE - Richting App
## Vergelijking met Design System & Assessment Modules Documentatie

**Datum:** 7 februari 2026
**Analist:** Claude Sonnet 4.5
**Bestanden geanalyseerd:**
- `app_design_system.md`
- `assessment_modules.md`
- `src/App.jsx` + 15 component files

---

## 📋 EXECUTIVE SUMMARY

Na systematische analyse van de volledige customer journey zijn er **25+ significante misalignments** gevonden tussen de huidige implementatie en de design specificaties.

**Severity Breakdown:**
- 🔴 **Critical Issues:** 3 (Scout ontbreekt, SCCT module missing, Auth placement risk)
- 🟡 **Medium Issues:** 12 (UI/UX afwijkingen, content gaps, token inconsistenties)
- 🟢 **Low Priority:** 10+ (Polish items, accessibility, microinteractions)

**Grootste gemiste kans:** Scout mascot is DE unique selling point volgens design docs, maar is nergens volledig geïmplementeerd (geen visuele avatar, geen evolution, geen context-aware animations).

---

## 🎯 TOP 5 CRITICAL FIXES

### 1. 🔴 Scout Component Volledig Ontbreekt
**Impact:** Core brand identity missing, geen emotionele connectie met gebruiker

**Specificatie:** `app_design_system.md` lijn 1445-1631
- SVG eagle avatar met 5 poses (neutral, happy, thinking, celebrating, encouraging)
- Floating animation (continuous loop)
- Speech bubble met context-aware messages
- Evolution states based on reliability: 🥚 (0-25) → 🐣 (25-50) → 🦜 (50-75) → 🦅 (75-100)

**Huidige situatie:**
- `VibeSwipe.jsx`: Alleen tekstberichten, geen visuele avatar
- `PersonalityQuiz.jsx`: Alleen tekstberichten
- `Onboarding.jsx`: Scout ontbreekt volledig

**Actie:**
```typescript
// Te implementeren:
- components/Scout/ScoutAvatar.tsx (SVG component)
- components/Scout/Scout.tsx (container met bubble)
- hooks/useScout.ts (state management)
- animations/scoutFloat.ts (floating animation)
```

---

### 2. 🔴 SCCT Self-Efficacy Scanner Module Ontbreekt
**Impact:** Core assessment module missing, -10 reliability punten

**Specificatie:** `assessment_modules.md` lijn 612-768

**Journey positie:** Tussen WorkValues en Results
```
RIASEC (30 pts) → Big Five (50 pts) → WorkValues (70 pts)
→ SCCT (80 pts) ← MISSING → Results
```

**Module specs:**
- Dynamische vragenlijst (8-10 skills)
- Skills extraction van top matches
- Confidence sliders 1-10 per skill
- +10 reliability punten

**Actie:**
- [ ] Implementeer `SCCTScanner.jsx` component
- [ ] Voeg toe tussen step 3 (WorkValues) en Results
- [ ] Implementeer skill extraction algoritme
- [ ] Update reliability scoring logic

---

### 3. 🔴 Auth Screen Placement = Data Loss Risk
**Impact:** Gebruikers kunnen 25-35 min data verliezen bij browser crash

**Huidige flow:**
```
Onboarding → RIASEC → Big5 → WorkValues → Auth ← TOO LATE
```

**Probleem:**
- Alle assessment data wordt VOOR auth ingevuld
- Geen localStorage backup voor anonymous users
- Browser refresh = data loss

**Opties:**
1. **Optie A:** Verplaats Auth direct na Onboarding (step 1)
2. **Optie B:** Implementeer localStorage backup voor anonymous sessions
3. **Optie C:** "Save & Continue Later" functionaliteit

**Aanbeveling:** Optie A (simpelst) of B (betere UX)

---

### 4. 🟡 RIASEC Cards Missen Visuele Content
**Impact:** Minder engaging, lagere completion rates

**Specificatie:** `assessment_modules.md` lijn 205-271

**Ontbrekende fields:**
```json
{
  "imageUrl": "/assets/cards/carpenter.jpg",  // ❌ MISSING
  "sectors": ["Bouw", "Ambacht"],             // ❌ MISSING
  "tagline": "Korte pakkende beschrijving"    // ⚠️ Verwarring met description
}
```

**Database update nodig:**
```sql
-- Voeg toe aan riasec_questions.metadata:
ALTER TABLE riasec_questions
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Update metadata format:
{
  "tag": "R",
  "emoji": "🔧",
  "gradient": "from-orange-400 to-red-500",
  "description": "Lang beschrijving voor details",
  "imageUrl": "/assets/cards/carpenter.jpg",      -- NIEUW
  "sectors": ["Bouw", "Ambacht"],                 -- NIEUW
  "tagline": "Bouwen met hout en gereedschap"    -- NIEUW
}
```

**Actie:**
- [ ] Voeg image URLs toe (60 afbeeldingen)
- [ ] Voeg sector arrays toe
- [ ] Update seed data script
- [ ] Verifieer SwipeCard.jsx rendert images correct

---

### 5. 🟡 Bottom Navigation Niet Conform Specs
**Impact:** Verwarring, inconsistent met design system

**Specificatie:** `app_design_system.md` lijn 52-63

**Design System:**
```
🏠 Home (Dashboard)
🧭 Ontdek (Assessments)
📊 Resultaten (Matches)
⚙️ Profiel (Settings)
```

**Huidige implementatie (`BottomNav.jsx`):**
```javascript
LayoutDashboard → Home      ✅ CORRECT
Search → Matches            ⚠️ Verkeerde icon (zou 📊 moeten zijn)
Brain → Test                ❌ Zou "Ontdek" moeten zijn met 🧭
User → Profiel              ✅ CORRECT
```

**Actie:**
```jsx
// Update BottomNav.jsx:
- Hernoem "Test" → "Ontdek"
- Wijzig Brain icon → Compass icon
- Wijzig Search icon → BarChart icon
```

---

## 📊 VOLLEDIGE ISSUE LIJST

### ONBOARDING (Step 0)

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 1.1 | Scout Hero image ontbreekt | 🔴 | Brand identity loss |
| 1.2 | Geen tijdsindicatie (30-40 min) | 🟡 | Gebruiker weet niet wat te verwachten |
| 1.3 | Geen "je kunt pauzeren" boodschap | 🟡 | Mogelijk hogere dropout |
| 1.4 | Segmentatie slides niet in specs | 🟡 | Onnodige friction |

**Fix:**
```jsx
// Simplify Onboarding.jsx naar 2 slides:
// Slide 1: Scout intro + "Welkom bij Richting" + 30-40 min + pauzeer boodschap
// Slide 2: Feature overview (swipe, tests, Scout) + CTA "Start ontdekking"
```

---

### RIASEC SWIPE (Step 1)

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 2.1 | Geen imageUrl in cards | 🟡 | Minder visueel engaging |
| 2.2 | Geen sector tags | 🟡 | Minder context voor gebruiker |
| 2.3 | Geen early exit optie bij 30 swipes | 🟡 | Kan niet doorswipe to 60 |
| 2.4 | Scout alleen text, geen avatar | 🔴 | Brand inconsistentie |
| 2.5 | Swipe indicators ✓/✗ onbekend | ⚠️ | Kan niet verifiëren |

**Specs:**
- Design System: lijn 1079-1175
- Assessment Modules: lijn 53-272

---

### BIG FIVE QUIZ (Step 2)

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 3.1 | Scout messages niet exact zoals specs | 🟡 | Minor UX polish |
| 3.2 | Mogelijk geen emoji's bij slider | ⚠️ | Kan niet verifiëren |
| 3.3 | Mogelijk geen back button | ⚠️ | Kan niet verifiëren |
| 3.4 | Scout alleen text, geen avatar | 🔴 | Brand inconsistentie |

**Specs:**
- Design System: lijn 1179-1276
- Assessment Modules: lijn 275-461

---

### WORK VALUES (Step 3)

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 4.1 | Module implementatie onbekend | 🟡 | Kan niet verifiëren conformiteit |
| 4.2 | Moet 6 waarden met sliders zijn | ⚠️ | Check: NIET card sorting |
| 4.3 | Sliders moeten starten op 5 | ⚠️ | Check: niet op 0 of 10 |

**Specs:**
- Assessment Modules: lijn 464-610

**Required components:**
```jsx
// 6 Werkwaarden:
🏆 Achievement
🦅 Independence
⭐ Recognition
👥 Relationships
🤝 Support
🏢 Working Conditions

// Interface: Sliders 1-10, start op 5
```

---

### AUTH SCREEN (Step 4)

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 5.1 | Auth komt NA alle assessments | 🔴 | Data loss risk bij crash |
| 5.2 | Geen localStorage backup | 🔴 | Anonymous data niet bewaard |

**Oplossing:** Zie Critical Fix #3

---

### HOME SCREEN (Step 5)

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 6.1 | Scout ontbreekt | 🔴 | Geen mascot op main screen |
| 6.2 | Layout grotendeels correct | ✅ | Reliability meter, NextMission, TopMatch aanwezig |

**Wel aanwezig:**
- ✅ ProgressCircle (reliability score)
- ✅ NextMission card
- ✅ DailyBooster
- ✅ Top match preview

---

### MATCHES SCREEN (Step 7)

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 7.1 | Screen bestaat en werkt | ✅ | - |
| 7.2 | Tab icon verkeerd (Search ipv Chart) | 🟡 | Design inconsistentie |

---

### MISSING MODULES

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 8.1 | SCCT Self-Efficacy Scanner ontbreekt | 🔴 | Core module missing, -10 reliability pts |
| 8.2 | Daily Dilemmas implementatie onbekend | 🟡 | Kan niet verifiëren specs |

**SCCT:** Zie Critical Fix #2

**Daily Dilemmas specs:** `assessment_modules.md` lijn 770-932
- Check: 1 per dag, notification 19:00
- Check: +5 reliability per dilemma
- Check: Streak tracking
- Check: 30 scenario's in DB

---

### DESIGN TOKENS & STYLING

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 9.1 | Fonts mogelijk niet exact (Poppins/Inter) | 🟡 | Brand consistency |
| 9.2 | Colors niet exact (blue-500 vs blue-600) | 🟡 | Design drift |
| 9.3 | Coral accent color niet gebruikt | 🟡 | Minder visuele variatie |
| 9.4 | Secondary colors (purple/green/yellow) niet gebruikt | 🟢 | Gemiste opportunity |

**Specs:** `app_design_system.md` lijn 67-254

**Fix:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],  // Voor headings
        inter: ['Inter', 'sans-serif'],       // Voor body
      },
      colors: {
        blue: {
          500: '#4A90E2',  // PRIMAIR - gebruik deze
          // ... rest
        },
        coral: {
          500: '#FF6B6B',  // ACCENT - voor CTA's
        },
        purple: { 500: '#9B6DD6' },
        green: { 500: '#4ECDC4' },
        yellow: { 500: '#FFE66D' },
      }
    }
  }
}
```

---

### ANIMATIONS & MICROINTERACTIONS

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 10.1 | Scout float animation ontbreekt | 🔴 | Scout niet geïmplementeerd |
| 10.2 | Confetti celebration ontbreekt | 🟢 | Minder celebratory UX |
| 10.3 | Button press feedback onbekend | ⚠️ | Kan niet verifiëren |
| 10.4 | Haptic feedback onbekend | 🟢 | Enhancement |

**Specs:** `app_design_system.md` lijn 1682-1943

**Missing animations:**
```typescript
// 1. Scout float (continuous):
useScoutFloat() → translateY loop (-12px to 0) + rotate (-3° to 3°)

// 2. Confetti (on completion):
import ConfettiCannon from 'react-native-confetti-cannon'
<ConfettiCannon count={100} origin={{x: width/2, y: 0}} />

// 3. Button press:
scale: 1 → 0.96 on press → spring back to 1

// 4. Haptic (React Native):
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
```

---

### ACCESSIBILITY

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 11.1 | Alt text op images onbekend | 🟡 | A11y compliance |
| 11.2 | Touch targets mogelijk < 48px | 🟡 | Usability |
| 11.3 | WCAG contrast niet geaudit | 🟡 | A11y compliance |
| 11.4 | Reduced motion support onbekend | 🟢 | A11y enhancement |

**Specs:** `app_design_system.md` lijn 1947-2126

**Checklist:**
```typescript
// 1. Alt text
<img src={card.imageUrl} alt={`${card.title} - ${card.tagline}`} />

// 2. Touch targets
<button className="min-h-[48px] min-w-[48px]" />

// 3. Contrast
// Alle text/bg combos ≥ 4.5:1 ratio (WCAG AA)

// 4. Reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const duration = prefersReducedMotion ? 0 : 300
```

---

## 🎯 IMPLEMENTATION ROADMAP

### Sprint 1: Critical Fixes (Week 1-2)

**Focus:** Scout + SCCT + Data Loss Prevention

#### Week 1: Scout Implementation
- [ ] **Day 1-2:** Scout SVG Avatar component
  ```typescript
  // components/Scout/ScoutAvatar.tsx
  // 5 poses: neutral, happy, thinking, celebrating, encouraging
  // SVG eagle design volgens specs
  ```
- [ ] **Day 3:** Scout Container + Speech Bubble
  ```typescript
  // components/Scout/Scout.tsx
  // Floating animation
  // Speech bubble met tail
  ```
- [ ] **Day 4:** Scout State Management
  ```typescript
  // hooks/useScout.ts
  // Context-aware messages
  // Evolution logic (reliability-based)
  ```
- [ ] **Day 5:** Integrate Scout in alle assessment screens
  - Onboarding
  - VibeSwipe
  - PersonalityQuiz
  - WorkValuesDeep
  - HomeScreen

#### Week 2: SCCT + Auth Fix
- [ ] **Day 1-2:** SCCT Self-Efficacy Scanner
  ```typescript
  // components/modules/SCCTScanner.jsx
  // Skill extraction van top matches
  // 8-10 confidence sliders
  ```
- [ ] **Day 3:** Auth Placement Fix
  - Option A: Verplaats naar step 1
  - Option B: localStorage backup systeem
  ```typescript
  // utils/localStorageBackup.ts
  // Save assessment data voor anonymous users
  // Restore on auth
  ```
- [ ] **Day 4-5:** Testing + Bug Fixes

---

### Sprint 2: Content & Visual Polish (Week 3-4)

#### Week 3: RIASEC Cards Content
- [ ] **Day 1-2:** Collect/Create 60 card images
  - Professional photography OF
  - Illustrations (Midjourney/DALL-E)
  - Licentie check
- [ ] **Day 3:** Database schema update
  ```sql
  -- Add imageUrl + sectors to metadata
  UPDATE riasec_questions SET metadata = metadata ||
  '{"imageUrl": "...", "sectors": [...], "tagline": "..."}'
  ```
- [ ] **Day 4:** Update seed data script
- [ ] **Day 5:** Verify SwipeCard renders correctly

#### Week 4: UI/UX Alignment
- [ ] **Day 1:** Onboarding flow simplification
  - 4 slides → 2 slides
  - Add Scout intro
  - Add tijdsindicatie + pauzeer boodschap
- [ ] **Day 2:** Bottom Navigation fix
  - Test → Ontdek
  - Update icons (Compass, BarChart)
- [ ] **Day 3:** Early exit option bij 30 swipes
  ```jsx
  // Modal: "Genoeg voor nu! Wil je doorgaan?"
  // Optie A: "Bekijk resultaten"
  // Optie B: "Nog 30 doen"
  ```
- [ ] **Day 4-5:** Design tokens update
  - `tailwind.config.js` update
  - Font families (Poppins/Inter)
  - Color palette exact volgens specs

---

### Sprint 3: Enhancement & Polish (Week 5-6)

#### Week 5: Animations & Microinteractions
- [ ] Scout float animation
- [ ] Confetti celebrations
- [ ] Button press feedback
- [ ] Haptic feedback (if React Native)
- [ ] Page transition polish

#### Week 6: Accessibility & Testing
- [ ] Alt text audit + fixes
- [ ] Touch target audit (min 48px)
- [ ] WCAG contrast checker + fixes
- [ ] Reduced motion support
- [ ] Full user journey testing
- [ ] Bug bash

---

## 📝 COMPONENT IMPLEMENTATION GUIDES

### Scout Component (Full Implementation)

```typescript
// 1. components/Scout/ScoutAvatar.tsx
import { Svg, Path, Circle, G } from 'react-native-svg';

interface ScoutAvatarProps {
  pose: 'neutral' | 'happy' | 'thinking' | 'celebrating' | 'encouraging';
  size?: number;
  reliabilityScore?: number; // Voor evolution
}

export function ScoutAvatar({ pose, size = 60, reliabilityScore = 0 }: ScoutAvatarProps) {
  // Evolution logic
  const getEvolutionStage = () => {
    if (reliabilityScore < 25) return 'egg';      // 🥚
    if (reliabilityScore < 50) return 'chick';    // 🐣
    if (reliabilityScore < 75) return 'teen';     // 🦜
    return 'hawk';                                 // 🦅
  };

  const stage = getEvolutionStage();
  const poses = {
    // ... SVG paths voor elke pose/stage combo
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      {/* Render based on stage + pose */}
    </Svg>
  );
}

// 2. components/Scout/Scout.tsx
import { motion } from 'framer-motion';
import { ScoutAvatar } from './ScoutAvatar';
import { useScout } from '@/hooks/useScout';

export function Scout() {
  const { message, pose, visible, reliabilityScore } = useScout();

  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 z-50">
      {/* Avatar met float animation */}
      <motion.div
        animate={{
          y: [-12, 0, -12],
          rotate: [-3, 3, -3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <ScoutAvatar pose={pose} reliabilityScore={reliabilityScore} />
      </motion.div>

      {/* Speech Bubble */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute top-16 right-0 bg-white rounded-xl shadow-lg p-3 max-w-[200px]"
        >
          <p className="text-sm text-gray-800">{message}</p>
          {/* Bubble tail */}
          <div className="absolute -top-2 right-5 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-transparent border-b-white" />
        </motion.div>
      )}
    </div>
  );
}

// 3. hooks/useScout.ts
import { create } from 'zustand';

interface ScoutState {
  message: string | null;
  pose: 'neutral' | 'happy' | 'thinking' | 'celebrating' | 'encouraging';
  visible: boolean;
  reliabilityScore: number;

  say: (message: string, pose?: ScoutState['pose']) => void;
  hide: () => void;
  celebrate: () => void;
  setReliability: (score: number) => void;
}

export const useScout = create<ScoutState>((set) => ({
  message: null,
  pose: 'neutral',
  visible: true,
  reliabilityScore: 0,

  say: (message, pose = 'neutral') => {
    set({ message, pose, visible: true });
    setTimeout(() => set({ message: null, pose: 'neutral' }), 5000);
  },

  hide: () => set({ visible: false }),

  celebrate: () => {
    set({
      message: "Yes! Je hebt het voltooid! 🎉",
      pose: 'celebrating',
      visible: true
    });
  },

  setReliability: (score) => set({ reliabilityScore: score }),
}));

// 4. Context-aware messages (utils/scoutMessages.ts)
export const scoutMessages = {
  onboarding: {
    welcome: "Hey! Ik ben Scout 🦅",
    intro: "Leuk je te ontmoeten! Laten we samen je richting ontdekken.",
  },
  riasec: {
    start: "Swipe door beroepen - kies wat je leuk lijkt!",
    milestone_10: "Goed bezig! Nog 20 te gaan 🎯",
    milestone_20: "Nog 10 te gaan! Ik zie al een patroon 👀",
    complete: "Perfect! Je hebt genoeg voor eerste inzichten 🎉",
  },
  // ... etc (zie assessment_modules.md lijn 1636-1679)
};
```

---

### SCCT Scanner Implementation

```typescript
// components/modules/SCCTScanner.jsx
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { assessmentService } from '@/services/assessmentService';
import { Scout } from '@/components/Scout/Scout';
import { useScout } from '@/hooks/useScout';

export function SCCTScanner() {
  const { user, userScores } = useStore();
  const { say } = useScout();
  const [skills, setSkills] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 1. Fetch top matches based on RIASEC scores
    const fetchTopMatches = async () => {
      const matches = await assessmentService.getTopMatches(user.id, 10);

      // 2. Extract top skills from these matches
      const skillMap = {};
      matches.forEach(match => {
        match.top_skills?.forEach(skill => {
          skillMap[skill.name] = (skillMap[skill.name] || 0) + 1;
        });
      });

      // 3. Sort by frequency, take top 8-10
      const topSkills = Object.entries(skillMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name]) => name);

      setSkills(topSkills);
      say("Laten we je zelfvertrouwen meten 💡", 'happy');
    };

    fetchTopMatches();
  }, []);

  const handleAnswer = (skill, confidence) => {
    setAnswers(prev => ({ ...prev, [skill]: confidence }));

    if (currentIndex < skills.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishSCCT({ ...answers, [skill]: confidence });
    }
  };

  const finishSCCT = async (finalAnswers) => {
    // Save to DB
    await assessmentService.saveSelfEfficacy(user.id, finalAnswers);

    // Update reliability
    useStore.getState().updateReliability(10);

    say("Super! Nu kan ik je leer-curve inschatten 📈", 'celebrating');

    setTimeout(() => {
      useStore.getState().setStep(5); // Go to Results
    }, 2000);
  };

  const currentSkill = skills[currentIndex];

  return (
    <div className="max-w-md mx-auto p-6">
      <Scout />

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Zelfvertrouwen</h2>
        <p className="text-gray-600">Vraag {currentIndex + 1} van {skills.length}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="text-4xl mb-4 text-center">
          {getSkillIcon(currentSkill)}
        </div>

        <h3 className="text-xl font-bold mb-2 text-center">
          {currentSkill}
        </h3>

        <p className="text-sm text-gray-500 mb-6 text-center">
          {getSkillDescription(currentSkill)}
        </p>

        <div className="mb-2 text-sm text-gray-600 text-center">
          Hoe zeker ben je van je kunnen?
        </div>

        {/* Slider 1-10 */}
        <input
          type="range"
          min="1"
          max="10"
          value={answers[currentSkill] || 5}
          onChange={(e) => handleAnswer(currentSkill, parseInt(e.target.value))}
          className="w-full"
        />

        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>😰 Helemaal niet</span>
          <span>{answers[currentSkill] || 5}/10</span>
          <span>😎 Heel zeker</span>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center italic">
          ℹ️ Geen ervaring? Schat in hoe makkelijk je denkt te leren
        </p>
      </div>
    </div>
  );
}

function getSkillIcon(skill: string) {
  const icons = {
    'Programming': '💻',
    'Critical Thinking': '🧠',
    'Design': '🎨',
    'Communication': '🗣️',
    // ... etc
  };
  return icons[skill] || '💡';
}

function getSkillDescription(skill: string) {
  const descriptions = {
    'Programming': 'Code schrijven en debuggen',
    'Critical Thinking': 'Problemen analyseren en oplossen',
    // ... etc
  };
  return descriptions[skill] || skill;
}
```

---

## 🔍 VERIFICATION CHECKLIST

### Pre-Implementation Verification

Voordat je begint met fixes, verifieer eerst deze onbekende componenten:

- [ ] **Lees:** `src/components/assessments/SwipeCard.jsx`
  - Check: Swipe indicators ✓/✗ aanwezig?
  - Check: Image rendering
  - Check: Sector tags rendering

- [ ] **Lees:** `src/components/assessments/LikertScale.jsx`
  - Check: Emoji's bij slider (😐 → 😊)?
  - Check: 5-punt schaal correct?

- [ ] **Lees:** `src/components/modules/WorkValuesDeepModule.jsx`
  - Check: 6 waarden met emoji's?
  - Check: Sliders 1-10?
  - Check: Start positie = 5?

- [ ] **Lees:** `src/components/modules/DailyBooster.jsx`
  - Check: Daily dilemma's conform specs?
  - Check: Notification systeem?
  - Check: Streak tracking?

- [ ] **Check:** `tailwind.config.js`
  - Font families correct?
  - Color tokens exact zoals specs?

---

## 📊 TESTING PLAN

### Unit Tests (Week 6)

```typescript
// tests/Scout.test.tsx
describe('Scout Component', () => {
  it('renders correct evolution stage based on reliability', () => {
    const { rerender } = render(<ScoutAvatar reliabilityScore={10} />);
    expect(screen.getByTestId('scout-stage')).toHaveTextContent('egg');

    rerender(<ScoutAvatar reliabilityScore={60} />);
    expect(screen.getByTestId('scout-stage')).toHaveTextContent('teen');
  });

  it('displays context-aware messages', () => {
    const { say } = useScout();
    say(scoutMessages.riasec.milestone_10, 'happy');
    expect(screen.getByText(/Goed bezig/)).toBeInTheDocument();
  });
});

// tests/SCCT.test.tsx
describe('SCCT Scanner', () => {
  it('extracts top skills from matches', async () => {
    const mockMatches = [/* ... */];
    const skills = await extractTopSkills(mockMatches);
    expect(skills).toHaveLength(10);
  });

  it('saves self-efficacy scores to DB', async () => {
    const answers = { 'Programming': 8, 'Design': 6 };
    await assessmentService.saveSelfEfficacy('user-id', answers);
    // Verify DB save
  });
});
```

### Integration Tests

```typescript
// tests/e2e/journey.test.tsx
describe('Complete Assessment Journey', () => {
  it('completes full flow: Onboarding → Auth → RIASEC → Big5 → Values → SCCT → Results', async () => {
    // 1. Start at onboarding
    render(<App />);
    expect(screen.getByText(/Welkom bij Richting/)).toBeInTheDocument();

    // 2. Click through to Auth (now step 1)
    fireEvent.click(screen.getByText(/Start/));
    expect(screen.getByText(/Inloggen/)).toBeInTheDocument();

    // 3. Login
    // ... auth flow

    // 4. RIASEC (30 swipes)
    for (let i = 0; i < 30; i++) {
      fireEvent.click(screen.getByTestId('swipe-right'));
    }

    // 5. Verify early exit modal appears
    expect(screen.getByText(/Genoeg voor nu!/)).toBeInTheDocument();

    // 6. Continue to Big5
    // ... etc

    // 7. Verify final reliability score = 80
    expect(useStore.getState().reliabilityScore).toBe(80);
  });
});
```

### Manual Testing Checklist

- [ ] **Scout Evolution Visual Check**
  - Start app → Scout is 🥚 (egg)
  - Complete RIASEC → Scout becomes 🐣 (chick)
  - Complete Big5 → Scout becomes 🦜 (teen bird)
  - Complete all → Scout becomes 🦅 (hawk)

- [ ] **RIASEC Cards Visual Check**
  - All 60 cards have images
  - Sector tags visible
  - Swipe indicators appear on drag

- [ ] **Responsive Design Check**
  - Test on iPhone SE (small)
  - Test on iPhone 14 Pro (medium)
  - Test on iPad (tablet)
  - Test on desktop (web version)

- [ ] **Accessibility Check**
  - VoiceOver (iOS) / TalkBack (Android) test
  - Keyboard navigation (web)
  - Color contrast validator
  - Touch target size validator

---

## 💰 ESTIMATED EFFORT

### Development Hours

| Task Category | Hours | Developer |
|---------------|-------|-----------|
| Scout Component Implementation | 24h | Frontend |
| SCCT Scanner Module | 16h | Frontend + Backend |
| Auth Placement Fix | 8h | Backend + Frontend |
| RIASEC Cards Content | 16h | Content + Frontend |
| Bottom Nav + UI Fixes | 8h | Frontend |
| Design Tokens Update | 4h | Frontend |
| Animations & Polish | 16h | Frontend |
| Accessibility Audit & Fixes | 12h | Frontend |
| Testing (Unit + E2E) | 16h | QA + Frontend |
| **TOTAL** | **120h** | ~3 weeks (1 developer) |

### Content Creation Hours

| Task | Hours | Role |
|------|-------|------|
| 60 RIASEC Card Images | 12h | Designer/Photographer |
| Scout SVG Illustrations (5 poses × 4 stages) | 16h | Illustrator |
| Daily Dilemma Scenarios (30) | 8h | Content Writer |
| **TOTAL** | **36h** | ~1 week |

---

## 🎓 BEST PRACTICES LEARNED

### 1. Design System Compliance
- **Lesson:** Small deviations accumulate into major inconsistencies
- **Action:** Always refer back to design system before implementing components
- **Tool:** Create design system checklist for each component

### 2. Content-First Development
- **Lesson:** Building UI before having content (images, copy) leads to placeholders
- **Action:** Finalize content BEFORE building components
- **Example:** RIASEC cards should have had 60 images ready before SwipeCard implementation

### 3. Mascot as Core Brand Element
- **Lesson:** Scout is mentioned 100+ times in specs but was deprioritized in implementation
- **Action:** Core brand elements should be implemented FIRST, not last
- **Impact:** Scout would have improved user engagement from day 1

### 4. Auth Placement Matters
- **Lesson:** Asking for auth AFTER 30 minutes of work = high dropout risk
- **Action:** Early auth (with social login) OR localStorage backup for anonymous sessions
- **Best Practice:** "Save early, save often"

### 5. Modular Assessment Design
- **Lesson:** Each assessment module has unique UI but shared patterns (progress, Scout, completion)
- **Action:** Create reusable assessment wrapper component
- **Example:**
  ```jsx
  <AssessmentWrapper
    title="RIASEC Swipe"
    progress={swipeCount}
    total={60}
    scoutMessages={scoutMessages.riasec}
  >
    <SwipeCards />
  </AssessmentWrapper>
  ```

---

## 📚 ADDITIONAL RESOURCES

### Design System Deep Dives
- **Typography System:** `app_design_system.md` lijn 155-254
- **Color Palette:** `app_design_system.md` lijn 67-151
- **Component Library:** `app_design_system.md` lijn 335-1013
- **Animation Specs:** `app_design_system.md` lijn 1682-1943
- **Accessibility:** `app_design_system.md` lijn 1947-2126

### Assessment Module Specs
- **Complete Journey:** `assessment_modules.md` lijn 20-40
- **RIASEC Details:** `assessment_modules.md` lijn 53-272
- **Big Five Details:** `assessment_modules.md` lijn 275-461
- **Work Values Details:** `assessment_modules.md` lijn 464-610
- **SCCT Details:** `assessment_modules.md` lijn 612-768
- **Daily Dilemmas:** `assessment_modules.md` lijn 770-932
- **Scout Integration:** `assessment_modules.md` lijn 1093-1166

### External References
- **RIASEC Theory:** Holland's Career Codes
- **Big Five:** OCEAN Personality Model
- **SCCT:** Social Cognitive Career Theory (Bandura)
- **Work Values:** Super's Work Values Inventory

---

## ✅ FINAL CHECKLIST

### Before Starting Development
- [ ] Review this entire document with team
- [ ] Prioritize fixes (Critical → Medium → Low)
- [ ] Verify unknown components (SwipeCard, LikertScale, WorkValues, DailyBooster)
- [ ] Set up design system reference (keep docs open)
- [ ] Create Figma/design files for Scout (if not exist)

### During Development
- [ ] Check off items from Implementation Roadmap
- [ ] Daily standup: compare progress vs specs
- [ ] Weekly design review: verify alignment
- [ ] Continuous testing: don't wait for end

### Before Launch
- [ ] Complete all 🔴 Critical fixes
- [ ] Complete 80%+ of 🟡 Medium fixes
- [ ] Full user journey test (manual)
- [ ] Accessibility audit WCAG AA
- [ ] Performance check (load times, animations)
- [ ] Analytics setup (track dropout points)

---

## 📞 CONTACT & QUESTIONS

Voor vragen over deze analyse:
- **Technical Lead:** [naam]
- **Design Lead:** [naam]
- **Product Owner:** [naam]

Voor implementatie hulp:
- **Scout Component:** Zie lijn 891-982 van dit document
- **SCCT Scanner:** Zie lijn 984-1141 van dit document
- **Algemene vragen:** Tag @claude in project channel

---

**Document versie:** 1.0
**Laatste update:** 7 februari 2026
**Volgende review:** Na Sprint 1 completion (Week 2)

---

END OF ANALYSIS DOCUMENT
