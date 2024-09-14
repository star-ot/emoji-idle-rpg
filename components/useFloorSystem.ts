import { useCallback } from 'react';
import { GameState } from './types';

export function useFloorSystem({ currentFloor, setCurrentFloor, setEnemies, setCurrentEnemy, setEnemiesDefeated }: GameState) {
    const generateEnemies = useCallback(() => {
        const enemyTypes = ['👾', '👹', '👻', '👽', '🤖', '🎃', '👿', '👺', '🧟', '🧛']
        const numEnemies = Math.floor(Math.random() * 3) + 3
        const newEnemies = Array.from({ length: numEnemies }, () => ({
            type: enemyTypes[Math.floor(Math.random() * enemyTypes.length)],
            health: Math.floor(currentFloor * 50 * Math.pow(1.05, currentFloor)),
            attack: Math.floor(currentFloor * 2 * Math.pow(1.03, currentFloor)),
            goldReward: Math.floor(currentFloor * 10 * Math.pow(1.1, currentFloor)),
            xpReward: Math.floor(currentFloor * 20 * Math.pow(1.05, currentFloor)),
        }))
        setEnemies(prevEnemies => {
            const updatedEnemies = [...prevEnemies, ...newEnemies]
            if (!prevEnemies[0]) {
                setCurrentEnemy(newEnemies[0])
            }
            return updatedEnemies
        })
    }, [currentFloor, setEnemies, setCurrentEnemy])

    const nextFloor = useCallback(() => {
        setCurrentFloor(prev => prev + 1)
        setEnemies([])
        setCurrentEnemy(null)
        setEnemiesDefeated(0)
        generateEnemies()
    }, [setCurrentFloor, setEnemies, setCurrentEnemy, setEnemiesDefeated, generateEnemies])

    return { nextFloor, generateEnemies }
}
