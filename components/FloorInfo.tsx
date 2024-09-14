import React from 'react'
import { Enemy } from './types'
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

type FloorInfoProps = {
    enemies: Enemy[]
    currentEnemy: Enemy | null
    currentFloor: number
}

export function FloorInfo({ enemies, currentEnemy, currentFloor }: FloorInfoProps) {
    console.log(currentFloor);
    return (
        <motion.div
            className="mt-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <h3 className="text-sm font-semibold mb-1">Enemies on this floor:</h3>
            <div className="flex flex-wrap gap-1">
                {enemies.map((enemy, index) => (
                    <Badge key={index} variant={enemy === currentEnemy ? "default" : "secondary"} className="text-xs p-1">
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
    )
}
