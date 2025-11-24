import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'framer-motion';
import { RefreshCw, Share2, Home } from 'lucide-react';
import BadgeGallery from '../components/BadgeGallery';

const EndScreen: React.FC = () => {
    const { stats, resetGame, startGame } = useGameStore();

    const handleShare = async () => {
        const text = `I stacked ${stats.towerHeight} affirmations in Affirmation Tower! 🏗️✨\nScore: ${stats.score}\n#AffirmationTower`;
        try {
            await navigator.clipboard.writeText(text);
            alert('Stats copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-auto p-6 pb-8 text-center space-y-4 max-w-md mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-y-auto max-h-[90vh] my-auto">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="pt-4"
            >
                <h2 className="text-4xl font-black mb-2 text-slate-800 dark:text-white">
                    {stats.towerHeight > 0 ? "Tower Complete!" : "Oops!"}
                </h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                    {stats.towerHeight > 0
                        ? `You stacked ${stats.towerHeight} affirmations.`
                        : "Your mindset toppled! Try again."}
                </p>
            </motion.div>


            <div className="grid grid-cols-2 gap-3 w-full">
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl">
                    <div className="text-4xl font-bold text-emerald-500">{stats.score}</div>
                    <div className="text-xs text-slate-400 uppercase font-bold mt-1">Score</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl">
                    <div className="text-4xl font-bold text-blue-500">{stats.perfectDrops}</div>
                    <div className="text-xs text-slate-400 uppercase font-bold mt-1">Perfect Drops</div>
                </div>
            </div>


            {stats.topAffirmations.length > 0 && (
                <div className="w-full text-left">
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Top Affirmations</h3>
                    <ul className="space-y-2">
                        {stats.topAffirmations.slice(0, 3).map((card) => (
                            <li key={card.id} className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                ✨ {card.text}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <BadgeGallery />

            <div className="w-full space-y-3">
                <button
                    onClick={() => startGame('DAILY')}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-2xl font-bold text-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 transition-colors"
                >
                    <RefreshCw />
                    Play Again
                </button>

                <div className="flex gap-3">
                    <button
                        onClick={handleShare}
                        className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        <Share2 size={20} />
                        Share
                    </button>
                    <button
                        onClick={resetGame}
                        className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        <Home size={20} />
                        Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EndScreen;
