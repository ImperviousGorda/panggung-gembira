import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Compass, ArrowUp } from 'lucide-react';

export interface VenueZone {
  id: string;
  title: string;
}

export const VENUE_ZONES: VenueZone[] = [
  { id: 'panggung', title: 'Panggung Acara' },
  { id: 'tamu-vvip', title: 'Tamu VVIP' },
  { id: 'ibu-guru-senior', title: 'Ibu Guru Senior' },
  { id: 'bapak-guru-senior', title: 'Bapak Guru Senior' },
  { id: 'ustadzaat', title: 'Ustadzaat' },
  { id: 'asatidz', title: 'Asatidz' },
  { id: 'tamu-putri', title: 'Tamu Putri (Selatan)' },
  { id: 'tamu-putra', title: 'Tamu Putra (Utara)' },
  { id: 'santri', title: 'Santri KMI Gontor 2' },
  { id: 'andalusia', title: 'Gedung Andalusia' },
  { id: 'santiniketan', title: 'Gedung Santiniketan (Selatan)' },
  { id: 'al-azhar', title: 'Gedung Al Azhar (Selatan)' },
  { id: 'syanggit', title: 'Gedung Syanggit (Utara)' },
  { id: 'aligarh', title: 'Gedung Aligarh (Utara)' },
  { id: 'jalan-kendaraan', title: 'Jalan Masuk Kendaraan (Selatan)' },
  { id: 'gerbang', title: 'Gerbang Utama & Karpet Merah' },
  { id: 'wc-putri', title: 'WC Putri (Selatan)' },
  { id: 'wc-putra', title: 'WC Putra (Utara)' },
];

const LEGEND_ITEMS = [
  { id: 'panggung', label: 'Panggung Acara', dotColor: 'bg-[#220d04] border-amber-400' },
  { id: 'tamu-vvip', label: 'Tamu VVIP', dotColor: 'bg-[#2b1206] border-amber-300' },
  { id: 'ibu-guru-senior', label: 'Guru Senior & Asatidz', dotColor: 'bg-[#291106] border-[#b8860b]' },
  { id: 'tamu-putri', label: 'Tamu Putri (Selatan)', dotColor: 'bg-[#291106] border-amber-400' },
  { id: 'tamu-putra', label: 'Tamu Putra (Utara)', dotColor: 'bg-[#291106] border-amber-400' },
  { id: 'santri', label: 'Santri KMI', dotColor: 'bg-[#240e05] border-amber-200' },
  { id: 'santiniketan', label: 'Santiniketan & Al Azhar (Selatan)', dotColor: 'bg-[#240e05] border-[#c59d5f]' },
  { id: 'syanggit', label: 'Syanggit & Aligarh (Utara)', dotColor: 'bg-[#240e05] border-[#c59d5f]' },
  { id: 'andalusia', label: 'Gedung Andalusia', dotColor: 'bg-[#240e05] border-[#c59d5f]' },
  { id: 'jalan-kendaraan', label: 'Jalan Masuk Kendaraan (Selatan)', dotColor: 'bg-[#eadcc2] border-[#3e1f10]' },
  { id: 'gerbang', label: 'Gerbang & Karpet Merah', dotColor: 'bg-[#7a2218] border-amber-300' },
  { id: 'wc-putri', label: 'Toilet / WC (Putri & Putra)', dotColor: 'bg-[#291106] border-amber-200' },
];

