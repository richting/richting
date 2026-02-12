/**
 * Scout Messages - Context-Aware Guidance
 *
 * All Scout messages organized by module/context.
 * Based on assessment_modules.md specifications (lijn 1636-1679)
 *
 * Usage:
 * import { scoutMessages } from '@/utils/scoutMessages';
 * const { say } = useScout();
 * say(scoutMessages.riasec.start, "happy");
 */

export const scoutMessages = {
  // ===== ONBOARDING =====
  onboarding: {
    welcome: "Hey! Ik ben Scout 🦅",
    intro: "Leuk je te ontmoeten! Laten we samen je richting ontdekken.",
    letsDo: "Klaar om te beginnen? Dit wordt leuk!",
    timeInfo: "Dit duurt ongeveer 30-40 minuten. Je kunt altijd pauzeren.",
  },

  // ===== RIASEC SWIPE GAME =====
  riasec: {
    start: "Swipe door beroepen - kies wat je leuk lijkt!",
    startAlt: "Ga op je buikgevoel af! Geen goed of fout.",
    milestone_5: "Goed bezig! Ga op je gevoel af 🚀",
    milestone_10: "Goed bezig! Nog 20 te gaan 🎯",
    milestone_15: "Ik begin een patroon te zien... 👀",
    milestone_20: "Nog 10 te gaan voor je eerste profiel! 🏁",
    milestone_25: "Bijna daar! Je doet het geweldig! 💪",
    milestone_30: "Yes! Je hebt genoeg geswipet! 🎉",
    milestone_40: "Bonus punten! Hoe meer, hoe beter 💪",
    milestone_50: "Wow! Dit helpt echt voor betere matches 🌟",
    milestone_60: "Perfectionist! Je profiel is super betrouwbaar nu! 🏆",
    encouragement: [
      "Lekker bezig!",
      "Ga zo door!",
      "Interessant!",
      "Top!",
      "Mooi zo!",
      "Perfect!",
    ],
    earlyExit: "Genoeg voor nu! Of wil je doorgaan voor nog betere matches?",
  },

  // ===== BIG FIVE PERSONALITY TEST =====
  bigFive: {
    start: "Tijd om te kijken hoe jij werkt! 💭",
    startAlt: "25 vragen over hoe je meestal bent. Er zijn geen goede antwoorden.",
    question_5: "Interessant! Ik leer je steeds beter kennen 🦅",
    question_10: "Halverwege! Je doet het goed 💪",
    question_15: "Nog 10 vragen! We zijn er bijna 🎯",
    question_20: "Laatste 5! Denk goed na 🧠",
    difficult: "Lastige vraag? Denk aan hoe je meestal bent.",
    complete: "Wow! Ik begrijp je nu veel beter 🎉",
    completeAlt: "Bedankt! Ik heb je profiel bijgewerkt 🎉",
  },

  // ===== WORK VALUES =====
  values: {
    start: "Wat maakt werk leuk voor jou? 🎯",
    startAlt: "6 sliders - sleep naar wat bij jou past.",
    noRightAnswer: "Geen goed of fout - puur jouw voorkeuren.",
    halfway: "Halfway! Denk goed na over wat echt belangrijk is.",
    complete: "Perfect! Nu weet ik wat jou motiveert 💪",
    completeAlt: "Top! Dit helpt bij het vinden van de juiste matches 🎯",
  },

  // ===== SCCT SELF-EFFICACY =====
  scct: {
    start: "Laten we je zelfvertrouwen meten 💡",
    startAlt: "Hoe zeker ben je van verschillende vaardigheden?",
    encouraging: "Geloof in jezelf! Je kunt meer dan je denkt 💪",
    noExperience: "Geen ervaring? Geen probleem! Schat in hoe makkelijk je denkt te leren.",
    halfway: "Je doet het goed! Nog een paar skills te gaan.",
    complete: "Super! Nu kan ik je leer-curve inschatten 📈",
    completeAlt: "Mooi! Dit geeft me inzicht in waar je kunt groeien 🌱",
  },

  // ===== RESULTS =====
  results: {
    reveal: "Trots op je! Kijk wat we ontdekt hebben 🎯",
    revealAlt: "Hier zijn je matches! Dit is gebaseerd op alles wat we geleerd hebben.",
    directMatch: "Dit is een perfecte match voor jou! 🎯",
    growthPotential: "Dit kun je leren - flinke groeikansen! 🌱",
    exploreMore: "Wil je meer weten? Klik op een match voor details!",
    highReliability: "Je profiel is {score}% betrouwbaar - dat is geweldig! 🏆",
    mediumReliability: "Je profiel is {score}% betrouwbaar. Meer tests = betere matches!",
    lowReliability: "Doe meer tests voor betrouwbaardere matches! Nog maar {score}%.",
  },

  // ===== DAILY DILEMMAS =====
  dilemma: {
    daily: "Nieuwe vraag! Wat zou jij doen? 💭",
    dailyAlt: "Daily Boost tijd! Een kleine vraag voor je profiel.",
    thanks: "Thanks! Ik leer je steeds beter kennen 🦅",
    streak_3: "3 dagen streak! Keep it up! 🔥",
    streak_7: "7 dagen streak! Je bent top! 🔥🔥",
    streak_14: "2 weken! Ongelofelijk! 🏆",
    streak_30: "30 dagen! Je bent een legende! 👑",
  },

  // ===== HOME SCREEN =====
  home: {
    welcome: "Welkom terug! Klaar voor je volgende stap? 🦅",
    welcomeBack: "Hey! Fijn dat je er weer bent!",
    checkProgress: "Bekijk je voortgang en ontdek nieuwe matches!",
    nextMission: "Je volgende missie staat klaar! 🎯",
    almostThere: "Nog {count} test(s) voor 100% betrouwbaarheid!",
    perfectScore: "Je hebt 100% betrouwbaarheid! Geweldig werk! 🏆",
  },

  // ===== MATCHES SCREEN =====
  matches: {
    intro: "Dit zijn jouw beste matches! 🎯",
    introAlt: "Beroepen die perfect bij jou passen, gebaseerd op je profiel.",
    topMatch: "Je #1 match! Dit past echt bij je 🌟",
    explore: "Klik op een match om meer te leren!",
    moreTests: "Doe meer tests voor nog betere matches!",
    locked: "Unlock meer matches door tests te voltooien! 🔒",
  },

  // ===== TEST HUB =====
  testHub: {
    welcome: "Welkom in de Test Hub! 🧠",
    welcomeAlt: "Kies een test om je profiel te verbeteren.",
    recommended: "Ik raad deze aan voor jou! 💡",
    completed: "Deze heb je al gedaan! ✅",
    locked: "Doe eerst andere tests om deze te unlocken! 🔒",
  },

  // ===== PROFILE SCREEN =====
  profile: {
    overview: "Dit ben jij! Je unieke profiel 🦅",
    overviewAlt: "Zo zie ik jou. Best cool, toch?",
    riasec: "Jouw RIASEC profiel laat je interesses zien 🎯",
    personality: "Jouw Big Five persoonlijkheid 🧠",
    values: "Wat jou motiveert in werk 💪",
    growth: "Je groei-areas - waar je kunt leren! 🌱",
  },

  // ===== ENCOURAGING MESSAGES (Random pick) =====
  encouragement: {
    general: [
      "Je doet het geweldig! 🌟",
      "Keep going! 💪",
      "Ik geloof in je! 🦅",
      "Fantastisch bezig! 🎯",
      "Je leert jezelf goed kennen! 🧠",
      "Dit is waardevol! 💎",
    ],
    struggle: [
      "Twijfel je? Dat is oké! Ga op je gevoel af.",
      "Moeilijk? Denk aan hoe je meestal bent.",
      "Neem je tijd. Er is geen haast.",
      "Geen stress - dit is voor jezelf!",
    ],
  },

  // ===== ERROR / FALLBACK =====
  error: {
    oops: "Oeps! Er ging iets mis 🙈",
    tryAgain: "Probeer het nog eens? Ik help je!",
    contact: "Lukt het niet? Laat het ons weten!",
  },

  // ===== CELEBRATION MESSAGES =====
  celebration: {
    firstTest: "Je eerste test voltooid! Zo begint het! 🎉",
    halfwayReliability: "50% betrouwbaarheid! We zijn halfway! 🎯",
    highReliability: "75% betrouwbaarheid! Bijna perfect! 🏆",
    perfectReliability: "100% betrouwbaarheid! JE BENT EEN LEGENDE! 👑",
    allTestsDone: "Alle tests gedaan! Je profiel is compleet! 🌟",
  },
};

