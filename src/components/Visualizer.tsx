import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  isActive: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', resize);
    resize();

    let time = 0;
    const draw = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, width, height);

      if (isActive) {
        time += 0.05;
        const bars = 40;
        const barWidth = width / bars;
        
        ctx.fillStyle = '#10b981'; // emerald-500
        
        for (let i = 0; i < bars; i++) {
          const x = i * barWidth;
          const amplitude = Math.sin(time + i * 0.2) * 20 + 30;
          const noise = Math.random() * 10;
          const h = amplitude + noise;
          
          ctx.beginPath();
          ctx.roundRect(x + barWidth * 0.2, (height - h) / 2, barWidth * 0.6, h, 4);
          ctx.fill();
        }
      } else {
        // Idle state: a single subtle line
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive]);

  return (
    <div className="w-full h-32 bg-black/5 rounded-2xl overflow-hidden border border-emerald-500/10">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
