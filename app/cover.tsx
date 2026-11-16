"use client";

import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";
import { EASE, useTiming } from "./motion";

const MASTHEAD = "SHERRY".split("");

/** Counts up to `to` once, then leaves the final formatted value in place. */
function CountUp({
  to,
  suffix = "",
  delay,
  skip,
}: {
  to: number;
  suffix?: string;
  delay: number;
  skip: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = to.toLocaleString("en-US") + suffix;

  useEffect(() => {
    const el = ref.current;
    if (skip || !el) return;
    el.textContent = "0" + suffix;
    const controls = animate(0, to, {
      duration: 1.5,
      delay,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = Math.round(v).toLocaleString("en-US") + suffix;
      },
    });
    return () => {
      controls.stop();
      el.textContent = final;
    };
  }, [skip, to, suffix, delay, final]);

  return (
    <span ref={ref} className="tabular-nums">
      {final}
    </span>
  );
}

function Org({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="visit ↗"
      className="text-mustard underline decoration-mustard/0 decoration-1 underline-offset-4 transition-colors hover:decoration-mustard"
    >
      {children}
    </a>
  );
}

/** One stat line: fades up in sequence, and its number warms on hover. */
function Row({
  index,
  className = "",
  children,
}: {
  index: number;
  className?: string;
  children: ReactNode;
}) {
  const { timing } = useTiming();
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={timing({ duration: 0.7, delay: 0.95 + index * 0.09, ease: EASE })}
      className={`group ${className}`}
    >
      {children}
    </motion.div>
  );
}

const numberClass =
  "font-display text-[40px] leading-10 transition-colors duration-300 group-hover:text-mustard";
const rule = "border-t border-bone/35";

function Desk({ filled, index }: { filled?: boolean; index: number }) {
  const { timing } = useTiming();
  const delay = 1.7 + index * 0.12;
  return (
    <motion.svg
      width="34"
      height="43"
      viewBox="0 0 76 96"
      className="shrink-0"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={timing({ duration: 0.45, delay, ease: EASE })}
      aria-hidden="true"
    >
      <circle cx="38" cy="16" r="12" fill="none" stroke="#EDE6DA" strokeWidth="2.5" />
      <path
        d="M14 58 C 14 40 24 32 38 32 C 52 32 62 40 62 58 Z"
        fill="none"
        stroke="#EDE6DA"
        strokeWidth="2.5"
      />
      {filled && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={timing({ duration: 0.5, delay: 2.25 })}
        >
          <circle cx="38" cy="16" r="13.5" fill="#E8B04A" />
          <path
            d="M12.5 59 C 12.5 40 24 31 38 31 C 52 31 63.5 40 63.5 59 Z"
            fill="#E8B04A"
          />
        </motion.g>
      )}
      <rect x="2" y="60" width="72" height="8" fill="#EDE6DA" />
      <rect x="10" y="68" width="5" height="28" fill="#EDE6DA" />
      <rect x="61" y="68" width="5" height="28" fill="#EDE6DA" />
    </motion.svg>
  );
}

const WAVE = [0.45, 0.9, 0.6, 1, 0.5];

