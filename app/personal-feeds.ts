import { load } from "cheerio/slim";
import { XMLParser } from "fast-xml-parser";
import { GOODREADS_URL, LETTERBOXD_URL } from "./personal-links";

export type Book = { title: string; author: string; url: string; image: string };
export type Film = { title: string; url: string; image: string; year: string; rating: number | null; review: string };

const MONTH = 60 * 60 * 24 * 30;

function safeUrl(value: unknown, base: string, hosts: string[]) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value, base);
    return url.protocol === "https:" && hosts.includes(url.hostname) ? url.href : "";
  } catch {
    return "";
  }
}

async function publicPage(url: string) {
  const response = await fetch(url, { next: { revalidate: MONTH }, signal: AbortSignal.timeout(6000) });
  if (!response.ok) throw new Error(`Public feed returned ${response.status}`);
  return response.text();
}

/** Goodreads' public profile exposes current books even without its old RSS feed. */
export async function getBooks(): Promise<Book[]> {
  try {
    const $ = load(await publicPage(GOODREADS_URL));
    const books: Book[] = [];
    $("#currentlyReadingReviews .Updates").each((_, element) => {
      const item = $(element);
      const title = item.find(".bookTitle").text().trim();
      const author = item.find(".authorName").text().trim();
      const url = safeUrl(item.find(".bookTitle").attr("href"), GOODREADS_URL, ["www.goodreads.com"]);
      const image = safeUrl(item.find(".firstcol img").attr("src"), GOODREADS_URL, ["i.gr-assets.com", "images.gr-assets.com"])
        .replace(/_SX\d+_/, "_SX256_");
      if (title && url && !books.some((book) => book.url === url)) books.push({ title, author, url, image });
    });
    return books.slice(0, 3);
  } catch (error) {
    console.warn("Couldn't refresh the reading shelf:", error);
    return [];
  }
}

export async function getFilms(): Promise<Film[]> {
  try {
    const feed = new XMLParser({ parseTagValue: false }).parse(await publicPage(`${LETTERBOXD_URL}rss/`));
    const items = feed?.rss?.channel?.item;
    const entries = Array.isArray(items) ? items : items ? [items] : [];
    const films: Film[] = [];
    for (const item of entries) {
      const title = item["letterboxd:filmTitle"];
      const url = safeUrl(item.link, LETTERBOXD_URL, ["letterboxd.com"]);
      if (typeof title !== "string" || !url || films.some((film) => film.url === url)) continue;
      const $ = load(typeof item.description === "string" ? item.description : "");
      const image = safeUrl($("img").first().attr("src"), LETTERBOXD_URL, ["a.ltrbxd.com", "s.ltrbxd.com"]);
      const review = $("p").map((_, p) => $(p).text().trim()).get()
        .filter((text) => text && !/^Watched on\b/.test(text)).join(" ");
      const rating = Number(item["letterboxd:memberRating"]);
      films.push({
        title, url, image,
        year: String(item["letterboxd:filmYear"] ?? ""),
        rating: Number.isFinite(rating) && rating >= 0.5 && rating <= 5 ? rating : null,
        review: review.length > 220 ? `${review.slice(0, 217).trimEnd()}…` : review,
      });
      if (films.length === 3) break;
    }
    return films;
  } catch (error) {
    console.warn("Couldn't refresh the film diary:", error);
    return [];
  }
}
