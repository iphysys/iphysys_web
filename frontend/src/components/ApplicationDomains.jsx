import React from "react";

// Curated cyber-physical systems imagery. Each entry is treated as a dark
// scene; we apply a red/gold tint via CSS overlay so it stays on-theme.
const DOMAINS = [
  {
    title: "Unmanned Aerial Systems",
    blurb:
      "Long-endurance UAVs, tactical drones, and aerial swarms requiring on-board autonomy.",
    image:
      "https://images.unsplash.com/photo-1639847648040-b1af1ce3cecf?w=1200&q=70&auto=format&fit=crop",
    tag: "UAV",
  },
  {
    title: "Industrial Robotics",
    blurb:
      "Distributed robotic cells coordinating perception, planning, and adaptation on the floor.",
    image:
      "https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=1200&q=70&auto=format&fit=crop",
    tag: "ROBOTICS",
  },
  {
    title: "Autonomous Platforms",
    blurb:
      "Ground vehicles, mobile manipulators, and field robots operating under uncertainty.",
    image:
      "https://images.unsplash.com/photo-1737644467636-6b0053476bb2?w=1200&q=70&auto=format&fit=crop",
    tag: "PLATFORMS",
  },
  {
    title: "Quadrotor Coordination",
    blurb:
      "Edge inference and inter-agent coordination for multi-rotor formations and inspection fleets.",
    image:
      "https://images.unsplash.com/photo-1514598800938-f7125ea1aa1c?w=1200&q=70&auto=format&fit=crop",
    tag: "QUADCOPTER",
  },
  {
    title: "Sensor & Compute Edge",
    blurb:
      "Heterogeneous sensors fused with low-latency compute close to the physics of the system.",
    image:
      "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=1200&q=70&auto=format&fit=crop",
    tag: "EDGE",
  },
  {
    title: "Mission Software",
    blurb:
      "Decision support for operators across critical infrastructure and mission-grade environments.",
    image:
      "https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=1200&q=70&auto=format&fit=crop",
    tag: "MISSION",
  },
];

export default function ApplicationDomains() {
  return (
    <section className="border-b border-white/10" data-testid="section-domains">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-mono-label">// Application Domains</p>
            <h2 className="font-display mt-4 text-3xl font-medium md:text-4xl">
              Where intelligent physical systems already live.
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-400">
            iphysys research is grounded in real cyber-physical systems —
            from aerial autonomy to industrial robotics to mission-grade
            edge software.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="domains-grid">
          {DOMAINS.map((d) => (
            <article
              key={d.title}
              className="group relative overflow-hidden border border-[#3a2a20] bg-[#120d0a]"
              data-testid={`domain-card-${d.tag.toLowerCase()}`}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={d.image}
                  alt={d.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover grayscale brightness-[0.75] contrast-110 transition-transform duration-[1200ms] group-hover:scale-105"
                />
                {/* Red/gold tint overlay */}
                <div
                  className="pointer-events-none absolute inset-0 mix-blend-screen"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(185, 28, 28, 0.55) 0%, rgba(212, 175, 55, 0.35) 60%, rgba(0,0,0,0) 100%)",
                  }}
                />
                {/* Vignette toward bottom for legibility */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0706]" />
                {/* Scanline overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, rgba(245,197,92,0.08) 0px, rgba(245,197,92,0.08) 1px, transparent 1px, transparent 3px)",
                  }}
                />
                <span className="absolute left-4 top-4 border border-[#d4af37]/40 bg-black/40 px-2 py-1 font-mono text-[10px] tracking-widest text-[#d4af37] backdrop-blur-sm">
                  {d.tag}
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-display text-lg font-medium text-white">{d.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{d.blurb}</p>
              </div>

              {/* corner accent */}
              <span className="absolute right-0 top-0 h-px w-12 bg-[#b91c1c]" />
              <span className="absolute right-0 top-0 h-12 w-px bg-[#b91c1c]" />
            </article>
          ))}
        </div>

        <p className="mt-10 max-w-2xl text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
          Images shown are illustrative of application domains, not deployed iphysys systems.
        </p>
      </div>
    </section>
  );
}
