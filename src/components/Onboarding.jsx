import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Target, TrendingUp } from 'lucide-react';

const Onboarding = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-secondary to-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl text-center"
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl"
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl md:text-7xl font-bold text-white mb-6 font-display"
        >
          Richting
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-light/80 mb-12 leading-relaxed"
        >
          Ontdek welke carrière echt bij <span className="text-primary font-semibold">jou</span> past.<br />
          Gebaseerd op wetenschappelijke modellen, niet op dagelijkse hobby's.
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <Target className="w-10 h-10 text-primary mb-3 mx-auto" />
            <h3 className="text-white font-semibold mb-2">RIASEC Model</h3>
            <p className="text-light/60 text-sm">
              Wetenschappelijk bewezen interesse-matching
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <Sparkles className="w-10 h-10 text-accent mb-3 mx-auto" />
            <h3 className="text-white font-semibold mb-2">Persoonlijke Waarden</h3>
            <p className="text-light/60 text-sm">
              Gebaseerd op Schwartz Theory
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <TrendingUp className="w-10 h-10 text-primary mb-3 mx-auto" />
            <h3 className="text-white font-semibold mb-2">30+ Beroepen</h3>
            <p className="text-light/60 text-sm">
              Nauwkeurige matching met O*NET data
            </p>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-10 py-5 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-lg flex items-center gap-3 mx-auto shadow-2xl"
        >
          Start de test <ArrowRight className="w-6 h-6" />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-light/40 text-sm mt-8"
        >
          Duurt ongeveer 5 minuten
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Onboarding;