/**
 * Get a random encouragement message
 * @param {string} type - "general" or "struggle"
 * @returns {string}
 */
export function getRandomEncouragement(type = 'general') {
  const messages = scoutMessages.encouragement[type];
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Get a random RIASEC encouragement
 * @returns {string}
 */
export function getRandomRiasecEncouragement() {
  const messages = scoutMessages.riasec.encouragement;
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Get reliability-based message
 * @param {number} score - Reliability score (0-100)
 * @returns {string}
 */
export function getReliabilityMessage(score) {
  if (score >= 90) {
    return scoutMessages.results.highReliability.replace('{score}', score);
  } else if (score >= 50) {
    return scoutMessages.results.mediumReliability.replace('{score}', score);
  } else {
    return scoutMessages.results.lowReliability.replace('{score}', score);
  }
}

/**
 * Get streak message based on count
 * @param {number} days - Consecutive days
 * @returns {string}
 */
export function getStreakMessage(days) {
  if (days >= 30) return scoutMessages.dilemma.streak_30;
  if (days >= 14) return scoutMessages.dilemma.streak_14;
  if (days >= 7) return scoutMessages.dilemma.streak_7;
  if (days >= 3) return scoutMessages.dilemma.streak_3;
  return scoutMessages.dilemma.thanks;
}

export default scoutMessages;
