import { useEffect, useRef } from 'react';

export default function ParticleBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number | null = null;
    let particles: Particle[] = [];
    let isIntersecting = true;
    let isTabVisible = !document.hidden;

    const mouse = { x: null as number | null, y: null as number | null, radius: 120 };

    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * -0.7 - 0.1; // Upward drift
        this.opacity = Math.random() * 0.8 + 0.2;
        
        // Luxury golden color palette
        const goldShades = ['#ffd700', '#fef4db', '#d4af37', '#f59e0b', '#b58920'];
        this.color = goldShades[Math.floor(Math.random() * goldShades.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset if goes off screen
        if (this.y < 0) {
          this.y = canvas?.height || window.innerHeight;
          this.x = Math.random() * (canvas?.width || window.innerWidth);
        }
        if (this.x < 0 || this.x > (canvas?.width || window.innerWidth)) {
          this.speedX = -this.speedX;
        }

        // Mouse avoidance force
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.hypot(dx, dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x += (dx / distance) * force * 2.5;
            this.y += (dy / distance) * force * 2.5;
          }
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    // Initialize particles
    const initParticles = () => {
      particles = [];
      const isMobile = window.innerWidth < 768;
      const density = isMobile ? 35000 : 20000;
      const maxCount = isMobile ? 25 : 60;
      const particleCount = Math.min(maxCount, Math.floor((window.innerWidth * window.innerHeight) / density));
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const stopAnimation = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    const animateParticles = () => {
      if (!isIntersecting || !isTabVisible) {
        stopAnimation();
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      animationId = requestAnimationFrame(animateParticles);
    };

    const startAnimation = () => {
      if (!animationId && isIntersecting && isTabVisible) {
        animateParticles();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    // IntersectionObserver to pause animation when canvas is not visible in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);

    // Pause when tab is inactive
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        startAnimation();
      } else {
        stopAnimation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    initParticles();
    startAnimation();

    return () => {
      stopAnimation();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      id="particle-canvas"
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}
