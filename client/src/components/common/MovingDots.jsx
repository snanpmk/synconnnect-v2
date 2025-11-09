import React, { useEffect, useRef } from "react";

const MovingDots = ({ dotCount = 65 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;

    const dots = Array.from(parent.children);

    const ANGLE = Math.PI + 0.12; // Left + slightly down
    const SPEED = 0.08;

    const dotParams = dots.map(() => ({
      x: Math.random(),
      y: Math.random(),
      speed: SPEED * (0.75 + Math.random() * 0.5),
      phase: Math.random() * 100,
    }));

    let rafId;

    function animate() {
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;

      dots.forEach((dot, i) => {
        const p = dotParams[i];
        p.x += Math.cos(ANGLE) * p.speed * 0.003;
        p.y += Math.sin(ANGLE) * p.speed * 0.003;

        if (p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) {
          p.x = 1 + 0.01 * Math.random();
          p.y = Math.random();
        }

        dot.style.transform = `translate(${p.x * w}px,${p.y * h}px)`;
        dot.style.opacity = "0.75";
      });

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      {Array.from({ length: dotCount }).map((_, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            width: "1px",
            height: "1px",
            background: "#fff",
            opacity: 0.75,
            borderRadius: "50%",
            left: 0,
            top: 0,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
};

export default MovingDots;
