import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Network, Sparkles, ShieldCheck, Workflow, Gauge, Eye, Brain, Compass, Wrench } from "lucide-react";
import NodeNetworkBackground from "@/components/NodeNetworkBackground";
import ApplicationDomains from "@/components/ApplicationDomains";
import { api } from "@/lib/api";

const CAPABILITIES = [
  { id: 1, title: "Multi-Agent Intelligence", desc: "Coordination and reasoning across distributed autonomous agents.", icon: Network },
  { id: 2, title: "Edge AI", desc: "Deploying intelligence where the mission happens.", icon: Cpu },
  { id: 3, title: "Distributed Optimization", desc: "Planning and optimization under real-world constraints.", icon: Workflow },
  { id: 4, title: "Human-Machine Teaming", desc: "Decision support systems that augment operators.", icon: Eye },
  { id: 5, title: "Engineering Intelligence", desc: "Transforming intent into trustworthy engineering artifacts.", icon: Wrench },
  { id: 6, title: "Trustworthy Autonomy", desc: "Confidence, risk awareness, and explainability for mission-critical systems.", icon: ShieldCheck },
];

const PRINCIPLES = [
  { n: "01", title: "Human-Centered Autonomy", desc: "Autonomy that augments — not replaces — human judgment." },
  { n: "02", title: "Intelligence at the Edge", desc: "Decisions belong where the physics lives, not in the cloud alone." },
  { n: "03", title: "Distributed by Design", desc: "Systems composed of cooperating agents, not monolithic stacks." },
  { n: "04", title: "Explainability Matters", desc: "Behavior that can be inspected, audited, and trusted." },
  { n: "05", title: "Mission Awareness", desc: "Software that understands intent, constraints, and consequence." },
  { n: "06", title: "Engineering Rigor", desc: "Specification, verification, and operational reality, end to end." },
];

