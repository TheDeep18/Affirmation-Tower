import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'framer-motion';
import { X, Moon, Sun, Type, Eye } from 'lucide-react';

interface SettingsProps {
    onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
    const { prefs, updatePrefs } = useGameStore();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Settings</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                        <X />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Theme */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Sun className="text-slate-400" />
                            <span className="font-medium">Theme</span>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                            <button
                                onClick={() => updatePrefs({ theme: 'light' })}
                                className={`p-2 rounded-md transition-all ${prefs.theme === 'light' ? 'bg-white shadow text-emerald-600' : 'text-slate-400'}`}
                            >
                                <Sun size={20} />
                            </button>
                            <button
                                onClick={() => updatePrefs({ theme: 'dark' })}
                                className={`p-2 rounded-md transition-all ${prefs.theme === 'dark' ? 'bg-slate-600 shadow text-emerald-400' : 'text-slate-400'}`}
                            >
                                <Moon size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Font Size */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-2">
                            <Type className="text-slate-400" />
                            <span className="font-medium">Text Size</span>
                        </div>
                        <input
                            type="range"
                            min="0.8"
                            max="1.5"
                            step="0.1"
                            value={prefs.fontScale}
                            onChange={(e) => updatePrefs({ fontScale: parseFloat(e.target.value) })}
                            className="w-full accent-emerald-500"
                        />
                    </div>

                    {/* High Contrast */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Eye className="text-slate-400" />
                            <span className="font-medium">High Contrast</span>
                        </div>
                        <button
                            onClick={() => updatePrefs({ highContrast: !prefs.highContrast })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${prefs.highContrast ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${prefs.highContrast ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-center text-xs text-slate-400">
                        v1.0.0 • Built with ❤️
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Settings;
