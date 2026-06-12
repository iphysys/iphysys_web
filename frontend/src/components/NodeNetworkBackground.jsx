import React, { useEffect, useRef } from "react";

// Futuristic node-edge topology with a fixed color budget:
// 50 gold, 20 red, 20 white = 90 total nodes by default.
export default function NodeNetworkBackground({
  className = "",
  gold = 50,
  red = 20,
  white = 20,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Mobile gets half the glow budget (rounded).
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const goldCount = isMobile ? Math.round(gold / 2) : gold;
    const redCount = isMobile ? Math.round(red / 2) : red;
    const whiteCount = isMobile ? Math.round(white / 2) : white;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Build the node set with an exact color budget.
    const makeNode = (kind) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.8 + 0.7,
      kind,
      phase: Math.random() * Math.PI * 2,
    });

    const nodes = [
      ...Array.from({ length: goldCount }, () => makeNode("gold")),
      ...Array.from({ length: redCount }, () => makeNode("red")),
      ...Array.from({ length: whiteCount }, () => makeNode("white")),
    ];

    const colorFor = (kind, alpha) => {
      switch (kind) {
        case "red":
          return `rgba(220, 38, 38, ${alpha})`;
        case "gold":
          return `rgba(245, 197, 92, ${alpha})`;
        case "white":
        default:
          return `rgba(255, 245, 225, ${alpha})`;
      }
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height);

      // edges — warm orange threading
      const max = 160;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < max) {
            const op = (1 - dist / max) * 0.32;
            let edgeColor = `rgba(234, 121, 35, ${op})`;
            if (a.kind === "white" || b.kind === "white") {
              edgeColor = `rgba(255, 240, 210, ${op * 0.9})`;
            } else if (a.kind === "red" && b.kind === "red") {
              edgeColor = `rgba(220, 38, 38, ${op * 0.95})`;
            }
            ctx.strokeStyle = edgeColor;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes — halo + crisp core, breathing pulse
      const tn = t * 0.001;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const pulse = 0.6 + 0.4 * Math.sin(tn * 1.3 + n.phase);

        ctx.beginPath();
        ctx.fillStyle = colorFor(n.kind, 0.18 * pulse);
        ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = colorFor(n.kind, 0.32);
        ctx.arc(n.x, n.y, n.r * 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = colorFor(n.kind, 0.95);
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [gold, red, white]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
      data-testid="hero-node-network"
    />
  );
}
