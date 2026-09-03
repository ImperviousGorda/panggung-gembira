import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Compass } from 'lucide-react';

export interface VenueZone {
  id: string;
  title: string;
  category: 'panggung' | 'vip' | 'tamu' | 'santri' | 'bazzar';
  bgClass: string;
  textClass: string;
}

export const VENUE_ZONES: VenueZone[] = [
  {
    id: 'panggung',
    title: 'Panggung Acara',
    category: 'panggung',
    bgClass: 'bg-[#ffff00] hover:bg-[#ffea00]',
    textClass: 'text-zinc-950 font-bold',
  },
  {
    id: 'ibu-guru-senior',
    title: 'Ibu guru Senior',
    category: 'vip',
    bgClass: 'bg-[#70c96e] hover:bg-[#5ebf5c]',
    textClass: 'text-zinc-950 font-semibold',
  },
  {
    id: 'bapak-guru-senior',
    title: 'Bapak guru Senior',
    category: 'vip',
    bgClass: 'bg-[#70c96e] hover:bg-[#5ebf5c]',
    textClass: 'text-zinc-950 font-semibold',
  },
  {
    id: 'asatidzah',
    title: 'Asatidzah',
    category: 'vip',
    bgClass: 'bg-[#43a276] hover:bg-[#349568]',
    textClass: 'text-white font-semibold',
  },
  {
    id: 'asatidz',
    title: 'Asatidz',
    category: 'vip',
    bgClass: 'bg-[#43a276] hover:bg-[#349568]',
    textClass: 'text-white font-semibold',
  },
  {
    id: 'tamu-putri',
    title: 'Tamu Putri',
    category: 'tamu',
    bgClass: 'bg-[#f8b4bb] hover:bg-[#f69ba4]',
    textClass: 'text-zinc-950 font-bold',
  },
  {
    id: 'tamu-putra',
    title: 'Tamu Putra',
    category: 'tamu',
    bgClass: 'bg-[#00a6f4] hover:bg-[#0092d6]',
    textClass: 'text-white font-bold',
  },
  {
    id: 'lorong-tengah',
    title: 'Lorong Karpet Merah',
    category: 'panggung',
    bgClass: 'bg-[#983838] hover:bg-[#852b2b]',
    textClass: 'text-white font-bold',
  },
  {
    id: 'pimpinan',
    title: 'Pimpinan',
    category: 'vip',
    bgClass: 'bg-[#844c35] hover:bg-[#723f2b]',
    textClass: 'text-white font-bold',
  },
  {
    id: 'foh',
    title: 'FOH',
    category: 'panggung',
    bgClass: 'bg-[#cf6d3b] hover:bg-[#e07742]',
    textClass: 'text-zinc-950 font-bold',
  },
  {
    id: 'santri-kiri',
    title: 'Santri Sektor Barat',
    category: 'santri',
    bgClass: 'bg-[#fef08a] hover:bg-[#fde047]',
    textClass: 'text-zinc-950 font-bold',
  },
  {
    id: 'santri-kanan',
    title: 'Santri Sektor Timur',
    category: 'santri',
    bgClass: 'bg-[#fef08a] hover:bg-[#fde047]',
    textClass: 'text-zinc-950 font-bold',
  },
  {
    id: 'bazzar-cafe',
    title: 'Bazzar Café Marhalah',
    category: 'bazzar',
    bgClass: 'bg-white hover:bg-zinc-100',
    textClass: 'text-zinc-950 font-semibold',
  },
  {
    id: 'bazzar-merchandise',
    title: 'Bazzar Merchandise',
    category: 'bazzar',
    bgClass: 'bg-white hover:bg-zinc-100',
    textClass: 'text-zinc-950 font-semibold',
  },
];

type FilterCategory = 'all' | 'panggung' | 'vip' | 'tamu' | 'santri' | 'bazzar';

