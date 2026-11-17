import { XMLParser } from "fast-xml-parser";

export type LatestPost = {
  title: string;
  url: string;
  published: string;
};

/** Read on the server: no browser CORS dependency or client-side feed request. */
export async function getLatestPost(): Promise<LatestPost | null> {
  try {
    const response = await fetch("https://sherryliuser.substack.com/feed", {
      next: { revalidate: 60 * 60 * 24 * 30 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Substack returned ${response.status}`);
    const feed = new XMLParser({ processEntities: true }).parse(await response.text());
    const items = feed?.rss?.channel?.item;
    const posts = Array.isArray(items) ? items : items ? [items] : [];
    for (const post of posts) {
      if (typeof post.title !== "string" || typeof post.link !== "string") continue;
      const url = new URL(post.link);
      const date = new Date(post.pubDate);
      if (url.origin !== "https://sherryliuser.substack.com" || Number.isNaN(date.getTime())) continue;
      return { title: post.title, url: url.href, published: date.toISOString() };
    }
  } catch (error) {
    // The cover and the regular Substack link still work if the feed is down.
    console.warn("Couldn't refresh the Substack clipping:", error);
  }
  return null;
}
