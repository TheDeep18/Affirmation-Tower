import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import Card from './Card';

const CardDeck: React.FC = () => {
    const { deck, currentCardIndex, swipeCard } = useGameStore();

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handleSwipe('LEFT');
            if (e.key === 'ArrowRight') handleSwipe('RIGHT');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentCardIndex]); // Re-bind on index change to ensure fresh state if needed

    const handleSwipe = (direction: 'LEFT' | 'RIGHT') => {
        swipeCard(direction);
    };

    // Show current card and maybe next one for stacking effect
    const currentCard = deck[currentCardIndex];
    const nextCard = deck[currentCardIndex + 1];

    if (!currentCard) return null;

    return (
        <div className="relative w-full max-w-md h-[60vh] flex items-center justify-center">


            {/* Next Card (Background) */}
            {nextCard && (
                <div className="absolute w-80 aspect-[3/4] transform scale-95 opacity-50 translate-y-4 blur-[1px]">
                    <Card card={nextCard} onSwipe={() => { }} active={false} />
                </div>
            )}

            {/* Current Card */}
            <div className="absolute w-80 aspect-[3/4] z-10">
                <Card
                    key={currentCard.id}
                    card={currentCard}
                    onSwipe={handleSwipe}
                    active={true}
                />
            </div>

            <div className="absolute -bottom-20 text-slate-300 dark:text-slate-400 text-sm font-semibold whitespace-nowrap">
                Use Arrow Keys or Swipe
            </div>
        </div>
    );
};

export default CardDeck;
