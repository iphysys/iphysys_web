import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

export default function InsightDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setPost(null);
    api
      .get(`/posts/${slug}`)
      .then(({ data }) => {
        setPost(data.post);
        setRelated(data.related || []);
        document.title = `${data.post.title} — iphysys`;
      })
      .catch(() => setError("Insight not found."));
  }, [slug]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center" data-testid="insight-not-found">
        <p className="font-mono text-xs uppercase tracking-widest text-slate-500">404</p>
        <h1 className="font-display mt-4 text-3xl text-white">Insight not found.</h1>
        <Link to="/insights" className="mt-8 inline-block font-mono text-xs uppercase tracking-[0.2em] text-blue-400">
          ← Back to Insights
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32" data-testid="insight-loading">
        <p className="font-mono text-xs text-slate-500">Loading…</p>
      </div>
    );
  }

  return (
    <article data-testid="insight-detail">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-4xl px-6 pb-12 pt-24 lg:pt-32">
          <Link to="/insights" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-white">
            <ArrowLeft size={12} strokeWidth={1.5} /> All Insights
          </Link>
          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-blue-400">{post.category}</p>
          <h1 className="font-display mt-4 text-3xl font-medium leading-tight text-white md:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-xs text-slate-500">
            <span>{(post.published_at || "").slice(0, 10)}</span>
            <span>·</span>
            <span>{post.reading_time || 1} min read</span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span>·</span>
                <div className="flex flex-wrap items-center gap-2">
                  {post.tags.map((t) => (
                    <span key={t} className="border border-white/10 px-2 py-1 uppercase tracking-widest">
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="prose-iphysys whitespace-pre-wrap" data-testid="insight-content">
            {post.content}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
            <p className="text-mono-label">// Related</p>
            <div className="mt-8 grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/insights/${r.slug}`}
                  className="group bg-[#0a0a0c] p-8 hover:bg-[#101013]"
                  data-testid={`related-${r.slug}`}
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-blue-400">{r.category}</p>
                  <h3 className="mt-3 font-display text-lg font-medium text-white group-hover:text-blue-200">
                    {r.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm text-slate-400">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
