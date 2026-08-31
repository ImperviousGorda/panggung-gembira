import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitType from 'split-type';
import shieldLogoImg from '../assets/images/logo_1_2.png';

gsap.registerPlugin(ScrollTrigger);

interface CinematicPreloaderProps {
  onAnimationComplete?: () => void;
}

export default function CinematicPreloader({ onAnimationComplete }: CinematicPreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Initialize Lenis Smooth Scroll Engine
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    if (prefersReducedMotion) {
      setIsFinished(true);
      if (onAnimationComplete) onAnimationComplete();
      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      };
    }

    const ctx = gsap.context(() => {
      // Setup initial hidden states for Hero elements to prevent layout jumps
      gsap.set('#header-nav', { opacity: 0, y: -20 });
      gsap.set('#hero-heading-group', { opacity: 0, y: 40 });
      gsap.set('#hero-heading-group h2', { opacity: 1, y: 0 });
      gsap.set('#hero-details-container p', { opacity: 0, y: 25 });
      gsap.set('#hero-buttons button, #hero-buttons a', { opacity: 0, scale: 0.95, y: 15 });
      gsap.set('#hero-shield-section', { opacity: 0, scale: 1.08, filter: 'blur(12px)' });
      gsap.set('#mobile-hero-logo', { opacity: 0, scale: 1.08 });
      gsap.set('#ornate-border-left, #ornate-border-right', { opacity: 0, scale: 0.9 });

      // Master Timeline for Intro Sequence & Hero Animation
      const masterTl = gsap.timeline({
        onComplete: () => {
          setIsFinished(true);
          if (onAnimationComplete) onAnimationComplete();

          // Initialize ScrollTrigger Section Animations after Intro completes
          initScrollTriggerAnimations();
        },
      });

      // 1. Logo Animation (0.8s)
      masterTl
        .fromTo(
          logoWrapperRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
        )
        // 2. Hold briefly (0.6s)
        .to({}, { duration: 0.6 })
        // 3. Reveal Homepage using smooth clip-path mask animation (0.8s)
        .to(preloaderRef.current, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          duration: 0.8,
          ease: 'power4.inOut',
        })
        // 4. Reveal Header Navigation (fade in, translateY(-20px -> 0))
        .to('#header-nav', {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
        }, '-=0.6')
        // 5. Hero Heading (translateY(40px -> 0), opacity 0 -> 1)
        .to(
          '#hero-heading-group',
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        // 6. Hero Description (fade, slight upward motion translateY(25px -> 0))
        .to(
          '#hero-details-container p',
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
          },
          '-=0.4'
        )
        // 7. Hero Buttons (stagger appearance, slight scale, soft fade)
        .to(
          '#hero-buttons button, #hero-buttons a',
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.4'
        )
        // 8. Hero Image / Shield (scale 1.08 -> 1, opacity 0 -> 1, subtle blur -> sharp)
        .to(
          ['#hero-shield-section', '#mobile-hero-logo'],
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.6'
        )
        // 9. Ornate Side Decorative elements (slow floating movement)
        .to(
          '#ornate-border-left, #ornate-border-right',
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.5'
        );
    });

    // Helper function to initialize ScrollTrigger for all website sections
    function initScrollTriggerAnimations() {
      const sections = document.querySelectorAll('section[id], section');

      sections.forEach((sec) => {
        // Skip hero main container, sponsor section, featured events, and gallery sections
        if (
          sec.id === 'sponsor-section' ||
          sec.id === 'flyer-section' ||
          sec.id === 'featured-events-section' ||
          sec.id === 'gallery-section' ||
          sec.classList.contains('no-scroll-trigger')
        ) {
          return;
        }

        const cards = sec.querySelectorAll('.grid > div, .space-y-4 > div, article');

        gsap.fromTo(
          sec,
          { opacity: 0, y: 40, scale: 0.99 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );

        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sec,
                start: 'top 80%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        }
      });
    }

    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [onAnimationComplete]);

  if (isFinished) return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#040404] text-amber-100 overflow-hidden select-none pointer-events-auto"
      style={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      }}
    >
      {/* Background Soft Ambient Light Glow */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      {/* Ornate Background Geometry Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Centered Logo Container */}
      <div ref={logoWrapperRef} className="relative flex flex-col items-center text-center space-y-4 px-4">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
          {/* Subtle Outer Pulsing Golden Halo */}
          <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-ping opacity-20" />
          <div className="absolute -inset-3 rounded-full border border-amber-500/20 animate-spin-slow pointer-events-none" />

          {/* Centered Logo */}
          <img
            src={shieldLogoImg}
            alt="Panggung Gembira Logo"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.45)]"
          />
        </div>

        {/* Minimal Subtitle */}
        <div className="space-y-1">
          <p className="font-amagro text-[10px] sm:text-xs tracking-[0.3em] text-amber-400 uppercase font-semibold">
            THE ABSOLUTE SPECTACLE
          </p>
          <h1 className="font-amagro text-xl sm:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#fef4db] via-[#d4af37] to-[#8a6f27]">
            PANGGUNG GEMBIRA
          </h1>
        </div>
      </div>
    </div>
  );
}
