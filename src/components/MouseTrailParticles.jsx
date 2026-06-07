import { useEffect, useRef } from 'react';

export default function MouseTrailParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particles = [];
    let animationFrame = 0;
    let lastMove = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const addParticles = (event) => {
      const now = performance.now();
      if (now - lastMove < 34) return;
      lastMove = now;

      const count = window.innerWidth < 768 ? 1 : 2;
      for (let index = 0; index < count; index += 1) {
        particles.push({
          x: event.clientX + (Math.random() - 0.5) * 18,
          y: event.clientY + (Math.random() - 0.5) * 18,
          radius: 18 + Math.random() * 24,
          alpha: 0.11 + Math.random() * 0.04,
          vx: (Math.random() - 0.5) * 0.28,
          vy: -0.28 - Math.random() * 0.42,
          life: 1,
          decay: 0.014 + Math.random() * 0.01,
        });
      }

      if (particles.length > 70) {
        particles.splice(0, particles.length - 70);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const p = particles[index];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        p.radius += 0.12;

        if (p.life <= 0) {
          particles.splice(index, 1);
          continue;
        }

        const alpha = p.alpha * p.life;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `rgba(255, 195, 80, ${alpha})`);
        gradient.addColorStop(0.45, `rgba(255, 150, 40, ${alpha * 0.45})`);
        gradient.addColorStop(1, 'rgba(255, 150, 40, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', addParticles, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', addParticles);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="mouse-trail-canvas" aria-hidden="true" />;
}
