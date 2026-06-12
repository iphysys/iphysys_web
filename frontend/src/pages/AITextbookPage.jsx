import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronRight, BookOpen, Search } from "lucide-react";
import { api } from "@/lib/api";

export default function AITextbookPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterKey, setChapterKey] = useState(searchParams.get("chapter") || "");
  const [sectionKey, setSectionKey] = useState(searchParams.get("section") || "");
  const [openChapters, setOpenChapters] = useState({});
  const [query, setQuery] = useState("");
  const [sectionData, setSectionData] = useState(null);
  const [sectionLoading, setSectionLoading] = useState(false);

  // Load TOC
  useEffect(() => {
    setLoading(true);
    api
      .get("/textbook")
      .then(({ data }) => {
        const list = data.chapters || [];
        setChapters(list);
        if (list.length > 0) {
          const initialChapter = chapterKey || list[0].key;
          setChapterKey(initialChapter);
          setOpenChapters((s) => ({ ...s, [initialChapter]: true }));
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load section content when a section is selected
  useEffect(() => {
    if (!chapterKey || !sectionKey) {
      setSectionData(null);
      return;
    }
    setSectionLoading(true);
    api
      .get(`/textbook/${chapterKey}/${sectionKey}`)
      .then(({ data }) => setSectionData(data))
      .catch(() => setSectionData(null))
      .finally(() => setSectionLoading(false));
  }, [chapterKey, sectionKey]);

  const chapter = useMemo(
    () => chapters.find((c) => c.key === chapterKey) || chapters[0],
    [chapters, chapterKey]
  );
  const section = sectionData?.section;

  const toggleChapter = (key) =>
    setOpenChapters((s) => ({ ...s, [key]: !s[key] }));

  const selectChapter = (key) => {
    setChapterKey(key);
    setSectionKey("");
    setOpenChapters((s) => ({ ...s, [key]: true }));
    setSearchParams({ chapter: key }, { replace: true });
  };

  const selectSection = (chKey, sKey) => {
    setChapterKey(chKey);
    setSectionKey(sKey);
    setOpenChapters((s) => ({ ...s, [chKey]: true }));
    setSearchParams({ chapter: chKey, section: sKey }, { replace: true });
  };

  const filteredToc = useMemo(() => {
    if (!query.trim()) return chapters;
    const q = query.trim().toLowerCase();
    return chapters
      .map((c) => {
        const chMatches = c.label.toLowerCase().includes(q);
        const sections = (c.sections || []).filter((s) =>
          s.label.toLowerCase().includes(q)
        );
        if (chMatches || sections.length > 0) {
          return { ...c, sections: chMatches ? c.sections : sections };
        }
        return null;
      })
      .filter(Boolean);
  }, [query, chapters]);

  return (
    <div data-testid="textbook-page">
      <section className="border-b border-[#3a2a20]">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-24 lg:px-12 lg:pt-32">
          <p className="text-mono-label">// AI Textbook</p>
          <h1 className="font-display mt-6 max-w-4xl text-4xl font-medium leading-tight md:text-5xl">
            A structured curriculum for intelligent physical systems.
          </h1>
          <p className="mt-6 max-w-2xl text-slate-400">
            A living textbook organized by chapter. Admins can author chapters, sections,
            and content through the admin dashboard.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* SIDEBAR */}
            <aside className="lg:col-span-3" data-testid="textbook-sidebar">
              <div className="border border-[#3a2a20] bg-[#120d0a]">
                <div className="border-b border-[#3a2a20] p-4">
                  <p className="text-mono-label">Table of Contents</p>
                  <div className="mt-3 flex items-center gap-2 border border-[#3a2a20] bg-[#0a0706] px-2 py-1.5">
                    <Search size={12} strokeWidth={1.5} className="text-[#d4af37]" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Filter chapters…"
                      className="w-full bg-transparent text-xs text-white placeholder:text-slate-600 focus:outline-none"
                      data-testid="textbook-toc-search"
                    />
                  </div>
                </div>
                <nav className="max-h-[70vh] overflow-y-auto p-2" data-testid="textbook-toc-nav">
                  {loading && (
                    <p className="px-3 py-4 text-xs text-slate-500">Loading…</p>
                  )}
                  {!loading && filteredToc.length === 0 && (
                    <p className="px-3 py-4 text-xs text-slate-500">No matching chapters.</p>
                  )}
                  {filteredToc.map((c, idx) => {
                    const isOpen = !!openChapters[c.key];
                    const isActive = chapterKey === c.key && !sectionKey;
                    return (
                      <div key={c.key} className="border-b border-[#231814] last:border-b-0">
                        <button
                          onClick={() => {
                            selectChapter(c.key);
                            toggleChapter(c.key);
                          }}
                          className={`flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors ${
                            isActive
                              ? "bg-[#1a120e] text-[#d4af37]"
                              : "text-slate-300 hover:bg-[#1a120e] hover:text-white"
                          }`}
                          data-testid={`chapter-${c.key}`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="font-mono text-[10px] text-slate-500">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <span className="font-mono text-[12px] uppercase tracking-[0.12em]">
                              {c.label}
                            </span>
                          </span>
                          {isOpen ? (
                            <ChevronDown size={12} strokeWidth={1.5} />
                          ) : (
                            <ChevronRight size={12} strokeWidth={1.5} />
                          )}
                        </button>
                        {isOpen && (
                          <div className="border-l border-[#3a2a20] bg-[#0f0a08] py-1 pl-3">
                            {(c.sections || []).map((s, sidx) => {
                              const active = chapterKey === c.key && sectionKey === s.key;
                              return (
                                <button
                                  key={s.key}
                                  onClick={() => selectSection(c.key, s.key)}
                                  className={`flex w-full items-center gap-3 px-3 py-1.5 text-left text-xs ${
                                    active ? "text-[#d4af37]" : "text-slate-400 hover:text-white"
                                  }`}
                                  data-testid={`section-${c.key}-${s.key}`}
                                >
                                  <span className="font-mono text-[10px] text-slate-600">
                                    {String(idx + 1).padStart(2, "0")}.{String(sidx + 1).padStart(2, "0")}
                                  </span>
                                  <span>{s.label}</span>
                                </button>
                              );
                            })}
                            {(!c.sections || c.sections.length === 0) && (
                              <p className="px-3 py-1.5 text-[11px] text-slate-600">No sections yet.</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* MAIN */}
            <div className="lg:col-span-9" data-testid="textbook-main">
              {!chapter ? (
                <div className="border border-[#3a2a20] bg-[#120d0a] p-12 text-center">
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">No chapters yet</p>
                  <p className="mt-3 text-sm text-slate-400">
                    Admin can author chapters via the admin dashboard.
                  </p>
                </div>
              ) : (
                <div className="border border-[#3a2a20] bg-[#120d0a] p-8 lg:p-12">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    <BookOpen size={12} strokeWidth={1.5} className="text-[#d4af37]" />
                    <span>Chapter</span>
                    <span className="text-slate-400">{chapter.label}</span>
                    {section && (
                      <>
                        <span>·</span>
                        <span>Section</span>
                        <span className="text-[#d4af37]">{section.label}</span>
                      </>
                    )}
                  </div>

                  <h2 className="font-display mt-6 text-3xl font-medium leading-tight text-white md:text-4xl">
                    {section ? section.label : chapter.label}
                  </h2>

                  {sectionLoading && (
                    <p className="mt-4 font-mono text-xs text-slate-500">Loading content…</p>
                  )}

                  {!sectionLoading && section && section.content && section.content.trim() ? (
                    <div className="prose-iphysys mt-8 whitespace-pre-wrap" data-testid="textbook-content">
                      {section.content}
                    </div>
                  ) : !sectionLoading && section ? (
                    <div className="mt-8 border border-dashed border-[#3a2a20] bg-[#0a0706] p-8 text-center" data-testid="textbook-placeholder">
                      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#d4af37]">
                        Content placeholder
                      </p>
                      <p className="mt-3 text-sm text-slate-400">
                        Study material has not been added for this section yet.
                      </p>
                    </div>
                  ) : (
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
                      Choose a section from the left to view material for this chapter.
                    </p>
                  )}

                  {/* Sections list inside the chapter, for navigation */}
                  {!section && (chapter.sections || []).length > 0 && (
                    <div className="mt-10">
                      <p className="text-mono-label">In this chapter</p>
                      <ul className="mt-4 grid gap-px border border-[#3a2a20] bg-[#3a2a20] sm:grid-cols-2">
                        {chapter.sections.map((s, i) => (
                          <li key={s.key}>
                            <button
                              onClick={() => selectSection(chapter.key, s.key)}
                              className="flex w-full items-center gap-3 bg-[#120d0a] px-4 py-3 text-left text-sm text-slate-300 hover:bg-[#1a120e] hover:text-white"
                              data-testid={`chapter-section-link-${s.key}`}
                            >
                              <span className="font-mono text-[10px] text-slate-600">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              {s.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
