import React, { useEffect, useRef } from 'react';

export default function RainCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initRain();
    };

    window.addEventListener('resize', handleResize);

    const dropCount = Math.min(Math.floor((width * height) / 10000), 120);
    const drops = [];

    function createDrop() {
      return {
        x: Math.random() * (width + 100) - 50,
        y: Math.random() * -height,
        length: Math.random() * 20 + 12,
        speed: Math.random() * 12 + 10,
        opacity: Math.random() * 0.25 + 0.1,
        thickness: Math.random() * 1.2 + 0.8,
        slant: -1,
      };
    }

    function initRain() {
      drops.length = 0;
      for (let i = 0; i < dropCount; i++) {
        drops.push({
          x: Math.random() * (width + 100) - 50,
          y: Math.random() * height,
          length: Math.random() * 20 + 12,
          speed: Math.random() * 12 + 10,
          opacity: Math.random() * 0.25 + 0.1,
          thickness: Math.random() * 1.2 + 0.8,
          slant: -1,
        });
      }
    }

    initRain();

    function render() {
      ctx.clearRect(0, 0, width, height);

      ctx.lineCap = 'round';
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        ctx.beginPath();
        ctx.strokeStyle = `rgba(200, 225, 255, ${d.opacity})`;
        ctx.lineWidth = d.thickness;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.slant, d.y + d.length);
        ctx.stroke();

        d.x += d.slant;
        d.y += d.speed;

        if (d.y > height) {
          drops[i] = createDrop();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="rain-canvas" />;
}
