import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Extract valid article links from HTML
 */
const extractLinks = (html) => {
  const $ = cheerio.load(html);
  const links = [];

  $("a").each((_, el) => {
    const href = $(el).attr("href");

    if (
      href &&
      href.startsWith("http") &&
      !href.includes("duckduckgo.com") &&
      !href.includes("bing.com") &&
      !href.includes("youtube.com")
    ) {
      links.push(href);
    }
  });

  return [...new Set(links)];
};

/**
 * Search articles using multiple fallbacks
 */
export const searchArticles = async (query) => {
  let links = [];

  // 1️⃣ DuckDuckGo search
  try {
    const ddg = await axios.get(
      `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`
    );
    links = extractLinks(ddg.data);
  } catch (err) {
    console.warn("DuckDuckGo search failed");
  }

  // 2️⃣ Bing fallback
  if (links.length < 2) {
    try {
      const bing = await axios.get(
        `https://www.bing.com/search?q=${encodeURIComponent(query)}`
      );
      links = extractLinks(bing.data);
    } catch (err) {
      console.warn("Bing search failed");
    }
  }

  // 3️⃣ Hard fallback (documented assumption)
  if (links.length < 2) {
    links = [
      "https://www.intercom.com/blog/chatbots/",
      "https://www.tidio.com/blog/chatbots-for-business/"
    ];
  }

  return links.slice(0, 2);
};
