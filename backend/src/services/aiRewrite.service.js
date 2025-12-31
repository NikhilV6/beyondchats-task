const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Rewrite article using competitor content
 */
async function rewriteArticle({
  title,
  originalContent,
  competitorContents
}) {
  const prompt = `
You are an expert SEO content writer.

Rewrite the following article using best practices from the competitor articles.

RULES:
- Do NOT copy any sentence from competitors
- Keep meaning accurate and factual
- Improve clarity, flow, and structure
- Use headings and subheadings
- Write naturally for humans
- Do NOT mention competitors or sources
- Do NOT say "this article is rewritten"
- Output plain text (no markdown)
- Length should be similar or slightly longer
- Add a short conclusion

ARTICLE TITLE:
${title}

ORIGINAL ARTICLE:
${originalContent}

COMPETITOR CONTENT (for reference only):
${competitorContents.join("\n\n---\n\n")}
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 1400,
    messages: [
      { role: "system", content: "You are a professional SEO content writer." },
      { role: "user", content: prompt }
    ]
  });

  return completion.choices[0].message.content.trim();
}

module.exports = {
  rewriteArticle
};
