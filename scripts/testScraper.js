const { scrapeCompetitorArticle } = require(
  "../backend/src/services/competitorScraper.service"
);

(async () => {
  const url = "https://forethought.ai/blog/chatbot-for-small-business";
  const text = await scrapeCompetitorArticle(url);
  console.log(text.slice(0, 1500));
})();
