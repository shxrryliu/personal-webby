"use client";

import { motion } from "framer-motion";
import { useTiming } from "./motion";

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
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sherry-liu-0183a7167/",
    cursor: "say hi ↗",
    tilt: 1.5,
    icon: ["M3.5 4.5h13v9h-7l-3.5 3v-3h-2.5z", "M7 8h6", "M7 10.5h4"],
    loop: 1,
  },
  {
    label: "Writing",
    href: "https://sherryliuser.substack.com/",
    cursor: "read ↗",
    tilt: -1,
    icon: ["M13.5 3.5l3 3L7 16l-3.8.8L4 13z", "M11.5 5.5l3 3"],
    loop: 2,
  },
  {
    label: "Goodreads",
    href: "https://www.goodreads.com/user/show/50509124-sherry-liu",
    cursor: "what I’m reading ↗",
    tilt: 2,
    icon: [
      "M10 5c-1.6-1.3-3.8-1.6-6.5-1v11c2.7-.6 4.9-.3 6.5 1 1.6-1.3 3.8-1.6 6.5-1V4c-2.7-.6-4.9-.3-6.5 1z",
      "M10 5v11",
    ],
    loop: 0,
  },
  {
    label: "Letterboxd",
    href: "https://letterboxd.com/sherryliuser/",
    cursor: "what I’m watching ↗",
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
 * A footer link in the same thin pen line as the screenshot notes: its icon is
 * drawn in when the footer scrolls into view, and on hover a loop is scribbled
 * around it while the icon wiggles.
 */
function DoodleLink({ link, index }: { link: FooterLink; index: number }) {
  const { reduced, timing } = useTiming();
  const draw = (duration: number, delay = 0) =>
    timing({ duration, delay, ease: "easeInOut" });

  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor={link.cursor}
      initial="hidden"
      whileInView="rest"
      whileHover="hover"
      whileTap={{ scale: 0.96 }}
      viewport={{ once: true }}
      style={{ rotate: link.tilt }}
      className="group relative inline-flex items-center gap-2 px-4 py-2.5 text-[19px] leading-6 text-bone transition-colors duration-300 hover:text-mustard"
    >
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hover: reduced
            ? {}
            : { rotate: [0, -12, 9, 0], transition: { duration: 0.5 } },
        }}
      >
        {link.icon.map((d, i) => (
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
      </motion.svg>
      {link.label}
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
          strokeOpacity="0.55"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            rest: {
              pathLength: 1,
              opacity: 1,
              transition: draw(0.5, 0.4 + index * 0.12),
            },
            hover: { pathLength: 1, opacity: 0, transition: draw(0.2) },
          }}
        />
        <motion.path
          d={LOOPS[link.loop]}
          vectorEffect="non-scaling-stroke"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            rest: { pathLength: 0, opacity: 0, transition: draw(0.25) },
            hover: { pathLength: 1, opacity: 1, transition: draw(0.45) },
          }}
        />
      </svg>
    </motion.a>
  );
}

export function Footer() {
  return (
    <footer className="flex flex-col gap-4 bg-oxblood px-6 py-9 text-bone md:px-14 xl:flex-row xl:items-center xl:justify-between">
      <p className="shrink-0 font-display text-[26px] leading-none tracking-[-0.02em] xl:whitespace-nowrap">
        The extended Sherry Liu internet universe
      </p>
      <ul className="-mx-4 flex flex-wrap gap-x-1 gap-y-1 xl:mx-0 xl:justify-end">
        {links.map((link, i) => (
          <li key={link.label}>
            <DoodleLink link={link} index={i} />
          </li>
        ))}
      </ul>
    </footer>
  );
}
