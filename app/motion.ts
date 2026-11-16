import { useReducedMotion, type Transition } from "framer-motion";

/** The site's standard ease-out curve. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Wraps a transition so it becomes instant for people who prefer reduced
 * motion. Elements keep the same markup either way (so hydration matches);
 * they just arrive without moving.
 */
export function useTiming() {
  const reduced = !!useReducedMotion();
  const timing = (t: Transition): Transition => (reduced ? { duration: 0 } : t);
  return { reduced, timing };
}
