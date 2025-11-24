import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'framer-motion';
import Block from './Block';

const Tower: React.FC = () => {
    const { blocks, endGame, stats } = useGameStore();
    const [sway, setSway] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isCollapsing, setIsCollapsing] = useState(false);
    const [dustParticles, setDustParticles] = useState<{ id: number, x: number, y: number }[]>([]);

    // Physics simulation and collapse trigger
    useEffect(() => {
        if (blocks.length === 0 || isCollapsing) return;

        // Count unstable blocks (width > 100 means unstable)
        const unstableCount = blocks.filter(b => b.width > 100).length;

        // Calculate center of mass for visual sway
        const totalMass = blocks.length;
        const centerOfMassX = blocks.reduce((acc, b) => acc + b.x, 0) / totalMass;

        // Visual sway based on imbalance
        const imbalance = Math.abs(centerOfMassX);
        const dampening = Math.max(0, 1 - (blocks.length / 8));
        const effectiveImbalanceMagnitude = imbalance * (1 - dampening * 0.8);
        const sign = Math.sign(centerOfMassX) || 1;
        const newSway = sign * effectiveImbalanceMagnitude * 1.5;

        setSway(newSway);

        // Collapse trigger: 3-4 unstable blocks total (regardless of sequence)
        if (unstableCount >= 3) {
            setIsCollapsing(true);

            // Trigger collapse sequence
            // 1. Animate fall
            setSway(sign * 90); // Topple over

            // 2. Generate dust after a brief delay (impact)
            setTimeout(() => {
                const particles = Array.from({ length: 12 }).map((_, i) => ({
                    id: i,
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() * -50)
                }));
                setDustParticles(particles);
            }, 400);

            // 3. End game after animation
            setTimeout(() => {
                endGame(true);
            }, 2500);
        }

    }, [blocks, endGame, isCollapsing]);

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-end pb-20 overflow-hidden relative"
            ref={containerRef}
        >
            {/* Background Effects */}
            <div className={`absolute inset-0 transition-colors duration-1000 ${stats.towerHeight > 5 ? 'bg-gradient-to-b from-indigo-900 to-slate-900' : ''
                }`} />

            {/* Dust Particles */}
            {dustParticles.map(p => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0, x: p.x, y: 0 }}
                    animate={{ opacity: [0, 0.8, 0], scale: [0.5, 2, 3], y: -100 + p.y }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute bottom-20 w-8 h-8 bg-slate-200/30 dark:bg-slate-600/30 rounded-full blur-xl z-0"
                />
            ))}

            {/* The Tower */}
            <motion.div
                className="relative flex flex-col-reverse items-center"
                animate={{ rotate: isCollapsing ? 0 : sway }}
                transition={{
                    type: "tween",
                    duration: 0.5
                }}
                style={{
                    transformOrigin: 'bottom center',
                    y: Math.max(0, (blocks.length * 50) - (window.innerHeight * 0.6))
                }}
            >
                {/* Base */}
                <div className="w-48 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mb-1" />

                {blocks.map((block, index) => (
                    <motion.div
                        key={block.id}
                        className="relative h-12 w-full flex justify-center z-10"
                        animate={isCollapsing ? {
                            x: (Math.random() - 0.5) * 300,
                            y: Math.random() * 200 + 100,
                            rotate: (Math.random() - 0.5) * 180,
                            opacity: 0
                        } : {}}
                        transition={isCollapsing ? {
                            duration: 0.8,
                            delay: index * 0.05,
                            ease: "easeOut"
                        } : {}}
                    >
                        <Block block={block} isFalling={index === blocks.length - 1 && !isCollapsing} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Tower;
