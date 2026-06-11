import React from "react";
import { User } from "lucide-react";

export default function AboutPage() {
  return (
    <div data-testid="about-page">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-12 lg:pt-32">
          <p className="text-mono-label">// About</p>
          <h1 className="font-display mt-6 max-w-4xl text-4xl font-medium leading-tight md:text-5xl lg:text-6xl">
            An engineering company for the next era of physical systems.
          </h1>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="text-mono-label">01 / Mission</p>
            </div>
            <div className="space-y-6 text-slate-300 md:col-span-7 md:col-start-6">
              <p className="text-xl leading-snug text-white md:text-2xl">
                Build the software intelligence stack that enables autonomous, distributed,
                and mission-aware physical systems to operate with rigor and trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-12 lg:px-12">
          <div className="md:col-span-4">
            <p className="text-mono-label">02 / Our Approach</p>
            <h2 className="font-display mt-4 text-2xl text-white">Research-led, engineering-anchored.</h2>
          </div>
          <div className="space-y-5 text-slate-400 md:col-span-7 md:col-start-6">
            <p>
              We treat intelligence for physical systems as a long-horizon engineering
              problem. Most of our work today is research, prototyping, and the building of
              internal tooling — not deployed products.
            </p>
            <p>
              We move deliberately. We pick problems where intelligence meaningfully changes
              what a physical system can do, and where engineering rigor matters more than
              novelty.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
          <p className="text-mono-label">03 / Engineering Principles</p>
          <div className="mt-10 grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Specifications first", "Behavior is engineered, not emergent by accident."],
              ["Edge by default", "Designed for systems that cannot depend on the cloud."],
              ["Distributed thinking", "Coordination is a primitive, not an add-on."],
              ["Trust is a feature", "Calibration, uncertainty, and explainability ship with the system."],
              ["Operator-aware", "Humans remain in the loop with intent and override."],
              ["Engineering rigor", "Verification, observability, and operational reality from day one."],
            ].map(([t, d]) => (
              <div key={t} className="bg-[#0a0a0c] p-8">
                <h3 className="font-display text-lg font-medium text-white">{t}</h3>
                <p className="mt-3 text-sm text-slate-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
          <p className="text-mono-label">04 / Fields of Interest</p>
          <div className="mt-10 grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Multi-Agent Systems",
              "Edge AI",
              "Distributed Optimization",
              "Engineering Intelligence",
              "Human-Machine Teaming",
              "Trustworthy Autonomy",
              "Digital Engineering",
              "Mission Systems",
            ].map((f) => (
              <div key={f} className="bg-[#0a0a0c] p-6">
                <p className="font-mono text-xs text-slate-500">[ field ]</p>
                <p className="mt-2 font-display text-base text-white">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-12 lg:px-12">
          <div className="md:col-span-4">
            <p className="text-mono-label">05 / Founder Note</p>
            <div className="mt-6 flex h-40 w-40 items-center justify-center border border-white/10 bg-[#0a0a0c]" data-testid="founder-photo-placeholder">
              <User size={28} strokeWidth={1.5} className="text-slate-600" />
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <blockquote className="border-l-2 border-blue-500 pl-6 text-xl leading-relaxed text-slate-200">
              We are early in our journey. Our work today focuses on exploration, research,
              and prototype development. We believe thoughtful engineering and technical
              rigor are essential for building trustworthy intelligent systems.
            </blockquote>
            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-slate-500">
              — iphysys, founding team
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-12 lg:px-12">
          <div className="md:col-span-4">
            <p className="text-mono-label">06 / Future Directions</p>
            <h2 className="font-display mt-4 text-2xl text-white">What comes next.</h2>
          </div>
          <div className="space-y-5 text-slate-400 md:col-span-7 md:col-start-6">
            <p>
              Over time, we expect iphysys to evolve from research and prototypes into
              practical tooling and infrastructure for the engineering of intelligent
              physical systems — across industrial, robotics, and mission-critical domains.
            </p>
            <p>
              We expect the team to grow alongside the work. We are not in a hurry to add
              headcount until the engineering case for it is clear.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
