import { useEffect, useState } from "react";
import { fetchArticles } from "../api/articles";
import ArticleCard from "../components/ArticleCard";
import Container from "../components/Container";
import SectionTitle from "../components/SectionTitle";

export default function Home({ onSelect }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  return (
    <Container>
      <SectionTitle
        title="Generated Articles"
        subtitle="AI-rewritten content generated from top Google results"
      />

      {loading ? (
        <p className="text-slate-500">Loading articles...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article._id}
              article={article}
              onClick={onSelect}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
