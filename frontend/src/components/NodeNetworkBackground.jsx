import React, { useEffect, useRef } from "react";

// Dense futuristic node-edge topology with red, gold AND white sparks.
export default function NodeNetworkBackground({ className = "", density = 140 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Increase density dramatically and assign a tri-color palette per node.
    const count = Math.max(80, Math.min(density, Math.floor((width * height) / 7500)));
    const palette = ["red", "gold", "gold", "white", "red", "gold"]; // weighted gold-heavy
    const nodes = Array.from({ length: count }, () => {
      const kind = palette[Math.floor(Math.random() * palette.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.8 + 0.7,
        kind,
        // pulse offset for breathing glow
        phase: Math.random() * Math.PI * 2,
      };
    });

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

      // edges — warm orange threading, slightly denser
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
            // edge color: blend toward the brighter of the two endpoints
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

      // nodes — dense glow with breathing pulse + crisp core
      const tn = t * 0.001;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const pulse = 0.6 + 0.4 * Math.sin(tn * 1.3 + n.phase);

        // Soft large halo
        ctx.beginPath();
        ctx.fillStyle = colorFor(n.kind, 0.18 * pulse);
        ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
        ctx.fill();

        // Inner halo
        ctx.beginPath();
        ctx.fillStyle = colorFor(n.kind, 0.32);
        ctx.arc(n.x, n.y, n.r * 2.4, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
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
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
      data-testid="hero-node-network"
    />
  );
}
