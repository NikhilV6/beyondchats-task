export default function ArticleCard({ article, onClick }) {
  return (
    <div
      onClick={() => onClick(article._id)}
      className="group cursor-pointer rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-2">
        {article.title}
      </h3>

      <p className="mt-2 text-sm text-slate-500 line-clamp-3">
        {article.content?.slice(0, 160)}...
      </p>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>View article →</span>
        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
