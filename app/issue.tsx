"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EASE, useTiming } from "./motion";
import type { Story } from "./stories";

type Note = { text: string; x: number; y: number; rotate: number };

/**
 * Hand-drawn marks and notes for each screenshot, in the screenshot's own
 * 1200 x 480 coordinate space. `marks` are SVG paths (circles, arrows,
 * underlines); negative y values sit in the padding above the image.
 */
const ANNOTATIONS = {
  quiz: {
    padTop: false,
    marks: [
      // loop around the "Write your own questions" tab
      "M180 138 C178 108 250 104 290 106 C345 108 372 120 366 140 C360 162 290 166 240 163 C195 160 176 150 184 128",
      "M150 68 C176 76 196 90 206 106 M206 106 l-13 -3 M206 106 l1 -14",
      // arrow to the teacher-written question
      "M822 36 C790 52 770 92 752 130 M752 130 l-1 -14 M752 130 l12 -7",
      // underline
      "M32 452 q18 -9 36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0",
    ],
    notes: [
      { text: "it starts here", x: 26, y: 30, rotate: -4 },
      { text: "a teacher wrote this one", x: 832, y: 6, rotate: -2 },
      { text: "0 → ~2 quizzes a week", x: 30, y: 404, rotate: -2 },
    ],
  },
  takeoff: {
    padTop: false,
    marks: [
      "M1052 26 C1084 26 1102 34 1110 50 M1110 50 l-13 -5 M1110 50 l3 -14",
      "M314 206 C296 212 282 214 266 213 M266 213 l11 -8 M266 213 l12 6",
    ],
    notes: [
      { text: "california said yes", x: 772, y: 2, rotate: -2 },
      { text: "standards, built in", x: 322, y: 186, rotate: -2 },
    ],
  },
  t4sg: {
    padTop: true,
    marks: [
      "M82 -6 C200 -22 520 -22 640 -6",
      "M720 -6 C820 -22 1020 -22 1118 -6",
    ],
    notes: [
      { text: "app one: reports for a school district", x: 96, y: -58, rotate: -1 },
      { text: "app two: waste pickups in fiji", x: 748, y: -58, rotate: 1 },
    ],
  },
} satisfies Record<string, { padTop: boolean; marks: string[]; notes: Note[] }>;

/** Draws the pen marks stroke by stroke, then fades the handwriting in. */
function Annotations({ set }: { set: keyof typeof ANNOTATIONS }) {
  const { timing } = useTiming();
  const { marks, notes } = ANNOTATIONS[set];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
      <svg
        viewBox="0 0 1200 480"
        className="absolute inset-0 h-full w-full overflow-visible"
        fill="none"
        stroke="#1A2FD0"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {marks.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={timing({
              duration: 0.7,
              delay: 0.7 + i * 0.35,
              ease: "easeInOut",
            })}
          />
        ))}
      </svg>
      {notes.map((note, i) => (
        <motion.span
          key={note.text}
          className="absolute whitespace-nowrap font-hand font-semibold leading-none text-cobalt"
          style={{
            // scales with the screenshot's width
            fontSize: "max(15px, 2.7cqw)",
            left: `${(note.x / 1200) * 100}%`,
            top: `${(note.y / 480) * 100}%`,
            rotate: note.rotate,
          }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={timing({ duration: 0.5, delay: 0.9 + i * 0.35 })}
        >
          {note.text}
        </motion.span>
      ))}
    </div>
  );
}

