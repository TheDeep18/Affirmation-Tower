import React from 'react';
import type { Card as CardType } from '../utils/types';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { PanInfo } from 'framer-motion';

interface CardProps {
    card: CardType;
    onSwipe: (direction: 'LEFT' | 'RIGHT') => void;
    active: boolean;
}

const Card: React.FC<CardProps> = ({ card, onSwipe, active }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    // Color feedback based on swipe direction
    const bgLeft = useTransform(x, [-150, 0], ['rgba(239, 68, 68, 0.2)', 'rgba(0,0,0,0)']);
    const bgRight = useTransform(x, [0, 150], ['rgba(0,0,0,0)', 'rgba(16, 185, 129, 0.2)']);

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 100) {
            onSwipe('RIGHT');
        } else if (info.offset.x < -100) {
            onSwipe('LEFT');
        }
    };

    const isNegative = card.type === 'NEGATIVE';
    const categoryColor = isNegative ? 'text-rose-500' : 'text-emerald-500';

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag={active ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 rounded-[2rem] bg-white dark:bg-slate-800 shadow-2xl flex flex-col items-center justify-between p-6 cursor-grab active:cursor-grabbing origin-bottom"
            whileHover={{ scale: active ? 1.02 : 1 }}
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.2 } }}
        >
            {/* Swipe Feedback Overlays - No Icons, just subtle color */}
            <motion.div style={{ backgroundColor: bgLeft }} className="absolute inset-0 rounded-[2rem] z-20 pointer-events-none" />
            <motion.div style={{ backgroundColor: bgRight }} className="absolute inset-0 rounded-[2rem] z-20 pointer-events-none" />

            <div className={`text-xs font-bold tracking-[0.2em] uppercase ${categoryColor} mt-2`}>
                {card.category}
            </div>

            <div className="flex-1 flex items-center justify-center px-2">
                <h3 className="text-4xl font-light text-center text-slate-800 dark:text-slate-100 leading-tight">
                    {card.text}
                </h3>
            </div>

            <div className="w-full flex justify-between gap-8 px-4 pointer-events-auto">
                <div
                    onClick={(e) => { e.stopPropagation(); onSwipe('LEFT'); }}
                    className="flex-1 py-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 font-bold text-sm uppercase tracking-wider text-center border border-rose-100 dark:border-rose-900/30 cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                >
                    Reject
                </div>
                <div
                    onClick={(e) => { e.stopPropagation(); onSwipe('RIGHT'); }}
                    className="flex-1 py-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 font-bold text-sm uppercase tracking-wider text-center border border-emerald-100 dark:border-emerald-900/30 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                >
                    Accept
                </div>
            </div>
        </motion.div>
    );
};

export default Card;
