import { create } from 'zustand';

/**
 * Scout State Management Hook
 *
 * Controls Scout's behavior, messages, and evolution throughout the app.
 *
 * Usage:
 * const { say, celebrate, hide, setReliability } = useScout();
 *
 * // Show a message
 * say("Goed bezig!", "happy");
 *
 * // Celebrate milestone
 * celebrate();
 *
 * // Hide Scout temporarily
 * hide();
 *
 * // Update reliability (triggers evolution)
 * setReliability(75); // Scout becomes hawk
 */

export const useScout = create((set, get) => ({
  // State
  message: null,
  pose: 'neutral',
  visible: true,
  reliabilityScore: 0,
  autoHideTimer: null,

  /**
   * Make Scout say something
   * @param {string} message - The message to display
   * @param {string} pose - Scout's pose (neutral, happy, thinking, celebrating, encouraging)
   * @param {number} duration - Auto-hide duration in ms (default: 5000)
   */
  say: (message, pose = 'neutral', duration = 5000) => {
    // Clear existing timer if any
    const currentTimer = get().autoHideTimer;
    if (currentTimer) {
      clearTimeout(currentTimer);
    }

    set({
      message,
      pose,
      visible: true,
    });

    // Auto-hide after duration
    if (duration > 0) {
      const timer = setTimeout(() => {
        set({
          message: null,
          pose: 'neutral',
          autoHideTimer: null,
        });
      }, duration);

      set({ autoHideTimer: timer });
    }
  },

  /**
   * Make Scout celebrate (special animation + message)
   */
  celebrate: (customMessage) => {
    const message = customMessage || "Yes! Je hebt het voltooid! 🎉";
    set({
      message,
      pose: 'celebrating',
      visible: true,
    });

    // Longer duration for celebrations
    setTimeout(() => {
      set({
        message: null,
        pose: 'happy',
      });
    }, 4000);
  },

  /**
   * Make Scout encouraging (supportive gesture)
   */
  encourage: (customMessage) => {
    const message = customMessage || "Je kunt dit! Geloof in jezelf 💪";
    get().say(message, 'encouraging', 6000);
  },

  /**
   * Make Scout think (contemplative pose)
   */
  think: (customMessage) => {
    const message = customMessage || "Interessant... 🤔";
    get().say(message, 'thinking', 4000);
  },

  /**
   * Hide Scout (use sparingly - Scout should usually be visible)
   */
  hide: () => {
    const currentTimer = get().autoHideTimer;
    if (currentTimer) {
      clearTimeout(currentTimer);
    }

    set({
      visible: false,
      message: null,
      autoHideTimer: null,
    });
  },

  /**
   * Show Scout again after hiding
   */
  show: () => {
    set({ visible: true });
  },

  /**
   * Update reliability score (triggers evolution if threshold crossed)
   * @param {number} score - New reliability score (0-100)
   */
  setReliability: (score) => {
    const oldScore = get().reliabilityScore;
    const oldStage = getEvolutionStage(oldScore);
    const newStage = getEvolutionStage(score);

    set({ reliabilityScore: score });

    // Evolution milestone reached!
    if (oldStage !== newStage && newStage !== 'egg') {
      const messages = {
        chick: "Kijk! Ik groei met je mee 🐣",
        teen: "We maken vooruitgang samen! 🦜",
        hawk: "Wow! We zijn beide volwassen geworden! 🦅",
      };

      if (messages[newStage]) {
        // Brief delay before showing evolution message
        setTimeout(() => {
          get().celebrate(messages[newStage]);
        }, 500);
      }
    }
  },

  /**
   * Clear any auto-hide timers (useful on component unmount)
   */
  cleanup: () => {
    const currentTimer = get().autoHideTimer;
    if (currentTimer) {
      clearTimeout(currentTimer);
      set({ autoHideTimer: null });
    }
  },

  /**
   * Reset Scout to initial state
   */
  reset: () => {
    const currentTimer = get().autoHideTimer;
    if (currentTimer) {
      clearTimeout(currentTimer);
    }

    set({
      message: null,
      pose: 'neutral',
      visible: true,
      reliabilityScore: 0,
      autoHideTimer: null,
    });
  },
}));

/**
 * Helper: Determine evolution stage from reliability score
 */
function getEvolutionStage(score) {
  if (score < 25) return 'egg';
  if (score < 50) return 'chick';
  if (score < 75) return 'teen';
  return 'hawk';
}

/**
 * Hook variant that syncs with Zustand store's reliability score
 * Use this in components that update reliability
 */
export function useSyncScoutReliability(reliabilityScore) {
  const setReliability = useScout(state => state.setReliability);

  React.useEffect(() => {
    if (reliabilityScore !== undefined) {
      setReliability(reliabilityScore);
    }
  }, [reliabilityScore, setReliability]);
}