export const VenueMapSection: React.FC = () => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('panggung');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  // Scroll-driven background animations for venue map section (1 rotating wheel effect like in reviews section)
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: mapScrollProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const mapBgRotate = useTransform(mapScrollProgress, [0, 1], [-20, 80]);
  const mapBgY = useTransform(mapScrollProgress, [0, 1], [-50, 50]);

  const filterTabs: { key: FilterCategory; label: string; count: number }[] = [
    { key: 'all', label: 'Semua Area', count: VENUE_ZONES.length },
    { key: 'panggung', label: 'Panggung & FOH', count: 3 },
    { key: 'vip', label: 'VIP & Dewan Guru', count: 5 },
    { key: 'tamu', label: 'Tamu Putra & Putri', count: 2 },
    { key: 'santri', label: 'Santri KMI', count: 2 },
    { key: 'bazzar', label: 'Bazzar & Merchandise', count: 2 },
  ];

  const isZoneFilteredIn = (zone: VenueZone) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'panggung') return zone.category === 'panggung';
    if (activeFilter === 'vip') return zone.category === 'vip';
    if (activeFilter === 'tamu') return zone.category === 'tamu';
    if (activeFilter === 'santri') return zone.category === 'santri';
    if (activeFilter === 'bazzar') return zone.category === 'bazzar';
    return true;
  };

  return (
    <section
      ref={sectionRef}
      id="venue-map-section"
      className="relative z-20 w-full py-24 px-6 lg:px-16 bg-[#040404] text-amber-100 border-t border-amber-500/15 overflow-hidden"
    >
      {/* Top Hairline Glowing Divider matching other sections */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent pointer-events-none" />

      {/* Ambient background glow & single rotating wheel pattern (matching review section) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Decorative Rotating Wheel / Star (1 Roda Saja) */}
        <motion.div
          style={{ rotate: mapBgRotate, y: mapBgY }}
          className="absolute -right-20 sm:-right-12 md:right-4 lg:right-16 top-4 w-64 h-64 sm:w-72 sm:h-72 md:w-88 md:h-88 border-2 border-amber-500/20 rounded-full flex items-center justify-center opacity-50 md:opacity-65 origin-center pointer-events-none"
        >
          {/* Outer Star */}
          <div className="absolute w-60 h-60 sm:w-72 sm:h-72 border border-amber-500/20 rotate-30 flex items-center justify-center animate-spin-reverse-slow">
            <div className="w-60 h-60 sm:w-72 sm:h-72 border border-amber-500/20 rotate-60"></div>
            <div className="w-60 h-60 sm:w-72 sm:h-72 border border-amber-500/20 rotate-90"></div>
          </div>
          {/* Inner Ring */}
          <div className="w-44 h-44 sm:w-56 sm:h-56 border border-dashed border-amber-500/25 rounded-full flex items-center justify-center animate-spin-slow">
            <div className="w-24 h-24 sm:w-32 sm:h-32 border border-amber-500/30 rounded-full"></div>
          </div>
        </motion.div>
      </div>

      {/* Background Ornate Glows & Spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(212,175,55,0.06)_0%,_rgba(0,0,0,0)_70%)] blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-700/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header matching the signature typography & animations of App.tsx */}
        <motion.div
          className="text-center space-y-3 max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
            }}
            className="flex justify-center items-center space-x-3"
          >
            <div className="w-8 h-[1px] bg-amber-500/30"></div>
            <p className="text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase font-cinzel">
              TATA LETAK & ZONA
            </p>
            <div className="w-8 h-[1px] bg-amber-500/30"></div>
          </motion.div>

          <motion.h3
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
            }}
            className="font-amagro text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fef4db] via-[#d4af37] to-[#8a6f27]"
          >
            Denah Acara
          </motion.h3>

          <motion.div
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: { opacity: 1, scaleX: 1, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
            className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mt-3 origin-center"
          />
        </motion.div>

        {/* Filter Pills with gold glow aesthetics */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={`px-4 py-2 rounded-full text-xs font-cinzel tracking-wider uppercase transition-all duration-300 flex items-center space-x-2 border cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)] scale-105'
                    : 'bg-[#050505]/80 text-zinc-400 border-amber-500/15 hover:border-amber-400/40 hover:text-amber-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-amber-400 text-zinc-950 font-bold' : 'bg-amber-500/10 text-amber-400/80'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Centered Venue Layout */}
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto">
          {/* Master Plan Blueprint Card */}
          <motion.div
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* The Blueprint Card Container */}
            <div
              className="relative w-full max-w-[560px] bg-[#050505]/95 border border-amber-500/25 rounded-2xl p-4 sm:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Subtle top inner gradient */}
              <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />

              {/* Gold Filigree Corner Accents */}
              <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-amber-500/50 rounded-tl pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-amber-500/50 rounded-tr pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-amber-500/50 rounded-bl pointer-events-none" />
              <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-amber-500/50 rounded-br pointer-events-none" />

              {/* Header inside Map Frame */}
              <div className="text-center mb-5 pb-3 border-b border-amber-500/15">
                <div className="flex items-center justify-center space-x-2 text-[10px] sm:text-xs font-cinzel tracking-[0.25em] text-amber-400 uppercase">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>MASTER PLAN • PANGGUNG GEMBIRA 6101</span>
                </div>
                <h4 className="font-amagro text-xl sm:text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#fef4db] via-[#d4af37] to-[#8a6f27] uppercase mt-1">
                  DENAH ACARA
                </h4>
                <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase mt-0.5">
                  Lapangan Sintesa • Gontor Kampus 2
                </p>
              </div>

              {/* 1. TOP: Panggung Acara (Yellow Box) */}
              <div className="w-full flex justify-center mb-3">
                {(() => {
                  const panggung = VENUE_ZONES.find((z) => z.id === 'panggung')!;
                  const isSelected = selectedZoneId === 'panggung';
                  const isFiltered = isZoneFilteredIn(panggung);
                  return (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedZoneId('panggung')}
                      className={`w-[86%] sm:w-[78%] py-5 sm:py-7 px-4 rounded-lg border-2 text-center transition-all duration-300 cursor-pointer relative overflow-hidden ${
                        panggung.bgClass
                      } ${panggung.textClass} ${
                        isSelected
                          ? 'ring-4 ring-amber-300 border-white shadow-[0_0_35px_rgba(255,255,0,0.6)] scale-[1.03] z-20'
                          : 'border-yellow-400 shadow-[0_4px_15px_rgba(0,0,0,0.4)]'
                      } ${!isFiltered ? 'opacity-30 grayscale-[50%]' : 'opacity-100'}`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xl sm:text-3xl font-amagro font-bold tracking-wide uppercase leading-tight">
                          Panggung
                        </div>
                        <div className="text-xl sm:text-3xl font-amagro font-bold tracking-wide uppercase leading-tight">
                          Acara
                        </div>
                        <p className="text-[10px] sm:text-xs text-zinc-900 font-semibold tracking-wider pt-1 opacity-90">
                          (The Absolute Spectacle)
                        </p>
                      </div>
                    </motion.button>
                  );
                })()}
              </div>

              {/* 2. MIDDLE AREA: Left (Putri) vs Right (Putra) separated by Lorong Karpet Merah */}
              <div className="w-full flex justify-center items-stretch gap-1.5 sm:gap-2.5 mb-3">
                {/* LEFT COLUMN: Ibu Guru Senior -> Asatidzah -> Tamu Putri */}
                <div className="w-[42%] sm:w-[40%] flex flex-col gap-1.5 sm:gap-2">
                  {/* Ibu Guru Senior */}
                  {(() => {
                    const zone = VENUE_ZONES.find((z) => z.id === 'ibu-guru-senior')!;
                    const isSelected = selectedZoneId === zone.id;
                    const isFiltered = isZoneFilteredIn(zone);
                    return (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedZoneId(zone.id)}
                        className={`w-full py-2.5 sm:py-3.5 px-2 rounded-md border text-center transition-all duration-300 cursor-pointer ${
                          zone.bgClass
                        } ${zone.textClass} ${
                          isSelected
                            ? 'ring-2 ring-white border-amber-400 shadow-[0_0_20px_rgba(112,201,110,0.7)] scale-[1.02] z-20 font-bold'
                            : 'border-emerald-600/60 shadow'
                        } ${!isFiltered ? 'opacity-30' : 'opacity-100'}`}
                      >
                        <span className="text-xs sm:text-sm font-bold leading-tight block">
                          Ibu guru
                        </span>
                        <span className="text-xs sm:text-sm font-bold leading-tight block">
                          Senior
                        </span>
                      </motion.button>
                    );
                  })()}

                  {/* Asatidzah */}
                  {(() => {
                    const zone = VENUE_ZONES.find((z) => z.id === 'asatidzah')!;
                    const isSelected = selectedZoneId === zone.id;
                    const isFiltered = isZoneFilteredIn(zone);
                    return (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedZoneId(zone.id)}
                        className={`w-full py-2.5 sm:py-3 px-2 rounded-md border text-center transition-all duration-300 cursor-pointer ${
                          zone.bgClass
                        } ${zone.textClass} ${
                          isSelected
                            ? 'ring-2 ring-white border-amber-400 shadow-[0_0_20px_rgba(67,162,118,0.7)] scale-[1.02] z-20 font-bold'
                            : 'border-teal-700/60 shadow'
                        } ${!isFiltered ? 'opacity-30' : 'opacity-100'}`}
                      >
                        <span className="text-xs sm:text-sm font-bold leading-tight block">
                          Asatidzah
                        </span>
                      </motion.button>
                    );
                  })()}

                  {/* Tamu Putri (Tall Pink Box) */}
                  {(() => {
                    const zone = VENUE_ZONES.find((z) => z.id === 'tamu-putri')!;
                    const isSelected = selectedZoneId === zone.id;
                    const isFiltered = isZoneFilteredIn(zone);
                    return (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedZoneId(zone.id)}
                        className={`w-full h-36 sm:h-44 rounded-md border text-center flex flex-col items-center justify-center p-2 transition-all duration-300 cursor-pointer relative ${
                          zone.bgClass
                        } ${zone.textClass} ${
                          isSelected
                            ? 'ring-4 ring-white border-pink-400 shadow-[0_0_25px_rgba(248,180,187,0.7)] scale-[1.02] z-20'
                            : 'border-pink-300/70 shadow'
                        } ${!isFiltered ? 'opacity-30' : 'opacity-100'}`}
                      >
                        <span className="text-xs sm:text-base font-bold leading-tight">
                          Tamu Putri
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-zinc-900/80 mt-1 hidden sm:block">
                          (Wali Santri & Undangan)
                        </span>
                      </motion.button>
                    );
                  })()}
                </div>

                {/* CENTRAL CORRIDOR (Red Strip / Lorong Karpet Merah) */}
                {(() => {
                  const zone = VENUE_ZONES.find((z) => z.id === 'lorong-tengah')!;
                  const isSelected = selectedZoneId === zone.id;
                  const isFiltered = isZoneFilteredIn(zone);
                  return (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedZoneId(zone.id)}
                      title="Lorong Karpet Merah Sentral"
                      className={`w-5 sm:w-7 rounded-md border flex items-center justify-center cursor-pointer transition-all duration-300 ${
                        zone.bgClass
                      } ${
                        isSelected
                          ? 'ring-2 ring-white border-amber-300 shadow-[0_0_20px_rgba(152,56,56,0.9)] scale-[1.05] z-20'
                          : 'border-red-900/70 shadow'
                      } ${!isFiltered ? 'opacity-30' : 'opacity-100'}`}
                    >
                      <span className="rotate-90 whitespace-nowrap text-[8px] sm:text-[10px] font-bold text-white tracking-widest uppercase select-none">
                        LORONG
                      </span>
                    </motion.button>
                  );
                })()}

                {/* RIGHT COLUMN: Bapak Guru Senior -> Asatidz -> Tamu Putra */}
                <div className="w-[42%] sm:w-[40%] flex flex-col gap-1.5 sm:gap-2">
                  {/* Bapak Guru Senior */}
                  {(() => {
                    const zone = VENUE_ZONES.find((z) => z.id === 'bapak-guru-senior')!;
                    const isSelected = selectedZoneId === zone.id;
                    const isFiltered = isZoneFilteredIn(zone);
                    return (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedZoneId(zone.id)}
                        className={`w-full py-2.5 sm:py-3.5 px-2 rounded-md border text-center transition-all duration-300 cursor-pointer ${
                          zone.bgClass
                        } ${zone.textClass} ${
                          isSelected
                            ? 'ring-2 ring-white border-amber-400 shadow-[0_0_20px_rgba(112,201,110,0.7)] scale-[1.02] z-20 font-bold'
                            : 'border-emerald-600/60 shadow'
                        } ${!isFiltered ? 'opacity-30' : 'opacity-100'}`}
                      >
                        <span className="text-xs sm:text-sm font-bold leading-tight block">
                          Bapak guru
                        </span>
                        <span className="text-xs sm:text-sm font-bold leading-tight block">
                          Senior
                        </span>
                      </motion.button>
                    );
                  })()}

                  {/* Asatidz */}
                  {(() => {
                    const zone = VENUE_ZONES.find((z) => z.id === 'asatidz')!;
                    const isSelected = selectedZoneId === zone.id;
                    const isFiltered = isZoneFilteredIn(zone);
                    return (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedZoneId(zone.id)}
                        className={`w-full py-2.5 sm:py-3 px-2 rounded-md border text-center transition-all duration-300 cursor-pointer ${
                          zone.bgClass
                        } ${zone.textClass} ${
                          isSelected
                            ? 'ring-2 ring-white border-amber-400 shadow-[0_0_20px_rgba(67,162,118,0.7)] scale-[1.02] z-20 font-bold'
                            : 'border-teal-700/60 shadow'
                        } ${!isFiltered ? 'opacity-30' : 'opacity-100'}`}
                      >
                        <span className="text-xs sm:text-sm font-bold leading-tight block">
                          Asatidz
                        </span>
                      </motion.button>
                    );
                  })()}

                  {/* Tamu Putra (Tall Sky Blue Box) */}
                  {(() => {
                    const zone = VENUE_ZONES.find((z) => z.id === 'tamu-putra')!;
                    const isSelected = selectedZoneId === zone.id;
                    const isFiltered = isZoneFilteredIn(zone);
                    return (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedZoneId(zone.id)}
                        className={`w-full h-36 sm:h-44 rounded-md border text-center flex flex-col items-center justify-center p-2 transition-all duration-300 cursor-pointer relative ${
                          zone.bgClass
                        } ${zone.textClass} ${
                          isSelected
                            ? 'ring-4 ring-white border-cyan-300 shadow-[0_0_25px_rgba(0,166,244,0.7)] scale-[1.02] z-20'
                            : 'border-sky-300/70 shadow'
                        } ${!isFiltered ? 'opacity-30' : 'opacity-100'}`}
                      >
                        <span className="text-xs sm:text-base font-bold leading-tight">
                          Tamu Putra
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-white/90 mt-1 hidden sm:block">
                          (Wali Santri & Undangan)
                        </span>
                      </motion.button>
                    );
                  })()}
                </div>
              </div>

              {/* 3. LOWER AREA: Santri (Left) - [Pimpinan & FOH (Center)] - Santri (Right) */}
              <div className="w-full flex justify-center items-stretch gap-2 sm:gap-3 mb-3">
                {/* Left Santri Block */}
                {(() => {
                  const zone = VENUE_ZONES.find((z) => z.id === 'santri-kiri')!;
                  const isSelected = selectedZoneId === zone.id;
                  const isFiltered = isZoneFilteredIn(zone);
                  return (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedZoneId(zone.id)}
                      className={`w-[32%] sm:w-[30%] h-28 sm:h-32 rounded-md border flex flex-col items-center justify-center p-1.5 transition-all duration-300 cursor-pointer ${
                        zone.bgClass
                      } ${zone.textClass} ${
                        isSelected
                          ? 'ring-4 ring-white border-amber-400 shadow-[0_0_20px_rgba(254,240,138,0.7)] scale-[1.02] z-20'
                          : 'border-yellow-300/70 shadow'
                      } ${!isFiltered ? 'opacity-30' : 'opacity-100'}`}
                    >
                      <span className="text-xs sm:text-base font-bold uppercase">Santri</span>
                      <span className="text-[8px] sm:text-[9px] text-zinc-800 font-medium">
                        (Sektor Barat)
                      </span>
                    </motion.button>
                  );
                })()}

                {/* Center Column: Pimpinan (Top) & FOH (Bottom) */}
                <div className="w-[26%] sm:w-[28%] flex flex-col justify-between gap-1.5">
                  {/* Pimpinan Block */}
                  {(() => {
                    const zone = VENUE_ZONES.find((z) => z.id === 'pimpinan')!;
                    const isSelected = selectedZoneId === zone.id;
                    const isFiltered = isZoneFilteredIn(zone);
                    return (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedZoneId(zone.id)}
                        className={`w-full py-2.5 sm:py-3 px-1 rounded-md border flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${
                          zone.bgClass
                        } ${zone.textClass} ${
                          isSelected
                            ? 'ring-2 ring-white border-amber-300 shadow-[0_0_20px_rgba(132,76,53,0.8)] scale-[1.03] z-20'
                            : 'border-amber-700/70 shadow'
                        } ${!isFiltered ? 'opacity-30' : 'opacity-100'}`}
                      >
                        <span className="text-[10px] sm:text-xs font-bold leading-tight">
                          Pimpinan
                        </span>
                      </motion.button>
                    );
                  })()}

                  {/* FOH Block */}
                  {(() => {
                    const zone = VENUE_ZONES.find((z) => z.id === 'foh')!;
                    const isSelected = selectedZoneId === zone.id;
                    const isFiltered = isZoneFilteredIn(zone);
                    return (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedZoneId(zone.id)}
                        className={`w-full py-2 sm:py-2.5 px-1 rounded-md border flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${
                          zone.bgClass
                        } ${zone.textClass} ${
                          isSelected
                            ? 'ring-2 ring-white border-amber-200 shadow-[0_0_20px_rgba(207,109,59,0.8)] scale-[1.03] z-20'
                            : 'border-orange-600/70 shadow'
                        } ${!isFiltered ? 'opacity-30' : 'opacity-100'}`}
                      >
                        <span className="text-[10px] sm:text-xs font-extrabold uppercase">FOH</span>
                      </motion.button>
                    );
                  })()}
                </div>

                {/* Right Santri Block */}
                {(() => {
                  const zone = VENUE_ZONES.find((z) => z.id === 'santri-kanan')!;
                  const isSelected = selectedZoneId === zone.id;
                  const isFiltered = isZoneFilteredIn(zone);
                  return (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedZoneId(zone.id)}
                      className={`w-[32%] sm:w-[30%] h-28 sm:h-32 rounded-md border flex flex-col items-center justify-center p-1.5 transition-all duration-300 cursor-pointer ${
                        zone.bgClass
                      } ${zone.textClass} ${
                        isSelected
                          ? 'ring-4 ring-white border-amber-400 shadow-[0_0_20px_rgba(254,240,138,0.7)] scale-[1.02] z-20'
                          : 'border-yellow-300/70 shadow'
                      } ${!isFiltered ? 'opacity-30' : 'opacity-100'}`}
                    >
                      <span className="text-xs sm:text-base font-bold uppercase">Santri</span>
                      <span className="text-[8px] sm:text-[9px] text-zinc-800 font-medium">
                        (Sektor Timur)
                      </span>
                    </motion.button>
                  );
                })()}
              </div>

              {/* 4. BOTTOM ROW: Bazzar Café Marhalah (Left) & Bazzar Merchandise (Right) */}
              <div className="w-full flex justify-between px-2 sm:px-4 pt-1">
                {/* Bazzar Cafe Marhalah */}
                {(() => {
                  const zone = VENUE_ZONES.find((z) => z.id === 'bazzar-cafe')!;
                  const isSelected = selectedZoneId === zone.id;
                  const isFiltered = isZoneFilteredIn(zone);
                  return (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedZoneId(zone.id)}
                      className={`w-[45%] sm:w-[44%] py-3 sm:py-3.5 px-2 rounded-md border text-center transition-all duration-300 cursor-pointer ${
                        zone.bgClass
                      } ${zone.textClass} ${
                        isSelected
                          ? 'ring-4 ring-amber-400 border-zinc-900 shadow-[0_0_20px_rgba(255,255,255,0.8)] scale-[1.02] z-20'
                          : 'border-zinc-300 shadow'
                      } ${!isFiltered ? 'opacity-30' : 'opacity-100'}`}
                    >
                      <span className="text-[10px] sm:text-xs font-bold leading-tight block">
                        Bazzar
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold leading-tight block">
                        Café Marhalah
                      </span>
                    </motion.button>
                  );
                })()}

                {/* Bazzar Merchandise */}
                {(() => {
                  const zone = VENUE_ZONES.find((z) => z.id === 'bazzar-merchandise')!;
                  const isSelected = selectedZoneId === zone.id;
                  const isFiltered = isZoneFilteredIn(zone);
                  return (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedZoneId(zone.id)}
                      className={`w-[45%] sm:w-[44%] py-3 sm:py-3.5 px-2 rounded-md border text-center transition-all duration-300 cursor-pointer ${
                        zone.bgClass
                      } ${zone.textClass} ${
                        isSelected
                          ? 'ring-4 ring-amber-400 border-zinc-900 shadow-[0_0_20px_rgba(255,255,255,0.8)] scale-[1.02] z-20'
                          : 'border-zinc-300 shadow'
                      } ${!isFiltered ? 'opacity-30' : 'opacity-100'}`}
                    >
                      <span className="text-[10px] sm:text-xs font-bold leading-tight block">
                        Bazzar
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold leading-tight block">
                        Merchandise
                      </span>
                    </motion.button>
                  );
                })()}
              </div>

              {/* Bottom Orientation Guidance */}
              <div className="mt-5 pt-3 border-t border-amber-500/15 flex items-center justify-between text-[9px] sm:text-[10px] text-amber-400 font-mono">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>Sektor Barat (Akses Putri)</span>
                </span>
                <span className="text-zinc-600 hidden sm:inline">|</span>
                <span className="flex items-center space-x-1">
                  <span>Sektor Timur (Akses Putra)</span>
                  <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                </span>
              </div>
            </div>

            {/* Quick Legend Guide under the Blueprint */}
            <div className="w-full max-w-[560px] bg-[#050505]/90 border border-amber-500/15 rounded-2xl p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-3 mt-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/90 font-semibold block text-center sm:text-left">
                PANDUAN WARNA SEKTOR:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-gray-300">
                <button
                  type="button"
                  onClick={() => setSelectedZoneId('panggung')}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors text-left"
                >
                  <span className="w-3 h-3 rounded-sm bg-yellow-400 shrink-0 border border-yellow-200" />
                  <span className="truncate">Panggung Acara</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedZoneId('ibu-guru-senior')}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors text-left"
                >
                  <span className="w-3 h-3 rounded-sm bg-[#70c96e] shrink-0 border border-emerald-300" />
                  <span className="truncate">Guru Senior & Asatidz</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedZoneId('tamu-putri')}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors text-left"
                >
                  <span className="w-3 h-3 rounded-sm bg-[#f8b4bb] shrink-0 border border-pink-300" />
                  <span className="truncate">Tamu Putri</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedZoneId('tamu-putra')}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors text-left"
                >
                  <span className="w-3 h-3 rounded-sm bg-[#00a6f4] shrink-0 border border-cyan-300" />
                  <span className="truncate">Tamu Putra</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedZoneId('santri-kiri')}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors text-left"
                >
                  <span className="w-3 h-3 rounded-sm bg-[#fef08a] shrink-0 border border-yellow-200" />
                  <span className="truncate">Santri KMI Gontor 2</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedZoneId('bazzar-cafe')}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors text-left"
                >
                  <span className="w-3 h-3 rounded-sm bg-white shrink-0 border border-zinc-300" />
                  <span className="truncate">Bazzar & Merchandise</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VenueMapSection;
