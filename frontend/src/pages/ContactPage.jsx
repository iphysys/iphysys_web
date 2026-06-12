import React, { useState } from "react";
import { api, formatApiErrorDetail } from "@/lib/api";
import { toast } from "sonner";

const INTERESTS = [
  "Research Collaboration",
  "Industry Partnership",
  "Speaking Opportunity",
  "General Inquiry",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    message: "",
    interest_type: "General Inquiry",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/contact", form);
      setSent(true);
      toast.success("Message received", { description: "We'll be in touch." });
      setForm({ name: "", organization: "", email: "", message: "", interest_type: "General Inquiry" });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Failed to send");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="contact-page">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-24 lg:px-12 lg:pt-32">
          <p className="text-mono-label">// Contact</p>
          <h1 className="font-display mt-6 max-w-3xl text-4xl font-medium leading-tight md:text-5xl">
            Start a conversation.
          </h1>
          <p className="mt-6 max-w-2xl text-slate-400">
            For research collaboration, partnerships, or speaking opportunities — we read every message.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-12 lg:px-12">
          <aside className="space-y-6 md:col-span-4">
            <div>
              <p className="text-mono-label">Direct</p>
              <a
                href="mailto:hello@iphysys.com"
                className="mt-2 block font-display text-xl text-white hover:text-[#f4c95d]"
                data-testid="direct-email"
              >
                hello@iphysys.com
              </a>
            </div>
            <div>
              <p className="text-mono-label">Response time</p>
              <p className="mt-2 text-sm text-slate-400">Within a few business days.</p>
            </div>
            <div>
              <p className="text-mono-label">Privacy</p>
              <p className="mt-2 text-sm text-slate-400">
                Submissions are stored in our internal system. We do not share contact data
                with third parties.
              </p>
            </div>
          </aside>

          <form onSubmit={submit} className="md:col-span-8" data-testid="contact-form">
            <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2">
              <Field label="Name" required value={form.name} onChange={onChange("name")} testid="contact-name" />
              <Field label="Organization" value={form.organization} onChange={onChange("organization")} testid="contact-org" />
              <Field label="Email" required type="email" value={form.email} onChange={onChange("email")} testid="contact-email" />
              <div className="bg-[#120d0a] p-6">
                <label className="text-mono-label">Interest Type</label>
                <select
                  value={form.interest_type}
                  onChange={onChange("interest_type")}
                  className="mt-3 w-full border border-white/10 bg-transparent py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                  data-testid="contact-interest"
                >
                  {INTERESTS.map((i) => (
                    <option key={i} value={i} className="bg-[#120d0a]">{i}</option>
                  ))}
                </select>
              </div>
              <div className="bg-[#120d0a] p-6 md:col-span-2">
                <label className="text-mono-label">Message</label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={onChange("message")}
                  className="mt-3 w-full border border-white/10 bg-transparent p-3 text-sm text-white placeholder:text-slate-600 focus:border-white/30 focus:outline-none"
                  placeholder="Tell us what you're working on…"
                  data-testid="contact-message"
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-slate-500" data-testid="contact-status">
                {sent ? "Message received." : ""}
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-6 py-3 text-xs font-mono uppercase tracking-[0.2em] text-white hover:border-white/40 hover:bg-white/10 disabled:opacity-50"
                data-testid="contact-submit"
              >
                {submitting ? "Sending…" : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function Field({ label, required, type = "text", value, onChange, testid }) {
  return (
    <div className="bg-[#120d0a] p-6">
      <label className="text-mono-label">{label}{required && " *"}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="mt-3 w-full border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-white/30 focus:outline-none"
        data-testid={testid}
      />
    </div>
  );
}
