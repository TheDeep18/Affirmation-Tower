import { describe, it, expect } from 'vitest';
import { deckBuilder, DECK_SIZE_DAILY } from './deck';

describe('Deck Builder', () => {
    it('creates a deck of correct size for DAILY mode', () => {
        const deck = deckBuilder.createDeck('DAILY');
        expect(deck).toHaveLength(DECK_SIZE_DAILY);
    });

    it('maintains approximately 40/60 ratio of negative to affirmation', () => {
        const deck = deckBuilder.createDeck('DAILY');
        const negatives = deck.filter(c => c.type === 'NEGATIVE').length;
        const affirmations = deck.filter(c => c.type === 'AFFIRMATION').length;

        // 12 cards: 40% is 4.8 -> 4 negatives, 8 affirmations
        expect(negatives).toBe(4);
        expect(affirmations).toBe(8);
    });

    it('shuffles the deck', () => {
        const deck1 = deckBuilder.createDeck('DAILY');
        const deck2 = deckBuilder.createDeck('DAILY');
        // Very small chance this fails randomly if shuffle results in same order, but unlikely for 12 items
        expect(deck1.map(c => c.id)).not.toEqual(deck2.map(c => c.id));
    });
});