const ROADMAP = [
  {
    phase: "Phase 01",
    title: "Today",
    items: ["Research", "Knowledge development", "Algorithm exploration", "Prototype demonstrations"],
  },
  {
    phase: "Phase 02",
    title: "Emerging Capabilities",
    items: ["Simulation environments", "Edge deployments", "Distributed coordination demonstrations"],
  },
  {
    phase: "Phase 03",
    title: "Future Systems",
    items: ["Trusted autonomy", "Mission systems", "Large-scale intelligent physical systems"],
  },
];

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts", { params: { limit: 3 } })
      .then(({ data }) => setPosts(data.items || []))
      .catch(() => setPosts([]));
  }, []);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-lines opacity-50" />
        <NodeNetworkBackground />
        <div className="relative mx-auto max-w-7xl px-6 pb-32 pt-28 lg:px-12 lg:pt-40">
          <div className="max-w-3xl">
            <p className="text-mono-label" data-testid="hero-overline">
              <span className="mr-3 inline-block h-1.5 w-1.5 bg-[#b91c1c]" /> iphysys // intelligence layer
            </p>
            <h1 className="font-display mt-6 text-5xl font-medium leading-[1.02] tracking-tight md:text-6xl lg:text-7xl" data-testid="hero-headline">
              Intelligence for<br />Physical Systems.
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg" data-testid="hero-subheadline">
              Building the intelligence stack for autonomous, distributed, and mission-aware systems.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3" data-testid="hero-ctas">
              <Link
                to="/vision"
                className="group inline-flex items-center gap-2 border border-white/20 bg-white/5 px-5 py-3 text-sm font-mono uppercase tracking-[0.2em] text-white hover:border-white/40 hover:bg-white/10"
                data-testid="hero-cta-vision"
              >
                Explore Vision
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
              </Link>
              <Link
                to="/insights"
                className="inline-flex items-center gap-2 border border-[#d4af37]/40 px-5 py-3 text-sm font-mono uppercase tracking-[0.2em] text-[#d4af37] hover:border-[#d4af37] hover:text-[#f4c95d]"
                data-testid="hero-cta-insights"
              >
                Read Insights
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-white/10 px-5 py-3 text-sm font-mono uppercase tracking-[0.2em] text-slate-300 hover:border-white/30 hover:text-white"
                data-testid="hero-cta-contact"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* THE SHIFT */}
      <section className="border-b border-white/10" data-testid="section-the-shift">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="text-mono-label">01 / The Shift</p>
              <h2 className="font-display mt-4 text-3xl font-medium leading-tight md:text-4xl">
                Physical systems are becoming intelligent.
              </h2>
            </div>
            <div className="space-y-6 text-slate-400 md:col-span-7 md:col-start-6">
              <p>
                A new generation of robots, sensors, and infrastructure is shifting from
                procedural control to autonomous behavior. Decisions that once belonged to
                operators are increasingly made by machines, at the edge, under uncertainty.
              </p>
              <p>
                This shift requires a different software stack — one that treats autonomy,
                distributed decision making, edge intelligence, and trustworthy AI as
                first-class engineering problems rather than features bolted on top.
              </p>
              <p>
                iphysys is being built for that shift.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="border-b border-white/10" data-testid="section-capabilities">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-mono-label">02 / Capability Areas</p>
              <h2 className="font-display mt-4 text-3xl font-medium md:text-4xl">Where iphysys works.</h2>
            </div>
            <p className="max-w-md text-sm text-slate-400">
              Early focus areas spanning research, prototyping, and the engineering primitives
              for intelligent physical systems.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map(({ id, title, desc, icon: Icon }) => (
              <div
                key={id}
                className="group relative bg-[#120d0a] p-8 transition-colors hover:bg-[#1a120e]"
                data-testid={`capability-card-${id}`}
              >
                <div className="absolute right-4 top-4">
                  <span className="border border-amber-500/30 bg-amber-500/10 px-2 py-1 font-mono text-[10px] tracking-widest text-amber-400">
                    RESEARCH & PROTOTYPING
                  </span>
                </div>
                <Icon size={20} strokeWidth={1.5} className="text-[#d4af37]" />
                <p className="mt-6 font-mono text-xs text-slate-500">CAP-{String(id).padStart(2, "0")}</p>
                <h3 className="mt-2 font-display text-xl font-medium text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION DOMAINS */}
      <ApplicationDomains />

      {/* PRINCIPLES */}
      <section className="border-b border-white/10" data-testid="section-principles">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <p className="text-mono-label">03 / Technology Principles</p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl font-medium md:text-4xl">
            How we think about building intelligent physical systems.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.n} className="bg-[#120d0a] p-8" data-testid={`principle-${p.n}`}>
                <p className="font-mono text-xs text-slate-500">{p.n}</p>
                <h3 className="mt-3 font-display text-lg font-medium text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="border-b border-white/10" data-testid="section-roadmap">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <p className="text-mono-label">04 / Vision Roadmap</p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl font-medium md:text-4xl">
            From research and prototypes toward trusted, mission-grade systems.
          </h2>

          <div className="mt-12 grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
            {ROADMAP.map((phase, idx) => (
              <div key={phase.phase} className="relative bg-[#120d0a] p-8" data-testid={`roadmap-phase-${idx + 1}`}>
                <span className="absolute left-0 top-0 h-1 w-12 bg-[#b91c1c]" />
                <p className="font-mono text-xs text-slate-500">{phase.phase}</p>
                <h3 className="mt-2 font-display text-xl font-medium text-white">{phase.title}</h3>
                <ul className="mt-6 space-y-2 text-sm text-slate-400">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-px w-3 bg-slate-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST INSIGHTS */}
      <section className="border-b border-white/10" data-testid="section-insights">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-mono-label">05 / Latest Insights</p>
              <h2 className="font-display mt-4 text-3xl font-medium md:text-4xl">Notes from the lab.</h2>
            </div>
            <Link to="/insights" className="font-mono text-xs uppercase tracking-[0.2em] text-slate-300 hover:text-white" data-testid="view-all-insights">
              View all insights →
            </Link>
          </div>

          <div className="mt-12 grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
            {posts.length === 0 && (
              <div className="bg-[#120d0a] p-8 text-sm text-slate-500" data-testid="insights-empty">Archive loading…</div>
            )}
            {posts.map((post) => (
              <Link
                to={`/insights/${post.slug}`}
                key={post.slug}
                className="group bg-[#120d0a] p-8 hover:bg-[#1a120e]"
                data-testid={`home-insight-${post.slug}`}
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#d4af37]">{post.category}</p>
                <h3 className="mt-4 font-display text-lg font-medium text-white group-hover:text-[#f4c95d]">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">{post.excerpt}</p>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  {post.reading_time || 1} min read
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="border-b border-white/10" data-testid="section-cta">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="text-mono-label">06 / Conversation</p>
              <h2 className="font-display mt-4 text-3xl font-medium leading-tight md:text-4xl">
                Building toward the future of autonomous systems.
              </h2>
              <p className="mt-6 max-w-2xl text-slate-400">
                We talk to researchers, operators, and engineering teams thinking about the
                same problems. If your work touches autonomy, edge intelligence, or
                mission-grade software — we'd like to hear from you.
              </p>
            </div>
            <div className="flex items-center md:col-span-5 md:justify-end">
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 border border-[#b91c1c] bg-[#b91c1c]/15 px-6 py-4 text-sm font-mono uppercase tracking-[0.2em] text-[#fde2c8] hover:border-[#dc2626] hover:bg-[#b91c1c]/25 glow-red"
                data-testid="cta-start-conversation"
              >
                Start a Conversation
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