export const VenueMapSection: React.FC = () => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('panggung');

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: mapScrollProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const mapBgRotate = useTransform(mapScrollProgress, [0, 1], [-20, 80]);
  const mapBgY = useTransform(mapScrollProgress, [0, 1], [-50, 50]);

  const getHighlightClass = (zoneId: string) => {
    return selectedZoneId === zoneId
      ? 'ring-2 sm:ring-4 ring-amber-400 border-amber-300 shadow-[0_0_25px_rgba(212,175,55,0.85)] scale-[1.03] z-20'
      : 'border-[#c59d5f]/40 hover:border-amber-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.3)]';
  };

  return (
    <section
      ref={sectionRef}
      id="venue-map-section"
      className="relative z-20 w-full py-24 px-4 sm:px-6 lg:px-16 bg-[#040404] text-amber-100 border-t border-b border-amber-500/20 overflow-hidden"
    >
      {/* Top Hairline Glowing Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent pointer-events-none" />

      {/* Ambient Background Rotating Star */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div
          style={{ rotate: mapBgRotate, y: mapBgY }}
          className="absolute -right-20 sm:-right-12 md:right-4 lg:right-16 top-4 w-64 h-64 sm:w-72 sm:h-72 md:w-88 md:h-88 border-2 border-amber-500/20 rounded-full flex items-center justify-center opacity-50 md:opacity-65 origin-center pointer-events-none"
        >
          <div className="absolute w-60 h-60 sm:w-72 sm:h-72 border border-amber-500/20 rotate-30 flex items-center justify-center animate-spin-reverse-slow">
            <div className="w-60 h-60 sm:w-72 sm:h-72 border border-amber-500/20 rotate-60"></div>
            <div className="w-60 h-60 sm:w-72 sm:h-72 border border-amber-500/20 rotate-90"></div>
          </div>
          <div className="w-44 h-44 sm:w-56 sm:h-56 border border-dashed border-amber-500/25 rounded-full flex items-center justify-center animate-spin-slow">
            <div className="w-24 h-24 sm:w-32 sm:h-32 border border-amber-500/30 rounded-full"></div>
          </div>
        </motion.div>
      </div>

      {/* Radial Spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(212,175,55,0.06)_0%,_rgba(0,0,0,0)_70%)] blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-700/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center space-y-3 max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
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

        {/* Main Venue Layout Container */}
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto">
          <motion.div
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Outer Royal Frame matching the Stage Layout Poster */}
            <div className="relative w-full max-w-[640px] bg-[#1a0c06] border-2 border-amber-500/40 rounded-3xl p-3 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden">
              {/* Gold Corner Filigree Accents */}
              <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-amber-400/60 rounded-tl pointer-events-none" />
              <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-amber-400/60 rounded-tr pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-amber-400/60 rounded-bl pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-amber-400/60 rounded-br pointer-events-none" />

              {/* Stage Layout Banner Header */}
              <div className="text-center mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-amber-500/20">
                <div className="flex items-center justify-center space-x-2 text-[10px] sm:text-xs font-cinzel tracking-[0.25em] text-amber-400 uppercase">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>MASTER PLAN • PANGGUNG GEMBIRA</span>
                </div>
                <h4 className="font-amagro text-xl sm:text-2xl font-bold tracking-[0.15em] text-[#f4ebd9] uppercase mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  STAGE LAYOUT
                </h4>
                <p className="text-[10px] text-amber-300/70 font-mono tracking-widest uppercase">
                  Lapangan Sintesa • Gontor Kampus 2
                </p>
              </div>

              {/* Arena Ground Floor */}
              <div className="relative w-full bg-[#f5ecda] rounded-2xl p-2 sm:p-3.5 border-2 border-[#6c3919]/50 shadow-inner flex flex-col items-center select-none overflow-hidden text-[#240e05]">
                {/* 1. TOP CENTER: PANGGUNG ACARA */}
                <div className="w-full flex justify-center mb-2 sm:mb-3 relative z-10">
                  <div className="relative flex items-center justify-center">
                    {/* Stepped Left Wing */}
                    <div className="hidden sm:flex flex-col items-end mr-1 space-y-1 opacity-90">
                      <div className="w-4 h-2 bg-[#3a1a0b] rounded-l-sm border border-[#a47b36]/60"></div>
                      <div className="w-6 h-4 bg-[#3a1a0b] rounded-l-sm border border-[#a47b36]/60"></div>
                      <div className="w-8 h-8 bg-[#3a1a0b] rounded-l-sm border border-[#a47b36]/60 flex items-center justify-center text-[7px] font-bold text-amber-200">
                        ≡
                      </div>
                    </div>

                    {/* Primary Stage Box */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedZoneId('panggung')}
                      className={`relative px-6 sm:px-12 py-3.5 sm:py-5 rounded-md border-2 bg-[#220d04] hover:bg-[#2e1307] text-[#fbf7ee] font-bold text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                        'panggung'
                      )}`}
                    >
                      <div className="font-serif text-lg sm:text-2xl font-extrabold tracking-wider uppercase leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        Panggung
                      </div>
                      <div className="font-serif text-lg sm:text-2xl font-extrabold tracking-wider uppercase leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        Acara
                      </div>
                    </motion.button>

                    {/* Stepped Right Wing */}
                    <div className="hidden sm:flex flex-col items-start ml-1 space-y-1 opacity-90">
                      <div className="w-4 h-2 bg-[#3a1a0b] rounded-r-sm border border-[#a47b36]/60"></div>
                      <div className="w-6 h-4 bg-[#3a1a0b] rounded-r-sm border border-[#a47b36]/60"></div>
                      <div className="w-8 h-8 bg-[#3a1a0b] rounded-r-sm border border-[#a47b36]/60 flex items-center justify-center text-[7px] font-bold text-amber-200">
                        ≡
                      </div>
                    </div>
                  </div>
                </div>

                {/* Planter Strip under stage */}
                <div className="w-[75%] sm:w-[65%] h-2.5 sm:h-3 rounded-full bg-gradient-to-r from-[#214b1c] via-[#2f6628] to-[#214b1c] border border-[#a47b36]/70 shadow-sm flex items-center justify-around px-2 mb-2 sm:mb-3">
                  <span className="text-[7px] text-amber-300">✿</span>
                  <span className="text-[6px] text-red-300">●</span>
                  <span className="text-[7px] text-amber-300">✿</span>
                  <span className="text-[6px] text-yellow-300">●</span>
                  <span className="text-[7px] text-amber-300">✿</span>
                </div>

                {/* 2. MIDDLE COMPLEX (Sayap Selatan + Tengah + Sayap Utara) */}
                <div className="w-full flex justify-between items-stretch gap-1 sm:gap-2 mb-2 sm:mb-3">
                  {/* SAYAP SELATAN (LEFT): Jalan Masuk Kendaraan + WC Putri & Santiniketan / Al Azhar */}
                  <div className="flex items-stretch gap-1 shrink-0">
                    {/* Jalan Masuk Kendaraan Strip */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedZoneId('jalan-kendaraan')}
                      title="Jalan Masuk Kendaraan (Sektor Selatan)"
                      className={`w-6 sm:w-8 rounded-md border bg-[#eadcc2] hover:bg-[#decbb0] text-[#381c10] font-bold flex flex-col items-center justify-between py-2 transition-all duration-300 cursor-pointer ${getHighlightClass(
                        'jalan-kendaraan'
                      )}`}
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-[#422212] animate-bounce" />
                      <div className="[writing-mode:vertical-rl] rotate-180 text-[8px] sm:text-[10px] font-bold tracking-widest uppercase text-[#3e1f10] whitespace-nowrap">
                        Jalan Masuk Kendaraan
                      </div>
                      <ArrowUp className="w-3.5 h-3.5 text-[#422212]" />
                    </motion.button>

                    {/* Sektor Selatan: WC Putri & Santiniketan (Atas) / Lorong / WC Putri & Al Azhar (Bawah) */}
                    <div className="w-16 sm:w-24 flex flex-col justify-between gap-1 text-[8px] sm:text-[10px]">
                      {/* Atas: WC Putri + Santiniketan */}
                      <div className="flex gap-1 h-[48%]">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedZoneId('wc-putri')}
                          className={`w-1/2 rounded-md border bg-[#291106] hover:bg-[#381808] text-[#fbf7ee] flex flex-col items-center justify-center p-0.5 text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                            'wc-putri'
                          )}`}
                        >
                          <div className="[writing-mode:vertical-rl] text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-amber-100">
                            WC PUTRI
                          </div>
                        </motion.button>

                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedZoneId('santiniketan')}
                          className={`w-1/2 rounded-md border bg-[#240e05] hover:bg-[#331407] text-[#fbf7ee] flex flex-col items-center justify-center p-0.5 text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                            'santiniketan'
                          )}`}
                        >
                          <div className="[writing-mode:vertical-rl] text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-[#fbf7ee]">
                            SANTINIKETAN
                          </div>
                        </motion.button>
                      </div>

                      {/* Lorong Walkway */}
                      <div className="w-full text-center py-0.5 bg-[#e0d0b6] border border-[#b89e7c] rounded text-[7px] sm:text-[8px] font-mono font-bold uppercase text-[#472615]">
                        Lorong
                      </div>

                      {/* Bawah: WC Putri + Al Azhar */}
                      <div className="flex gap-1 h-[48%]">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedZoneId('wc-putri')}
                          className={`w-1/2 rounded-md border bg-[#291106] hover:bg-[#381808] text-[#fbf7ee] flex flex-col items-center justify-center p-0.5 text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                            'wc-putri'
                          )}`}
                        >
                          <div className="[writing-mode:vertical-rl] text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-amber-100">
                            WC PUTRI
                          </div>
                        </motion.button>

                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedZoneId('al-azhar')}
                          className={`w-1/2 rounded-md border bg-[#240e05] hover:bg-[#331407] text-[#fbf7ee] flex flex-col items-center justify-center p-0.5 text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                            'al-azhar'
                          )}`}
                        >
                          <div className="[writing-mode:vertical-rl] text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-[#fbf7ee]">
                            AL AZHAR
                          </div>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* CENTER COURTYARD: VIP/Guru/Tamu (Atas) + VVIP/Santri/Karpet (Bawah) */}
                  <div className="flex-1 flex flex-col gap-1 sm:gap-2 px-1">
                    {/* Atas: Sektor Selatan (Putri) vs Sektor Utara (Putra) */}
                    <div className="w-full flex gap-1 sm:gap-2">
                      {/* Kolom Selatan (Putri) */}
                      <div className="w-1/2 flex flex-col gap-1 sm:gap-1.5">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedZoneId('ibu-guru-senior')}
                          className={`w-full py-1 sm:py-1.5 px-1 rounded-md border bg-[#291106] hover:bg-[#361708] text-[#fbf7ee] text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                            'ibu-guru-senior'
                          )}`}
                        >
                          <span className="text-[8px] sm:text-[11px] font-bold leading-tight block">
                            Ibu Guru Senior
                          </span>
                        </motion.button>

                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedZoneId('ustadzaat')}
                          className={`w-full py-1 sm:py-1.5 px-1 rounded-md border bg-[#291106] hover:bg-[#361708] text-[#fbf7ee] text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                            'ustadzaat'
                          )}`}
                        >
                          <span className="text-[8px] sm:text-[11px] font-bold leading-tight block">
                            Ustadzaat
                          </span>
                        </motion.button>

                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedZoneId('tamu-putri')}
                          className={`w-full py-2.5 sm:py-4 px-1 rounded-md border bg-[#291106] hover:bg-[#361708] text-amber-100 font-extrabold text-center flex items-center justify-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                            'tamu-putri'
                          )}`}
                        >
                          <span className="text-[9px] sm:text-xs uppercase leading-tight block">
                            Tamu Putri
                          </span>
                        </motion.button>
                      </div>

                      {/* Kolom Utara (Putra) */}
                      <div className="w-1/2 flex flex-col gap-1 sm:gap-1.5">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedZoneId('bapak-guru-senior')}
                          className={`w-full py-1 sm:py-1.5 px-1 rounded-md border bg-[#291106] hover:bg-[#361708] text-[#fbf7ee] text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                            'bapak-guru-senior'
                          )}`}
                        >
                          <span className="text-[8px] sm:text-[11px] font-bold leading-tight block">
                            Bapak Guru Senior
                          </span>
                        </motion.button>

                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedZoneId('asatidz')}
                          className={`w-full py-1 sm:py-1.5 px-1 rounded-md border bg-[#291106] hover:bg-[#361708] text-[#fbf7ee] text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                            'asatidz'
                          )}`}
                        >
                          <span className="text-[8px] sm:text-[11px] font-bold leading-tight block">
                            Asatidz
                          </span>
                        </motion.button>

                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedZoneId('tamu-putra')}
                          className={`w-full py-2.5 sm:py-4 px-1 rounded-md border bg-[#291106] hover:bg-[#361708] text-amber-100 font-extrabold text-center flex items-center justify-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                            'tamu-putra'
                          )}`}
                        >
                          <span className="text-[9px] sm:text-xs uppercase leading-tight block">
                            Tamu Putra
                          </span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Bawah: Tamu VVIP + Karpet Merah + Blok Santri */}
                    <div className="w-full flex flex-col items-center relative pt-1">
                      {/* Tamu VVIP Pavilion */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedZoneId('tamu-vvip')}
                        className={`w-[45%] sm:w-[40%] py-1.5 sm:py-2 px-2 rounded-t-md border-2 bg-[#2b1206] hover:bg-[#381808] text-center transition-all duration-300 cursor-pointer z-20 ${getHighlightClass(
                          'tamu-vvip'
                        )}`}
                      >
                        <span className="text-[8px] sm:text-[10px] font-bold uppercase block leading-tight text-amber-200">
                          Tamu
                        </span>
                        <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider block leading-tight text-amber-300">
                          VVIP
                        </span>
                      </motion.button>

                      {/* Walkway & Santri */}
                      <div className="w-full flex items-stretch justify-center">
                        {/* Santri Sisi Selatan */}
                        <div className="flex-1 flex flex-col justify-between gap-1 sm:gap-1.5 pr-1">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedZoneId('santri')}
                            className={`w-full py-2 sm:py-2.5 rounded-md border bg-[#240e05] hover:bg-[#331407] text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                              'santri'
                            )}`}
                          >
                            <span className="text-[8px] sm:text-[10px] font-bold uppercase text-[#fbf7ee]">
                              Santri
                            </span>
                          </motion.button>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedZoneId('santri')}
                            className={`w-full py-2 sm:py-2.5 rounded-md border bg-[#240e05] hover:bg-[#331407] text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                              'santri'
                            )}`}
                          >
                            <span className="text-[8px] sm:text-[10px] font-bold uppercase text-[#fbf7ee]">
                              Santri
                            </span>
                          </motion.button>
                        </div>

                        {/* Karpet Merah Sentral */}
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedZoneId('gerbang')}
                          title="Karpet Merah Sentral"
                          className={`w-7 sm:w-10 rounded-b-md border-x-2 border-b-2 bg-[#7a2218] hover:bg-[#8d2a1e] flex flex-col items-center justify-between py-1 transition-all duration-300 cursor-pointer ${getHighlightClass(
                            'gerbang'
                          )}`}
                        >
                          <div className="text-[6px] sm:text-[7px] text-amber-200 uppercase font-mono tracking-tighter">
                            ▲
                          </div>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-amber-300 bg-amber-400/80 my-0.5"></div>
                          <ArrowUp className="w-3.5 h-3.5 text-white animate-pulse" />
                        </motion.button>

                        {/* Santri Sisi Utara */}
                        <div className="flex-1 flex flex-col justify-between gap-1 sm:gap-1.5 pl-1">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedZoneId('santri')}
                            className={`w-full py-2 sm:py-2.5 rounded-md border bg-[#240e05] hover:bg-[#331407] text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                              'santri'
                            )}`}
                          >
                            <span className="text-[8px] sm:text-[10px] font-bold uppercase text-[#fbf7ee]">
                              Santri
                            </span>
                          </motion.button>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedZoneId('santri')}
                            className={`w-full py-2 sm:py-2.5 rounded-md border bg-[#240e05] hover:bg-[#331407] text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                              'santri'
                            )}`}
                          >
                            <span className="text-[8px] sm:text-[10px] font-bold uppercase text-[#fbf7ee]">
                              Santri
                            </span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SAYAP UTARA (RIGHT): Syanggit & WC Putra (Atas) / Lorong / Aligarh & WC Putra (Bawah) */}
                  <div className="w-16 sm:w-24 flex flex-col justify-between gap-1 text-[8px] sm:text-[10px] shrink-0">
                    {/* Atas: Syanggit + WC Putra */}
                    <div className="flex gap-1 h-[48%]">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedZoneId('syanggit')}
                        className={`w-1/2 rounded-md border bg-[#240e05] hover:bg-[#331407] text-[#fbf7ee] flex flex-col items-center justify-center p-0.5 text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                          'syanggit'
                        )}`}
                      >
                        <div className="[writing-mode:vertical-rl] text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-[#fbf7ee]">
                          SYANGGIT
                        </div>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedZoneId('wc-putra')}
                        className={`w-1/2 rounded-md border bg-[#291106] hover:bg-[#381808] text-amber-100 flex flex-col items-center justify-center p-0.5 text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                          'wc-putra'
                        )}`}
                      >
                        <div className="[writing-mode:vertical-rl] text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-amber-100">
                          WC PUTRA
                        </div>
                      </motion.button>
                    </div>

                    {/* Lorong Walkway */}
                    <div className="w-full text-center py-0.5 bg-[#e0d0b6] border border-[#b89e7c] rounded text-[7px] sm:text-[8px] font-mono font-bold uppercase text-[#472615]">
                      Lorong
                    </div>

                    {/* Bawah: Aligarh + WC Putra */}
                    <div className="flex gap-1 h-[48%]">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedZoneId('aligarh')}
                        className={`w-1/2 rounded-md border bg-[#240e05] hover:bg-[#331407] text-[#fbf7ee] flex flex-col items-center justify-center p-0.5 text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                          'aligarh'
                        )}`}
                      >
                        <div className="[writing-mode:vertical-rl] text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-[#fbf7ee]">
                          ALIGARH
                        </div>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedZoneId('wc-putra')}
                        className={`w-1/2 rounded-md border bg-[#291106] hover:bg-[#381808] text-amber-100 flex flex-col items-center justify-center p-0.5 text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                          'wc-putra'
                        )}`}
                      >
                        <div className="[writing-mode:vertical-rl] text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-amber-100">
                          WC PUTRA
                        </div>
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* 3. SEKTOR SELATAN BAWAH: ANDALUSIA & GERBANG */}
                <div className="w-full flex items-center justify-between gap-1 sm:gap-2 mb-1.5">
                  {/* Andalusia (Sayap Selatan) */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedZoneId('andalusia')}
                    className={`flex-1 py-1.5 sm:py-2.5 px-2 rounded-md border bg-[#240e05] hover:bg-[#331407] text-[#fbf7ee] text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                      'andalusia'
                    )}`}
                  >
                    <span className="text-[9px] sm:text-xs font-extrabold uppercase tracking-widest text-[#fbf7ee] block">
                      ANDALUSIA
                    </span>
                  </motion.button>

                  {/* Indikator Pintu Masuk */}
                  <div className="w-7 sm:w-10 flex flex-col items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-white border-2 border-amber-600 flex items-center justify-center shadow-sm">
                      <ArrowUp className="w-3.5 h-3.5 text-[#7a2218] stroke-[3]" />
                    </div>
                  </div>

                  {/* Andalusia (Sayap Utara) */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedZoneId('andalusia')}
                    className={`flex-1 py-1.5 sm:py-2.5 px-2 rounded-md border bg-[#240e05] hover:bg-[#331407] text-[#fbf7ee] text-center transition-all duration-300 cursor-pointer ${getHighlightClass(
                      'andalusia'
                    )}`}
                  >
                    <span className="text-[9px] sm:text-xs font-extrabold uppercase tracking-widest text-[#fbf7ee] block">
                      ANDALUSIA
                    </span>
                  </motion.button>
                </div>

                {/* Taman Bunga & Gerbang */}
                <div className="w-full flex items-center justify-between gap-1 sm:gap-2">
                  <div className="flex-1 h-2 sm:h-2.5 rounded-full bg-gradient-to-r from-[#214b1c] via-[#2f6628] to-[#214b1c] border border-[#a47b36]/70 shadow-sm flex items-center justify-around px-2">
                    <span className="text-[6px] text-amber-300">✿</span>
                    <span className="text-[5px] text-red-300">●</span>
                    <span className="text-[6px] text-amber-300">✿</span>
                  </div>

                  {/* Gerbang (Gate Entrance) */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedZoneId('gerbang')}
                    className={`px-3 py-1 rounded-t-md border-t-2 border-x-2 bg-[#331508] border-amber-500/70 text-center cursor-pointer transition-all duration-300 shadow-md ${getHighlightClass(
                      'gerbang'
                    )}`}
                  >
                    <div className="text-[9px] sm:text-xs font-cinzel font-bold text-amber-200 tracking-wider uppercase">
                      Gerbang
                    </div>
                  </motion.button>

                  <div className="flex-1 h-2 sm:h-2.5 rounded-full bg-gradient-to-r from-[#214b1c] via-[#2f6628] to-[#214b1c] border border-[#a47b36]/70 shadow-sm flex items-center justify-around px-2">
                    <span className="text-[6px] text-amber-300">✿</span>
                    <span className="text-[5px] text-red-300">●</span>
                    <span className="text-[6px] text-amber-300">✿</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Legend Guide under the Blueprint */}
            <div className="w-full max-w-[640px] bg-[#050505]/90 border border-amber-500/15 rounded-2xl p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/90 font-semibold block">
                  PANDUAN CEPAT ZONA ACARA:
                </span>
                <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                  Pilih untuk menyorot denah
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-gray-300">
                {LEGEND_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedZoneId(item.id)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors text-left"
                  >
                    <span className={`w-3 h-3 rounded-sm shrink-0 border ${item.dotColor}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Luxurious Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none z-10">
        <div className="absolute -bottom-2 left-1/4 right-1/4 h-4 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent blur-md" />
        <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent shadow-[0_0_12px_rgba(245,158,11,0.4)]" />
      </div>
    </section>
  );
};

export default VenueMapSection;
