"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import type { Role } from "./cover";
import { useTiming } from "./motion";
import { READING_HASH, WATCHING_HASH } from "./personal-links";

type FooterLink = {
  label: string;
  href: string;
  /** Text the cursor label shows on hover. */
  cursor: string;
  /** Resting tilt in degrees. */
  tilt: number;
  /** Line-drawing icon, as pen strokes in a 20 x 20 box. */
  icon: string[];
  /** Which hand-drawn loop circles the link on hover. */
  loop: number;
  /** The hat this link belongs to, if any (see the roles in cover.tsx). */
  role?: Role;
};

const links: FooterLink[] = [
  // Hidden for now. Uncomment to bring the resume link back.
  // {
  //   label: "Resume",
  //   href: "https://drive.google.com/file/d/14Ki6bSKAT2-WeS7banVjEOyyrCBfsuuq/view?usp=sharing",
  //   cursor: "the one-pager ↗",
  //   tilt: -2,
  //   icon: ["M5 2.5h7l3.5 3.5v11.5H5z", "M12 2.5V6h3.5", "M7.5 10h5", "M7.5 13h5"],
  //   loop: 0,
  // },
  {
    label: "linkedin",
    href: "https://www.linkedin.com/in/sherry-liu-0183a7167/",
    cursor: "say hi ↗",
    tilt: 1.5,
    icon: ["M3.5 4.5h13v9h-7l-3.5 3v-3h-2.5z", "M7 8h6", "M7 10.5h4"],
    loop: 1,
  },
  {
    label: "substack",
    role: "writer",
    href: "https://sherryliuser.substack.com/",
    cursor: "read ↗",
    tilt: -1,
    icon: ["M13.5 3.5l3 3L7 16l-3.8.8L4 13z", "M11.5 5.5l3 3"],
    loop: 2,
  },
  {
    label: "bookshelf",
    href: READING_HASH,
    cursor: "what i’m reading →",
    tilt: 2,
    icon: [
      "M10 5c-1.6-1.3-3.8-1.6-6.5-1v11c2.7-.6 4.9-.3 6.5 1 1.6-1.3 3.8-1.6 6.5-1V4c-2.7-.6-4.9-.3-6.5 1z",
      "M10 5v11",
    ],
    loop: 0,
  },
  {
    label: "film roll",
    href: WATCHING_HASH,
    cursor: "what i’m watching →",
    tilt: -1.5,
    icon: [
      "M4.5 4h11a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 14.5v-9A1.5 1.5 0 0 1 4.5 4z",
      "M6.5 4v12",
      "M13.5 4v12",
      "M3 8h3.5",
      "M3 12h3.5",
      "M13.5 8H17",
      "M13.5 12H17",
    ],
    loop: 1,
  },
];

/** Pen loops in a 100 x 40 box; each overshoots its start like a real scribble. */
const LOOPS = [
  "M9 22 C6 8 30 3 52 3 C78 3 97 9 95 21 C93 34 68 38 46 37 C22 36 4 31 10 16",
  "M12 12 C28 2 70 1 88 9 C100 15 98 30 82 35 C60 41 24 39 9 30 C0 23 6 11 20 7",
  "M6 20 C8 6 34 2 58 4 C82 6 98 14 93 25 C88 37 58 39 36 37 C16 35 3 30 7 15",
];

/**
 * One item in the strip under the cover, in the same thin pen line as the
 * screenshot notes: a line-drawn icon, a word and a wavy underline, sitting at
 * a slight tilt. The icon is drawn in on load; on hover a loop is scribbled
 * around the item while the icon wiggles. `circled` keeps the loop on.
 *
 * Renders a link when given `href`, otherwise a checkbox-style button, so the
 * hats on the left and the links on the right are the same object.
 */
