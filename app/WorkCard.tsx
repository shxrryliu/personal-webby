"use client";

import Image from "next/image";
import { useExpandedCards } from "./expanded-cards-context";

// Generate a stable ID from title for accessibility attributes
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type WorkCardDetails = {
  summary: string;
  bulletsTitle?: string;
  bullets?: string[];
  paragraphs?: string[];
  footer?: string;
  footerUrl?: string;
  mediaSrc?: string;
  mediaAlt?: string;
};

export type WorkCardProps = {
  title: string;
  date: string;
  image?: string;
  /** Tailwind aspect-ratio class to match Figma proportions */
  aspect?: string;
  hasExternalLink?: boolean;
  url?: string;

  /** If present, card becomes expandable on click and collapses on mouse leave */
  details?: WorkCardDetails;
  /** CSS color for the gradient end (bottom-right). Falls back to cream-dark if omitted. */
  gradientColor?: string;
};

export function WorkCard({
  title,
  date,
  image,
  aspect,
  hasExternalLink,
  url,
  details,
  gradientColor,
}: WorkCardProps) {
  const { isExpanded, setExpanded: setCardExpanded } = useExpandedCards();
  const expanded = isExpanded(title);
  const detailsId = `details-${slugify(title)}`;

  const isExpandable = Boolean(details);
  const isClickable = Boolean(url) || isExpandable;

  const card = (
    <article
      className={[
        "group px-[20px]",
        isClickable ? "cursor-magnify" : "",
        isExpandable ? "select-none" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={
        isExpandable
          ? () => {
              setCardExpanded(title, true);
            }
          : undefined
      }
      onMouseLeave={
        isExpandable
          ? () => {
              setCardExpanded(title, false);
            }
          : undefined
      }
      role={isExpandable ? "button" : undefined}
      tabIndex={isExpandable ? 0 : undefined}
      aria-expanded={isExpandable ? expanded : undefined}
      aria-controls={isExpandable ? detailsId : undefined}
      onKeyDown={
        isExpandable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setCardExpanded(title, true);
              }
              if (e.key === "Escape") setCardExpanded(title, false);
            }
          : undefined
      }
    >
      {/* Title row */}
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-sm font-bold md:text-base">{title}</h2>
        <span className="text-charcoal-light" aria-hidden="true">
          &#9734;
        </span>
        <span className="text-sm text-charcoal-light">{date}</span>
      </div>

      {/* Card body (image + expandable details live within the same container) */}
      <div
        className="overflow-hidden rounded-lg transition-shadow group-hover:shadow-md"
        style={{
          background: gradientColor
            ? `linear-gradient(135deg, #e8e1d8 0%, ${gradientColor} 100%)`
            : "#e8e1d8",
        }}
      >
        {image ? (
          <div className="pb-0">
            <Image
              src={image}
              alt={`${title} screenshot`}
              // These provide an initial intrinsic size; final rendered size is controlled by style below.
              width={1200}
              height={400}
              sizes="(min-width: 768px) 768px, 100vw"
              style={{ width: "100%", height: "auto" }}
              className="block object-contain"
            />
          </div>
        ) : (
          <div className="relative flex aspect-[3/1] items-end justify-end p-4 md:p-6">
            {hasExternalLink && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-charcoal-light"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            )}
          </div>
        )}

        {/* Expandable details */}
        {details && (
          <div
            id={detailsId}
            className={[
              "border-t border-warm-gray/50 px-6 text-sm leading-relaxed md:px-10 md:text-base",
              "transition-[max-height,opacity,transform] duration-700 ease-out",
              expanded
                ? "max-h-[520px] opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-1",
            ].join(" ")}
          >
            <p className="font-bold pt-6">{details.summary}</p>

            {details.bullets?.length ? (
              <div className="pt-3">
                {details.bulletsTitle ? (
                  <p className="mb-2">{details.bulletsTitle}</p>
                ) : null}
                <ul className="list-disc space-y-1 pl-6">
                  {details.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {details.paragraphs?.length ? (
              <div className="space-y-3 pt-3">
                {details.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            ) : null}

            {details.footer ? (
              <p className="mt-4 pb-8 text-right">
                {details.footerUrl ? (
                  <a
                    href={details.footerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 underline hover:text-charcoal-light"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {details.footer}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ) : (
                  details.footer
                )}
              </p>
            ) : null}

            {details.mediaSrc ? (
              <div className="pb-8 pt-3">
                <Image
                  src={details.mediaSrc}
                  alt={details.mediaAlt ?? `${title} additional image`}
                  width={1400}
                  height={900}
                  sizes="(min-width: 768px) 768px, 100vw"
                  style={{ width: "100%", height: "auto" }}
                  className="block rounded-md"
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );

  if (!url) return card;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      onClick={(e) => {
        // If the card is expandable, prioritize expand over navigating.
        if (isExpandable) e.preventDefault();
      }}
    >
      {card}
    </a>
  );
}

