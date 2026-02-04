"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const noMotion = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function StaggerFadeIn({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReduced = usePrefersReducedMotion();
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
  const prefersReduced = usePrefersReducedMotion();
  const child = prefersReduced ? noMotion : childVariants;

  return (
    <motion.div variants={child} className={className}>
      {children}
    </motion.div>
  );
}
