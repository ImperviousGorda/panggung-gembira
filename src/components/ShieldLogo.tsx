import React, { useState } from "react";
import shieldLogoImg from "../assets/images/logo_1_2.png";

export default function ShieldLogo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="w-full max-w-[340px] lg:max-w-[400px] relative z-10 select-none mx-auto group cursor-pointer" 
      id="shield-logo-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Golden Ambient Pulsing Back-glow (Atmospheric majestic aura - automatically breathes!) */}
      <div 
        className="absolute inset-0 bg-radial from-[rgba(212,175,55,0.22)] to-transparent blur-3xl -z-10 rounded-full transition-all duration-1000 ease-out-expo pointer-events-none scale-125 animate-glow-breathe" 
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.28) 0%, rgba(170,131,27,0.06) 50%, rgba(0,0,0,0) 70%)"
        }}
      />
      
      {/* 2. Concentrated Inner Sub-glow behind keyhole region (automatically breathes!) */}
      <div 
        className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-radial from-[rgba(212,175,55,0.35)] to-transparent blur-2xl -z-10 rounded-full mix-blend-screen pointer-events-none animate-inner-glow-breathe"
        style={{
          background: "radial-gradient(circle, rgba(254,244,219,0.3) 0%, rgba(212,175,55,0.05) 60%, rgba(0,0,0,0) 80%)"
        }}
      />

      {/* 3. The Interactive Logo Image & Dual-Sheen Sweeper (Scales ONLY when hovering!) */}
      <div className="relative overflow-visible transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-[1.05]">
        <img
          src={shieldLogoImg}
          alt="Panggung Gembira Shield Logo"
          loading="lazy"
          decoding="async"
          className="w-full h-auto drop-shadow-[0_12px_40px_rgba(0,0,0,0.85)] transition-all duration-700 group-hover:drop-shadow-[0_20px_55px_rgba(212,175,55,0.35)]"
          referrerPolicy="no-referrer"
          id="ornate-shield-logo-img"
        />

        {/* 4. Golden Metallic Hover Sheen Sweep (Clipped perfectly to the unique shape of the shield logo!) */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            WebkitMaskImage: `url(${shieldLogoImg})`,
            maskImage: `url(${shieldLogoImg})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        >
          {/* Intense shine line sweeping across on mouse enter */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] transition-all duration-1000"
            style={{
              width: "150%",
              height: "100%",
              left: isHovered ? "150%" : "-150%",
              transform: "translateX(-50%) skewX(-25deg)",
              transition: isHovered ? "left 1.2s cubic-bezier(0.16, 1, 0.3, 1)" : "none"
            }}
          />
        </div>

        {/* 5. Secondary Continuous Ambient Shimmer (Sweeps slowly every 8s to keep the interface alive) */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-50"
          style={{
            WebkitMaskImage: `url(${shieldLogoImg})`,
            maskImage: `url(${shieldLogoImg})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/25 to-transparent skew-x-[-25deg] animate-sheen-sweep" />
        </div>
      </div>
    </div>
  );
}

