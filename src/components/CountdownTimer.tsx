import { useState, useEffect } from 'react';

export default function CountdownTimer() {
  // Target date: August 24, 2026 at 19:00:00 (WIB/Local time)
  const targetDate = new Date('September 13, 2026 19:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
        });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: d < 10 ? `0${d}` : `${d}`,
        hours: h < 10 ? `0${h}` : `${h}`,
        minutes: m < 10 ? `0${m}` : `${m}`,
        seconds: s < 10 ? `0${s}` : `${s}`,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="space-y-3 pt-2">
      <p className="text-xs tracking-[0.2em] text-amber-100/90 font-semibold uppercase">
        HITUNG MUNDUR MENUJU MALAM PERDANA
      </p>
      <div className="flex space-x-3">
        {/* Days card */}
        <div className="text-center bg-zinc-950/90 backdrop-blur-xl rounded-lg p-2.5 min-w-[65px] lg:min-w-[75px] gold-card-glow hover:border-amber-400 transition-all duration-300 group">
          <span className="font-amagro text-lg lg:text-xl font-bold text-amber-300 block group-hover:text-amber-100 transition-colors">
            {timeLeft.days}
          </span>
          <span className="text-[8px] tracking-widest text-gray-500 uppercase font-medium">Hari</span>
        </div>

        {/* Hours card */}
        <div className="text-center bg-zinc-950/90 backdrop-blur-xl rounded-lg p-2.5 min-w-[65px] lg:min-w-[75px] gold-card-glow hover:border-amber-400 transition-all duration-300 group">
          <span className="font-amagro text-lg lg:text-xl font-bold text-amber-300 block group-hover:text-amber-100 transition-colors">
            {timeLeft.hours}
          </span>
          <span className="text-[8px] tracking-widest text-gray-500 uppercase font-medium">Jam</span>
        </div>

        {/* Minutes card */}
        <div className="text-center bg-zinc-950/90 backdrop-blur-xl rounded-lg p-2.5 min-w-[65px] lg:min-w-[75px] gold-card-glow hover:border-amber-400 transition-all duration-300 group">
          <span className="font-amagro text-lg lg:text-xl font-bold text-amber-300 block group-hover:text-amber-100 transition-colors">
            {timeLeft.minutes}
          </span>
          <span className="text-[8px] tracking-widest text-gray-500 uppercase font-medium">Menit</span>
        </div>

        {/* Seconds card */}
        <div className="text-center bg-zinc-950/90 backdrop-blur-xl rounded-lg p-2.5 min-w-[65px] lg:min-w-[75px] gold-card-glow hover:border-amber-400 transition-all duration-300 group">
          <span className="font-amagro text-lg lg:text-xl font-bold text-amber-400 block group-hover:text-amber-200 transition-colors">
            {timeLeft.seconds}
          </span>
          <span className="text-[8px] tracking-widest text-gray-500 uppercase font-medium">Detik</span>
        </div>
      </div>
    </div>
  );
}
