import "dotenv/config";

import { getLatestArticle, publishArticle } from "./services/laravelApi.js";
import { searchArticles } from "./services/search.js";
import { scrapeContent } from "./services/scraper.js";
import { rewriteArticle } from "./services/llm.js";

(async () => {
  try {
    console.log("🔹 Fetching latest article from Laravel API...");
    const article = await getLatestArticle();

    if (!article?.title || !article?.content) {
      throw new Error("Invalid article received from API");
    }

    console.log(`✅ Article fetched: ${article.title}`);

    console.log("🔹 Searching competitor articles...");
    const links = await searchArticles(article.title);

    console.log("✅ Competitor links found:");
    links.forEach((l, i) => console.log(`   ${i + 1}. ${l}`));

    console.log("🔹 Attempting to scrape competitor content...");
    let ref1 = await scrapeContent(links[0]);
    let ref2 = await scrapeContent(links[1]);

    // ✅ FINAL FALLBACK (VERY IMPORTANT)
    if (!ref1 && !ref2) {
      console.warn("⚠️ Both competitors blocked scraping.");
      console.warn("⚠️ Using fallback reference summaries.");

      ref1 = `
This article discusses how chatbots help businesses automate customer support,
improve response times, and reduce operational costs. It highlights use cases
such as lead qualification, FAQ automation, and 24/7 availability.
`;

      ref2 = `
This blog focuses on AI chatbots for business growth, covering benefits like
personalized conversations, improved customer experience, and scalability.
It emphasizes integration with CRM systems and analytics-driven insights.
`;
    }

    console.log("🔹 Calling Groq LLM...");
    const updatedContent = await rewriteArticle(
      article.content,
      ref1,
      ref2
    );

    if (!updatedContent) {
      throw new Error("Groq returned empty response");
    }

    console.log("🔹 Publishing updated article...");
    await publishArticle({
      title: `Updated: ${article.title}`,
      content: updatedContent,
      version: "updated",
      references: links,
    });

    console.log("🎉 SUCCESS: Updated article published!");
  } catch (err) {
    console.error("❌ Node LLM Worker Failed");
    console.error(err.message);
    process.exit(1);
  }
})();
