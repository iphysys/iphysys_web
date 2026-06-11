import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api, formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { LogOut, FileText, Mail, Users, BarChart3, Plus, Trash2, Edit3, X } from "lucide-react";

const TABS = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "posts", label: "Posts", icon: FileText },
  { key: "newsletter", label: "Newsletter", icon: Users },
  { key: "contacts", label: "Contacts", icon: Mail },
];

const CATEGORIES = [
  "Physical AI",
  "Multi-Agent Systems",
  "Edge AI",
  "Distributed Optimization",
  "Engineering Intelligence",
  "Trustworthy AI",
  "Digital Engineering",
  "Mission Systems",
  "Defence Technology",
  "Systems Thinking",
];

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");

  if (loading) return <div className="p-12 font-mono text-xs text-slate-500" data-testid="admin-loading">Loading…</div>;
  if (!user || user.role !== "admin") return <Navigate to="/admin/login" replace />;

  const doLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#050505]" data-testid="admin-dashboard">
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">
          <div className="flex items-center gap-6">
            <p className="font-mono text-sm tracking-widest text-white">
              <span className="text-slate-500">[</span> iphysys <span className="text-slate-500">/</span> admin <span className="text-slate-500">]</span>
            </p>
            <p className="hidden font-mono text-xs uppercase tracking-widest text-slate-500 md:block">
              {user.email}
            </p>
          </div>
          <button
            onClick={doLogout}
            className="flex items-center gap-2 border border-white/15 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.2em] text-slate-300 hover:border-white/40 hover:text-white"
            data-testid="admin-logout"
          >
            <LogOut size={12} strokeWidth={1.5} /> Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
        <div className="flex flex-wrap gap-2" data-testid="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 border px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] ${
                tab === t.key ? "border-white text-white" : "border-white/15 text-slate-400 hover:border-white/30"
              }`}
              data-testid={`admin-tab-${t.key}`}
            >
              <t.icon size={12} strokeWidth={1.5} /> {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "overview" && <OverviewTab />}
          {tab === "posts" && <PostsTab />}
          {tab === "newsletter" && <NewsletterTab />}
          {tab === "contacts" && <ContactsTab />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.get("/admin/stats").then(({ data }) => setStats(data));
  }, []);
  if (!stats) return <p className="font-mono text-xs text-slate-500" data-testid="stats-loading">Loading…</p>;
  const items = [
    { label: "Posts (total)", value: stats.posts_total },
    { label: "Published", value: stats.posts_published },
    { label: "Newsletter subs", value: stats.newsletter },
    { label: "Contact requests", value: stats.contacts },
    { label: "Unread contacts", value: stats.contacts_unread },
  ];
  return (
    <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3 lg:grid-cols-5" data-testid="stats-grid">
      {items.map((i) => (
        <div key={i.label} className="bg-[#0a0a0c] p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500">{i.label}</p>
          <p className="font-display mt-4 text-4xl text-white">{i.value}</p>
        </div>
      ))}
    </div>
  );
}

function PostsTab() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null); // null or post
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/admin/posts");
    setPosts(data.items || []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const onSave = async (form) => {
    try {
      if (editing && editing.id) {
        await api.put(`/admin/posts/${editing.id}`, form);
        toast.success("Post updated");
      } else {
        await api.post("/admin/posts", form);
        toast.success("Post created");
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Save failed");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await api.delete(`/admin/posts/${id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div data-testid="admin-posts">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl text-white">Posts</h2>
        <button
          onClick={() => setEditing({})}
          className="flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-2 text-xs font-mono uppercase tracking-[0.2em] text-white hover:border-white/40 hover:bg-white/10"
          data-testid="admin-new-post"
        >
          <Plus size={12} strokeWidth={1.5} /> New Post
        </button>
      </div>

      {loading ? (
        <p className="font-mono text-xs text-slate-500">Loading…</p>
      ) : (
        <div className="border border-white/10">
          <div className="grid grid-cols-12 gap-4 border-b border-white/10 bg-[#0a0a0c] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
            <div className="col-span-5">Title</div>
            <div className="col-span-3">Category</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          {posts.length === 0 && <p className="p-6 text-sm text-slate-500">No posts.</p>}
          {posts.map((p) => (
            <div key={p.id} className="grid grid-cols-12 items-center gap-4 border-b border-white/5 px-4 py-3 text-sm" data-testid={`admin-post-row-${p.id}`}>
              <div className="col-span-5 truncate text-white">{p.title}</div>
              <div className="col-span-3 font-mono text-xs text-slate-400">{p.category}</div>
              <div className="col-span-2">
                <span
                  className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${
                    p.published ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <button onClick={() => setEditing(p)} className="border border-white/15 p-2 text-slate-300 hover:border-white/40 hover:text-white" data-testid={`admin-edit-${p.id}`}>
                  <Edit3 size={12} strokeWidth={1.5} />
                </button>
                <button onClick={() => onDelete(p.id)} className="border border-white/15 p-2 text-slate-300 hover:border-red-500/40 hover:text-red-400" data-testid={`admin-delete-${p.id}`}>
                  <Trash2 size={12} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing !== null && (
        <PostEditor initial={editing} onClose={() => setEditing(null)} onSave={onSave} />
      )}
    </div>
  );
}

function PostEditor({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    slug: initial.slug || "",
    excerpt: initial.excerpt || "",
    content: initial.content || "",
    category: initial.category || CATEGORIES[0],
    tags: (initial.tags || []).join(", "),
    featured: !!initial.featured,
    published: !!initial.published,
  });
  const update = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    onSave({ ...form, tags });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-6" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="my-12 w-full max-w-3xl border border-white/15 bg-[#0a0a0c] p-8"
        data-testid="admin-post-editor"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-xl text-white">{initial.id ? "Edit post" : "New post"}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white" data-testid="admin-editor-close">
            <X size={16} />
          </button>
        </div>
        <div className="grid gap-4">
          <Input label="Title" required value={form.title} onChange={update("title")} testid="post-title" />
          <Input label="Slug (optional)" value={form.slug} onChange={update("slug")} testid="post-slug" />
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-mono-label">Category</label>
              <select value={form.category} onChange={update("category")} className="mt-2 w-full border border-white/15 bg-transparent p-2 text-sm text-white" data-testid="post-category">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#0a0a0c]">{c}</option>
                ))}
              </select>
            </div>
            <Input label="Tags (comma separated)" value={form.tags} onChange={update("tags")} testid="post-tags" />
          </div>
          <Input label="Excerpt" value={form.excerpt} onChange={update("excerpt")} testid="post-excerpt" />
          <div>
            <label className="text-mono-label">Content</label>
            <textarea
              value={form.content}
              onChange={update("content")}
              rows={14}
              className="mt-2 w-full border border-white/15 bg-transparent p-3 font-mono text-sm text-white focus:border-white/30 focus:outline-none"
              data-testid="post-content"
            />
          </div>
          <div className="flex flex-wrap gap-6 text-xs font-mono uppercase tracking-widest text-slate-300">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={update("featured")} data-testid="post-featured" /> Featured
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.published} onChange={update("published")} data-testid="post-published" /> Published
            </label>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="border border-white/15 px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-slate-300 hover:border-white/30">
            Cancel
          </button>
          <button type="submit" className="border border-white/20 bg-white/10 px-5 py-2 text-xs font-mono uppercase tracking-[0.2em] text-white hover:bg-white/20" data-testid="admin-post-save">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, required, value, onChange, testid }) {
  return (
    <div>
      <label className="text-mono-label">{label}{required && " *"}</label>
      <input
        required={required}
        value={value}
        onChange={onChange}
        className="mt-2 w-full border border-white/15 bg-transparent px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
        data-testid={testid}
      />
    </div>
  );
}

function NewsletterTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/admin/newsletter");
    setItems(data.items || []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Remove subscriber?")) return;
    await api.delete(`/admin/newsletter/${id}`);
    toast.success("Removed");
    load();
  };

  return (
    <div data-testid="admin-newsletter">
      <h2 className="mb-6 font-display text-xl text-white">Newsletter subscribers</h2>
      {loading ? (
        <p className="font-mono text-xs text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="font-mono text-xs text-slate-500">No subscribers yet.</p>
      ) : (
        <div className="border border-white/10">
          {items.map((s) => (
            <div key={s.id} className="flex items-center justify-between border-b border-white/5 px-4 py-3 text-sm" data-testid={`subscriber-${s.id}`}>
              <div>
                <p className="text-white">{s.email}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{(s.created_at || "").slice(0, 10)}</p>
              </div>
              <button onClick={() => remove(s.id)} className="border border-white/15 p-2 text-slate-400 hover:border-red-500/40 hover:text-red-400">
                <Trash2 size={12} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/admin/contacts");
    setItems(data.items || []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const toggleRead = async (id) => {
    await api.put(`/admin/contacts/${id}/read`);
    load();
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    await api.delete(`/admin/contacts/${id}`);
    load();
  };

  return (
    <div data-testid="admin-contacts">
      <h2 className="mb-6 font-display text-xl text-white">Contact requests</h2>
      {loading ? (
        <p className="font-mono text-xs text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="font-mono text-xs text-slate-500">No messages.</p>
      ) : (
        <div className="space-y-4">
          {items.map((c) => (
            <div key={c.id} className={`border border-white/10 bg-[#0a0a0c] p-6 ${c.read ? "opacity-70" : ""}`} data-testid={`contact-${c.id}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base text-white">{c.name} <span className="text-slate-500">·</span> <span className="font-mono text-xs text-slate-400">{c.email}</span></p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    {c.interest_type} · {(c.created_at || "").slice(0, 16).replace("T", " ")} · {c.organization || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleRead(c.id)} className="border border-white/15 px-3 py-1.5 text-xs font-mono uppercase tracking-widest text-slate-300 hover:border-white/40">
                    {c.read ? "Read" : "Mark read"}
                  </button>
                  <button onClick={() => remove(c.id)} className="border border-white/15 p-2 text-slate-300 hover:border-red-500/40 hover:text-red-400">
                    <Trash2 size={12} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm text-slate-300">{c.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
