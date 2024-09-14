import { useEffect } from 'react';
import { GameState, Stat } from './types';

export function useAutoUpgrade({ character, upgradeCharacter }: GameState) {
    useEffect(() => {
        const autoUpgrade = setInterval(() => {
            const stats: Stat[] = ['attack', 'defense', 'health']
            const randomStat = stats[Math.floor(Math.random() * stats.length)]
            upgradeCharacter(randomStat)
        }, 10000)

        return () => clearInterval(autoUpgrade)
    }, [character, upgradeCharacter])
}
