import type { GameProgress, GamePrefs, SavedTower } from './types';

const KEYS = {
    PREFS: 'affirmationTower.prefs',
    PROGRESS: 'affirmationTower.progress',
};

const DEFAULT_PREFS: GamePrefs = {
    theme: 'dark',
    fontScale: 1,
    highContrast: false,
    reducedMotion: false,
};

const DEFAULT_PROGRESS: GameProgress = {
    dailyStreak: 0,
    lastPlayedISODate: null,
    bestHeight: 0,
    bestScore: 0,
    towers: [],
};

export const storage = {
    getPrefs: (): GamePrefs => {
        try {
            const stored = localStorage.getItem(KEYS.PREFS);
            return stored ? { ...DEFAULT_PREFS, ...JSON.parse(stored) } : DEFAULT_PREFS;
        } catch {
            return DEFAULT_PREFS;
        }
    },

    savePrefs: (prefs: Partial<GamePrefs>) => {
        try {
            const current = storage.getPrefs();
            localStorage.setItem(KEYS.PREFS, JSON.stringify({ ...current, ...prefs }));
        } catch (e) {
            console.error('Failed to save prefs', e);
        }
    },

    getProgress: (): GameProgress => {
        try {
            const stored = localStorage.getItem(KEYS.PROGRESS);
            return stored ? { ...DEFAULT_PROGRESS, ...JSON.parse(stored) } : DEFAULT_PROGRESS;
        } catch {
            return DEFAULT_PROGRESS;
        }
    },

    saveProgress: (progress: Partial<GameProgress>) => {
        try {
            const current = storage.getProgress();
            localStorage.setItem(KEYS.PROGRESS, JSON.stringify({ ...current, ...progress }));
        } catch (e) {
            console.error('Failed to save progress', e);
        }
    },

    addTower: (tower: SavedTower) => {
        const progress = storage.getProgress();
        const newTowers = [tower, ...progress.towers].slice(0, 50); // Keep last 50
        const newBestHeight = Math.max(progress.bestHeight, tower.height);
        const newBestScore = Math.max(progress.bestScore, tower.score);

        storage.saveProgress({
            towers: newTowers,
            bestHeight: newBestHeight,
            bestScore: newBestScore,
        });
    },

    updateStreak: () => {
        const progress = storage.getProgress();
        const today = new Date().toISOString().split('T')[0];
        const lastPlayed = progress.lastPlayedISODate ? progress.lastPlayedISODate.split('T')[0] : null;

        if (lastPlayed === today) return; // Already played today

        let newStreak = progress.dailyStreak;
        if (lastPlayed) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastPlayed === yesterdayStr) {
                newStreak += 1;
            } else {
                newStreak = 1; // Streak broken
            }
        } else {
            newStreak = 1; // First time
        }

        storage.saveProgress({
            dailyStreak: newStreak,
            lastPlayedISODate: new Date().toISOString(),
        });
    },

    reset: () => {
        localStorage.removeItem(KEYS.PREFS);
        localStorage.removeItem(KEYS.PROGRESS);
    }
};
