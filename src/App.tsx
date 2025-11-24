import React, { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import Landing from './pages/Landing';
import CardDeck from './components/CardDeck';
import Tower from './components/Tower';
import EndScreen from './pages/EndScreen';
import Settings from './pages/Settings';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings as SettingsIcon, Layout, Maximize } from 'lucide-react';

function App() {
    const { phase, prefs } = useGameStore();
    const [showSettings, setShowSettings] = React.useState(false);
    const [isSplitView, setIsSplitView] = React.useState(true);
    const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024);

    // Apply theme and font scale
    useEffect(() => {
        document.documentElement.classList.toggle('dark', prefs.theme === 'dark');
        document.documentElement.style.fontSize = `${prefs.fontScale * 16}px`;
    }, [prefs]);

    // Detect screen size and force focused view on mobile/tablet
    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 1024; // lg breakpoint
            setIsDesktop(desktop);
            if (!desktop) {
                setIsSplitView(false); // Force focused view on mobile/tablet
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden relative">

            {/* Header / HUD */}
            <header className="absolute top-0 left-0 right-0 p-4 z-50 flex justify-between items-center pointer-events-none">
                <h1 className="text-xl font-bold opacity-50">Affirmation Tower</h1>
                <div className="flex items-center gap-2 pointer-events-auto">
                    {/* Layout Toggle - Only visible on desktop */}
                    {isDesktop && (
                        <button
                            onClick={() => setIsSplitView(!isSplitView)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all transform hover:scale-105 font-bold z-50"
                            aria-label="Toggle Layout"
                        >
                            {isSplitView ? <Maximize size={18} /> : <Layout size={18} />}
                            <span>{isSplitView ? 'Focus View' : 'Split View'}</span>
                        </button>
                    )}

                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        aria-label="Settings"
                    >
                        <SettingsIcon size={24} />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="h-screen w-full flex flex-col items-center justify-center relative">
                <AnimatePresence mode="wait">
                    {phase === 'LANDING' && (
                        <motion.div
                            key="landing"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full h-full"
                        >
                            <Landing />
                        </motion.div>
                    )}

                    {(phase === 'CARD' || phase === 'DROP' || phase === 'TOWER') && (
                        <motion.div
                            key="game"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full relative"
                        >
                            {isSplitView ? (
                                // Split View - Force Row
                                <div className="w-full h-full flex flex-row">
                                    <div className="w-1/2 h-full flex items-center justify-center relative z-20 p-4">
                                        <CardDeck />
                                    </div>
                                    <div className="w-1/2 h-full relative z-10 bg-slate-50/50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-slate-800">
                                        <Tower />
                                    </div>
                                </div>
                            ) : (
                                // Focused View (Card Centered, Tower Background)
                                <div className="w-full h-full relative flex items-center justify-center">
                                    <div className="absolute inset-0 z-0 opacity-30 blur-sm pointer-events-none">
                                        <Tower />
                                    </div>
                                    <div className="relative z-10">
                                        <CardDeck />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {phase === 'END' && (
                        <motion.div
                            key="end"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="w-full h-full z-20 flex items-center justify-center"
                        >
                            <EndScreen />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <Settings onClose={() => setShowSettings(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
