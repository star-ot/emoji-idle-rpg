import React from 'react'
import { Button } from "@/components/ui/button"
import { Sword, Shield, Heart } from "lucide-react"
import { Stat } from './types'  // Import the Stat type
import { motion } from "framer-motion"

type UpgradesProps = {
    upgradeCharacter: (stat: Stat) => void  // Use Stat type here
    character: { gold: number, attack: number, defense: number, maxHealth: number }
    getUpgradeCost: (stat: Stat) => number  // Use Stat type here
}

export function Upgrades({ upgradeCharacter, character, getUpgradeCost }: UpgradesProps) {
    return (
        <motion.div
            className="bg-gradient-to-br from-green-900 to-teal-900 rounded-lg p-4 shadow-lg relative overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <div className="relative z-10">
                <h2 className="text-xl font-semibold mb-2">Upgrades</h2>
                <div className="grid grid-cols-1 gap-2">
                    <Button
                        onClick={() => upgradeCharacter('attack')}
                        disabled={character.gold < getUpgradeCost('attack')}
                        className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300 text-xs"
                    >
                        <Sword className="mr-1 h-3 w-3" />
                        Attack ({getUpgradeCost('attack')} gold)
                    </Button>
                    <Button
                        onClick={() => upgradeCharacter('defense')}
                        disabled={character.gold < getUpgradeCost('defense')}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 text-xs"
                    >
                        <Shield className="mr-1 h-3 w-3" />
                        Defense ({getUpgradeCost('defense')} gold)
                    </Button>
                    <Button
                        onClick={() => upgradeCharacter('health')}
                        disabled={character.gold < getUpgradeCost('health')}
                        className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 transition-all duration-300 text-xs"
                    >
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
    )
}
