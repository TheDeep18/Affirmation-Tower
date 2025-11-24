import React from 'react';
import { useGameStore } from '../store/useGameStore';

const BadgeGallery: React.FC = () => {
    const { stats } = useGameStore();

    // Score-based badge logic
    const badges = [
        { id: 'rookie', name: 'Rookie Builder', icon: '🏗️', unlocked: stats.score >= 10 },
        { id: 'mindset', name: 'Mindset Master', icon: '🔥', unlocked: stats.score >= 50 },
        { id: 'skyscraper', name: 'Skyscraper', icon: '🌆', unlocked: stats.score >= 100 },
    ];

    return (
        <div className="grid grid-cols-3 gap-2 mt-4">
            {badges.map((badge) => (
                <div
                    key={badge.id}
                    className={`flex flex-col items-center p-2 rounded-xl border ${badge.unlocked
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-50 grayscale'
                        }`}
                >
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className="text-[10px] font-bold text-center leading-tight">{badge.name}</div>
                </div>
            ))}
        </div>
    );
};

export default BadgeGallery;
