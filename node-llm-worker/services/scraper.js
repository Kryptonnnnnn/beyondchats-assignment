import axios from "axios";
import * as cheerio from "cheerio";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
};

export const scrapeContent = async (url) => {
  if (!url || !url.startsWith("http")) {
    console.warn("⚠️ Invalid URL skipped:", url);
    return "";
  }

  try {
    const res = await axios.get(url, {
      headers: HEADERS,
      timeout: 15000,
      validateStatus: (status) => status < 500, // allow 403/404
    });

    if (res.status !== 200) {
      console.warn(`⚠️ Skipped (${res.status}): ${url}`);
      return "";
    }

    const $ = cheerio.load(res.data);

    const text = $("p")
      .map((_, el) => $(el).text())
      .get()
      .join("\n\n");

    return text.slice(0, 6000);
  } catch (err) {
    console.warn(`⚠️ Failed to scrape: ${url}`);
    return "";
  }
};
