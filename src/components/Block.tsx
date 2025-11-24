import React from 'react';
import type { Block as BlockType } from '../utils/types';
import { motion } from 'framer-motion';

interface BlockProps {
    block: BlockType;
    isFalling?: boolean;
}

const Block: React.FC<BlockProps> = ({ block, isFalling }) => {
    // Map categories to colors
    const getCategoryColor = (category: string) => {
        // We can use the block width to detect "unstable" blocks (width 120)
        // Or we can pass a prop. But width is a good proxy for now as per useGameStore logic.
        if (block.width > 100) {
            return 'bg-slate-700 dark:bg-slate-600 text-slate-200';
        }

        switch (category) {
            case 'Growth': return 'bg-emerald-400';
            case 'Value': return 'bg-blue-400';
            case 'Resilience': return 'bg-stone-400';
            case 'Process': return 'bg-purple-400';
            case 'Clarity': return 'bg-cyan-400';
            case 'Gratitude': return 'bg-amber-400';
            default: return 'bg-slate-400';
        }
    };

    return (
        <motion.div
            layoutId={block.id}
            initial={isFalling ? { y: -500, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`absolute h-12 rounded-md shadow-sm flex items-center justify-center px-3 text-[10px] font-medium tracking-wide text-white uppercase ${getCategoryColor(block.category)}`}
            style={{
                width: `${block.width}px`,
                x: block.x, // Relative to center
                rotate: block.rotation,
                bottom: 0,
            }}
        >
            {block.category}
        </motion.div>
    );
};

export default Block;
