"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useState } from "react";

/**
 * A cobalt dot that trails the mouse. Over anything with a `data-cursor`
 * attribute it opens into a little label carrying that text, and it swells
 * over other links. The real cursor stays visible; this only follows it.
 * With reduced motion it never listens for the mouse, so it stays hidden.
 */
export function CursorFollower() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 320, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 320, damping: 26, mass: 0.6 });
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [overLink, setOverLink] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let shown = false;
    const sync = (target: Element | null) => {
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor ?? null);
      setOverLink(!!target?.closest("a, button"));
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (!shown) {
        // Appear at the pointer instead of springing in from off-screen.
        sx.jump(e.clientX);
        sy.jump(e.clientY);
        shown = true;
        setVisible(true);
      }
      sync(e.target instanceof Element ? e.target : null);
    };
    // Scrolling moves the page under a still pointer, so re-read what it is over.
    // Captured, so scrolling inside an open spread counts too (scroll doesn't bubble).
    const onScroll = () => {
      if (shown) sync(document.elementFromPoint(x.get(), y.get()));
    };
    const onLeave = () => {
      shown = false;
      setVisible(false);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll, { capture: true });
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, x, y, sx, sy]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[90]"
    >
      <motion.div
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.4 }}
        transition={{ duration: 0.2 }}
        className="absolute left-4 top-4"
      >
        <AnimatePresence mode="wait" initial={false}>
          {label ? (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.5, rotate: -14 }}
              animate={{ opacity: 1, scale: 1, rotate: -5 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className="block origin-top-left whitespace-nowrap rounded-full bg-mustard px-3 py-1.5 font-type text-[13px] leading-none text-oxblood shadow-[0_6px_16px_rgba(42,30,24,0.25)]"
            >
              {label}
            </motion.span>
          ) : (
            <motion.span
              key="dot"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: overLink ? 1.8 : 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 24 }}
              className="block h-3 w-3 rounded-full border border-bone/70 bg-cobalt shadow-[0_2px_6px_rgba(42,30,24,0.25)]"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
