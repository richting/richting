import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const DilemmaSlider = ({ onComplete, userValues, setUserValues }) => {
  const dilemmas = [
    {
      id: 'security',
      leftLabel: 'Zekerheid & Stabiliteit',
      rightLabel: 'Avontuur & Risico',
      leftIcon: '🛡️',
      rightIcon: '🎲',
      question: 'Wat spreekt jou meer aan?'
    },
    {
      id: 'creativity',
      leftLabel: 'Vaste Structuur',
      rightLabel: 'Creatieve Vrijheid',
      leftIcon: '📐',
      rightIcon: '🎨',
      question: 'Hoe werk je het liefst?'
    },
    {
      id: 'autonomy',
      leftLabel: 'Teamwork',
      rightLabel: 'Zelfstandig Werken',
      leftIcon: '👥',
      rightIcon: '🧘',
      question: 'Wat geeft jou meer energie?'
    },
    {
      id: 'team',
      leftLabel: 'Individuele Prestatie',
      rightLabel: 'Teamimpact',
      leftIcon: '🏆',
      rightIcon: '🤝',
      question: 'Waar word je trots van?'
    },
    {
      id: 'dynamic',
      leftLabel: 'Voorspelbare Routine',
      rightLabel: 'Dynamische Omgeving',
      leftIcon: '📅',
      rightIcon: '⚡',
      question: 'Wat is jouw ideale werkdag?'
    }
  ];

  const handleSliderChange = (id, value) => {
    setUserValues(prev => ({
      ...prev,
      [id]: parseInt(value)
    }));
  };

  const canProceed = Object.values(userValues).every(v => v > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-secondary to-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4 font-display">
            Wat vind jij belangrijk?
          </h2>
          <p className="text-light/70 text-lg">
            Deze keuzes helpen ons je perfecte match te vinden
          </p>
        </div>

        {/* Dilemmas */}
        <div className="space-y-8 mb-12">
          {dilemmas.map((dilemma, index) => (
            <motion.div
              key={dilemma.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-white text-xl font-semibold mb-6 text-center">
                {dilemma.question}
              </h3>

              <div className="flex items-center gap-4">
                {/* Left Label */}
                <div className="flex-1 text-right">
                  <div className="text-3xl mb-2">{dilemma.leftIcon}</div>
                  <p className="text-white/70 text-sm font-medium">
                    {dilemma.leftLabel}
                  </p>
                </div>

                {/* Slider */}
                <div className="flex-1 px-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={userValues[dilemma.id]}
                    onChange={(e) => handleSliderChange(dilemma.id, e.target.value)}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, 
                        #FF6B35 0%, 
                        #FF6B35 ${(userValues[dilemma.id] - 1) * 11.11}%, 
                        rgba(255,255,255,0.2) ${(userValues[dilemma.id] - 1) * 11.11}%, 
                        rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <div className="text-center mt-2">
                    <span className="text-primary font-bold text-lg">
                      {userValues[dilemma.id]}
                    </span>
                    <span className="text-white/50 text-sm"> / 10</span>
                  </div>
                </div>

                {/* Right Label */}
                <div className="flex-1 text-left">
                  <div className="text-3xl mb-2">{dilemma.rightIcon}</div>
                  <p className="text-white/70 text-sm font-medium">
                    {dilemma.rightLabel}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            disabled={!canProceed}
            className={`px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 mx-auto transition-all ${
              canProceed
                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            Bekijk mijn matches <ArrowRight className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default DilemmaSlider;
