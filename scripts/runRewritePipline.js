require("dotenv").config({ path: "backend/.env" });

const connectDB = require("../backend/src/config/db");
const Article = require("../backend/src/models/Article");

const { getTopCompetitorLinks } = require("../backend/src/services/googleSearch.service");
const { scrapeCompetitorArticle } = require("../backend/src/services/competitorScraper.service");
const { rewriteArticle } = require("../backend/src/services/aiRewrite.service");

async function run() {
  try {
    await connectDB();
    console.log("✅ Connected to DB");

    const articles = await Article.find({
      updatedContent: { $in: [null, ""] }
    });

    console.log(`📄 Articles to process: ${articles.length}`);

    for (const article of articles) {
      console.log("\n➡ Processing:", article.title);

      // STEP 1: Get competitor URLs
      let competitorLinks = article.references || [];

      if (!competitorLinks.length) {
        competitorLinks = await getTopCompetitorLinks(article.title);
      }

      if (!competitorLinks.length) {
        console.log("⚠️ No competitor links found");
        continue;
      }

      // STEP 2: Scrape competitor content
      const competitorContents = [];

      for (const link of competitorLinks) {
        try {
          const text = await scrapeCompetitorArticle(link);
          if (text && text.length > 300) {
            competitorContents.push(text);
          }
        } catch (err) {
          console.log("⚠️ Failed scraping:", link);
        }
      }

      if (!competitorContents.length) {
        console.log("⚠️ No usable competitor content");
        continue;
      }

      // STEP 3: Rewrite using AI
      const rewritten = await rewriteArticle({
        title: article.title,
        originalContent: article.content,
        competitorContents
      });

      if (!rewritten || rewritten.length < 300) {
        console.log("⚠️ Rewrite too short, skipping");
        continue;
      }

      // STEP 4: Append references
      const referencesText =
        "\n\nReferences:\n" +
        competitorLinks.map((l, i) => `${i + 1}. ${l}`).join("\n");

      article.updatedContent = rewritten + referencesText;
      article.references = competitorLinks;

      await article.save();

      console.log("✅ Updated:", article.title);
    }

    console.log("\n🎉 All articles processed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Pipeline failed:", err);
    process.exit(1);
  }
}

run();
