# Richting - Carrière Keuze Tool

Een moderne web-applicatie die eindexamenkandidaten en studenten helpt bij het maken van carrièrekeuzes op basis van wetenschappelijke modellen.

## 🎯 Functionaliteit

### Theoretische Basis
1. **RIASEC-model (Holland Codes)**: Voor interesse-matching
2. **Schwartz Theory of Basic Values**: Voor cultuur- en werkwaarde-matching
3. **O*NET Database Logica**: 30 beroepen met RIASEC-vectoren

### Features
- **Vibe Swipe Module**: Tinder-achtige interface met 20 kaarten voor RIASEC-assessment
- **Dilemma Slider Module**: 5 horizontale sliders voor werkwaarden
- **Matching Engine**: Cosine similarity berekening tussen gebruikersprofiel en beroepen
- **Resultaten Dashboard**: Radar chart + Top 5 carrière matches met studie-adviezen

## 🛠️ Tech Stack

- **React** (via Vite) - UI framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animaties en swipe-interacties
- **Lucide React** - Iconen

## 📁 Project Structuur

```
richting/
├── src/
│   ├── components/
│   │   ├── Card.jsx              # Swipe kaart component
│   │   ├── SwipeGame.jsx         # RIASEC swipe interface
│   │   ├── DilemmaSlider.jsx     # Waarden assessment
│   │   ├── Dashboard.jsx         # Resultaten weergave
│   │   └── Onboarding.jsx        # Welkomstscherm
│   ├── data/
│   │   ├── careersData.js        # 30 beroepen met RIASEC vectors
│   │   └── swipeCards.js         # 20 activiteiten voor assessment
│   ├── utils/
│   │   └── matchingEngine.js    # Algoritmes voor matching
│   ├── App.jsx                   # Hoofdcomponent met state
│   ├── App.css                   # Styling
│   └── main.jsx                  # Entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚀 Installatie & Gebruik

```bash
# Installeer dependencies
npm install

# Start development server
npm run dev

# Build voor productie
npm run build

# Preview productie build
npm run preview
```

## 🎨 Design Kenmerken

- **Modern en minimalistisch**: Gradient achtergronden, glasmorphism effects
- **Toegankelijk voor jongeren**: Emoji's, duidelijke visuele feedback
- **Soepele animaties**: Framer Motion voor swipe-interacties
- **Responsive**: Werkt op desktop, tablet en mobiel

## 📊 RIASEC Dimensies

- **R** (Realistic): Praktisch, technisch werk
- **I** (Investigative): Analytisch, onderzoeksgericht
- **A** (Artistic): Creatief, expressief
- **S** (Social): Helpend, begeleidend
- **E** (Enterprising): Leidend, ondernemend
- **C** (Conventional): Georganiseerd, gedetailleerd

## 🔄 User Flow

1. **Onboarding**: Introductie en uitleg
2. **Vibe Swipe**: 20 kaarten swipen (links/rechts)
3. **Dilemma Sliders**: 5 werkwaarden bepalen
4. **Resultaten**: Radar chart + Top 5 carrière matches

## 📈 Matching Algoritme

Het matching algoritme gebruikt:
1. **Normalisatie** van user scores naar 0-1 vector
2. **Cosine Similarity** tussen user en carrière vectoren
3. **Value Fit Bonus** (+10% voor matching waarden)
4. **Ranking** op basis van totale score

## 🎓 Voorbeelden van Carrières

De dataset bevat onder andere:
- Data Scientist
- Software Engineer
- Verpleegkundige
- Architect
- Marketing Manager
- Psycholoog
- Game Developer
- En 23 andere beroepen...

## 📝 Licentie

Dit project is ontwikkeld als demonstratie van een carrière-keuze tool.
