import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import Scout from '../ui/Scout';
import { useScout } from '../../hooks/useScout';

// Skill configuration - in a real app this might come from the DB or an API
const TOP_SKILLS_MOCK = [
  { id: 'critical_thinking', name: 'Kritisch Denken', icon: '🧠', description: 'Problemen analyseren en oplossen' },
  { id: 'active_listening', name: 'Actief Luisteren', icon: '👂', description: 'Aandacht geven aan wat anderen zeggen' },
  { id: 'complex_problem_solving', name: 'Probleem Oplossen', icon: '🧩', description: 'Complexe vraagstukken aanpakken' },
  { id: 'social_perceptiveness', name: 'Sociale Antenne', icon: '📡', description: 'Aanvoelen hoe anderen reageren' },
  { id: 'speaking', name: 'Spreken', icon: '🗣️', description: 'Effectief informatie overbrengen' },
  { id: 'writing', name: 'Schrijven', icon: '✍️', description: 'Duidelijk communiceren op papier' },
  { id: 'judgment', name: 'Oordeelsvorming', icon: '⚖️', description: 'Kosten en baten afwegen' },
  { id: 'negotiation', name: 'Onderhandelen', icon: '🤝', description: 'Verschillen overbruggen' }
];

const SCCTScanner = () => {
  const { user, nextStep, setSelfEfficacy, updateReliability } = useStore();
  const { say } = useScout();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // In a real implementation, we would fetch the user's "Top Skills" based on their
  // RIASEC matches here. for now, we use a static high-value skill list.
  const [skills, setSkills] = useState(TOP_SKILLS_MOCK);

  useEffect(() => {
    // Intro message
    say("Laten we je zelfvertrouwen meten! 💡", 'happy');
  }, [say]);

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value);
    setAnswers({
      ...answers,
      [skills[currentIndex].id]: val
    });
  };

  const handleNext = () => {
    // Save current answer
    const currentSkillId = skills[currentIndex].id;
    const currentVal = answers[currentSkillId] || 5;

    const newAnswers = { ...answers, [currentSkillId]: currentVal };
    setAnswers(newAnswers);

    if (currentIndex < skills.length - 1) {
      setCurrentIndex(prev => prev + 1);
      // Occasional encouragement
      if (currentIndex === 2) {
        say("Je kent jezelf goed! Ga zo door 🚀", 'encouraging');
      }
    } else {
      finishModule(newAnswers);
    }
  };

  const finishModule = (finalAnswers) => {
    say("Super! Nu kan ik je leer-curve inschatten 📈", 'celebrating');

    // Save to store/DB
    setSelfEfficacy(finalAnswers);

    // Update reliability score (+10 points for this module)
    updateReliability('scct_efficacy', 10);

    // Allow animation to play
    setTimeout(() => {
      nextStep(); // Proceed to Results/Auth
    }, 2000);
  };

  const currentSkill = skills[currentIndex];
  const currentVal = answers[currentSkill.id] || 5;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 max-w-md mx-auto">
      <Scout />

      <div className="w-full mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-400">
            Vraag {currentIndex + 1} / {skills.length}
          </span>
          <span className="text-sm font-bold text-blue-600">
            {Math.round(((currentIndex) / skills.length) * 100)}%
          </span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex) / skills.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white p-8 rounded-3xl shadow-xl w-full text-center border border-gray-100"
        >
          <div className="text-6xl mb-6">{currentSkill.icon}</div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentSkill.name}
          </h2>

          <p className="text-gray-500 mb-8">
            {currentSkill.description}
          </p>

          <div className="mb-2 text-sm font-medium text-gray-700">
            Hoe zeker ben je dat je dit kunt?
          </div>

          <div className="relative mb-8 pt-6">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={currentVal}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between mt-4 text-xs font-medium text-gray-400">
              <span>😰 Onzeker</span>
              <span className="text-blue-600 font-bold text-base">{currentVal}/10</span>
              <span>😎 Expert</span>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all transform active:scale-95"
          >
            {currentIndex === skills.length - 1 ? 'Afronden' : 'Volgende'}
          </button>
        </motion.div>
      </AnimatePresence>

      <p className="mt-8 text-xs text-gray-400 text-center max-w-xs">
        Tip: Als je geen ervaring hebt, schat dan in hoe makkelijk je het zou leren.
      </p>
    </div>
  );
};

export default SCCTScanner;
