# Emoji Idle RPG

Emoji Idle RPG is a fun and engaging idle game where players can level up their emoji character, fight various enemies, collect gold, and progress through floors! The game utilizes React for the user interface and hooks for managing state and game mechanics.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Game Mechanics](#game-mechanics)

## Introduction

Emoji Idle RPG is an idle game where players have minimal interaction as their character automatically engages in battles. The game is designed as a Proof of Concept (PoC) using modern web technologies including React, TypeScript, and Framer Motion.

## Features

- Level up your character.
- Fight against various emoji enemies.
- Automatically upgrade character stats.
- Purchase and use healing potions.
- Progress through multiple floors with increasing difficulty.
- Save and load game state using local storage.

## Installation

### Prerequisites

- Node.js and npm installed on your system.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/star-ot/emoji-idle-rpg.git
   cd emoji-idle-rpg
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

### Controls

- **Upgrade Character Stats**: Click on the relevant buttons (Attack, Defense, Health) in the Upgrades section.
- **Buy Healing Potion**: Use the Shop section to purchase potions.
- **Use Potion**: Use the healing potion to recover character health.
- **Manual Attack**: Click the Attack button to deal damage to the enemy.
- **Next Floor**: Progress to the next floor if conditions are met.
- **Delete Character**: Start over with a new character by deleting the current one.

## Game Mechanics

### Character Stats

- **Level**: Increases as the character gains experience points (XP).
- **Attack**: Determines the damage dealt to enemies.
- **Defense**: Reduces incoming damage from enemies.
- **Health**: Character's current and maximum health.
- **Gold**: Currency used for upgrades and purchases.
- **XP**: Earn XP to level up and improve stats.

### Enemies

- **Health**: Amount of damage required to defeat the enemy.
- **Attack**: Damage dealt by the enemy.
- **Rewards**: Gold and XP earned by defeating the enemy.

## Credits

- [Lucide Icons](https://lucide.dev/) for the beautiful icons.
- [Framer Motion](https://www.framer.com/motion/) for animations.
- [React](https://reactjs.org/) and [Next.js](https://nextjs.org/) for the web framework.

## Deploy on Vercel:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/star-ot/emoji-idle-rpg)

---

© 2024 StarVSK. All rights reserved.

Enjoy playing Emoji Idle RPG! 🎮
