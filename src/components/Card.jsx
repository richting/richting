import { motion } from 'framer-motion';

const Card = ({ card, onSwipe, style }) => {
  return (
    <motion.div
      style={style}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(event, info) => {
        if (Math.abs(info.offset.x) > 150) {
          onSwipe(info.offset.x > 0 ? 'right' : 'left', card.tag);
        }
      }}
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
    >
      <div className={`bg-gradient-to-br ${card.gradient} rounded-3xl p-8 h-full flex flex-col justify-between shadow-2xl`}>
        <div className="text-7xl mb-6">{card.emoji}</div>
        
        <div className="text-white">
          <h3 className="text-3xl font-bold mb-4 leading-tight">
            {card.title}
          </h3>
          <p className="text-lg opacity-90 leading-relaxed">
            {card.description}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-white font-semibold text-sm">
              {card.tag === 'R' && 'Realistisch'}
              {card.tag === 'I' && 'Intellectueel'}
              {card.tag === 'A' && 'Artistiek'}
              {card.tag === 'S' && 'Sociaal'}
              {card.tag === 'E' && 'Ondernemend'}
              {card.tag === 'C' && 'Conventioneel'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
