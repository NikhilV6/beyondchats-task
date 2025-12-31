const axios = require("axios");

const SERPER_URL = "https://google.serper.dev/search";

async function searchGoogle(query) {
  const res = await axios.post(
    SERPER_URL,
    { q: query, num: 5 },
    {
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data.organic || [];
}

async function getTopCompetitorLinks(title) {
  const results = await searchGoogle(title);

  const links = [];

  for (const r of results) {
    if (!r.link) continue;
    if (r.link.includes("beyondchats.com")) continue;

    links.push(r.link);
    if (links.length === 2) break;
  }

  return links;
}

module.exports = {
  getTopCompetitorLinks
};
