export type Stat = 'attack' | 'defense' | 'health'

export type Inventory = {
    healingPotions: number; // This should ensure `healingPotions` is defined
    [key: string]: number; // This should ensure any other key is defined
}

export type Character = {
    level: number
    xp: number
    xpToNextLevel: number
    defense: number
    health: number
    maxHealth: number
    gold: number
    attack: number
}

export interface Enemy {
    type: string
    health: number
    attack: number
    goldReward: number
    xpReward: number
}

export interface GameState {
    character: Character
    setCharacter: React.Dispatch<React.SetStateAction<Character>>
    currentFloor: number
    setCurrentFloor: React.Dispatch<React.SetStateAction<number>>
    enemies: Enemy[]
    setEnemies: React.Dispatch<React.SetStateAction<Enemy[]>>
    currentEnemy: Enemy | null
    setCurrentEnemy: React.Dispatch<React.SetStateAction<Enemy | null>>
    enemiesDefeated: number
    setEnemiesDefeated: React.Dispatch<React.SetStateAction<number>>
    inventory: Inventory
    upgradeCharacter: (stat: Stat) => void
    earnGold: (amount: number) => void
    heal: (amount: number) => void
    addToInventory: (item: string, amount: number) => void
    removeFromInventory: (item: string, amount: number) => void
    gainXP: (amount: number) => void
    deleteCharacter: () => void
}


export type Prev = Character

export type UseCombatSystemProps = {
    character: Character;
    currentEnemy: Enemy | null;
    setCharacter: React.Dispatch<React.SetStateAction<Character>>;
    setCurrentEnemy: React.Dispatch<React.SetStateAction<Enemy | null>>;
    earnGold: (amount: number) => void;
    enemies: Enemy[];
    setEnemies: React.Dispatch<React.SetStateAction<Enemy[]>>;
    enemiesDefeated: number;
    setEnemiesDefeated: React.Dispatch<React.SetStateAction<number>>;
    gainXP: (xp: number) => void;
};
