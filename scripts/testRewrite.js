require("dotenv").config({ path: "backend/.env" });

const { rewriteArticle } = require("../backend/src/services/aiRewrite.service");

(async () => {
  const result = await rewriteArticle({
    title: "What is a Live Chatbot?",
    originalContent: `
A live chatbot is a software tool that allows businesses to communicate
with users in real time through chat interfaces.
    `,
    competitorContents: [
      "Live chatbots allow instant communication between brands and customers.",
      "They improve customer experience by responding instantly."
    ]
  });

  console.log("\n===== GENERATED ARTICLE =====\n");
  console.log(result);
})();
