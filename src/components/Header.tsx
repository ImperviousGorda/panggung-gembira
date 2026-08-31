import shieldLogoImg from "../assets/images/logo_1_2.png";

export default function Header() {
  return (
    <header id="header-nav" className="relative z-30 w-full px-6 lg:px-16 py-5 flex items-center justify-between border-b border-amber-950/40 bg-black/75 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center space-x-3">
        {/* Top Left Logo Crest */}
        <div className="w-10 h-10 border border-amber-500/30 rounded-full flex items-center justify-center overflow-hidden bg-black/80 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:border-amber-400/80 transition-all duration-500 hover:scale-105">
          <img 
            src={shieldLogoImg} 
            alt="Panggung Gembira Shield" 
            loading="lazy"
            decoding="async"
            className="w-8 h-8 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h1 className="font-amagro text-sm lg:text-base font-bold tracking-[0.15em] text-amber-100 gold-glow leading-none">
            PANGGUNG GEMBIRA
          </h1>
          <p className="font-amagro text-[8px] tracking-[0.25em] text-amber-500 uppercase font-semibold mt-0.5">
            THE ABSOLUTE SPECTACLE
          </p>
        </div>
      </div>
    </header>
  );
}
