export default function Navbar() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">
          Article Intelligence
        </h1>

        <span className="text-sm text-slate-500">
          AI Content Rewriter
        </span>
      </div>
    </header>
  );
}
