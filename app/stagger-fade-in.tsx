"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.075,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const noMotion = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export function StaggerFadeIn({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const child = prefersReduced ? noMotion : childVariants;

  return (
    <motion.div
      variants={prefersReduced ? undefined : containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {Array.isArray(children)
        ? children.map((c, i) => (
            <motion.div key={i} variants={child}>
              {c}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

export function FadeInSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const child = prefersReduced ? noMotion : childVariants;

  return (
    <motion.div variants={child} className={className}>
      {children}
    </motion.div>
  );
}
