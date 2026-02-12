import React from 'react';

/**
 * Scout Avatar Component
 * SVG-based mascot that evolves based on user's reliability score
 *
 * Evolution Stages:
 * - egg (0-25): 🥚 Simple egg shape
 * - chick (25-50): 🐣 Hatched chick
 * - teen (50-75): 🦜 Young bird
 * - hawk (75-100): 🦅 Majestic hawk
 *
 * Poses:
 * - neutral: Default calm state
 * - happy: Encouraging, celebratory
 * - thinking: Contemplative
 * - celebrating: Arms up, excited
 * - encouraging: Supportive gesture
 */

const ScoutAvatar = ({
  pose = 'neutral',
  size = 60,
  reliabilityScore = 0,
  className = ''
}) => {
  // Determine evolution stage based on reliability score
  const getEvolutionStage = () => {
    if (reliabilityScore < 25) return 'egg';
    if (reliabilityScore < 50) return 'chick';
    if (reliabilityScore < 75) return 'teen';
    return 'hawk';
  };

  const stage = getEvolutionStage();

  // SVG paths for each stage + pose combination
  const getPaths = () => {
    const baseColor = '#4A90E2'; // Brand blue
    const accentColor = '#3B7DD6';
    const highlightColor = '#5CAFFF';

    // EGG STAGE (0-25)
    if (stage === 'egg') {
      return (
        <g>
          {/* Simple egg shape */}
          <ellipse
            cx={size / 2}
            cy={size / 2 + 5}
            rx={size * 0.35}
            ry={size * 0.4}
            fill={baseColor}
            opacity={0.9}
          />
          {/* Crack pattern (appears when close to hatching, 20-25) */}
          {reliabilityScore >= 20 && (
            <>
              <path
                d={`M ${size/2} ${size*0.3} L ${size/2 + 5} ${size*0.4}`}
                stroke="#2C3E50"
                strokeWidth={1.5}
                fill="none"
              />
              <path
                d={`M ${size/2} ${size*0.3} L ${size/2 - 5} ${size*0.35}`}
                stroke="#2C3E50"
                strokeWidth={1.5}
                fill="none"
              />
            </>
          )}
          {/* Simple eye dots */}
          <circle cx={size/2 - 8} cy={size/2} r={2} fill="#2C3E50" />
          <circle cx={size/2 + 8} cy={size/2} r={2} fill="#2C3E50" />
        </g>
      );
    }

    // CHICK STAGE (25-50)
    if (stage === 'chick') {
      const bodyY = pose === 'celebrating' ? size/2 - 2 : size/2 + 2;
      const eyeSize = pose === 'happy' || pose === 'celebrating' ? 4 : 3;

      return (
        <g>
          {/* Chick body */}
          <circle
            cx={size / 2}
            cy={bodyY + 8}
            r={size * 0.25}
            fill={highlightColor}
          />
          {/* Head */}
          <circle
            cx={size / 2}
            cy={bodyY - 5}
            r={size * 0.2}
            fill={baseColor}
          />
          {/* Tiny wings */}
          <ellipse
            cx={size/2 - 12}
            cy={bodyY + 5}
            rx={6}
            ry={8}
            fill={accentColor}
            transform={pose === 'celebrating' ? `rotate(-20 ${size/2 - 12} ${bodyY + 5})` : ''}
          />
          <ellipse
            cx={size/2 + 12}
            cy={bodyY + 5}
            rx={6}
            ry={8}
            fill={accentColor}
            transform={pose === 'celebrating' ? `rotate(20 ${size/2 + 12} ${bodyY + 5})` : ''}
          />
          {/* Eyes */}
          <circle cx={size/2 - 6} cy={bodyY - 6} r={eyeSize} fill="#2C3E50" />
          <circle cx={size/2 + 6} cy={bodyY - 6} r={eyeSize} fill="#2C3E50" />
          {/* Beak */}
          <path
            d={`M ${size/2} ${bodyY - 2} L ${size/2 - 3} ${bodyY + 2} L ${size/2 + 3} ${bodyY + 2} Z`}
            fill="#FFE66D"
          />
          {/* Egg shell pieces at feet */}
          <path
            d={`M ${size/2 - 10} ${bodyY + 18} L ${size/2 - 5} ${bodyY + 15} L ${size/2} ${bodyY + 18} Z`}
            fill="#E8EEF2"
            opacity={0.7}
          />
        </g>
      );
    }

    // TEEN BIRD STAGE (50-75)
    if (stage === 'teen') {
      const bodyY = pose === 'celebrating' ? size/2 - 3 : size/2;
      const wingAngleLeft = pose === 'celebrating' ? -30 : pose === 'encouraging' ? -15 : -5;
      const wingAngleRight = pose === 'celebrating' ? 30 : pose === 'encouraging' ? 15 : 5;

      return (
        <g>
          {/* Body */}
          <ellipse
            cx={size / 2}
            cy={bodyY + 10}
            rx={size * 0.22}
            ry={size * 0.28}
            fill={baseColor}
          />
          {/* Head */}
          <circle
            cx={size / 2}
            cy={bodyY - 5}
            r={size * 0.18}
            fill={baseColor}
          />
          {/* Wings - more developed */}
          <ellipse
            cx={size/2 - 15}
            cy={bodyY + 8}
            rx={10}
            ry={14}
            fill={accentColor}
            transform={`rotate(${wingAngleLeft} ${size/2 - 15} ${bodyY + 8})`}
          />
          <ellipse
            cx={size/2 + 15}
            cy={bodyY + 8}
            rx={10}
            ry={14}
            fill={accentColor}
            transform={`rotate(${wingAngleRight} ${size/2 + 15} ${bodyY + 8})`}
          />
          {/* Feather details on wings */}
          <path
            d={`M ${size/2 - 15} ${bodyY + 3} Q ${size/2 - 18} ${bodyY + 8} ${size/2 - 15} ${bodyY + 13}`}
            stroke="#2C3E50"
            strokeWidth={0.5}
            fill="none"
            opacity={0.3}
          />
          {/* Tail feathers */}
          <path
            d={`M ${size/2} ${bodyY + 25} L ${size/2 - 4} ${bodyY + 32} L ${size/2} ${bodyY + 30} L ${size/2 + 4} ${bodyY + 32} Z`}
            fill={accentColor}
          />
          {/* Eyes - larger, more expressive */}
          <g>
            <circle cx={size/2 - 5} cy={bodyY - 7} r={4} fill="#FFFFFF" />
            <circle cx={size/2 - 5} cy={bodyY - 7} r={2.5} fill="#2C3E50" />
            <circle cx={size/2 - 5} cy={bodyY - 8} r={1} fill="#FFFFFF" /> {/* Glint */}
          </g>
          <g>
            <circle cx={size/2 + 5} cy={bodyY - 7} r={4} fill="#FFFFFF" />
            <circle cx={size/2 + 5} cy={bodyY - 7} r={2.5} fill="#2C3E50" />
            <circle cx={size/2 + 5} cy={bodyY - 8} r={1} fill="#FFFFFF" />
          </g>
          {/* Beak */}
          <path
            d={`M ${size/2} ${bodyY - 2} L ${size/2 - 4} ${bodyY + 3} L ${size/2 + 4} ${bodyY + 3} Z`}
            fill="#FFE66D"
          />
          {/* Eyebrows for thinking pose */}
          {pose === 'thinking' && (
            <>
              <path
                d={`M ${size/2 - 8} ${bodyY - 10} Q ${size/2 - 5} ${bodyY - 11} ${size/2 - 2} ${bodyY - 10}`}
                stroke="#2C3E50"
                strokeWidth={1}
                fill="none"
              />
              <path
                d={`M ${size/2 + 2} ${bodyY - 10} Q ${size/2 + 5} ${bodyY - 11} ${size/2 + 8} ${bodyY - 10}`}
                stroke="#2C3E50"
                strokeWidth={1}
                fill="none"
              />
            </>
          )}
        </g>
      );
    }

    // HAWK STAGE (75-100) - Majestic final form
    if (stage === 'hawk') {
      const bodyY = pose === 'celebrating' ? size/2 - 4 : size/2;
      const wingSpread = pose === 'celebrating' ? 35 : pose === 'encouraging' ? 25 : 18;
      const headTilt = pose === 'thinking' ? 5 : 0;

      return (
        <g>
          {/* Body - sleeker, more powerful */}
          <ellipse
            cx={size / 2}
            cy={bodyY + 12}
            rx={size * 0.2}
            ry={size * 0.32}
            fill={`url(#bodyGradient-${size})`}
          />
          <defs>
            <linearGradient id={`bodyGradient-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={highlightColor} />
              <stop offset="100%" stopColor={baseColor} />
            </linearGradient>
          </defs>

          {/* Head */}
          <ellipse
            cx={size / 2 + headTilt}
            cy={bodyY - 8}
            rx={size * 0.16}
            ry={size * 0.18}
            fill={baseColor}
          />

          {/* Majestic wings */}
          <path
            d={`M ${size/2 - wingSpread} ${bodyY + 5} Q ${size/2 - wingSpread - 8} ${bodyY} ${size/2 - wingSpread - 5} ${bodyY - 8}
                L ${size/2 - 15} ${bodyY + 8} Z`}
            fill={accentColor}
          />
          <path
            d={`M ${size/2 + wingSpread} ${bodyY + 5} Q ${size/2 + wingSpread + 8} ${bodyY} ${size/2 + wingSpread + 5} ${bodyY - 8}
                L ${size/2 + 15} ${bodyY + 8} Z`}
            fill={accentColor}
          />

          {/* Wing feather details */}
          {[0, 1, 2].map(i => (
            <React.Fragment key={`feather-${i}`}>
              <line
                x1={size/2 - wingSpread - 5 + i*3}
                y1={bodyY - 8 + i*2}
                x2={size/2 - 15 - i*2}
                y2={bodyY + 8 - i}
                stroke="#2C3E50"
                strokeWidth={0.8}
                opacity={0.4}
              />
              <line
                x1={size/2 + wingSpread + 5 - i*3}
                y1={bodyY - 8 + i*2}
                x2={size/2 + 15 + i*2}
                y2={bodyY + 8 - i}
                stroke="#2C3E50"
                strokeWidth={0.8}
                opacity={0.4}
              />
            </React.Fragment>
          ))}

          {/* Proud tail feathers */}
          <path
            d={`M ${size/2} ${bodyY + 28} L ${size/2 - 6} ${bodyY + 38} L ${size/2 - 2} ${bodyY + 32}
                L ${size/2 + 2} ${bodyY + 32} L ${size/2 + 6} ${bodyY + 38} Z`}
            fill={accentColor}
          />

          {/* Keen hawk eyes */}
          <g>
            <ellipse cx={size/2 - 4} cy={bodyY - 9} rx={5} ry={4} fill="#FFFFFF" />
            <circle cx={size/2 - 4} cy={bodyY - 9} r={2.5} fill="#2C3E50" />
            <circle cx={size/2 - 5} cy={bodyY - 10} r={1.2} fill="#FFFFFF" /> {/* Glint */}
          </g>
          <g>
            <ellipse cx={size/2 + 4} cy={bodyY - 9} rx={5} ry={4} fill="#FFFFFF" />
            <circle cx={size/2 + 4} cy={bodyY - 9} r={2.5} fill="#2C3E50" />
            <circle cx={size/2 + 3} cy={bodyY - 10} r={1.2} fill="#FFFFFF" />
          </g>

          {/* Sharp beak */}
          <path
            d={`M ${size/2} ${bodyY - 4} L ${size/2 - 5} ${bodyY + 2} L ${size/2} ${bodyY + 1} L ${size/2 + 5} ${bodyY + 2} Z`}
            fill="#FFE66D"
          />

          {/* Crown/crest feathers for celebrating pose */}
          {pose === 'celebrating' && (
            <>
              <path
                d={`M ${size/2 - 3} ${bodyY - 18} L ${size/2 - 5} ${bodyY - 22} L ${size/2 - 2} ${bodyY - 19} Z`}
                fill={highlightColor}
              />
              <path
                d={`M ${size/2 + 3} ${bodyY - 18} L ${size/2 + 5} ${bodyY - 22} L ${size/2 + 2} ${bodyY - 19} Z`}
                fill={highlightColor}
              />
            </>
          )}

          {/* Confident eyebrows */}
          <path
            d={`M ${size/2 - 8} ${bodyY - 12} Q ${size/2 - 5} ${bodyY - 13} ${size/2 - 2} ${bodyY - 12}`}
            stroke="#2C3E50"
            strokeWidth={1.2}
            fill="none"
          />
          <path
            d={`M ${size/2 + 2} ${bodyY - 12} Q ${size/2 + 5} ${bodyY - 13} ${size/2 + 8} ${bodyY - 12}`}
            stroke="#2C3E50"
            strokeWidth={1.2}
            fill="none"
          />
        </g>
      );
    }

    return null;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ overflow: 'visible' }}
    >
      {getPaths()}
    </svg>
  );
};

export default ScoutAvatar;
