import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ArticlePage from "./pages/ArticlePage";

export default function App() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <>
      <Navbar />

      {!selectedArticle ? (
        <Home onSelect={setSelectedArticle} />
      ) : (
        <ArticlePage
          articleId={selectedArticle}
          onBack={() => setSelectedArticle(null)}
        />
      )}
    </>
  );
}
