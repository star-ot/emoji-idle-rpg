import React from 'react'
import { Button } from "@/components/ui/button"
import { TestTubeDiagonal } from "lucide-react"
import { motion } from "framer-motion"

type ShopAndInventoryProps = {
    character: { gold: number, maxHealth: number }
    inventory: { healingPotions: number }
    earnGold: (amount: number) => void
    heal: (amount: number) => void
    removeFromInventory: (item: string, amount: number) => void
    getPotionCost: () => number
    setMessage: (message: string) => void
}

export function ShopAndInventory({
    character,
    inventory,
    earnGold,
    heal,
    removeFromInventory,
    getPotionCost,
    setMessage
}: ShopAndInventoryProps) {
    const buyPotion = () => {
        const cost = getPotionCost()
        if (character.gold >= cost) {
            earnGold(-cost)
            setMessage("Bought a healing potion!")
        } else {
            setMessage("Not enough gold to buy a potion!")
        }
    }

    const usePotion = () => {
        if (inventory.healingPotions > 0) {
            heal(Math.floor(character.maxHealth * 0.5))
            removeFromInventory('healingPotions', 1)
            setMessage("Used a healing potion! Healed 50% of max health!")
        } else {
            setMessage("No healing potions in inventory!")
        }
    }

    return (
        <motion.div
            className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg p-4 shadow-lg relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <div className="relative z-10">
                <h2 className="text-xl font-semibold mb-2">Shop & Inventory</h2>
                <div className="flex flex-col gap-2">
                    <Button
                        onClick={buyPotion}
                        disabled={character.gold < getPotionCost()}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 transition-all duration-300 text-xs"
                    >
                        Buy Potion ({getPotionCost()} gold)
                    </Button>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <TestTubeDiagonal className="h-4 w-4 mr-1 text-yellow-400" />
                            <span className="text-sm">{inventory.healingPotions}</span>
                        </div>
                        <Button
                            onClick={usePotion}
                            disabled={inventory.healingPotions === 0}
                            className="bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 transition-all duration-300 text-xs"
                        >
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
    )
}