export function Doodle({
  label,
  icon,
  tilt,
  loop,
  index,
  cursor,
  href,
  onClick,
  circled = false,
  children,
}: {
  label: string;
  /** Pen strokes in a 20 x 20 box. */
  icon: string[];
  tilt: number;
  loop: number;
  index: number;
  cursor: string;
  href?: string;
  onClick?: () => void;
  circled?: boolean;
  /** Extra strokes drawn inside the icon, e.g. a tick. */
  children?: ReactNode;
}) {
  const { reduced, timing } = useTiming();
  const draw = (duration: number, delay = 0) =>
    timing({ duration, delay, ease: "easeInOut" });
  // The staggered delay is only for the first draw-in on load; afterwards the
  // underline should come straight back when a hover or a tick ends.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const shared = {
    "data-cursor": cursor,
    initial: "hidden",
    animate: circled ? "hover" : "rest",
    whileHover: "hover",
    whileTap: { scale: 0.96 },
    style: { rotate: tilt },
    className: `group relative inline-flex cursor-pointer items-center gap-1.5 px-1 py-1.5 text-[12px] leading-5 sm:px-2.5 sm:text-[13px] transition-colors duration-300 hover:text-mustard ${
      circled ? "text-mustard" : "text-bone"
    }`,
  } as const;

  const inner = (
    <>
      <motion.svg
        width="14"
        height="14"
        viewBox="0 0 20 20"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="overflow-visible"
        variants={{
          hover: reduced
            ? {}
            : { rotate: [0, -12, 9, 0], transition: { duration: 0.5 } },
        }}
      >
        {icon.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              rest: {
                pathLength: 1,
                opacity: 1,
                transition: draw(0.5, 0.15 + index * 0.12 + i * 0.1),
              },
              hover: { pathLength: 1, opacity: 1 },
            }}
          />
        ))}
        {children}
      </motion.svg>
      {label}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        fill="none"
        stroke="#E8B04A"
        strokeWidth="1.3"
        strokeLinecap="round"
      >
        {/* resting squiggle under the word; it gives way to the loop on hover */}
        <motion.path
          d="M30 37 q5 -3 10 0 t10 0 t10 0 t10 0 t10 0 t10 0"
          vectorEffect="non-scaling-stroke"
          stroke="#EDE6DA"
          strokeOpacity="0.6"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            rest: {
              pathLength: 1,
              opacity: 1,
              transition: draw(settled ? 0.3 : 0.5, settled ? 0 : 0.4 + index * 0.12),
            },
            hover: { pathLength: 1, opacity: 0, transition: draw(0.2) },
          }}
        />
        <motion.path
          d={LOOPS[loop]}
          vectorEffect="non-scaling-stroke"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            rest: { pathLength: 0, opacity: 0, transition: draw(0.25) },
            hover: { pathLength: 1, opacity: 1, transition: draw(0.45) },
          }}
        />
      </svg>
    </>
  );

  return href ? (
    <motion.a href={href} target={href.startsWith("#") ? undefined : "_blank"} rel={href.startsWith("#") ? undefined : "noopener noreferrer"} {...shared}>
      {inner}
    </motion.a>
  ) : (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={circled}
      onClick={onClick}
      {...shared}
    >
      {inner}
    </motion.button>
  );
}

/**
 * Where else to find me: the links at the right of the strip under the cover.
 * When a hat is picked, links that don't belong to it dim.
 */
export function Universe({
  role,
  startIndex,
}: {
  role: Role | null;
  /** How many items are drawn in before these, so the stagger carries on. */
  startIndex: number;
}) {
  return (
    <ul className="-mx-1 flex justify-between sm:-mx-2.5 sm:justify-start">
      {links.map((link, i) => (
        <li
          key={link.label}
          className={`transition-opacity duration-300 ${
            role && link.role !== role ? "opacity-30" : ""
          }`}
        >
          <Doodle
            label={link.label}
            icon={link.icon}
            tilt={link.tilt}
            loop={link.loop}
            index={i + startIndex}
            cursor={link.cursor}
            href={link.href}
          />
        </li>
      ))}
    </ul>
  );
}
