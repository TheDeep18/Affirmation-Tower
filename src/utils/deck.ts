import type { Card } from './types';
import { cards } from './cards';

export const DECK_SIZE_DAILY = 12;
export const DECK_SIZE_FREE = 30; // Larger deck for free play

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export const deckBuilder = {
    createDeck: (mode: 'DAILY' | 'FREE'): Card[] => {
        const size = mode === 'DAILY' ? DECK_SIZE_DAILY : DECK_SIZE_FREE;

        // Target ratio: 40% negative, 60% affirmation
        const negativeCount = Math.floor(size * 0.4);
        const affirmationCount = size - negativeCount;

        const allNegatives = cards.filter(c => c.type === 'NEGATIVE');
        const allAffirmations = cards.filter(c => c.type === 'AFFIRMATION');

        const selectedNegatives = shuffle(allNegatives).slice(0, negativeCount);
        const selectedAffirmations = shuffle(allAffirmations).slice(0, affirmationCount);

        return shuffle([...selectedNegatives, ...selectedAffirmations]);
    }
};
