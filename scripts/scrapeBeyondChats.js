require("dotenv").config({ path: "backend/.env" });

const connectDB = require("../backend/src/config/db");
const Article = require("../backend/src/models/Article");

const {
  getLastPageNumber,
  getArticleLinksFromPage,
  scrapeArticle
} = require("../backend/src/services/beyondChatsScraper.service");

async function run() {
  try {
    await connectDB();
    console.log("Connected to DB");

    const lastPage = await getLastPageNumber();
    console.log("Last page:", lastPage);

    let allLinks = [];

    // Collect from oldest → newest
    for (let page = 1; page <= lastPage; page++) {
      const pageUrl = `https://beyondchats.com/blogs/page/${page}/`;
      console.log("Scanning:", pageUrl);

      const links = await getArticleLinksFromPage(pageUrl);
      allLinks.push(...links);
    }

    // Deduplicate while preserving order
    allLinks = [...new Set(allLinks)];

    const oldestFive = allLinks.slice(-5);

    console.log("Final selected articles:", oldestFive);

    for (const url of oldestFive) {
      const exists = await Article.findOne({ sourceUrl: url });
      if (exists) {
        console.log("Skipping existing:", url);
        continue;
      }

      const article = await scrapeArticle(url);

      if (!article.content || article.content.length < 50) {
        console.log("Skipping empty article:", url);
        continue;
      }

      await Article.create(article);
      console.log("Saved:", article.title);
    }

    console.log("Scraping completed successfully");
    process.exit(0);
  } catch (err) {
    console.error("Scraping failed:", err);
    process.exit(1);
  }
}

run();
