"use client"

import { motion } from "motion/react"
import { usePathname } from "next/navigation"

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.21, 0.47, 0.32, 0.98], // Cubic bezier para um movimento orgânico
      }}
    >
      {children}
    </motion.div>
  )
}
