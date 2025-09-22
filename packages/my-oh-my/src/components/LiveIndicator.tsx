'use client';

import { motion } from 'framer-motion';

export function LiveIndicator() {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="w-2 h-2 bg-green-400 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <span className="text-sm font-medium text-green-400">LIVE</span>
    </div>
  );
}
