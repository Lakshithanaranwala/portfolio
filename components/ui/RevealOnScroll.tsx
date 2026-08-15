'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
};

export default function RevealOnScroll({ children, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
