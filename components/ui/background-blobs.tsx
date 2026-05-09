"use client"

import { motion } from "motion/react"

export function BackgroundBlobs() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] -left-[10%] w-[50%] aspect-square bg-primary/10 border-organic blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -30, 40, 0],
          y: [0, 50, -30, 0],
          rotate: [0, -15, 15, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[20%] -right-[15%] w-[45%] aspect-square bg-accent/10 border-organic-2 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 20, -30, 0],
          y: [0, 30, -50, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute -bottom-[15%] left-[20%] w-[40%] aspect-square bg-[var(--ouro)]/10 border-organic-3 blur-3xl"
      />
    </div>
  )
}
