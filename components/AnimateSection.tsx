"use client";

import { motion } from "motion/react";

type AnimateSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "section" | "div";
};

export function AnimateSection({
  children,
  className = "",
  delay = 0,
  as = "section",
}: AnimateSectionProps) {
  const Component = as === "section" ? motion.section : motion.div;

  return (
    <Component
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
