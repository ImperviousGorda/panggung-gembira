import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Smooth lerp coordinates
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Disable on touch devices or if reduced motion is preferred
    const touchMedia = window.matchMedia('(pointer: coarse)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (touchMedia.matches || motionMedia.matches) {
      setIsMobile(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check hover targets for cursor expansion & magnetic effect
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, textarea, select, [role="button"], .interactive-hover');
        setIsHovered(!!interactive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    // Animation Loop for smooth interpolating ring
    let animFrameId: number | null = null;
    const loop = () => {
      if (document.hidden || !isVisible) {
        animFrameId = requestAnimationFrame(loop);
        return;
      }

      // Lerp ring position
      pos.current.x += (mouse.current.x - pos.current.x) * 0.18;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden">
      {/* Center Small Gold Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full transition-all duration-300 ease-out ${
          isClicking
            ? 'scale-75 bg-amber-300 shadow-[0_0_10px_rgba(254,243,199,1)]'
            : isHovered
            ? 'scale-100 bg-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.9)]'
            : 'scale-100 bg-amber-400 shadow-[0_0_8px_rgba(212,175,55,0.8)]'
        }`}
      />

      {/* Smooth Trailing Gold Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-10 h-10 -ml-5 -mt-5 rounded-full transition-all duration-300 ease-out flex items-center justify-center ${
          isHovered
            ? 'scale-100 border border-amber-300 bg-amber-400/10 shadow-[0_0_20px_rgba(212,175,55,0.35)]'
            : isClicking
            ? 'scale-95 border border-amber-300 bg-amber-500/20'
            : 'scale-100 border border-amber-500/40'
        }`}
      />
    </div>
  );
}
