require("dotenv").config({ path: "backend/.env" });

const connectDB = require("../backend/src/config/db");
const Article = require("../backend/src/models/Article");
const { getTopCompetitorLinks } = require("../backend/src/services/googleSearch.service");

async function run() {
  try {
    await connectDB();
    console.log("Connected to DB");

    // Get articles without references
    const articles = await Article.find({
      $or: [
        { references: { $exists: false } },
        { references: { $size: 0 } }
      ]
    });

    console.log(`Found ${articles.length} articles to enrich`);

    for (const article of articles) {
      console.log("\nSearching competitors for:", article.title);

      const links = await getTopCompetitorLinks(article.title);

      if (!links || links.length === 0) {
        console.log("No competitors found.");
        continue;
      }

      article.references = links;
      await article.save();

      console.log("Saved references:", links);
    }

    console.log("✅ Competitor search completed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error running competitor search:", err);
    process.exit(1);
  }
}

run();