/** A small sound wave that keeps "speaking" beside the voice AI line (CSS only). */
function VoiceWave() {
  return (
    <span aria-hidden="true" className="ml-1.5 inline-flex h-[18px] items-center gap-[3px] align-[-3px]">
      {WAVE.map((height, i) => (
        <span
          key={i}
          className="voice-bar block h-full w-[3px] rounded-full bg-mustard"
          style={{
            ["--bar" as string]: height,
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </span>
  );
}

export function Cover() {
  const { reduced, timing } = useTiming();

  // Pointer parallax: the portrait drifts toward the cursor, the masthead away.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const portraitX = useTransform(sx, (v) => v * 14);
  const portraitY = useTransform(sy, (v) => v * 8);
  const mastheadX = useTransform(sx, (v) => v * -8);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section
      id="hero"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative overflow-hidden bg-oxblood text-bone lg:min-h-[max(calc(25.8vw+590px),min(100svh,68vw))]"
    >
      {/* Masthead */}
      <motion.h1
        style={{ x: mastheadX }}
        aria-label="Sherry Xinrui Liu"
        className="pointer-events-none -mt-[2.78vw] select-none whitespace-nowrap text-center font-display text-[27.78vw] leading-none tracking-[-0.05em] lg:absolute lg:inset-x-0 lg:top-0"
      >
        {MASTHEAD.map((letter, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="inline-block"
            initial={{ opacity: 0, y: "14%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={timing({ duration: 0.9, delay: 0.05 + i * 0.07, ease: EASE })}
          >
            {letter}
          </motion.span>
        ))}
      </motion.h1>

      {/* Portrait, standing in front of the masthead. */}
      <div className="relative z-10 mx-auto -mt-[13vw] aspect-[660/800] w-[min(86vw,540px)] overflow-hidden lg:absolute lg:left-[53%] lg:top-[15vw] xl:left-[52%] lg:mt-0 lg:aspect-auto lg:w-[max(42vw,550px)] lg:-translate-x-1/2 lg:overflow-visible">
        <motion.div style={{ x: portraitX, y: portraitY }}>
          <motion.div
            data-cursor="hi!"
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={timing({ duration: 1.1, delay: 0.4, ease: EASE })}
          >
            <Image
              src="/images/headshot-cutout.webp"
              alt="Sherry Liu looking through a magnifying glass"
              width={1600}
              height={2249}
              sizes="(min-width: 1024px) 46vw, 86vw"
              priority
              className="h-auto w-full"
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={timing({ duration: 0.8, delay: 0.9 })}
        className="hidden font-type text-[13px] uppercase leading-4 tracking-[0.2em] lg:absolute lg:left-14 lg:top-[25.8vw] lg:block"
      >
        Issue 2026.0
      </motion.p>

      {/* Cover lines */}
      <div className="relative z-20 grid gap-x-12 gap-y-10 border-t border-bone/35 px-6 pb-14 pt-10 md:grid-cols-2 md:px-14 lg:static lg:block lg:border-0 lg:p-0">
        <div className="flex flex-col gap-3.5 lg:absolute lg:left-14 lg:top-[calc(25.8vw+52px)] lg:z-20 lg:w-[clamp(236px,25.8vw,372px)]">
          <Row index={0} className="flex flex-col gap-0.5">
            <div className="font-display text-[104px] leading-[92px] tracking-[-0.04em] transition-colors duration-300 group-hover:text-mustard">
              <CountUp to={100} suffix="+" delay={1.0} skip={reduced} />
            </div>
            <p className="text-[17px] leading-6">
              formerly incarcerated people I personally coached into
              high-paying skilled-trades jobs at{" "}
              <Org href="https://www.emergecareer.com">Emerge Career</Org>
            </p>
          </Row>
          <Row index={1} className={`flex items-center gap-3.5 pt-3.5 ${rule}`}>
            <div className={`${numberClass} w-11 shrink-0`}>1</div>
            <p className="text-base leading-[22px]">
              AI career coach, brought to life with voice AI <VoiceWave />
            </p>
          </Row>
          <Row index={2} className={`flex items-center gap-3.5 pt-3.5 ${rule}`}>
            <div className={`${numberClass} w-11 shrink-0`}>2</div>
            <p className="text-base leading-[22px]">
              hiring partnerships in the trucking industry
            </p>
          </Row>
          <Row index={3} className={`flex items-center gap-3.5 pt-3.5 ${rule}`}>
            <div className={`${numberClass} w-11 shrink-0`}>1</div>
            <p className="text-base leading-[22px]">design system</p>
          </Row>
        </div>

        <div className="flex flex-col gap-3.5 md:items-end md:text-right lg:absolute lg:right-14 lg:top-[calc(25.8vw+52px)] lg:z-20 lg:w-[clamp(236px,20.8vw,300px)]">
          <Row index={4} className="flex flex-col gap-0.5 md:items-end">
            <div className="font-display text-[44px] leading-[44px] tracking-[-0.03em] transition-colors duration-300 group-hover:text-mustard">
              <CountUp to={200000} delay={1.25} skip={reduced} />
            </div>
            <p className="text-[15px] leading-[21px]">
              classrooms created custom content on{" "}
              <Org href="https://www.ixl.com">IXL</Org> that became
              district-wide common assessments
            </p>
          </Row>
          <Row
            index={5}
            className={`flex w-full flex-row-reverse items-end justify-end gap-4 pt-2.5 md:flex-row ${rule}`}
          >
            <div className="flex shrink-0 gap-2 pb-[3px]">
              <Desk filled index={0} />
              <Desk index={1} />
              <Desk index={2} />
            </div>
            <div className="flex flex-col gap-0.5 md:items-end">
              <div className={`${numberClass} tracking-[-0.02em]`}>
                1 <span className="text-2xl italic">in</span> 3
              </div>
              <p className="text-[15px] leading-[21px]">
                U.S. K–12 students served by IXL
              </p>
            </div>
          </Row>
          <Row
            index={6}
            className={`flex w-full flex-row-reverse items-center justify-end gap-3.5 pb-3.5 pt-3 md:flex-row ${rule}`}
          >
            <p className="text-[15px] leading-[21px]">
              digital curriculum approved by California&rsquo;s Board of
              Education
            </p>
            <div className={`${numberClass} shrink-0`}>
              1<span className="text-2xl italic">st</span>
            </div>
          </Row>
          <Row
            index={7}
            className="flex w-full flex-row-reverse items-center justify-end gap-3.5 border-t border-bone pt-[26px] md:flex-row"
          >
            <p className="text-[15px] leading-[21px]">
              design teams sourced and staffed at{" "}
              <Org href="https://socialgood.hcs.harvard.edu">Harvard T4SG</Org>
            </p>
            <div className={`${numberClass} w-[30px] shrink-0`}>8</div>
          </Row>
          <Row
            index={8}
            className={`flex w-full flex-row-reverse items-center justify-end gap-3.5 pt-3 md:flex-row ${rule}`}
          >
            <p className="text-[15px] leading-[21px] md:w-[200px] md:shrink-0">
              nonprofits I designed for hands-on, pro bono
            </p>
            <div className={`${numberClass} w-[30px] shrink-0`}>2</div>
          </Row>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={timing({ duration: 0.8, delay: 1.8 })}
        className="hidden font-type text-[13px] uppercase leading-4 tracking-[0.2em] lg:absolute lg:bottom-16 lg:left-14 lg:block"
      >
        Designer · Engineer · Writer
      </motion.p>
    </section>
  );
}
