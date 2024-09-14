import { useCallback } from 'react';
import { UseCombatSystemProps } from './types';

export function useCombatSystem({
    character,
    currentEnemy,
    setCharacter,
    setCurrentEnemy,
    earnGold,
    enemies,
    setEnemies,
    enemiesDefeated,
    setEnemiesDefeated,
    gainXP
}: UseCombatSystemProps) {
    const attack = useCallback(() => {
        if (!currentEnemy || character.health <= 0) return
        if (enemiesDefeated >= 10) {
            console.log("You have defeated 10 enemies! You are now a master!")
        }

        const updatedEnemy = { ...currentEnemy, health: currentEnemy.health - character.attack }

        if (updatedEnemy.health <= 0) {
            earnGold(currentEnemy.goldReward)
            gainXP(currentEnemy.xpReward)
            setEnemiesDefeated(prev => prev + 1)
            const newEnemies = enemies.slice(1)
            setEnemies(newEnemies)
            setCurrentEnemy(newEnemies[0] || null)
        } else {
            setCurrentEnemy(updatedEnemy)
            const damageTaken = Math.max(1, currentEnemy.attack - character.defense)
            setCharacter(prev => ({
                ...prev,
                health: Math.max(0, prev.health - damageTaken),
            }))
        }
        return character.attack
    }, [character, currentEnemy, setCharacter, setCurrentEnemy, earnGold, enemies, setEnemies, setEnemiesDefeated, gainXP])

    return { attack }
}
