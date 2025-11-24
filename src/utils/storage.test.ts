import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from './storage';

describe('Storage', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('saves and retrieves preferences', () => {
        storage.savePrefs({ theme: 'light' });
        const prefs = storage.getPrefs();
        expect(prefs.theme).toBe('light');
    });

    it('updates streak correctly', () => {
        // Mock date
        const mockDate = new Date('2023-01-01T12:00:00Z');
        vi.setSystemTime(mockDate);

        storage.updateStreak();
        let progress = storage.getProgress();
        expect(progress.dailyStreak).toBe(1);

        // Next day
        const nextDay = new Date('2023-01-02T12:00:00Z');
        vi.setSystemTime(nextDay);

        storage.updateStreak();
        progress = storage.getProgress();
        expect(progress.dailyStreak).toBe(2);
    });

    it('resets streak if day skipped', () => {
        // Day 1
        vi.setSystemTime(new Date('2023-01-01T12:00:00Z'));
        storage.updateStreak();

        // Day 3 (Skipped Day 2)
        vi.setSystemTime(new Date('2023-01-03T12:00:00Z'));
        storage.updateStreak();

        const progress = storage.getProgress();
        expect(progress.dailyStreak).toBe(1);
    });
});
