import React from 'react'
import { Enemy, Character } from './types'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'

type CombatProps = {
    currentEnemy: Enemy | null
    enemiesDefeated: number
    character: Character
    showDamage: boolean
    manualDamage: number
    nextFloorAttackRequirement: number
    currentFloor: number
}

export function Combat({
    currentEnemy,
    enemiesDefeated,
    character,
    showDamage,
    manualDamage,
    nextFloorAttackRequirement,
    currentFloor
}: CombatProps) {
    return (
        <motion.div
            className="md:col-span-2 bg-gradient-to-br from-orange-900 to-red-900 rounded-lg p-4 shadow-lg relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold">Floor: {currentFloor}</h2>
                    <div className="text-xs">Next Floor Requires: {nextFloorAttackRequirement} Attack</div>
                </div>
                <AnimatePresence mode="wait">
                    {currentEnemy ? (
                        <motion.div
                            key={currentEnemy.type}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="relative"
                        >
                            <div className="text-5xl mb-2 text-center">{currentEnemy.type}</div>
                            <div className="text-xs mb-1">Health: {currentEnemy.health}</div>
                            <div className="text-xs mb-1">Attack: {currentEnemy.attack}</div>
                            <Progress value={(currentEnemy.health / (currentFloor * 50 * Math.pow(1.05, currentFloor))) * 100} className="mt-1 bg-red-900" />
                            {(showDamage || manualDamage > 0) && (
                                <motion.div
                                    className="text-red-500 font-bold text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                    initial={{ opacity: 1, y: 0 }}
                                    animate={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    -{manualDamage || character.attack}
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <div className="text-center text-lg">Spawning new enemies...</div>
                    )}
                </AnimatePresence>
                <div className="mt-2 text-xs">Enemies defeated: {enemiesDefeated}</div>
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
    )
}
