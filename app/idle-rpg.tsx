"use client";
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Sword, Zap, Trash2 } from "lucide-react"
import { CharacterStats } from '@/components/CharacterStats'
import { Combat } from '@/components/Combat'
import { Upgrades } from '@/components/Upgrades'
import { ShopAndInventory } from '@/components/ShopAndInventory'
import { FloorInfo } from '@/components/FloorInfo'
import { Footer } from '@/components/Footer'
import { FooterAd } from '@/components/FooterAd'
import { useGameState, Stat } from '@/components/useGameState'
import { useCombatSystem } from '@/components/useCombatSystem'
import { useFloorSystem } from '@/components/useFloorSystem'
import { useAutoUpgrade } from '@/components/useAutoUpgrade'

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
            <CharacterStats character={gameState.character} />
            <Upgrades character={gameState.character} upgradeCharacter={gameState.upgradeCharacter} getUpgradeCost={getUpgradeCost} />
            <Combat
              currentEnemy={gameState.currentEnemy}
              enemiesDefeated={gameState.enemiesDefeated}
              character={gameState.character}
              showDamage={showDamage}
              manualDamage={manualDamage}
              nextFloorAttackRequirement={nextFloorAttackRequirement}
              currentFloor={gameState.currentFloor}
            />
            <ShopAndInventory
              character={gameState.character}
              inventory={gameState.inventory}
              earnGold={gameState.earnGold}
              heal={gameState.heal}
              removeFromInventory={gameState.removeFromInventory}
              addToInventory={gameState.addToInventory}
              getPotionCost={getPotionCost}
              setMessage={setMessage}
            />
          </div>

          <motion.div
            className="mt-4 flex flex-wrap justify-between gap-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              onClick={handleManualAttack}
              disabled={!gameState.currentEnemy || gameState.character.health <= 0}
              size="sm"
              className="text-lg bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 transition-all duration-300"
            >
              <Sword className="mr-1 h-6 w-6" />
              Attack
            </Button>
            <Button
              onClick={handleNextFloor}
              disabled={!canProgressToNextFloor}
              size="sm"
              className="text-lg bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 transition-all duration-300"
            >
              <Zap className="mr-1 h-6 w-6" />
              Next Floor
            </Button>
            <Button
              onClick={handleDeleteCharacter}
              variant="destructive"
              size="sm"
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300"
            >
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

          <FloorInfo
            enemies={gameState.enemies}
            currentEnemy={gameState.currentEnemy}
            currentFloor={gameState.currentFloor}
          />
          <Footer />
        </div>
      </div>
      <FooterAd />
    </div>
  )
}
