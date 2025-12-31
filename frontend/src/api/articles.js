const BASE_URL = "http://localhost:5000/api/articles";

export async function fetchArticles() {
  const res = await fetch(BASE_URL);
  return res.json();
}

export async function fetchArticleById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
}
