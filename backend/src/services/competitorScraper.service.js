const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeCompetitorArticle(url) {
  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    },
    timeout: 15000
  });

  const $ = cheerio.load(response.data);

  let contentParts = [];

  const trySelectors = [
    "article",
    "main",
    "[class*='content']",
    "[class*='post']"
  ];

  for (const selector of trySelectors) {
    $(selector)
      .find("p, h1, h2, h3, li")
      .each((_, el) => {
        const text = $(el).text().trim();

        if (
          text.length > 40 &&
          !text.toLowerCase().includes("cookie") &&
          !text.toLowerCase().includes("privacy") &&
          !text.toLowerCase().includes("subscribe") &&
          !text.toLowerCase().includes("newsletter")
        ) {
          contentParts.push(text);
        }
      });

    if (contentParts.length > 10) break; // good enough
  }

  // Absolute fallback
  if (contentParts.length === 0) {
    $("p").each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 40) contentParts.push(text);
    });
  }

  return contentParts.join("\n\n");
}

module.exports = {
  scrapeCompetitorArticle
};
