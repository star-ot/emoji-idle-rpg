import React from "react";
import { Character } from "@/lib/types/character";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Zap, Sword, Shield, Heart, Coins, Star } from "lucide-react";

type CharacterStatsProps = {
    character: Character;
};

export function CharacterStats({ character }: CharacterStatsProps) {
    return (
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
                        Level:{" "}
                        <span aria-live="polite" className="ml-1">
                            {character.level}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <Sword className="mr-1 h-4 w-4 text-red-400" />
                        Attack: {character.attack}
                    </div>
                    <div className="flex items-center">
                        <Shield className="mr-1 h-4 w-4 text-blue-400" />
                        Defense: {character.defense}
                    </div>
                    <div className="flex items-center">
                        <Heart className="mr-1 h-4 w-4 text-green-400" />
                        Health: {character.health}/{character.maxHealth}
                    </div>
                    <div className="flex items-center">
                        <Coins className="mr-1 h-4 w-4 text-yellow-400" />
                        Gold: {character.gold}
                    </div>
                    <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 text-purple-400" />
                        XP:{" "}
                        <span aria-live="polite" className="ml-1">
                            {character.xp}/{character.xpToNextLevel}
                        </span>
                    </div>
                </div>
                <div className="relative mt-2">
                    <Progress
                        value={(character.health / character.maxHealth) * 100}
                        className="mt-2 bg-green-900"
                    />
                    {character.health <= 0 && (
                        <div className="absolute top-8 left-0 w-full text-center text-xs text-red-500 font-bold">
                            Incapacitated - Cannot Attack
                        </div>
                    )}
                </div>
                <Progress
                    value={(character.xp / character.xpToNextLevel) * 100}
                    className="mt-2 bg-purple-900"
                />
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
    );
}
