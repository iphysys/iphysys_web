import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { INSIGHTS_TOPICS } from "@/constants/insightsTopics";

const PAGE_SIZE = 9;

export default function InsightsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [topicKey, setTopicKey] = useState(searchParams.get("topic") || "");
  const [subKey, setSubKey] = useState(searchParams.get("sub") || "");
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [openTopics, setOpenTopics] = useState(() =>
    topicKey ? { [topicKey]: true } : {}
  );

  const activeTopic = useMemo(
    () => INSIGHTS_TOPICS.find((t) => t.key === topicKey),
    [topicKey]
  );
  const activeSub = useMemo(
    () => activeTopic?.children.find((c) => c.key === subKey),
    [activeTopic, subKey]
  );

  // Fetch posts whenever filters change
  useEffect(() => {
    setLoading(true);
    const params = {
      limit: PAGE_SIZE,
      skip: page * PAGE_SIZE,
    };
    if (activeTopic?.category) params.category = activeTopic.category;
    if (activeSub?.tag) params.tag = activeSub.tag;
    if (q) params.q = q;

    api
      .get("/posts", { params })
      .then(({ data }) => {
        setPosts(data.items || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [activeTopic, activeSub, q, page]);

  // Sync URL
  useEffect(() => {
    const next = {};
    if (topicKey) next.topic = topicKey;
    if (subKey) next.sub = subKey;
    if (q) next.q = q;
    setSearchParams(next, { replace: true });
  }, [topicKey, subKey, q, setSearchParams]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  const toggleOpen = (key) =>
    setOpenTopics((s) => ({ ...s, [key]: !s[key] }));

  const selectTopic = (key) => {
    setPage(0);
    setSubKey("");
    setTopicKey(key === topicKey ? "" : key);
    setOpenTopics((s) => ({ ...s, [key]: true }));
  };

  const selectSub = (topic, sub) => {
    setPage(0);
    setTopicKey(topic);
    setSubKey(sub === subKey ? "" : sub);
    setOpenTopics((s) => ({ ...s, [topic]: true }));
  };

  const clearAll = () => {
    setPage(0);
    setTopicKey("");
    setSubKey("");
    setQ("");
  };

  return (
    <div data-testid="insights-page">
      <section className="border-b border-[#3a2a20]">
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-24 lg:px-12 lg:pt-32">
          <p className="text-mono-label">// Insights</p>
          <h1 className="font-display mt-6 max-w-3xl text-4xl font-medium leading-tight md:text-5xl">
            Engineering notes on intelligent physical systems.
          </h1>
          <p className="mt-6 max-w-2xl text-slate-400">
            Drafts, perspectives, and field notes — filtered by topic, sub-topic, and free-text search.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* SIDEBAR */}
            <aside className="lg:col-span-3" data-testid="insights-sidebar">
              <div className="border border-[#3a2a20] bg-[#120d0a]">
                <div className="border-b border-[#3a2a20] p-4">
                  <p className="text-mono-label">Topics</p>
                  <button
                    onClick={clearAll}
                    className="mt-3 text-xs font-mono uppercase tracking-[0.2em] text-slate-500 hover:text-[#d4af37]"
                    data-testid="insights-clear"
                  >
                    Clear filters
                  </button>
                </div>
                <nav className="max-h-[70vh] overflow-y-auto p-2" data-testid="topics-nav">
                  {INSIGHTS_TOPICS.map((t) => {
                    const isOpen = !!openTopics[t.key];
                    const isActive = topicKey === t.key && !subKey;
                    return (
                      <div key={t.key} className="border-b border-[#231814] last:border-b-0">
                        <button
                          onClick={() => {
                            selectTopic(t.key);
                            toggleOpen(t.key);
                          }}
                          className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors ${
                            isActive
                              ? "bg-[#1a120e] text-[#d4af37]"
                              : "text-slate-300 hover:bg-[#1a120e] hover:text-white"
                          }`}
                          data-testid={`topic-${t.key}`}
                        >
                          <span className="font-mono text-[12px] uppercase tracking-[0.15em]">
                            {t.label}
                          </span>
                          {isOpen ? (
                            <ChevronDown size={12} strokeWidth={1.5} />
                          ) : (
                            <ChevronRight size={12} strokeWidth={1.5} />
                          )}
                        </button>
                        {isOpen && (
                          <div className="border-l border-[#3a2a20] bg-[#0f0a08] pb-2 pl-3">
                            {t.children.map((c) => {
                              const subActive = topicKey === t.key && subKey === c.key;
                              return (
                                <button
                                  key={c.key}
                                  onClick={() => selectSub(t.key, c.key)}
                                  className={`block w-full px-3 py-1.5 text-left text-xs ${
                                    subActive
                                      ? "text-[#d4af37]"
                                      : "text-slate-400 hover:text-white"
                                  }`}
                                  data-testid={`subtopic-${t.key}-${c.key}`}
                                >
                                  · {c.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* MAIN */}
            <div className="lg:col-span-9" data-testid="insights-main">
              <div className="mb-6 flex items-center gap-3 border border-[#3a2a20] bg-[#120d0a] px-3 py-2">
                <Search size={14} strokeWidth={1.5} className="text-[#d4af37]" />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => {
                    setPage(0);
                    setQ(e.target.value);
                  }}
                  placeholder="Search insights (title, excerpt, body)…"
                  className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
                  data-testid="insights-search"
                />
              </div>

              <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                <span>Filter:</span>
                {activeTopic ? (
                  <span
                    className="border border-[#d4af37]/40 bg-[#d4af37]/10 px-2 py-1 text-[#d4af37]"
                    data-testid="active-topic"
                  >
                    {activeTopic.label}
                  </span>
                ) : (
                  <span className="text-slate-500">All topics</span>
                )}
                {activeSub && (
                  <span
                    className="border border-[#b91c1c]/40 bg-[#b91c1c]/10 px-2 py-1 text-[#fca5a5]"
                    data-testid="active-subtopic"
                  >
                    {activeSub.label}
                  </span>
                )}
                {q && (
                  <span className="border border-white/15 px-2 py-1 text-slate-300" data-testid="active-search">
                    "{q}"
                  </span>
                )}
              </div>

              {loading ? (
                <p className="font-mono text-xs text-slate-500" data-testid="insights-loading">Loading…</p>
              ) : posts.length === 0 ? (
                <div className="border border-[#3a2a20] bg-[#120d0a] p-10 text-center" data-testid="insights-empty">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">No insights yet</p>
                  <p className="mt-2 text-sm text-slate-400">
                    {activeTopic
                      ? `Nothing published under "${activeTopic.label}" yet.`
                      : "No insights match this filter."}
                  </p>
                </div>
              ) : (
                <div className="grid gap-px border border-[#3a2a20] bg-[#3a2a20] sm:grid-cols-2 xl:grid-cols-3">
                  {posts.map((post) => (
                    <Link
                      to={`/insights/${post.slug}`}
                      key={post.slug}
                      className="group bg-[#120d0a] p-6 hover:bg-[#1a120e]"
                      data-testid={`insight-card-${post.slug}`}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-widest text-[#d4af37]">
                        {post.category}
                      </p>
                      <h3 className="mt-3 font-display text-base font-medium leading-snug text-white group-hover:text-[#f4c95d]">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">{post.excerpt}</p>
                      <div className="mt-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-slate-500">
                        <span>{post.reading_time || 1} min read</span>
                        <span>{(post.published_at || "").slice(0, 10)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between font-mono text-xs text-slate-400">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className="border border-[#3a2a20] px-4 py-2 uppercase tracking-[0.2em] hover:border-[#d4af37]/40 disabled:opacity-40"
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
                    className="border border-[#3a2a20] px-4 py-2 uppercase tracking-[0.2em] hover:border-[#d4af37]/40 disabled:opacity-40"
                    data-testid="pagination-next"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
