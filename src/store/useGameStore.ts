import { create } from 'zustand';
import type { Card, Block, GamePhase, GameStats, GamePrefs, SavedTower } from '../utils/types';
import { deckBuilder } from '../utils/deck';
import { storage } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

interface GameState {
    phase: GamePhase;
    deck: Card[];
    currentCardIndex: number;
    blocks: Block[];
    stats: GameStats;
    prefs: GamePrefs;
    streak: number;
    pendingBlockType: 'STABLE' | 'UNSTABLE' | null;

    // Actions
    startGame: (mode: 'DAILY' | 'FREE') => void;
    swipeCard: (direction: 'LEFT' | 'RIGHT') => 'CORRECT' | 'WRONG';
    dropBlock: (accuracy: number) => void; // accuracy 0-1 (1 is perfect)
    endGame: (collapsed: boolean) => void;
    resetGame: () => void;
    updatePrefs: (prefs: Partial<GamePrefs>) => void;
    saveTower: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
    phase: 'LANDING',
    deck: [],
    currentCardIndex: 0,
    blocks: [],
    stats: {
        score: 0,
        perfectDrops: 0,
        topAffirmations: [],
        towerHeight: 0,
    },
    prefs: storage.getPrefs(),
    streak: storage.getProgress().dailyStreak,

    pendingBlockType: null,

    startGame: (mode) => {
        const deck = deckBuilder.createDeck(mode);
        storage.updateStreak();
        set({
            phase: 'CARD',
            deck,
            currentCardIndex: 0,
            blocks: [],
            stats: {
                score: 0,
                perfectDrops: 0,
                topAffirmations: [],
                towerHeight: 0,
            },
            streak: storage.getProgress().dailyStreak,
            pendingBlockType: null,
        });
    },

    swipeCard: (direction) => {
        const { deck, currentCardIndex, stats, blocks } = get();
        const card = deck[currentCardIndex];

        if (!card) return 'WRONG';

        const newStats = { ...stats };

        let blockType: 'STABLE' | 'UNSTABLE' | null = null;

        // Logic Matrix:
        // Affirmation + Right (Accept) -> Stable Block
        // Affirmation + Left (Reject) -> Unstable Block
        // Negative + Right (Accept) -> Unstable Block
        // Negative + Left (Reject) -> Nothing (Correct)

        if (card.type === 'AFFIRMATION') {
            if (direction === 'RIGHT') {
                // Accept Affirmation (Good) -> Stable
                newStats.score += 10;
                newStats.topAffirmations = [...newStats.topAffirmations, card];
                blockType = 'STABLE';
            } else {
                // Reject Affirmation (Bad) -> No Block (Missed opportunity)
                // No score penalty, just no block
            }
        } else {
            // Negative
            if (direction === 'LEFT') {
                // Reject Negative (Good) -> No Block
                newStats.score += 5;
            } else {
                // Accept Negative (Bad) -> Unstable
                blockType = 'UNSTABLE';
            }
        }

        // Add Block Logic (Auto-Drop)
        let newBlocks = [...blocks];
        if (blockType) {
            const isUnstable = blockType === 'UNSTABLE';

            // Calculate X position
            // Stable: Centered (0) with slight random variance (simulating "perfect" auto-drop)
            // Unstable: Forced off-center (40-80px)

            let x = 0;
            if (isUnstable) {
                // Force large offset (40-80px), random side
                // If we want to be mean, we could place it on the side it's already leaning!
                // But random is fair enough.
                x = (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 40);
            } else {
                // Active Stabilization:
                // Calculate current center of mass to determine lean
                const currentBlocks = get().blocks;
                const totalMass = currentBlocks.length;
                const centerOfMass = totalMass > 0
                    ? currentBlocks.reduce((sum, b) => sum + b.x, 0) / totalMass
                    : 0;

                // Counter-act the lean. If leaning right (positive), place left (negative).
                // We multiply by a factor to "pull" it back.
                const correction = -centerOfMass * 1.5;

                // Clamp correction to ensure stable blocks don't spawn too far out
                const clampedCorrection = Math.max(-35, Math.min(35, correction));

                // Add slight randomness for realism
                x = clampedCorrection + (Math.random() - 0.5) * 5;
            }

            const newBlock: Block = {
                id: uuidv4(),
                cardId: card.id,
                text: card.text,
                category: card.category,
                x: x,
                rotation: isUnstable ? (Math.random() - 0.5) * 15 : (Math.random() - 0.5) * 2,
                width: isUnstable ? 120 : 100,
                color: isUnstable ? 'bg-slate-600' : 'bg-emerald-500',
            };

            newBlocks.push(newBlock);
            newStats.towerHeight += 1;
            if (!isUnstable) newStats.perfectDrops += 1; // Auto-perfect for stable
        }

        // Check for Game Over / Next Card
        const nextIndex = currentCardIndex + 1;

        // We need to update state immediately
        set({
            stats: newStats,
            blocks: newBlocks,
            currentCardIndex: nextIndex,
        });

        // If deck finished
        if (nextIndex >= deck.length) {
            setTimeout(() => {
                set({ phase: 'END' });
            }, 1000); // Small delay to see final block
        }

        return blockType === 'STABLE' || (card.type === 'NEGATIVE' && direction === 'LEFT') ? 'CORRECT' : 'WRONG';
    },

    dropBlock: () => {
        // Deprecated in favor of auto-drop in swipeCard, keeping for interface compatibility if needed or removing
        console.warn("dropBlock is deprecated");
    },

    endGame: (collapsed) => {
        const { stats, blocks } = get();


        // Save tower if not collapsed (or maybe save failed attempts too? Spec says "Try again" on collapse)
        // If collapsed, maybe we don't save it as a "success" but we still show end screen

        if (!collapsed) {
            const tower: SavedTower = {
                id: uuidv4(),
                dateISO: new Date().toISOString(),
                mode: 'DAILY', // TODO: Track mode in state
                height: stats.towerHeight,
                score: stats.score,
                blocks: blocks
            };
            storage.addTower(tower);
        }

        set({ phase: 'END' });
    },

    resetGame: () => {
        set({ phase: 'LANDING' });
    },

    updatePrefs: (newPrefs) => {
        storage.savePrefs(newPrefs);
        set({ prefs: { ...get().prefs, ...newPrefs } });
    },

    saveTower: () => {
        // Logic to trigger html-to-image download handled in component
    }
}));
