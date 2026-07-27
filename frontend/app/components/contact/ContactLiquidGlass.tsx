"use client";

import { useEffect, useRef } from "react";

export default function ContactLiquidGlass() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);
    resize();

    let time = 0;
    const colors = ["#FFD60A", "#B1A606", "#7B8F06"];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < 3; i++) {
        const grad = ctx.createRadialGradient(
          width * (0.3 + Math.sin(time * 0.3 + i) * 0.1),
          height * (0.5 + Math.cos(time * 0.5 + i) * 0.1),
          50,
          width * (0.4 + Math.sin(time * 0.4 + i) * 0.1),
          height * (0.6 + Math.cos(time * 0.6 + i) * 0.1),
          width * 0.6
        );
        grad.addColorStop(0, colors[i % colors.length] + "15");
        grad.addColorStop(0.5, colors[(i + 1) % colors.length] + "08");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }
      time += 0.01;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 h-full w-full" style={{ opacity: 0.4 }} />;
}