import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { api } from "@/lib/api";

const PAGE_SIZE = 9;

export default function InsightsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialQ = searchParams.get("q") || "";
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState(initialCategory);
  const [q, setQ] = useState(initialQ);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/posts", {
        params: {
          category: category || undefined,
          q: q || undefined,
          limit: PAGE_SIZE,
          skip: page * PAGE_SIZE,
        },
      })
      .then(({ data }) => {
        setPosts(data.items || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [category, q, page]);

  useEffect(() => {
    const next = {};
    if (category) next.category = category;
    if (q) next.q = q;
    setSearchParams(next, { replace: true });
  }, [category, q, setSearchParams]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  return (
    <div data-testid="insights-page">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-24 lg:px-12 lg:pt-32">
          <p className="text-mono-label">// Insights</p>
          <h1 className="font-display mt-6 max-w-3xl text-4xl font-medium leading-tight md:text-5xl">
            Engineering notes on intelligent physical systems.
          </h1>
          <p className="mt-6 max-w-2xl text-slate-400">
            Drafts, perspectives, and field notes from work on autonomy, edge intelligence,
            distributed optimization, and the engineering of trustworthy systems.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 border border-white/10 bg-[#0a0a0c] px-3 py-2 md:w-96">
              <Search size={14} strokeWidth={1.5} className="text-slate-500" />
              <input
                type="search"
                value={q}
                onChange={(e) => {
                  setPage(0);
                  setQ(e.target.value);
                }}
                placeholder="Search insights"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
                data-testid="insights-search"
              />
            </div>
            <div className="overflow-x-auto">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em]">
                <button
                  className={`border px-3 py-1.5 ${
                    !category ? "border-white text-white" : "border-white/15 text-slate-400 hover:border-white/30"
                  }`}
                  onClick={() => {
                    setPage(0);
                    setCategory("");
                  }}
                  data-testid="filter-all"
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    className={`whitespace-nowrap border px-3 py-1.5 ${
                      category === c ? "border-white text-white" : "border-white/15 text-slate-400 hover:border-white/30"
                    }`}
                    onClick={() => {
                      setPage(0);
                      setCategory(c);
                    }}
                    data-testid={`filter-${c.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
          {loading ? (
            <p className="font-mono text-xs text-slate-500" data-testid="insights-loading">Loading…</p>
          ) : posts.length === 0 ? (
            <p className="font-mono text-xs text-slate-500" data-testid="insights-empty">No insights match this filter.</p>
          ) : (
            <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  to={`/insights/${post.slug}`}
                  key={post.slug}
                  className="group bg-[#0a0a0c] p-8 hover:bg-[#101013]"
                  data-testid={`insight-card-${post.slug}`}
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-blue-400">{post.category}</p>
                  <h3 className="mt-4 font-display text-lg font-medium leading-snug text-white group-hover:text-blue-200">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">{post.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    <span>{post.reading_time || 1} min read</span>
                    <span>{(post.published_at || "").slice(0, 10)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-between font-mono text-xs text-slate-400">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="border border-white/15 px-4 py-2 uppercase tracking-[0.2em] hover:border-white/30 disabled:opacity-40"
                data-testid="pagination-prev"
              >
                ← Prev
              </button>
              <span data-testid="pagination-status">
                Page {page + 1} / {totalPages}
              </span>
              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="border border-white/15 px-4 py-2 uppercase tracking-[0.2em] hover:border-white/30 disabled:opacity-40"
                data-testid="pagination-next"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
