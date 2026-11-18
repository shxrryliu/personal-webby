"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { DatePill, StoryVisual } from "./issue";
import { EASE, useTiming } from "./motion";
import { ABOUT_HASH, issueHash, stories, type Story } from "./stories";
import type { Book, Film } from "./personal-feeds";
import { READING_HASH, WATCHING_HASH, GOODREADS_URL, LETTERBOXD_URL } from "./personal-links";

const findStory = (hash: string) =>
  stories.find((story) => issueHash(story.slug) === hash) ?? null;

/** A real link, with a short paper turn before changing the current issue. */
function NextIssue({ href, label }: { href: string; label: string }) {
  const { reduced } = useTiming();
  const [turning, setTurning] = useState(false);
  const turnRef = useRef<Animation | null>(null);
  useEffect(() => () => turnRef.current?.cancel(), []);

  return (
    <div className="paper-footer relative flex justify-end bg-bone text-[15px] text-oxblood" data-turning={turning}>
      <a
        href={href}
        data-cursor="turn the page →"
        aria-busy={turning || undefined}
        className="relative flex min-h-16 items-center py-4 pl-5 pr-14 underline decoration-1 underline-offset-4 hover:text-espresso focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cobalt md:pl-8 md:pr-16"
        onClick={async (event) => {
          if (
            event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
            reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ) return;
          const paper = event.currentTarget.closest<HTMLElement>("[role=dialog]");
          if (!paper?.animate) return;
          event.preventDefault();
          if (turnRef.current) return;
          setTurning(true);
          const startingHash = window.location.hash;
          const turn = paper.animate(
            [
              { transform: "perspective(1400px) rotateY(0deg)", opacity: 1, transformOrigin: "left center" },
              { transform: "perspective(1400px) rotateY(-12deg) translateX(-12px)", opacity: 0, transformOrigin: "left center" },
            ],
            { duration: 240, easing: "ease-in", fill: "forwards" },
          );
          turnRef.current = turn;
          try {
            await turn.finished;
          } catch {
            return; // Closing or changing the spread cancels its pending turn.
          }
          if (window.location.hash !== startingHash) return;
          history.replaceState(history.state, "", href);
          window.dispatchEvent(new Event(HASH_EVENT));
        }}
      >
        {label} →
        <span aria-hidden="true" className="paper-fold pointer-events-none absolute bottom-0 right-0" />
      </a>
    </div>
  );
}

/**
 * The shell every spread shares: a dimmed backdrop, a sheet of bone paper that
 * flies in at a tilt, a coloured title strip with a close button, and a footer
 * line. Closes on Esc, the close button, or a click outside the sheet.
 */
function Sheet({
  id,
  label,
  title,
  strip,
  tilt,
  onClose,
  next,
  variant = "issue",
  children,
}: {
  id: string;
  /** Accessible name for the dialog. */
  label: string;
  /** Text in the title strip. */
  title: string;
  /** Title strip colours (Tailwind classes). */
  strip: string;
  tilt: number;
  onClose: () => void;
  next: { href: string; label: string };
  variant?: "issue" | "bookshelf" | "film";
  children: ReactNode;
}) {
  const { timing } = useTiming();
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hand focus back to whatever opened the sheet once it closes.
    const opener = document.activeElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      // Keep Tab inside the sheet: wrap from the last control to the first.
      const controls = scrollRef.current?.querySelectorAll<HTMLElement>("a[href], button");
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !scrollRef.current?.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      if (opener instanceof HTMLElement && opener.isConnected) {
        // The portrait is taller than the viewport. Returning focus must not
        // scroll the cover down and leave that position saved for a refresh.
        opener.focus({ preventScroll: true });
      }
    };
  }, [onClose]);

  // Runs after the effect above, so the opener is read before focus moves.
  // Each spread starts at its top with focus on the close button, including
  // when "next" swaps the spread inside a sheet that is already open.
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
    closeRef.current?.focus({ preventScroll: true });
  }, [id]);

  return (
    <motion.div
      ref={scrollRef}
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-espresso/60 p-3 backdrop-blur-[2px] md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={timing({ duration: 0.25 })}
      onClick={onClose}
    >
      <motion.article
        key={id}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: variant === "issue" ? 0.8 : 0.96, rotate: variant === "issue" ? tilt * 3 : 0, y: variant === "issue" ? 60 : 24 }}
        animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={timing({ type: "spring", stiffness: 260, damping: 24 })}
        className={`relative my-auto w-full max-w-[980px] shadow-[0_40px_80px_rgba(20,10,8,0.5)] ${variant === "film" ? "text-bone" : "text-espresso"}`}
      >
        <div className={variant === "bookshelf" ? "bookshelf-paper" : variant === "film" ? "bg-[#211B17]" : "bg-bone"}>
        <div className={`flex items-center justify-between px-5 py-2.5 md:px-8 ${variant === "issue" ? strip : ""}`}>
          <span className={`font-type text-[12px] ${variant === "issue" ? "tracking-[0.2em]" : "opacity-65"}`}>{title}</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            data-cursor="close"
            aria-label="Close"
            className="-mr-2 flex h-8 w-8 cursor-pointer items-center justify-center text-2xl leading-none transition-transform duration-200 hover:rotate-90"
          >
            ×
          </button>
        </div>

        {children}
        {variant !== "issue" && (
          <div className={`flex justify-end px-5 pb-5 pt-6 text-[14px] md:px-8 ${variant === "film" ? "text-mustard" : "text-oxblood"}`}>
            <a href={next.href} className="underline underline-offset-4" data-cursor="take a look →">{next.label} →</a>
          </div>
        )}
        </div>
        {variant === "issue" && <NextIssue href={next.href} label={next.label} />}
      </motion.article>
    </motion.div>
  );
}

