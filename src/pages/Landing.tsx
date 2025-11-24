import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'framer-motion';
import { Play, Infinity } from 'lucide-react';

const Landing: React.FC = () => {
    const { startGame, streak } = useGameStore();

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-8 max-w-md mx-auto">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-br from-emerald-400 to-cyan-500 bg-clip-text text-transparent mb-2">
                    Affirmation<br />Tower
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                    Stack your mindset, one block at a time.
                </p>
            </motion.div>

            <div className="w-full space-y-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startGame('DAILY')}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-2xl font-bold text-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 transition-colors"
                >
                    <Play fill="currentColor" />
                    Daily Mode
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startGame('FREE')}
                    className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white p-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-colors"
                >
                    <Infinity />
                    Free Play
                </motion.button>
            </div>

            {streak > 0 && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2"
                >
                    <span>🔥</span> {streak} Day Streak
                </motion.div>
            )}
        </div>
    );
};

export default Landing;
