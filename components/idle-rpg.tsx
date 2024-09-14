"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Sword, Shield, Heart, Zap, Coins, Star, Trash2, TestTubeDiagonal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Character = {
  level: number
  xp: number
  xpToNextLevel: number
  defense: number
  health: number
  maxHealth: number
  gold: number
  attack: number
}

interface Enemy {
  type: string
  health: number
  attack: number
  goldReward: number
  xpReward: number
}

interface GameState {
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

type Stat = 'attack' | 'defense' | 'health'

type Inventory = {
  [key: string]: number;
}

type Prev = Character

function useGameState(): GameState {
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

type UseCombatSystemProps = {
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

function useCombatSystem({ character, currentEnemy, setCharacter, setCurrentEnemy, earnGold, enemies, setEnemies, enemiesDefeated, setEnemiesDefeated, gainXP }: UseCombatSystemProps) {
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

function useFloorSystem({ currentFloor, setCurrentFloor, setEnemies, setCurrentEnemy, setEnemiesDefeated }: GameState) {
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

function useAutoUpgrade({ character, upgradeCharacter }: GameState) {
  useEffect(() => {
    const autoUpgrade = setInterval(() => {
      const stats: Stat[] = ['attack', 'defense', 'health']
      const randomStat = stats[Math.floor(Math.random() * stats.length)]
      upgradeCharacter(randomStat)
    }, 10000)

    return () => clearInterval(autoUpgrade)
  }, [character, upgradeCharacter])
}

export function IdleRpg() {
  const gameState = useGameState()
  const { attack } = useCombatSystem(gameState)
  const { nextFloor, generateEnemies } = useFloorSystem(gameState)
  useAutoUpgrade(gameState)

  const [message, setMessage] = useState<string>("")
  const [showDamage, setShowDamage] = useState<boolean>(false)
  const [manualDamage, setManualDamage] = useState<number>(0)

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (gameState.character.health <= 0) return
      attack()
      setShowDamage(true)
      setTimeout(() => setShowDamage(false), 200)
    }, 1000)

    return () => clearInterval(gameLoop)
  }, [attack, gameState.character.health])

  useEffect(() => {
    if (gameState.enemies.length === 0 || (gameState.enemies.length < 3 && !gameState.currentEnemy)) {
      generateEnemies()
    }
  }, [gameState.enemies.length, gameState.currentEnemy, generateEnemies])

  const getUpgradeCost = (stat: Stat) => {
    if (stat === 'health') {
      return Math.floor(gameState.character.maxHealth * 0.2)
    }
    return Math.floor(10 * Math.pow(1.1, gameState.character[stat]))
  }

  const handleNextFloor = () => {
    nextFloor()
    setMessage(`Progressed to floor ${gameState.currentFloor + 1}!`)
  }

  const nextFloorAttackRequirement = Math.floor(gameState.currentFloor * 5 * Math.pow(1.1, gameState.currentFloor - 1))
  const canProgressToNextFloor = gameState.character.attack >= nextFloorAttackRequirement

  const getPotionCost = () => {
    return Math.floor(gameState.character.maxHealth * 0.05)
  }

  const buyPotion = () => {
    const cost = getPotionCost()
    if (gameState.character.gold >= cost) {
      gameState.earnGold(-cost)
      setMessage("Bought a healing potion!")
    } else {
      setMessage("Not enough gold to buy a potion!")
    }
  }

  const usePotion = () => {
    if (gameState.inventory.healingPotions > 0) {
      gameState.heal(Math.floor(gameState.character.maxHealth * 0.5))
      gameState.removeFromInventory('healingPotions', 1)
      setMessage("Used a healing potion! Healed 50% of max health!")
    } else {
      setMessage("No healing potions in inventory!")
    }
  }

  const handleManualAttack = () => {
    if (gameState.character.health > 0) {
      const damage = attack()
      if (damage !== undefined) {
        setManualDamage(damage)
        setTimeout(() => setManualDamage(0), 500)
      }
    }
  }


  const handleDeleteCharacter = () => {
    if (confirm("Are you sure you want to delete your character? This action cannot be undone.")) {
      gameState.deleteCharacter()
      setMessage("Character deleted. Starting a new game...")
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => setMessage(""), 5000)
    return () => clearTimeout(timeout)
  }, [message])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 text-white p-2 overflow-hidden flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-7xl bg-black bg-opacity-50 rounded-xl shadow-2xl p-4 backdrop-blur-sm">
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
              Emoji Idle RPG
            </span>
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              className="md:col-span-2 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-4 shadow-lg relative overflow-hidden"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative z-10">
                <h2 className="text-xl font-semibold mb-2">Character</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center">
                    <Zap className="mr-1 h-4 w-4 text-yellow-400" />
                    Level: <span aria-live="polite" className="ml-1">{gameState.character.level}</span>
                  </div>
                  <div className="flex items-center">
                    <Sword className="mr-1 h-4 w-4 text-red-400" />
                    Attack: {gameState.character.attack}
                  </div>
                  <div className="flex items-center">
                    <Shield className="mr-1 h-4 w-4 text-blue-400" />
                    Defense: {gameState.character.defense}
                  </div>
                  <div className="flex items-center">
                    <Heart className="mr-1 h-4 w-4 text-green-400" />
                    Health: {gameState.character.health}/{gameState.character.maxHealth}
                  </div>
                  <div className="flex items-center">
                    <Coins className="mr-1 h-4 w-4 text-yellow-400" />
                    Gold: {gameState.character.gold}
                  </div>
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 text-purple-400" />
                    XP: <span aria-live="polite" className="ml-1">{gameState.character.xp}/{gameState.character.xpToNextLevel}</span>
                  </div>
                </div>
                <div className="relative mt-2">
                  <Progress value={(gameState.character.health / gameState.character.maxHealth) * 100} className="mt-2 bg-green-900"/>
                  {gameState.character.health <= 0 && (
                    <div className="absolute top-8 left-0 w-full text-center text-xs text-red-500 font-bold">
                    Incapacitated - Cannot Attack
                  </div>
                )}
              </div>
              <Progress value={(gameState.character.xp / gameState.character.xpToNextLevel) * 100} className="mt-2 bg-purple-900"/>
            </div>
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-10"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-green-900 to-teal-900 rounded-lg p-4 shadow-lg relative overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative z-10">
              <h2 className="text-xl font-semibold mb-2">Upgrades</h2>
              <div className="grid grid-cols-1 gap-2">
                <Button onClick={() => gameState.upgradeCharacter('attack')} disabled={gameState.character.gold < getUpgradeCost('attack')} className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300 text-xs">
                  <Sword className="mr-1 h-3 w-3" />
                  Attack ({getUpgradeCost('attack')} gold)
                </Button>
                <Button onClick={() => gameState.upgradeCharacter('defense')} disabled={gameState.character.gold < getUpgradeCost('defense')} className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 text-xs">
                  <Shield className="mr-1 h-3 w-3" />
                  Defense ({getUpgradeCost('defense')} gold)
                </Button>
                <Button onClick={() => gameState.upgradeCharacter('health')} disabled={gameState.character.gold < getUpgradeCost('health')} className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 transition-all duration-300 text-xs">
                  <Heart className="mr-1 h-3 w-3" />
                  Health ({getUpgradeCost('health')} gold)
                </Button>
              </div>
            </div>
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-green-500 opacity-10"
              animate={{
                scale: [1, 1.5, 1],
                rotate: [0, 180, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>

          <motion.div
            className="md:col-span-2 bg-gradient-to-br from-orange-900 to-red-900 rounded-lg p-4 shadow-lg relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Floor: {gameState.currentFloor}</h2>
                <div className="text-s">Next Floor Requires: {nextFloorAttackRequirement} Attack</div>
              </div>
              <AnimatePresence mode="wait">
                {gameState.currentEnemy ? (
                  <motion.div
                    key={gameState.currentEnemy.type}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <div className="text-5xl mb-2 text-center">{gameState.currentEnemy.type}</div>
                    <div className="text-xs mb-1">Health: {gameState.currentEnemy.health}</div>
                    <div className="text-xs mb-1">Attack: {gameState.currentEnemy.attack}</div>
                      <Progress value={(gameState.currentEnemy.health / (gameState.currentFloor * 50 * Math.pow(1.05, gameState.currentFloor))) * 100} className="mt-1 bg-red-900"/>
                      {(showDamage || manualDamage > 0) && (
                        <motion.div
                          className="text-red-500 font-bold text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          initial={{ opacity: 1, y: 0 }}
                          animate={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                        >
                          -{manualDamage || gameState.character.attack}
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="text-center text-lg">Spawning new enemies...</div>
                  )}
                </AnimatePresence>
                <div className="mt-2 text-xs">Enemies defeated: {gameState.enemiesDefeated}</div>
              </div>
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-red-500 opacity-10"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, -90, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg p-4 shadow-lg relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative z-10">
                <h2 className="text-xl font-semibold mb-2">Shop & Inventory</h2>
                <div className="flex flex-col gap-2">
                  <Button onClick={buyPotion} disabled={gameState.character.gold < getPotionCost()} className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 transition-all duration-300 text-xs">
                    Buy Potion ({getPotionCost()} gold)
                  </Button>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TestTubeDiagonal className="h-4 w-4 mr-1 text-yellow-400" />
                      <span className="text-sm">{gameState.inventory.healingPotions}</span>
                    </div>
                    <Button onClick={usePotion} disabled={gameState.inventory.healingPotions === 0} className="bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 transition-all duration-300 text-xs">
                      Use Potion
                    </Button>
                  </div>
                </div>
              </div>
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-purple-500 opacity-10"
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, 45, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </motion.div>
          </div>

          <motion.div
            className="mt-4 flex flex-wrap justify-between gap-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button onClick={handleManualAttack} disabled={!gameState.currentEnemy || gameState.character.health <= 0} size="sm" className="text-lg bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 transition-all duration-300">
              <Sword className="mr-1 h-6 w-6" />
              Attack
            </Button>
            <Button onClick={handleNextFloor} disabled={!canProgressToNextFloor} size="sm" className="text-lg bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 transition-all duration-300">
            <Zap className="mr-1 h-6 w-6" />
              Next Floor
            </Button>
            {/* Uncomment for debugging purpose */}
            {/* <Button onClick={addDebugGold} variant="outline" size="sm" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300">
              <Coins className="mr-1 h-3 w-3" />
              Debug: Add Gold
            </Button> */}
            <Button onClick={handleDeleteCharacter} variant="destructive" size="sm" className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300">
              <Trash2 className="mr-1 h-4 w-4" />
              Delete Character
            </Button>
          </motion.div>

          <AnimatePresence>
            {message && (
              <motion.div
                className="mt-2 p-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg flex items-center text-xs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="mr-1 h-4 w-4" />
                <span>{message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="mt-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-sm font-semibold mb-1">Enemies on this floor:</h3>
            <div className="flex flex-wrap gap-1">
              {gameState.enemies.map((enemy, index) => (
                <Badge key={index} variant={enemy === gameState.currentEnemy ? "default" : "secondary"} className="text-xs p-1">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {enemy.type}
                  </motion.span>
                </Badge>
              ))}
            </div>
          </motion.div>
          <div className='flex mt-4 justify-between'>
            <p className="text-xs text-gray-400 mt-4">© 2024 StarVSK. All rights reserved.</p>
            <p className="text-xs text-gray-400 mt-4">Idle RPG Game v1.0</p>
          </div>
        </div>
      </div>
      <div className="h-32 bg-gray-800 mt-4 flex items-center justify-center">
        <p className="text-sm text-gray-400">Advertisement Space</p>
      </div>
    </div>
  )
}
