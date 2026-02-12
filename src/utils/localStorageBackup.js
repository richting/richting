/**
 * LocalStorage Backup Utility
 * 
 * Purpose: Persist anonymous user progress locally so they don't lose data
 * if they refresh or leave the onboarding flow before creating an account.
 */

const BACKUP_KEY = 'richting_user_backup';

export const saveToLocalStorage = (data) => {
  try {
    if (!data) return;

    // Only save essential data
    const backupPayload = {
      timestamp: Date.now(),
      userScores: data.userScores,
      userValues: data.userValues,
      personalityVector: data.personalityVector,
      selfEfficacy: data.selfEfficacy,
      reliabilityScore: data.reliabilityScore,
      completedModules: data.completedModules,
      currentStep: data.currentStep
    };

    localStorage.setItem(BACKUP_KEY, JSON.stringify(backupPayload));
    // console.log('✅ Progress backed up locally');
  } catch (err) {
    console.warn('Failed to save request backup:', err);
  }
};

export const loadFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(BACKUP_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);

    // Optional: Check if backup is too old (e.g., > 7 days)
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - data.timestamp > ONE_WEEK) {
      console.log('🗑️ Backup too old, discarding');
      localStorage.removeItem(BACKUP_KEY);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Failed to load backup:', err);
    return null;
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(BACKUP_KEY);
  } catch (err) {
    console.error('Failed to clear backup:', err);
  }
};
