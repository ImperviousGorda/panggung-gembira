import React from 'react';
import { Instagram, Phone, MapPin, ExternalLink } from 'lucide-react';
import shieldLogoImg from '../assets/images/logo_preloader.webp';

interface FooterProps {
  onOpenContact?: () => void;
  onOpenGuidebook?: () => void;
  onScrollToFlyer?: () => void;
}

export default function Footer({
  onOpenContact,
}: FooterProps) {
  return (
    <footer
      id="main-footer"
      className="relative z-20 w-full bg-[#040302] border-t border-amber-500/15 text-zinc-300 pt-10 sm:pt-12 md:pt-14 pb-8 sm:pb-10 px-5 sm:px-8 md:px-10 lg:px-16 overflow-hidden"
    >
      {/* Ambient background subtle lighting */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-amber-600/5 blur-[120px] rounded-full" />
        <div className="absolute top-0 right-1/4 w-96 h-64 bg-amber-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Responsive Grid for Mobile, Tablet (sm/md), and Desktop (lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10 md:gap-8 lg:gap-14 items-start">
          {/* Column 1: Brand & Logo & Description */}
          <div className="sm:col-span-2 md:col-span-5 space-y-3.5 sm:space-y-4">
            <div className="flex items-center space-x-3.5">
              {/* Crest Logo */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-black/60 border border-amber-500/30 p-1 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:border-amber-400 transition-all duration-300">
                <img
                  src={shieldLogoImg}
                  alt="Panggung Gembira Logo"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="font-cinzel text-sm sm:text-base md:text-lg font-bold tracking-wider text-amber-400 uppercase leading-snug">
                  PANGGUNG GEMBIRA
                </h3>
                <p className="text-[9px] sm:text-[10px] md:text-xs font-mono tracking-[0.2em] text-amber-200/70 uppercase">
                  IMPERVIOUS GENERATION
                </p>
              </div>
            </div>

            {/* Quote Description */}
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-md font-light">
              Panggung Gembira menjadi kunci kejayaan, membangun peradaban Ummat.
            </p>
          </div>

          {/* Column 2: Address / Alamat */}
          <div className="sm:col-span-1 md:col-span-4 space-y-3">
            <h4 className="font-cinzel text-xs sm:text-sm md:text-base font-bold tracking-widest text-amber-400 uppercase flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
              <span>ADDRESS</span>
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
              <p className="font-medium text-amber-200/90">
                Pondok Modern Darussalam Gontor Kampus 2
              </p>
              <p className="text-zinc-400 text-[11px] sm:text-xs md:text-sm">
                Jl. Raya Siman, Madusari, Kec. Siman, Kabupaten Ponorogo, Jawa Timur 63471
              </p>
              <div className="pt-1">
                <a
                  href="https://maps.google.com/?q=Pondok+Modern+Darussalam+Gontor+Kampus+2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs text-amber-400/90 hover:text-amber-300 underline underline-offset-4 transition-colors duration-200"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Hubungi Kami / Contacts */}
          <div className="sm:col-span-1 md:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs sm:text-sm md:text-base font-bold tracking-widest text-amber-400 uppercase">
              HUBUNGI KAMI
            </h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-zinc-400 font-sans">
              <li>
                <a
                  href="https://www.instagram.com/impervious_generation.g2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2.5 hover:text-amber-300 transition-colors duration-200 group"
                >
                  <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 group-hover:text-amber-400 transition-colors shrink-0" />
                  <span className="truncate">@impervious_generation.g2</span>
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="inline-flex items-center space-x-2.5 hover:text-amber-300 transition-colors duration-200 group cursor-pointer text-left"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 group-hover:text-amber-400 transition-colors shrink-0" />
                  <span>Contact Person</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Subtle Horizontal Divider */}
        <div className="w-full h-px bg-zinc-900 border-t border-amber-500/10 mt-8 sm:mt-10 mb-5 sm:mb-6" />

        {/* Copyright Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-zinc-500 text-xs font-sans leading-relaxed">
          <p>
            &copy; <em className="italic">designed by</em> robbenWuzHere.
          </p>
          <p className="font-mono text-[11px] sm:text-xs text-zinc-400/80">
            IMPERVIOUS GENERATION CAMPUS 2
          </p>
        </div>
      </div>
    </footer>
  );
}