/** One job, opened as a spread. */
function StorySpread({ story, onClose }: { story: Story; onClose: () => void }) {
  const next = stories[(stories.indexOf(story) + 1) % stories.length];

  return (
    <Sheet
      id={story.slug}
      label={story.headline}
      title={`${story.mast} · issue ${story.page}`}
      strip={story.cover}
      tilt={story.tilt}
      onClose={onClose}
      next={{ href: issueHash(next.slug), label: `next issue: ${next.mast}` }}
    >
      <div className="grid gap-x-16 gap-y-5 px-5 pb-6 pt-6 md:grid-cols-2 md:px-8 md:pt-8">
        <div>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px] leading-6 text-oxblood">
            <DatePill current={story.current}>{story.when}</DatePill>
            <a
              href={story.orgUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="visit ↗"
              className="underline decoration-oxblood/40 decoration-1 underline-offset-4 transition-colors hover:decoration-oxblood"
            >
              {story.org}
            </a>
          </p>
          <h2 className="font-headline mt-4 text-[clamp(24px,2.6vw,32px)] leading-[1.14]">
            {story.headline}
          </h2>
        </div>
        <div className="md:pt-11">
          <div className="space-y-3 text-base leading-[26px]">
            {story.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {story.link && (
            <a
              href={story.link.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open ↗"
              className="mt-4 inline-block text-oxblood underline decoration-1 underline-offset-4 transition-colors hover:text-espresso"
            >
              {story.link.label} →
            </a>
          )}
        </div>
      </div>

      <div className="px-5 md:px-8">
        <StoryVisual story={story} />
      </div>
    </Sheet>
  );
}

function PersonalSpread({
  kind, books, films, onClose,
}: {
  kind: "reading" | "watching";
  books: Book[];
  films: Film[];
  onClose: () => void;
}) {
  const reading = kind === "reading";
  const source = reading ? GOODREADS_URL : LETTERBOXD_URL;
  const items = reading ? books : films;

  return (
    <Sheet
      id={kind}
      label={reading ? "What I'm reading" : "What I'm watching"}
      title={reading ? "bookshelf" : "film roll"}
      strip="bg-espresso text-bone"
      tilt={reading ? -1 : 1}
      onClose={onClose}
      variant={reading ? "bookshelf" : "film"}
      next={{ href: reading ? WATCHING_HASH : READING_HASH, label: reading ? "film roll" : "bookshelf" }}
    >
      <div className="px-5 pb-4 pt-7 md:px-8 md:pt-9">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 className="font-headline text-[clamp(26px,3vw,36px)] leading-tight">
            {reading ? "currently reading" : "recently watched and rated"}
          </h2>
          <a href={source} target="_blank" rel="noopener noreferrer" className={`text-[14px] italic underline underline-offset-4 ${reading ? "text-cobalt" : "text-mustard"}`}>
            {reading ? "from goodreads ↗" : "from letterboxd ↗"}
          </a>
        </div>
        {!items.length ? (
          <p className="py-12 text-[16px] leading-7">
            the shelf is taking a moment to load. <a href={source} target="_blank" rel="noopener noreferrer" className={`underline ${reading ? "text-cobalt" : "text-mustard"}`}>see it {reading ? "on goodreads" : "on letterboxd"} ↗</a>
          </p>
        ) : (
          <ul className={`mt-8 grid gap-7 sm:grid-cols-3 sm:gap-8 ${reading ? "book-shelf" : "film-strip px-4 py-7 sm:px-5 sm:py-8"}`}>
            {items.map((item) => (
              <li key={item.url} className="min-w-0">
                <a href={item.url} target="_blank" rel="noopener noreferrer" data-cursor="read more ↗" className="group flex items-start gap-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt sm:block">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      width={128}
                      height={192}
                      unoptimized
                      loading="eager"
                      className={`h-32 w-[85px] shrink-0 object-contain sm:h-48 sm:w-32 ${reading ? "book-cover object-left-bottom" : "object-left-top"}`}
                    />
                  )}
                  <div className="min-w-0 sm:mt-5">
                    <h3 className={`text-[18px] leading-6 group-hover:underline ${reading ? "group-hover:text-cobalt" : "group-hover:text-mustard"}`}>{item.title.toLowerCase()}</h3>
                    {"author" in item ? (
                      <p className="mt-1.5 text-[14px] italic text-espresso/75">{item.author.toLowerCase()}</p>
                    ) : (
                      <>
                        <p className="mt-1.5 flex flex-wrap items-center gap-2 font-sans text-[13px] text-bone/65">
                          {item.year}
                          {item.rating !== null && (
                            <span role="img" aria-label={`${item.rating} out of 5 stars`} className="text-mustard">
                              {"★".repeat(Math.floor(item.rating))}{item.rating % 1 ? "½" : ""}
                            </span>
                          )}
                        </p>
                        {item.review && <p className="mt-3 font-sans text-[14px] leading-[22px] text-bone/85">{item.review}</p>}
                      </>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Sheet>
  );
}

type Inspiration = {
  src: string;
  alt: string;
  width: number;
  height: number;
  tilt: number;
  /** The work's title, set in italics under the print. */
  title?: string;
  /** Who made it, shown under the print. */
  credit: string;
  /** A pen note under the print. */
  note?: string;
};

/** Things that aren't websites that this site borrows from. */
const INSPIRATION: Inspiration[] = [
  {
    src: "/images/inspo-conversation.webp",
    alt: "Two figures in red coats and wide hats facing each other at a bar, one smoking, one holding a martini",
    width: 590,
    height: 791,
    tilt: -2,
    title: "conversation with myself",
    credit: "tatyana markovtsev",
  },
  {
    src: "/images/inspo-gitanes.webp",
    alt: "A painted girl with a black bob and striped sleeves smoking against a red background",
    width: 570,
    height: 806,
    tilt: 1.5,
    title: "gitanes",
    credit: "christina gordon",
  },
  {
    src: "/images/inspo-room.webp",
    alt: "A bedroom with a red-framed mirror and a glowing cobalt cube as a bedside table",
    width: 900,
    height: 1170,
    tilt: -1,
    credit: "interior styled by bertie coad",
  },
  {
    src: "/images/inspo-painting.webp",
    alt: "A thickly painted portrait in cobalt blue and white",
    width: 432,
    height: 574,
    tilt: 2,
    title: "girl with blue",
    credit: "alexandros spentzaris",
    note: "this color",
  },
  {
    src: "/images/inspo-bouquet.webp",
    alt: "Orange lilies wrapped in deep blue paper",
    width: 432,
    height: 424,
    tilt: -1.5,
    credit: "flowers by api (아피), south korea",
  },
];

/** The "about me" spread, opened by clicking the portrait on the cover. */
function AboutSpread({ onClose }: { onClose: () => void }) {
  const { timing } = useTiming();

  return (
    <Sheet
      id="about"
      label="About Sherry"
      title="about"
      strip="bg-oxblood text-bone"
      tilt={-1.5}
      onClose={onClose}
      next={{ href: issueHash(stories[0].slug), label: `read the issues: ${stories[0].mast}` }}
    >
      <div className="grid gap-x-16 gap-y-5 px-5 pt-7 md:grid-cols-2 md:px-8 md:pt-10">
        <h2 className="font-headline text-[clamp(34px,4.2vw,56px)] leading-[1.02] tracking-[-0.02em]">
          i design tech <span className="text-oxblood">for good.</span>
        </h2>
        <div className="space-y-4 text-[17px] leading-7 md:pt-2">
          <p>
            i think not enough smart people apply themselves to make the world
            better. i hope to change that.
          </p>
          <p>
            i&rsquo;m the daughter of architects; i think design spans
            disciplines. how you see anything is how you see everything.
          </p>
        </div>
      </div>

      <div className="px-5 pb-2 pt-8 md:px-8 md:pt-10">
        <p className="text-[15px] leading-6 text-oxblood">inspo for this site</p>
        <ul className="mt-4 grid grid-cols-2 items-start gap-x-4 gap-y-6 sm:grid-cols-5 md:gap-x-5">
          {INSPIRATION.map((item, i) => (
            <motion.li
              key={item.src}
              initial={{ opacity: 0, y: 30, rotate: item.tilt * 3 }}
              animate={{ opacity: 1, y: 0, rotate: item.tilt }}
              transition={timing({ duration: 0.7, delay: 0.25 + i * 0.1, ease: EASE })}
              className={i % 2 === 1 ? "sm:mt-6" : ""}
            >
              <div className="bg-[#F7F3EC] p-1.5 shadow-[0_10px_24px_rgba(42,30,24,0.18)] md:p-2">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(min-width: 640px) 170px, 45vw"
                  // spreads mount on demand, so load their pictures straight away
                  loading="eager"
                  className="block h-auto w-full"
                />
              </div>
              <p className="mt-2 text-[12px] leading-4 text-espresso/80">
                {item.title && (
                  <>
                    <em>{item.title}</em>,{" "}
                  </>
                )}
                {item.credit}
              </p>
              {item.note && (
                <p className="mt-1.5 font-hand text-[17px] font-semibold leading-[1.1] text-cobalt">
                  {item.note}
                </p>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </Sheet>
  );
}

/**
 * Opens a job, or the "about me" page, as a small magazine spread over the
 * cover. What is open lives in the address bar's hash, so the cover can open
 * a spread with a plain link and a spread can be shared.
 */
/** Fired after this file changes the address itself, which the browser does not announce. */
const HASH_EVENT = "spread:hash";

function subscribeToHash(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener("hashchange", onChange);
  window.addEventListener(HASH_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(HASH_EVENT, onChange);
  };
}

export function Issues({ books, films }: { books: Book[]; films: Film[] }) {
  // The address bar is the source of truth for which spread is open.
  const hash = useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash,
    () => "",
  );
  const open = hash === ABOUT_HASH ? "about" : hash === READING_HASH ? "reading" : hash === WATCHING_HASH ? "watching" : findStory(hash);
  const isOpen = open !== null;

  useEffect(() => {
    // Links to a spread are handled here so history stays tidy: opening one
    // adds a single entry (so Back closes it), and moving between spreads
    // replaces that entry instead of stacking more.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target instanceof Element ? e.target.closest("a") : null;
      const target = link?.getAttribute("href");
      if (!target?.startsWith("#")) return;
      if (target !== ABOUT_HASH && target !== READING_HASH && target !== WATCHING_HASH && !findStory(target)) return;
      e.preventDefault();
      if (isOpen) history.replaceState(history.state, "", target);
      else history.pushState({ spread: true }, "", target);
      window.dispatchEvent(new Event(HASH_EVENT));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [isOpen]);

  const close = useCallback(() => {
    if (history.state?.spread) {
      // Opened from the cover: step back to the entry before it.
      history.back();
      return;
    }
    // Arrived on a spread's address directly: just drop the hash.
    history.replaceState(null, "", window.location.pathname + window.location.search);
    window.dispatchEvent(new Event(HASH_EVENT));
  }, []);

  return (
    <AnimatePresence>
      {open === "about" ? (
        <AboutSpread key="spread" onClose={close} />
      ) : open === "reading" || open === "watching" ? (
        <PersonalSpread key="spread" kind={open} books={books} films={films} onClose={close} />
      ) : open ? (
        <StorySpread key="spread" story={open} onClose={close} />
      ) : null}
    </AnimatePresence>
  );
}
