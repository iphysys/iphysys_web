import React, { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, X, ChevronDown, ChevronRight, Save, FilePlus2 } from "lucide-react";
import { api, formatApiErrorDetail } from "@/lib/api";
import { toast } from "sonner";

export default function AdminTextbookTab() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openChapters, setOpenChapters] = useState({});
  const [chapterEditor, setChapterEditor] = useState(null); // null | {} | chapter
  const [sectionEditor, setSectionEditor] = useState(null); // null | {chapter_id, ...section}

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/textbook");
      setChapters(data.chapters || []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const toggle = (k) => setOpenChapters((s) => ({ ...s, [k]: !s[k] }));

  const saveChapter = async (form) => {
    try {
      if (chapterEditor.id) {
        await api.put(`/admin/textbook/chapters/${chapterEditor.id}`, form);
        toast.success("Chapter updated");
      } else {
        await api.post("/admin/textbook/chapters", form);
        toast.success("Chapter created");
      }
      setChapterEditor(null);
      load();
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Save failed");
    }
  };

  const deleteChapter = async (chapter) => {
    if (
      !window.confirm(
        `Delete chapter "${chapter.label}" and all of its sections? This cannot be undone.`
      )
    )
      return;
    try {
      await api.delete(`/admin/textbook/chapters/${chapter.id}`);
      toast.success("Chapter deleted");
      load();
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Delete failed");
    }
  };

  const saveSection = async (form) => {
    try {
      if (sectionEditor.id) {
        await api.put(`/admin/textbook/sections/${sectionEditor.id}`, form);
        toast.success("Section updated");
      } else {
        await api.post(
          `/admin/textbook/chapters/${sectionEditor.chapter_id}/sections`,
          form
        );
        toast.success("Section created");
      }
      setSectionEditor(null);
      load();
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Save failed");
    }
  };

  const deleteSection = async (sec) => {
    if (!window.confirm(`Delete section "${sec.label}"?`)) return;
    try {
      await api.delete(`/admin/textbook/sections/${sec.id}`);
      toast.success("Section deleted");
      load();
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Delete failed");
    }
  };

  return (
    <div data-testid="admin-textbook">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-white">Textbook</h2>
          <p className="mt-1 text-xs text-slate-500">
            Manage chapters, sections, and study-material content.
          </p>
        </div>
        <button
          onClick={() => setChapterEditor({})}
          className="flex items-center gap-2 border border-[#d4af37] bg-[#d4af37]/10 px-3 py-2 text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] hover:bg-[#d4af37]/20"
          data-testid="admin-new-chapter"
        >
          <Plus size={12} strokeWidth={1.5} /> New chapter
        </button>
      </div>

      {loading ? (
        <p className="font-mono text-xs text-slate-500" data-testid="textbook-loading">Loading…</p>
      ) : chapters.length === 0 ? (
        <p className="border border-[#3a2a20] bg-[#120d0a] p-6 text-sm text-slate-500" data-testid="textbook-empty">
          No chapters yet. Create the first one.
        </p>
      ) : (
        <div className="border border-[#3a2a20]" data-testid="chapters-list">
          {chapters.map((c, ci) => {
            const isOpen = !!openChapters[c.id];
            return (
              <div key={c.id} className="border-b border-[#231814] last:border-b-0">
                <div className="flex items-center justify-between gap-4 bg-[#120d0a] px-4 py-3">
                  <button
                    onClick={() => toggle(c.id)}
                    className="flex flex-1 items-center gap-3 text-left"
                    data-testid={`tb-chapter-toggle-${c.key}`}
                  >
                    {isOpen ? (
                      <ChevronDown size={14} strokeWidth={1.5} className="text-[#d4af37]" />
                    ) : (
                      <ChevronRight size={14} strokeWidth={1.5} className="text-slate-500" />
                    )}
                    <span className="font-mono text-[10px] text-slate-500">
                      {String(ci + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-base text-white">{c.label}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                      / {c.key}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                      · {(c.sections || []).length} sections
                    </span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSectionEditor({ chapter_id: c.id })}
                      className="flex items-center gap-1 border border-[#3a2a20] px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-widest text-slate-300 hover:border-[#d4af37]/50 hover:text-[#d4af37]"
                      data-testid={`tb-add-section-${c.key}`}
                    >
                      <FilePlus2 size={11} strokeWidth={1.5} /> Section
                    </button>
                    <button
                      onClick={() => setChapterEditor(c)}
                      className="border border-[#3a2a20] p-1.5 text-slate-300 hover:border-white/40 hover:text-white"
                      title="Edit chapter"
                      data-testid={`tb-edit-chapter-${c.key}`}
                    >
                      <Edit3 size={12} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => deleteChapter(c)}
                      className="border border-[#3a2a20] p-1.5 text-slate-300 hover:border-red-500/40 hover:text-red-400"
                      title="Delete chapter"
                      data-testid={`tb-delete-chapter-${c.key}`}
                    >
                      <Trash2 size={12} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-[#231814] bg-[#0f0a08]">
                    {(c.sections || []).length === 0 ? (
                      <p className="px-6 py-4 text-xs text-slate-500">No sections in this chapter.</p>
                    ) : (
                      <ul>
                        {c.sections.map((s, si) => (
                          <li
                            key={s.id}
                            className="flex items-center justify-between gap-4 border-t border-[#231814] px-6 py-2.5 first:border-t-0"
                            data-testid={`tb-section-row-${s.id}`}
                          >
                            <div className="flex flex-1 items-center gap-3">
                              <span className="font-mono text-[10px] text-slate-600">
                                {String(ci + 1).padStart(2, "0")}.{String(si + 1).padStart(2, "0")}
                              </span>
                              <span className="text-sm text-slate-200">{s.label}</span>
                              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                                / {s.key}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSectionEditor({ ...s })}
                                className="border border-[#3a2a20] p-1.5 text-slate-300 hover:border-white/40 hover:text-white"
                                title="Edit section"
                                data-testid={`tb-edit-section-${s.id}`}
                              >
                                <Edit3 size={12} strokeWidth={1.5} />
                              </button>
                              <button
                                onClick={() => deleteSection(s)}
                                className="border border-[#3a2a20] p-1.5 text-slate-300 hover:border-red-500/40 hover:text-red-400"
                                title="Delete section"
                                data-testid={`tb-delete-section-${s.id}`}
                              >
                                <Trash2 size={12} strokeWidth={1.5} />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {chapterEditor && (
        <ChapterEditor
          initial={chapterEditor}
          onClose={() => setChapterEditor(null)}
          onSave={saveChapter}
        />
      )}
      {sectionEditor && (
        <SectionEditor
          initial={sectionEditor}
          onClose={() => setSectionEditor(null)}
          onSave={saveSection}
        />
      )}
    </div>
  );
}

function ChapterEditor({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    label: initial.label || "",
    key: initial.key || "",
    order: initial.order ?? "",
  });
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      label: form.label,
      key: form.key || undefined,
      order: form.order === "" ? undefined : Number(form.order),
    };
    onSave(payload);
  };

  return (
    <Modal onClose={onClose} title={initial.id ? "Edit chapter" : "New chapter"} testid="chapter-editor">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Label" required value={form.label} onChange={update("label")} testid="chapter-label" />
        <Field
          label="Key (slug, optional)"
          value={form.key}
          onChange={update("key")}
          testid="chapter-key"
          placeholder="auto-generated from label"
        />
        <Field
          label="Order (optional)"
          type="number"
          value={form.order}
          onChange={update("order")}
          testid="chapter-order"
          placeholder="auto"
        />
        <Actions onClose={onClose} />
      </form>
    </Modal>
  );
}

function SectionEditor({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    label: initial.label || "",
    key: initial.key || "",
    order: initial.order ?? "",
    content: initial.content || "",
  });
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    onSave({
      label: form.label,
      key: form.key || undefined,
      order: form.order === "" ? undefined : Number(form.order),
      content: form.content,
    });
  };

  return (
    <Modal
      onClose={onClose}
      title={initial.id ? "Edit section" : "New section"}
      testid="section-editor"
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Label" required value={form.label} onChange={update("label")} testid="section-label" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Key (slug, optional)"
            value={form.key}
            onChange={update("key")}
            testid="section-key"
            placeholder="auto-generated"
          />
          <Field
            label="Order (optional)"
            type="number"
            value={form.order}
            onChange={update("order")}
            testid="section-order"
            placeholder="auto"
          />
        </div>
        <div>
          <label className="text-mono-label">Content (markdown / plain text)</label>
          <textarea
            value={form.content}
            onChange={update("content")}
            rows={14}
            className="mt-2 w-full border border-[#3a2a20] bg-transparent p-3 font-mono text-sm text-white focus:border-[#d4af37]/50 focus:outline-none"
            placeholder="Study material for this section…"
            data-testid="section-content"
          />
        </div>
        <Actions onClose={onClose} />
      </form>
    </Modal>
  );
}

function Modal({ children, onClose, title, testid }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-12 w-full max-w-3xl border border-[#3a2a20] bg-[#120d0a] p-8"
        data-testid={testid}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-xl text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            data-testid="editor-close"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, required, type = "text", value, onChange, testid, placeholder }) {
  return (
    <div>
      <label className="text-mono-label">
        {label}
        {required && " *"}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2 w-full border border-[#3a2a20] bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-[#d4af37]/50 focus:outline-none"
        data-testid={testid}
      />
    </div>
  );
}

function Actions({ onClose }) {
  return (
    <div className="mt-6 flex justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="border border-[#3a2a20] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-slate-300 hover:border-white/30"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="flex items-center gap-2 border border-[#d4af37] bg-[#d4af37]/10 px-5 py-2 text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] hover:bg-[#d4af37]/20"
        data-testid="editor-save"
      >
        <Save size={11} strokeWidth={1.5} /> Save
      </button>
    </div>
  );
}
