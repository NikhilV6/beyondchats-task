// const BASE_URL = "http://localhost:5000/api/articles";
const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchArticles() {
  const res = await fetch(BASE_URL);
  return res.json();
}

export async function fetchArticleById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
}
