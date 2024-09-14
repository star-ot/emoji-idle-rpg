import { useState, useEffect, useCallback } from 'react';
import { Character, Enemy, GameState, Stat, Inventory, Prev } from './types';

export function useGameState(): GameState {
    const defaultData: Character = {
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        attack: 5,
        defense: 5,
        health: 100,
        maxHealth: 100,
        gold: 0,
    }

    const defaultInventory: Inventory = { healingPotions: 0 }
    const defaultFloor = 1

    const [character, setCharacter] = useState<Character>(() => {
        if (typeof window !== 'undefined') {
            const savedCharacter = localStorage.getItem('idleRPGCharacter')
            return savedCharacter ? JSON.parse(savedCharacter) : defaultData
        }
        return defaultData
    })

    const [currentFloor, setCurrentFloor] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const savedFloor = localStorage.getItem('idleRPGCurrentFloor')
            return savedFloor ? JSON.parse(savedFloor) : defaultFloor
        }
        return defaultFloor
    })

    const [inventory, setInventory] = useState<Inventory>(() => {
        if (typeof window !== 'undefined') {
            const savedInventory = localStorage.getItem('idleRPGInventory')
            return savedInventory ? JSON.parse(savedInventory) : defaultInventory
        }
        return defaultInventory
    })

    const [enemies, setEnemies] = useState<Enemy[]>([])
    const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null)
    const [enemiesDefeated, setEnemiesDefeated] = useState<number>(0)

    useEffect(() => {
        localStorage.setItem('idleRPGCharacter', JSON.stringify(character))
    }, [character])

    useEffect(() => {
        localStorage.setItem('idleRPGCurrentFloor', JSON.stringify(currentFloor))
    }, [currentFloor])

    useEffect(() => {
        localStorage.setItem('idleRPGInventory', JSON.stringify(inventory))
    }, [inventory])

    const upgradeCharacter = useCallback((stat: Stat) => {
        setCharacter((prev: Character) => {
            let upgradeCost
            if (stat === 'health') {
                upgradeCost = Math.floor(prev.maxHealth * 0.2)
            } else {
                upgradeCost = Math.floor(10 * Math.pow(1.1, prev[stat]))
            }
            if (prev.gold < upgradeCost) return prev

            const newStats = { ...prev, gold: prev.gold - upgradeCost }
            switch (stat) {
                case 'attack':
                    newStats.attack = Math.floor(prev.attack + 1)
                    break
                case 'defense':
                    newStats.defense = Math.floor(prev.defense + 1)
                    break
                case 'health':
                    newStats.maxHealth = Math.floor(prev.maxHealth * 1.1)
                    newStats.health = newStats.maxHealth
                    break
            }
            return newStats
        })
    }, [])

    const earnGold = useCallback((amount: number) => {
        setCharacter((prev: Prev) => ({ ...prev, gold: prev.gold + amount }))
    }, [])

    const heal = useCallback((amount: number) => {
        setCharacter((prev: Prev) => ({
            ...prev,
            health: Math.min(prev.health + amount, prev.maxHealth),
        }))
    }, [])

    const addToInventory = useCallback((item: string, amount: number) => {
        setInventory((prev: Inventory) => ({
            ...prev,
            [item]: (prev[item] || 0) + amount
        }))
    }, [])

    const removeFromInventory = useCallback((item: string, amount: number) => {
        setInventory((prev: Inventory) => ({
            ...prev,
            [item]: Math.max((prev[item] || 0) - amount, 0),
        }))
    }, [])

    const gainXP = useCallback((amount: number) => {
        setCharacter((prev: Prev) => {
            let newXP = prev.xp + amount
            let newLevel = prev.level
            let newXPToNextLevel = prev.xpToNextLevel

            while (newXP >= newXPToNextLevel) {
                newXP -= newXPToNextLevel
                newLevel++
                newXPToNextLevel = Math.floor(newXPToNextLevel * 1.1)
            }

            return {
                ...prev,
                xp: newXP,
                level: newLevel,
                xpToNextLevel: newXPToNextLevel,
                attack: prev.attack + (newLevel - prev.level),
                defense: prev.defense + (newLevel - prev.level),
                maxHealth: prev.maxHealth + (newLevel - prev.level) * 10,
                health: prev.health + (newLevel - prev.level) * 10,
            }
        })
    }, [])

    const deleteCharacter = useCallback(() => {
        localStorage.removeItem('idleRPGCharacter')
        localStorage.removeItem('idleRPGCurrentFloor')
        localStorage.removeItem('idleRPGInventory')
        setCharacter(defaultData)
        setCurrentFloor(defaultFloor)
        setEnemies([])
        setCurrentEnemy(null)
        setEnemiesDefeated(0)
        setInventory(defaultInventory)
    }, [])

    return {
        character,
        setCharacter,
        currentFloor,
        setCurrentFloor,
        enemies,
        setEnemies,
        currentEnemy,
        setCurrentEnemy,
        enemiesDefeated,
        setEnemiesDefeated,
        inventory,
        upgradeCharacter,
        earnGold,
        heal,
        addToInventory,
        removeFromInventory,
        gainXP,
        deleteCharacter,
    }
}
export type { Stat };