/** Small rounded date label. Filled with a pulsing dot when the work is ongoing. */
export function DatePill({
  children,
  current,
}: {
  children: React.ReactNode;
  current?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm leading-5 ${
        current
          ? "border-oxblood bg-oxblood text-bone"
          : "border-oxblood/40 text-oxblood"
      }`}
    >
      {current && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mustard opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-mustard" />
        </span>
      )}
      {children}
    </span>
  );
}

const JOURNEY_QUOTES = [
  { text: "it gave me all the updates for my CDL. it was fast.", who: "arthur r." },
  { text: "i used the voice, journey? it was cool! really fast.", who: "george t." },
  { text: "i just went through and completed it... it was quick.", who: "joseph g." },
];

/**
 * Journey's start screen, what students said after building a resume with it
 * by voice, and how often the interview ended in a real resume. Quotes and figures are from the
 * talk "Designing AI that meets people where they are".
 */
function JourneyPanel() {
  const { timing } = useTiming();
  const enter = (delay: number) => timing({ duration: 0.8, delay, ease: EASE });

  return (
    <div className="flex flex-col gap-8 bg-[#F7F3EC] p-7 shadow-[0_18px_40px_rgba(42,30,24,0.12)] sm:flex-row sm:items-center md:gap-10 md:p-10">
      <motion.div
        className="mx-auto w-[58%] max-w-[230px] shrink-0 sm:mx-0 sm:w-[32%]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={enter(0.1)}
      >
        <Image
          src="/images/journey-1.webp"
          alt="Journey start screen: Let’s find your first job"
          width={780}
          height={1434}
          sizes="(min-width: 640px) 230px, 58vw"
          // spreads mount on demand, so load their pictures straight away
                  loading="eager"
                  className="block h-auto w-full"
        />
      </motion.div>

      <div className="min-w-0 flex-1">
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={enter(0.2)}
        >
          <div
            aria-hidden="true"
            className="h-8 font-display text-[72px] leading-[72px] text-oxblood"
          >
            “
          </div>
          <blockquote className="font-headline mt-3 text-[clamp(24px,2.5vw,36px)] leading-[1.12] text-espresso">
            the resume builder was fast! it was cool... it was like{" "}
            <span className="text-oxblood">the future.</span>
          </blockquote>
          <figcaption className="mt-3 text-sm leading-5 text-espresso">
            miguel c., after building a resume by voice
          </figcaption>
        </motion.figure>

        <div className="mt-6 flex flex-col gap-5 border-t border-rule pt-5 xl:flex-row xl:gap-7">
          <motion.div
            className="shrink-0 xl:w-[38%]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={enter(0.35)}
          >
            <p className="font-display text-[clamp(48px,5vw,72px)] leading-[0.9] tracking-[-0.04em] text-oxblood">
              92%
            </p>
            <p className="mt-2 text-sm leading-5 text-espresso">
              of finished voice interviews became a real resume
            </p>
          </motion.div>

          <ul className="space-y-2.5">
            {JOURNEY_QUOTES.map((quote, i) => (
              <motion.li
                key={quote.who}
                className="text-[13px] leading-[18px] text-espresso"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={enter(0.45 + i * 0.12)}
              >
                “{quote.text}”{" "}
                <span className="text-espresso/60">{quote.who}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** A story's picture: the annotated screenshot or the Journey panel. Animates in as soon as it mounts. */
export function StoryVisual({ story }: { story: Story }) {
  const { timing } = useTiming();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={timing({ duration: 0.7, delay: 0.15, ease: EASE })}
    >
      {story.image ? (
        <div
          className={`bg-[#F7F3EC] p-3 shadow-[0_18px_40px_rgba(42,30,24,0.12)] md:p-5 ${
            story.annotate && ANNOTATIONS[story.annotate].padTop
              ? "sm:pt-[9%] md:pt-[9%]"
              : ""
          }`}
        >
          <div className="relative [container-type:inline-size]">
            <Image
              src={story.image}
              alt={`${story.headline}: screenshots`}
              width={1200}
              height={480}
              sizes="(min-width: 1024px) 960px, 100vw"
              // spreads mount on demand, so load their pictures straight away
                  loading="eager"
                  className="block h-auto w-full"
            />
            {story.annotate && <Annotations set={story.annotate} />}
          </div>
        </div>
      ) : story.visual === "journey" ? (
        <JourneyPanel />
      ) : null}
    </motion.div>
  );
}
