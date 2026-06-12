import React from "react";

const LAYERS = [
  { code: "L01", title: "Physical Assets", desc: "Robots, machines, infrastructure, sensors in the real world." },
  { code: "L02", title: "Sensing", desc: "Heterogeneous signals captured continuously from the environment." },
  { code: "L03", title: "Perception", desc: "Turning raw signals into structured understanding of state." },
  { code: "L04", title: "Reasoning", desc: "Models that anticipate, plan, and evaluate alternatives." },
  { code: "L05", title: "Coordination", desc: "Distributed decision making across agents and subsystems." },
  { code: "L06", title: "Decision Support", desc: "Surfacing options, risks, and confidence to operators." },
  { code: "L07", title: "Human Oversight", desc: "Operators stay in the loop, with intent and accountability." },
];

export default function VisionPage() {
  return (
    <div data-testid="vision-page">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-12 lg:pt-32">
          <p className="text-mono-label">// Vision</p>
          <h1 className="font-display mt-6 max-w-4xl text-4xl font-medium leading-tight md:text-5xl lg:text-6xl">
            The next generation of physical systems will be defined by intelligence.
          </h1>
          <p className="mt-8 max-w-3xl text-slate-400">
            iphysys exists to develop the software intelligence that lets autonomous,
            distributed, and mission-aware systems be safe, useful, and trustworthy in the
            real world.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-12 lg:px-12 lg:py-32">
          <div className="md:col-span-4">
            <p className="text-mono-label">01 / Why Now</p>
            <h2 className="font-display mt-4 text-3xl font-medium leading-tight md:text-4xl">
              Why physical systems need intelligence.
            </h2>
          </div>
          <div className="space-y-6 text-slate-400 md:col-span-7 md:col-start-6">
            <p>
              Sensors are now ubiquitous. Compute can be placed almost anywhere. Networked
              physical systems are increasingly distributed, asynchronous, and operating
              under uncertainty that traditional control stacks were not designed for.
            </p>
            <p>
              At the same time, AI systems trained primarily for digital tasks rarely carry
              the safety properties needed when their decisions affect physical reality.
            </p>
            <p>
              The result is a gap: a generation of physical systems that need a different
              kind of intelligence — one that is distributed, edge-native, mission-aware,
              and engineered for trust.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <p className="text-mono-label">02 / Our Thesis</p>
          <blockquote className="mt-6 max-w-4xl border-l-2 border-[#b91c1c] pl-6 text-2xl leading-snug text-white md:text-3xl">
            The next generation of physical systems will not be defined solely by hardware
            excellence, but by the intelligence that enables them to perceive, reason,
            coordinate, and adapt.
          </blockquote>
        </div>
      </section>

      <section className="border-b border-white/10" data-testid="vision-layers">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <p className="text-mono-label">03 / Layers of Intelligence</p>
          <h2 className="font-display mt-4 max-w-3xl text-3xl font-medium md:text-4xl">
            A layered view of how intelligence stacks against the physical world.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="border border-white/10">
                {LAYERS.map((l, i) => (
                  <div
                    key={l.code}
                    className={`relative flex items-start gap-6 p-6 ${
                      i === 0 ? "" : "border-t border-white/10"
                    }`}
                    data-testid={`layer-${l.code}`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-xs text-slate-500">{l.code}</span>
                      {i !== LAYERS.length - 1 && (
                        <span className="mt-2 h-10 w-px bg-white/15" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-medium text-white">{l.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{l.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="sticky top-24 border border-white/10 bg-[#120d0a] p-6">
                <p className="text-mono-label">Reading the stack</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  Each layer is engineered as a first-class concern — not an afterthought.
                  Sensing without perception is noise. Perception without reasoning is
                  brittle. Reasoning without coordination doesn't scale. And no layer is
                  trustworthy without human oversight.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  iphysys' research focuses on the upper layers — perception, reasoning,
                  coordination, and decision support — where the hardest open problems in
                  intelligent physical systems live today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <p className="text-mono-label">04 / Long-Term Vision</p>
          <h2 className="font-display mt-4 max-w-3xl text-3xl font-medium md:text-4xl">
            Where this work could lead.
          </h2>
          <div className="mt-12 grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Industrial Autonomy", desc: "Self-coordinating production lines, energy systems, logistics." },
              { title: "Robotics", desc: "Fleets of mobile and manipulating robots operating with shared context." },
              { title: "Critical Infrastructure", desc: "Resilient sensing and decision support for civil systems." },
              { title: "Mission-Critical Environments", desc: "Defence among many domains where engineering rigor is non-negotiable." },
            ].map((b) => (
              <div key={b.title} className="bg-[#120d0a] p-8">
                <h3 className="font-display text-lg font-medium text-white">{b.title}</h3>
                <p className="mt-3 text-sm text-slate-400">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
