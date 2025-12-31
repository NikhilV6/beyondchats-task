import { useEffect, useState } from "react";
import { fetchArticleById } from "../api/articles";
import Container from "../components/Container";

export default function ArticlePage({ articleId, onBack }) {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetchArticleById(articleId).then(setArticle);
  }, [articleId]);

  if (!article) {
    return (
      <Container>
        <p className="text-slate-500">Loading article...</p>
      </Container>
    );
  }

  return (
    <Container>
      <button
        onClick={onBack}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back to articles
      </button>

      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        {article.title}
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Original */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-3 text-slate-800">
            Original Article
          </h2>
          <div className="prose prose-slate max-w-none whitespace-pre-wrap">
            {article.content}
          </div>
        </div>

        {/* Rewritten */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-3 text-slate-800">
            AI Rewritten Article
          </h2>
          <div className="prose prose-slate max-w-none whitespace-pre-wrap">
            {article.updatedContent || "Not generated yet"}
          </div>
        </div>
      </div>

      {article.references?.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-3">References</h3>
          <ul className="list-disc pl-5 space-y-1 text-blue-600">
            {article.references.map((ref, i) => (
              <li key={i}>
                <a href={ref} target="_blank" rel="noreferrer">
                  {ref}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}
