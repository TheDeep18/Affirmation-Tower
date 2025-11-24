export type CardType = 'NEGATIVE' | 'AFFIRMATION';

export type CardCategory =
    | 'Doubt' | 'Comparison' | 'Imposter' | 'Rejection' | 'Perfectionism' // Negative
    | 'Growth' | 'Value' | 'Resilience' | 'Process' | 'Clarity' | 'Gratitude'; // Affirmation

export interface Card {
    id: string;
    type: CardType;
    text: string;
    category: CardCategory;
    rationale?: string;
}

export interface Block {
    id: string;
    cardId: string;
    text: string;
    category: CardCategory;
    x: number; // Horizontal position (-50 to 50, 0 is center)
    rotation: number; // Rotation in degrees
    width: number;
    color: string;
}

export interface GameStats {
    score: number;
    perfectDrops: number;
    topAffirmations: Card[];
    towerHeight: number;
}

export interface GameProgress {
    dailyStreak: number;
    lastPlayedISODate: string | null;
    bestHeight: number;
    bestScore: number;
    towers: SavedTower[];
}

export interface SavedTower {
    id: string;
    dateISO: string;
    mode: 'DAILY' | 'FREE';
    height: number;
    score: number;
    blocks: Block[];
}

export interface GamePrefs {
    theme: 'light' | 'dark';
    fontScale: number;
    highContrast: boolean;
    reducedMotion: boolean;
}

export type GamePhase = 'LANDING' | 'CARD' | 'DROP' | 'TOWER' | 'TOWER_REVIEW' | 'END';
