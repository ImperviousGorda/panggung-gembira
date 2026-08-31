import React, { useState, useRef, useEffect } from 'react';
import { Download, Send, Sparkles, Ticket, QrCode, Image as ImageIcon, Award, Share2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import shieldLogoImg from '../assets/images/logo_1_2.png';
import ribbonCocoaImg from '../assets/images/Ribbon Cocoa (1).webp';
import ribbonKremImg from '../assets/images/Ribbon Krem.webp';

gsap.registerPlugin(ScrollTrigger);

interface FlyerSectionProps {
  onShowToast: (msg: string) => void;
}

export const FlyerSection: React.FC<FlyerSectionProps> = ({ onShowToast }) => {
  const [guestName, setGuestName] = useState('Irgi Faisal Jaka Alghani');
  const [guestRole, setGuestRole] = useState('Tamu Undangan');
  const [flyerTheme, setFlyerTheme] = useState<'gold' | 'brown'>('gold');
  const [isGenerating, setIsGenerating] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const flyerCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header Animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 35, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      }

      // Left Text Block Animation
      if (leftContentRef.current) {
        gsap.fromTo(
          leftContentRef.current,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            delay: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      }

      // Right Preview Card Animation
      if (rightCardRef.current) {
        gsap.fromTo(
          rightCardRef.current,
          { opacity: 0, x: 40, scale: 0.96 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.9,
            delay: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const roleOptions = [
    'Tamu Undangan',
    'Alumni Gontor',
    'Wali Santri',
    'Santri Gontor',
    'Siswa Akhir KMI 6101',
  ];

  const generateAndDownloadPNG = async (): Promise<boolean> => {
    if (!flyerCardRef.current) return false;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(flyerCardRef.current, {
        cacheBust: true,
        quality: 0.98,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `Flyer-Panggung-Gembira-6101-${guestName.replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();

      // Trigger Confetti Celebration
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#fef4db', '#fbbf24', '#8a6f27'],
      });

      onShowToast('Greeting Card berhasil diunduh dalam format HD!');
      return true;
    } catch (err) {
      console.error('Error generating flyer image:', err);
      onShowToast('Gagal membuat gambar poster. Silakan coba lagi.');
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPNG = async () => {
    await generateAndDownloadPNG();
  };

  const getShareUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('guest', guestName);
    url.searchParams.set('role', guestRole);
    return url.toString();
  };

  const handleShareWhatsApp = () => {
    const message = `✨ *GREETING CARD PANGGUNG GEMBIRA 6101* ✨\n\nKepada Yth. *${guestName}* (${guestRole})\n\nMari menjadi bagian dari malam mahakarya peradaban seni & pendidikan santri termegah di *Pondok Modern Darussalam Gontor Kampus 2*.\n\n📍 *Lokasi:* Lapangan Utama PMDG Kampus 2\n⏱️ *Waktu:* 20:00 WIB - Selesai\n\nBuka kartu undangan & flyer khusus di sini:\n${getShareUrl()}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    onShowToast('Membuka WhatsApp...');
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: 'Flyer Greeting Card Panggung Gembira 6101',
      text: `Greeting Card Panggung Gembira 6101 KMI Gontor Kampus 2 untuk ${guestName}`,
      url: getShareUrl(),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onShowToast('Greeting Card berhasil dibagikan!');
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      onShowToast('Fitur berbagi tidak didukung pada peramban ini.');
    }
  };

  return (
    <section ref={sectionRef} className="relative z-20 w-full py-16 px-6 lg:px-16 bg-[#040404] text-amber-100 border-y border-amber-500/15 overflow-hidden" id="flyer-section">
      {/* Top & Bottom Hairline Glowing Dividers */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent pointer-events-none" />

      {/* Background Ornate Glows & Spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(212,175,55,0.07)_0%,_rgba(0,0,0,0)_70%)] blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-700/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Shareable Flyer</span>
          </div>
          <h2 className="font-amagro text-3xl sm:text-4xl lg:text-5xl text-amber-100 font-bold gold-glow">
            OFFICIAL GREETING CARD
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT SIDE: Pure Text & Invitation Words */}
          <div ref={leftContentRef} className="lg:col-span-5 space-y-6 text-left" id="flyer-text-left">
            <div className="space-y-4">

              <div className="w-16 h-[2px] bg-gradient-to-r from-amber-500 to-transparent" />

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
                Selamat datang kepada Bapak/Ibu, Alumni, Wali Santri, Santri Gontor, serta seluruh Sahabat Panggung Gembira 6101. Merupakan kebahagiaan bagi kami dapat menyambut kehadiran Anda dalam Pagelaran Seni Siswa Akhir Impervious Generation di Pondok Modern Darussalam Gontor Kampus 2.
              </p>

              <p className="text-amber-200/90 text-xs sm:text-sm leading-relaxed italic bg-[#1f140b]/60 border-l-2 border-amber-500/60 p-4 rounded-r-xl">
                "Pendidikan Kunci Kejayaan"
              </p>

              <p className="text-gray-400 text-xs leading-relaxed font-light">
                Tuliskan nama Anda pada kolom untuk membuat Official Greeting Card berornamen Emas & Coklat Gelap Elegan. Unduh dalam format HD atau bagikan langsung kepada yang lainnya.
              </p>
            </div>

            {/* Action Buttons Group */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadPNG}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-[#d4af37] via-[#fef4db] to-[#8a6f27] hover:from-amber-400 hover:to-amber-500 text-black font-bold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2.5 text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Mengolah Gambar HD...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4.5 h-4.5" />
                    <span>Unduh Greeting Card (PNG HD)</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  disabled={isGenerating}
                  className="bg-[#24170d] hover:bg-[#322012] border border-amber-500/30 text-amber-200 font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kirim WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  disabled={isGenerating}
                  className="bg-[#1a1007] hover:bg-[#28190c] border border-amber-500/30 text-amber-200 font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bagikan</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Interactive Flyer Preview & Controls (Gold & Dark Brown ONLY) */}
          <div ref={rightCardRef} className="lg:col-span-7 flex flex-col items-center justify-center space-y-6">

            {/* Input Form Controls for Customizing Name & Status */}
            <div className="w-full max-w-md bg-[#181008] border border-amber-500/30 rounded-2xl p-5 shadow-[0_4px_30px_rgba(0,0,0,0.8)] backdrop-blur-md space-y-4 text-left">
              <h4 className="font-amagro text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center space-x-2 border-b border-amber-500/20 pb-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Tuliskan Namamu Disini</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Input Name */}
                <div className="space-y-1">
                  <label className="text-[11px] text-amber-200/80 font-medium">Nama Anda:</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    maxLength={32}
                    placeholder="Tuliskan Nama Anda..."
                    className="w-full bg-[#0d0804] border border-amber-500/30 focus:border-amber-400 text-amber-100 text-xs rounded-lg px-3 py-2 outline-none transition-all focus:ring-1 focus:ring-amber-400/50"
                  />
                </div>

                {/* Select Role */}
                <div className="space-y-1">
                  <label className="text-[11px] text-amber-200/80 font-medium">Kategori / Status:</label>
                  <select
                    value={guestRole}
                    onChange={(e) => setGuestRole(e.target.value)}
                    className="w-full bg-[#0d0804] border border-amber-500/30 focus:border-amber-400 text-amber-100 text-xs rounded-lg px-3 py-2 outline-none transition-all cursor-pointer"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role} className="bg-[#181008] text-amber-100">
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Theme Selector */}
                <div className="space-y-1 sm:col-span-2 pt-2 border-t border-amber-500/20">
                  <label className="text-[11px] text-amber-200/80 font-medium block">Pilih Tema & Warna Kartu:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFlyerTheme('gold')}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                        flyerTheme === 'gold'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                          : 'bg-[#0d0804] border-amber-500/20 text-gray-400 hover:text-amber-200'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#fef4db] via-[#d4af37] to-[#8a6f27] border border-amber-300/50" />
                      <span>Emas Royal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFlyerTheme('brown')}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                        flyerTheme === 'brown'
                          ? 'bg-amber-900/40 border-amber-500 text-amber-200 shadow-[0_0_12px_rgba(180,95,35,0.35)]'
                          : 'bg-[#0d0804] border-amber-500/20 text-gray-400 hover:text-amber-200'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#ffe4c4] via-[#e5a059] to-[#4a240d] border border-amber-400/50" />
                      <span>Coklat Gelap Elegan</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Printable Poster Canvas (Strictly Gold & Dark Brown Palette) */}
            <div className="relative flex flex-col items-center">
              <p className="text-[10px] text-amber-400/80 uppercase font-mono tracking-widest flex items-center space-x-1 mb-2">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Tinjauan Hasil Kartu ({flyerTheme === 'gold' ? 'Emas Royal' : 'Coklat Gelap Elegan'})</span>
              </p>

              {/* Printable Canvas Captured by html-to-image */}
              <div
                ref={flyerCardRef}
                className={`relative w-full max-w-sm rounded-2xl p-6 border text-center space-y-5 overflow-hidden select-none transition-all duration-300 ${
                  flyerTheme === 'brown'
                    ? 'border-[#c89355]/60 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#432512] via-[#241308] to-[#130903] shadow-[0_0_60px_rgba(165,85,25,0.35)]'
                    : 'border-amber-500/40 bg-gradient-to-b from-[#1c120a] via-[#0f0a05] to-[#25170d] shadow-[0_0_50px_rgba(212,175,55,0.2)]'
                }`}
              >
                {/* Ambient Glow Background Effects */}
                <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full blur-2xl pointer-events-none ${flyerTheme === 'brown' ? 'bg-[#c89355]/20' : 'bg-amber-500/10'}`} />
                <div className={`absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full blur-2xl pointer-events-none ${flyerTheme === 'brown' ? 'bg-amber-900/30' : 'bg-amber-700/10'}`} />

                {/* Top Header Crest */}
                <div className="flex items-center justify-between border-b border-amber-500/25 pb-3">
                  <div className="flex items-center space-x-2 text-left">
                    <img 
                      src={shieldLogoImg} 
                      alt="Logo Crest" 
                      loading="eager"
                      decoding="async"
                      className="w-6 h-6 object-contain drop-shadow" 
                      referrerPolicy="no-referrer" 
                    />
                    <div>
                      <span className={`block text-[10px] font-bold uppercase tracking-widest leading-none ${flyerTheme === 'brown' ? 'text-[#fce4cb]' : 'text-amber-200'}`}>
                        PMDG KAMPUS 2
                      </span>
                      <span className={`block text-[8px] font-mono tracking-wider ${flyerTheme === 'brown' ? 'text-[#d89f67]' : 'text-amber-400/70'}`}>
                        SISWA AKHIR KMI 6101
                      </span>
                    </div>
                  </div>

                  <div className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase tracking-widest ${
                    flyerTheme === 'brown'
                      ? 'bg-[#3d200e] border-[#c89355]/50 text-[#f7d5a5]'
                      : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  }`}>
                    M M X V I I
                  </div>
                </div>

                {/* Main Title Group */}
                <div className="space-y-1 py-1">
                  <span className={`text-[9px] uppercase tracking-[0.3em] font-semibold block ${flyerTheme === 'brown' ? 'text-[#e5aa70]' : 'text-amber-400/90'}`}>
                    GREETING CARD
                  </span>
                  <h2 className={`font-amagro text-3xl font-black tracking-wider text-transparent bg-clip-text ${
                    flyerTheme === 'brown'
                      ? 'bg-gradient-to-r from-[#fff5ea] via-[#f7c897] to-[#b86d2a] drop-shadow-[0_2px_12px_rgba(180,95,35,0.6)]'
                      : 'bg-gradient-to-r from-[#fef4db] via-[#d4af37] to-[#8a6f27] drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]'
                  }`}>
                    PANGGUNG
                  </h2>
                  <h2 className={`font-amagro text-2xl font-black tracking-widest text-transparent bg-clip-text ${
                    flyerTheme === 'brown'
                      ? 'bg-gradient-to-r from-[#fff5ea] via-[#f7c897] to-[#b86d2a] drop-shadow-[0_2px_12px_rgba(180,95,35,0.6)]'
                      : 'bg-gradient-to-r from-[#fef4db] via-[#d4af37] to-[#8a6f27] drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]'
                  }`}>
                    GEMBIRA 6101
                  </h2>
                  <p className={`text-[10px] font-light italic max-w-xs mx-auto ${flyerTheme === 'brown' ? 'text-[#ebd2b9]' : 'text-amber-100/80'}`}>
                    "Menegakkan Pendidikan Holistik, Menuju Pusat Peradaban Dunia"
                  </p>
                </div>

                {/* Gold Gradient Line */}
                <div className={`h-[1px] w-full bg-gradient-to-r ${
                  flyerTheme === 'brown'
                    ? 'from-transparent via-[#c89355]/50 to-transparent'
                    : 'from-transparent via-amber-500/40 to-transparent'
                }`} />

                {/* Guest Personal Ticket Badge */}
                <div className={`p-3.5 rounded-xl border text-center space-y-1 relative shadow-inner ${
                  flyerTheme === 'brown'
                    ? 'border-[#c89355]/50 bg-gradient-to-b from-[#3a1d0d] to-[#251207] shadow-[inset_0_1px_6px_rgba(0,0,0,0.5)]'
                    : 'border-amber-500/35 bg-[#20140a]'
                }`}>
                  <div className="absolute top-2 right-2 opacity-40">
                    <Ticket className={`w-4 h-4 ${flyerTheme === 'brown' ? 'text-[#e5aa70]' : 'text-amber-400'}`} />
                  </div>
                  <span className={`text-[9px] uppercase font-mono tracking-widest block ${flyerTheme === 'brown' ? 'text-[#dfab78]' : 'text-amber-300/70'}`}>
                    DIPERSEMBAHKAN KHUSUS UNTUK
                  </span>
                  <p className={`font-amagro text-lg font-bold truncate tracking-wide ${flyerTheme === 'brown' ? 'text-[#fff3e7]' : 'text-amber-100'}`}>
                    {guestName || 'Nama Tamu Undangan'}
                  </p>
                  <div className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-semibold tracking-wider uppercase ${
                    flyerTheme === 'brown'
                      ? 'bg-[#180b04] border-[#d89e5e]/50 text-[#f7caa1]'
                      : 'bg-[#0f0904] border border-amber-500/40 text-amber-300'
                  }`}>
                    {guestRole}
                  </div>
                </div>

                {/* Decorative Ribbon Artwork (Natural Printed Element) */}
                <div className="relative -my-1 -mx-6 z-10 flex justify-center items-center pointer-events-none">
                  <img
                    src={flyerTheme === 'brown' ? ribbonCocoaImg : ribbonKremImg}
                    alt="Panggung Gembira Ribbon"
                    loading="eager"
                    decoding="async"
                    className="w-full h-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)] transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Event Schedule Details */}
                <div className={`grid grid-cols-2 gap-2 text-left border p-3 rounded-xl text-[10px] ${
                  flyerTheme === 'brown'
                    ? 'bg-[#1d0d04]/90 border-[#c89355]/35'
                    : 'bg-[#140c06] border-amber-500/20'
                }`}>
                  <div className="space-y-0.5">
                    <span className={`font-semibold block uppercase ${flyerTheme === 'brown' ? 'text-[#eabb88]' : 'text-amber-400'}`}>Waktu:</span>
                    <span className={`block font-light ${flyerTheme === 'brown' ? 'text-[#f5ded0]' : 'text-amber-100/80'}`}>Sabtu Malam Minggu</span>
                    <span className={`font-mono block ${flyerTheme === 'brown' ? 'text-[#f7d1a5]' : 'text-amber-300'}`}>20:00 WIB - Selesai</span>
                  </div>
                  <div className={`space-y-0.5 border-l pl-2.5 ${flyerTheme === 'brown' ? 'border-[#c89355]/30' : 'border-amber-500/25'}`}>
                    <span className={`font-semibold block uppercase ${flyerTheme === 'brown' ? 'text-[#eabb88]' : 'text-amber-400'}`}>Lokasi:</span>
                    <span className={`block font-light ${flyerTheme === 'brown' ? 'text-[#f5ded0]' : 'text-amber-100/80'}`}>Lapangan Utama</span>
                    <span className={`block font-medium ${flyerTheme === 'brown' ? 'text-[#f7d1a5]' : 'text-amber-300'}`}>PMDG Kampus 2</span>
                  </div>
                </div>

                {/* Bottom Stamp / Validation */}
                <div className={`flex items-center justify-between text-[9px] font-mono border-t pt-2.5 ${
                  flyerTheme === 'brown'
                    ? 'border-[#c89355]/30 text-[#eab582]'
                    : 'border-amber-500/20 text-amber-400/80'
                }`}>
                  <div className={`flex items-center space-x-1 ${flyerTheme === 'brown' ? 'text-[#eab582]' : 'text-amber-400'}`}>
                    <QrCode className="w-3.5 h-3.5" />
                    <span>PG6ZA-VALIDATED</span>
                  </div>
                  <span className={flyerTheme === 'brown' ? 'text-[#d89e67]' : 'text-amber-300/80'}>panggunggembira6101</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
