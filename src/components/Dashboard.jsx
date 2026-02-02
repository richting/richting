import { motion } from 'framer-motion';
import { TrendingUp, BookOpen, RotateCcw, Sparkles } from 'lucide-react';
import { matchCareers, getRIASECProfile, normalizeScores } from '../utils/matchingEngine';
import { careersData } from '../data/careersData';

const Dashboard = ({ userScores, userValues, onRestart }) => {
  const matches = matchCareers(userScores, userValues, careersData);
  const topMatches = matches.slice(0, 5);
  const profile = getRIASECProfile(userScores);
  const normalized = normalizeScores(userScores);

  // Radar Chart SVG
  const RadarChart = () => {
    const size = 300;
    const center = size / 2;
    const radius = size / 2 - 40;
    const dimensions = ['R', 'I', 'A', 'S', 'E', 'C'];
    const labels = {
      R: 'Realistisch',
      I: 'Intellectueel',
      A: 'Artistiek',
      S: 'Sociaal',
      E: 'Ondernemend',
      C: 'Conventioneel'
    };

    const getPoint = (value, index) => {
      const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
      const r = radius * value;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle)
      };
    };

    const points = dimensions.map((dim, i) => getPoint(normalized[dim], i));
    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

    return (
      <svg width={size} height={size} className="mx-auto">
        {/* Grid circles */}
        {gridLevels.map((level, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius * level}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {dimensions.map((dim, i) => {
          const endPoint = getPoint(1, i);
          return (
            <line
              key={dim}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <motion.path
          d={pathData}
          fill="rgba(255, 107, 53, 0.3)"
          stroke="#FF6B35"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Data points */}
        {points.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="6"
            fill="#FF6B35"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          />
        ))}

        {/* Labels */}
        {dimensions.map((dim, i) => {
          const labelPoint = getPoint(1.15, i);
          return (
            <text
              key={dim}
              x={labelPoint.x}
              y={labelPoint.y}
              fill="white"
              fontSize="14"
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {labels[dim]}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-secondary to-dark p-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">Jouw Resultaten</span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 font-display">
            Dit ben jij
          </h1>
          <p className="text-xl text-light/70">
            Jouw profiel: <span className="text-primary font-semibold">{profile}</span>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Jouw RIASEC Profiel
            </h2>
            <RadarChart />
            
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
              {Object.entries(normalized).map(([key, value]) => (
                <div key={key} className="bg-white/5 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 font-medium">{key}</span>
                    <span className="text-primary font-bold">
                      {Math.round(value * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Match Highlight */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 text-white flex flex-col justify-center"
          >
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-3xl font-bold mb-2">Perfect Match!</h3>
            <h2 className="text-5xl font-bold mb-4 font-display">
              {topMatches[0].title}
            </h2>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6" />
              <span className="text-2xl font-bold">{topMatches[0].matchPercentage}% match</span>
            </div>
            <div className="space-y-2">
              <p className="text-white/90 font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Aanbevolen studies:
              </p>
              <div className="flex flex-wrap gap-2">
                {topMatches[0].recommended_studies.map((study, i) => (
                  <span
                    key={i}
                    className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
                  >
                    {study}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* All Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6 font-display">
            Meer Matches Voor Jou
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {topMatches.slice(1).map((career, index) => (
              <motion.div
                key={career.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">
                    {career.title}
                  </h3>
                  <div className="bg-primary/20 px-3 py-1 rounded-full">
                    <span className="text-primary font-bold text-sm">
                      {career.matchPercentage}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-white/60 text-sm mb-2">Aanbevolen studies:</p>
                    <div className="flex flex-wrap gap-2">
                      {career.recommended_studies.map((study, i) => (
                        <span
                          key={i}
                          className="bg-white/10 px-2 py-1 rounded text-white/80 text-xs"
                        >
                          {study}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Restart Button */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold flex items-center gap-3 mx-auto border border-white/20 hover:bg-white/20 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Opnieuw starten
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
