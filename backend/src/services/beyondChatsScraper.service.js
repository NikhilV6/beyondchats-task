const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://beyondchats.com";

/**
 * Load HTML
 */
async function fetchBlogPage(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

/**
 * Find last pagination page number
 */
async function getLastPageNumber() {
  const $ = await fetchBlogPage(`${BASE_URL}/blogs/`);

  let maxPage = 1;

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    const match = href.match(/\/blogs\/page\/(\d+)/);
    if (match) {
      maxPage = Math.max(maxPage, parseInt(match[1], 10));
    }
  });

  return maxPage;
}

/**
 * Extract article URLs from listing page
 */
async function getArticleLinksFromPage(pageUrl) {
  const $ = await fetchBlogPage(pageUrl);
  const links = new Set();

  $("article").each((_, article) => {
    const link = $(article).find("a.ct-media-container").attr("href");

    if (!link) return;

    const fullUrl = link.startsWith("http")
      ? link
      : BASE_URL + link;

    // safety check: only real blog posts
    if (!fullUrl.includes("/blogs/")) return;

    links.add(fullUrl);
  });

  return Array.from(links);
}

/**
 * Extract full article content
 */
async function scrapeArticle(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const title = $("h1").first().text().trim();

  const contentParts = [];

  // Target actual Elementor blog content container
  $(".elementor-widget-theme-post-content")
    .find("p, h2, h3, h4, li")
    .each((_, el) => {
      const text = $(el).text().trim();

      if (
        text.length > 30 &&
        !text.toLowerCase().includes("copyright") &&
        !text.toLowerCase().includes("all rights reserved") &&
        !text.toLowerCase().includes("beyondchats")
      ) {
        contentParts.push(text);
      }
    });

  const content = contentParts.join("\n\n");

  return {
    title,
    content,
    sourceUrl: url
  };
}



module.exports = {
  getLastPageNumber,
  getArticleLinksFromPage,
  scrapeArticle
};
