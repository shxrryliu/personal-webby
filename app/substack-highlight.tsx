"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTiming } from "./motion";
import type { SubstackPost } from "./substack";

/** One essay stays on the cover; the reader decides when to turn to another. */
export function SubstackHighlight({ posts }: { posts: SubstackPost[] }) {
  const [index, setIndex] = useState(0);
  const { timing } = useTiming();
  if (!posts.length) return null;
  const post = posts[index % posts.length];

  return (
    <div className={`relative bg-bone px-4 pt-3 text-espresso ${posts.length > 1 ? "essay-card pb-9" : "pb-3"}`}>
        <motion.div
          key={post.url}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={timing({ duration: 0.2 })}
        >
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="read the essay ↗"
            title={post.title}
            className="block min-h-[47px] text-[18px] leading-[1.3] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt"
          >
            <span className="line-clamp-2">{post.title.toLowerCase()}</span>
          </a>
          <div className="mt-2.5 flex items-center justify-between gap-3 font-type text-[11px] text-espresso/70">
            <time dateTime={post.published}>
              {new Date(post.published).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
              }).toLowerCase()}
            </time>
            <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-cobalt hover:underline">
              from diet coke club ↗
            </a>
          </div>
        </motion.div>
      {posts.length > 1 && (
        <nav aria-label="Featured Substack essays">
          <button
            type="button"
            aria-label="Previous essay"
            data-cursor="previous essay ←"
            onClick={() => setIndex((current) => (current + posts.length - 1) % posts.length)}
            className="essay-previous absolute bottom-0 left-0 size-9 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cobalt"
          ><span aria-hidden="true" className="essay-fold-left paper-fold absolute bottom-0 left-0" /></button>
          <span aria-live="polite" aria-atomic="true" className="sr-only">
            essay {index + 1} of {posts.length}: {post.title}
          </span>
          <button
            type="button"
            aria-label="Next essay"
            data-cursor="next essay →"
            onClick={() => setIndex((current) => (current + 1) % posts.length)}
            className="essay-next absolute bottom-0 right-0 size-9 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cobalt"
          ><span aria-hidden="true" className="essay-fold-right paper-fold absolute bottom-0 right-0" /></button>
        </nav>
      )}
    </div>
  );
}
