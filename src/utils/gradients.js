export const getGradient = (tag) => {
    switch (tag) {
        case 'R': // Realistic - Orange/Red
            return "from-orange-400 to-red-500";
        case 'I': // Investigative - Blue/Indigo
            return "from-blue-400 to-indigo-600";
        case 'A': // Artistic - Purple/Pink
            return "from-purple-400 to-pink-500";
        case 'S': // Social - Green/Teal
            return "from-green-400 to-teal-500";
        case 'E': // Enterprising - Yellow/Orange (Darkened for readability)
            return "from-orange-400 to-orange-600";
        case 'C': // Conventional - Gray/Slate
            return "from-slate-500 to-gray-700";
        default:
            return "from-blue-500 to-indigo-600";
    }
};

export const getEmoji = (tag) => {
    switch (tag) {
        case 'R': return "🔧";
        case 'I': return "🧪";
        case 'A': return "🎨";
        case 'S': return "💚";
        case 'E': return "🚀";
        case 'C': return "📋";
        default: return "✨";
    }
};
