import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { Calendar, Clock, MapPin, Play, X, Send, Film, Sparkles, ChevronLeft, ChevronRight, Volume2, Mic, Drama, Music, Languages, Heart, MessageCircle, Bookmark, Share2, Star, ThumbsUp, Users, MessageSquare, User, GraduationCap, ChevronDown, Feather, Trash2, ShieldCheck, Pin } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import Header from './components/Header';
import ParticleBackdrop from './components/ParticleBackdrop';
import ShieldLogo from './components/ShieldLogo';
import CountdownTimer from './components/CountdownTimer';
import CinematicPreloader from './components/CinematicPreloader';
import CustomCursor from './components/CustomCursor';
import { FlyerSection } from './components/FlyerSection';
import Footer from './components/Footer';
import { ContactFormData, ShowBabak } from './types';

// Import Logo Shard Images for Philosophy Section
import shard1 from './assets/pecahanLogo/permata.webp';
import shard3 from './assets/pecahanLogo/lubang.webp';
import shard4 from './assets/pecahanLogo/pg.webp';
import shard5 from './assets/pecahanLogo/bingkai.webp';
import shard6 from './assets/pecahanLogo/kubah.webp';
import shard10 from './assets/pecahanLogo/101.webp';
import ribbonKrem from './assets/images/Ribbon Krem.webp';
import ribbonCocoa from './assets/images/Ribbon Cocoa (1).webp';

// Import Generated Images for Elegant Gallery
import pgStage from './assets/images/panggung_gembira_stage_1782925679901.jpg';
import pgDance from './assets/images/panggung_gembira_dance_1782925693913.jpg';
import pgMusic from './assets/images/panggung_gembira_music_1782925708543.jpg';
import shieldLogoImg from './assets/images/logo_1_2.png';

const philosophyItems = [
  {
    id: '01',
    image: shard1,
    title: 'Permata 1',
    description: 'Permata tunggal melambangkan konsep tauhid sebagai ajaran pokok peradaban Islam.',
  },
  {
    id: '02',
    image: shard6,
    title: 'Kubah Masjid dan Lingkaran',
    description: 'Kubah masjid di puncak logo adalah simbol peradaban Islam, tingkat peradaban tertinggi yang menjadi cita-cita akhir umat muslim.',
  },
  {
    id: '03',
    image: shard3,
    title: 'Lubang Kunci',
    description: 'Melambangkan pintu menuju kejayaan umat, ketika nilai-nilai Islam dijadikan pondasi, umat pun mencapai puncak peradaban dunia.',
  },
  {
    id: '04',
    image: shard4,
    title: "Monogram 'P' dan 'G'",
    description: "Monogram 'PG' berbentuk ornamen arabesque, yang simetris melambangkan pergerakan yang dinamis dan terorganisir.",
  },
  {
    id: '05',
    image: shard5,
    title: 'Bingkai dan Ornamen',
    description: 'Bingkai melambangkan integrasi dari seluruh aspek penyelenggaraan acara.',
  },
  {
    id: '06',
    image: shard10,
    title: 'Angka 101',
    description: 'Melambangkan Siswa Kelas 6 di umur pondok yang ke- 101.',
  },
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 150 : -150,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 260, damping: 26 },
      opacity: { duration: 0.25 },
      scale: { duration: 0.25 },
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -150 : 150,
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: 'spring', stiffness: 260, damping: 26 },
      opacity: { duration: 0.25 },
      scale: { duration: 0.25 },
    },
  }),
};

interface ReviewItem {
  id: string;
  name: string;
  role: string;
  time: string;
  rating: number;
  type: 'ulasan' | 'saran';
  text: string;
  avatar?: string;
  isPermanent?: boolean;
}

const pinnedExampleReviews: ReviewItem[] = [
  {
    id: 'sample-permanent-3',
    name: 'Rabbani AR',
    role: 'Final Grade Student',
    time: 'Official Note',
    rating: 5,
    type: 'ulasan',
    text: 'Ucapan Terima Kasih atas dukungannya kepada : Ust.Iqbal Husyen, Ust.Hafizh Annafi, Elang Nayantoko, Naufal Althaf, dan Athar Rizqy',
    isPermanent: true,
  }
];

const initialReviews: ReviewItem[] = pinnedExampleReviews;

const galleryItems = [
  {
    title: 'Panggung Utama Mahakarya',
    brand: '@pg2.official',
    subtitle: 'Indonesia',
    category: 'Panggung' as const,
    image: pgStage,
    likes: 2027,
    overlayStyle: 'editorial-typography',
    overlayTextTop: 'MAHAKARYA BORN',
    overlayTextMiddle: 'among legends',
    overlayTextBottom: 'AND GREAT masters',
    description: 'Kemegahan desain panggung utama berhias kaligrafi raksasa, tata cahaya spektakuler, dan kubah megah sebagai poros pertunjukan.',
  },
  {
    title: 'Sajak Selaras Nusantara',
    brand: '@pg2.official',
    subtitle: 'Ponorogo',
    category: 'Pentas' as const,
    image: pgDance,
    likes: 5743,
    isGrayscale: true,
    description: 'Tari kolosal gabungan etnis Nusantara mengekspresikan kesatuan perjuangan santri dalam keberagaman budaya Indonesia.',
  },
  {
    title: 'Harmoni Simfoni Gontor',
    brand: '@pg2.official',
    subtitle: 'Indonesia',
    category: 'Musik' as const,
    image: pgMusic,
    likes: 6101,
    overlayStyle: 'badge-headline',
    badge: 'Panggung Gembira 6101',
    headline: 'TRIONFO AI PREMI SINTESA 2026!',
    description: 'Kolaborasi orkestra klasik, hadrah modern, dan paduan suara membawakan melodi perjuangan menegakkan nilai pondok.',
  },
  {
    title: 'Seni Kaligrafi Kontemporer',
    brand: '@pg2.official',
    subtitle: 'Gontor 2',
    category: 'Seni' as const,
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800',
    likes: 3009,
    description: "Goresan indah ayat suci Al-Qur'an berpadu dengan lukisan abstrak kontemporer yang dibuat langsung oleh tangan kreatif para santri.",
  },
  {
    title: 'Teatrikal Sejarah Peradaban',
    brand: '@pg2.official',
    subtitle: 'Indonesia',
    category: 'Pentas' as const,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    likes: 5100,
    overlayStyle: 'editorial-typography',
    overlayTextTop: 'SENI DITEMPA',
    overlayTextMiddle: 'di bumi gontor',
    overlayTextBottom: 'UNTUK PERADABAN',
    description: 'Kisah epik perjuangan pahlawan peradaban Islam dalam balutan drama teatrikal kolosal dengan properti panggung raksasa.',
  },
  {
    title: 'Dinamika Laga Bela Diri',
    brand: '@pg2.official',
    subtitle: 'Ponorogo',
    category: 'Pentas' as const,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    likes: 3120,
    isGrayscale: true,
    description: 'Ketangkasan fisik berpadu dalam keindahan jurus pencak silat, senam formasi, lompat api, dan atraksi kekuatan santri.',
  },
  {
    title: 'Simfoni Cahaya Malam',
    brand: '@pg2.official',
    subtitle: 'Gontor 2',
    category: 'Panggung' as const,
    image: pgStage,
    likes: 4200,
    overlayStyle: 'badge-headline',
    badge: 'MAHAKARYA PERADABAN',
    headline: 'GEMA SIMFONI HASIL DEDIKASI!',
    description: 'Tata panggung spektakuler dengan permainan sinar laser dan lampu sorot tematik mengangkasa ke langit malam Ponorogo.',
  },
  {
    title: 'Gelora Tari Persada',
    brand: '@pg2.official',
    subtitle: 'Indonesia',
    category: 'Pentas' as const,
    image: pgDance,
    likes: 2650,
    description: 'Harmoni gerak dan irama yang menceritakan perjalanan generasi perintis dalam membina peradaban luhur.',
  },
];

export default function App() {
  // Scroll-driven wipe effect for Ribbon
  const ribbonRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ribbonRef,
    offset: ["start end", "end start"]
  });

  // Map the scroll progress to clip-path and opacity to make it sync perfectly with scroll
  const ribbonClipPath = useTransform(
    scrollYProgress,
    [0.1, 0.45],
    ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"]
  );
  
  const ribbonOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.3],
    [0, 1]
  );

  // Scroll-driven wipe effect for Cocoa Ribbon below gallery
  const cocoaRibbonRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: cocoaRibbonScrollProgress } = useScroll({
    target: cocoaRibbonRef,
    offset: ["start end", "end start"]
  });

  const cocoaRibbonClipPath = useTransform(
    cocoaRibbonScrollProgress,
    [0.1, 0.45],
    ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"]
  );

  const cocoaRibbonOpacity = useTransform(
    cocoaRibbonScrollProgress,
    [0.1, 0.3],
    [0, 1]
  );

  // Scroll-driven background animations for philosophy sections
  const aboutSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: aboutScrollProgress } = useScroll({
    target: aboutSectionRef,
    offset: ["start end", "end start"]
  });

  const aboutBgRotate1 = useTransform(aboutScrollProgress, [0, 1], [0, 120]);
  const aboutBgRotate2 = useTransform(aboutScrollProgress, [0, 1], [360, 240]);
  const aboutBgY1 = useTransform(aboutScrollProgress, [0, 1], [-60, 60]);
  const aboutBgY2 = useTransform(aboutScrollProgress, [0, 1], [60, -60]);

  const logoPhilosophyRef = useRef<HTMLElement>(null);
  const { scrollYProgress: logoScrollProgress } = useScroll({
    target: logoPhilosophyRef,
    offset: ["start end", "end start"]
  });

  const logoBgRotate1 = useTransform(logoScrollProgress, [0, 1], [-20, 60]);
  const logoBgRotate2 = useTransform(logoScrollProgress, [0, 1], [90, -10]);
  const logoBgY1 = useTransform(logoScrollProgress, [0, 1], [-80, 80]);
  const logoBgY2 = useTransform(logoScrollProgress, [0, 1], [80, -80]);

  // Scroll-driven background animations for gallery section
  const gallerySectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: galleryScrollProgress } = useScroll({
    target: gallerySectionRef,
    offset: ["start end", "end start"]
  });

  const galleryBgRotate1 = useTransform(galleryScrollProgress, [0, 1], [10, 110]);
  const galleryBgRotate2 = useTransform(galleryScrollProgress, [0, 1], [120, 20]);
  const galleryBgY1 = useTransform(galleryScrollProgress, [0, 1], [-50, 50]);
  const galleryBgY2 = useTransform(galleryScrollProgress, [0, 1], [50, -50]);

  // Scroll-driven background animations for reviews section
  const reviewsSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: reviewsScrollProgress } = useScroll({
    target: reviewsSectionRef,
    offset: ["start end", "end start"]
  });

  const reviewsBgRotate1 = useTransform(reviewsScrollProgress, [0, 1], [-20, 80]);
  const reviewsBgRotate2 = useTransform(reviewsScrollProgress, [0, 1], [100, -10]);
  const reviewsBgY1 = useTransform(reviewsScrollProgress, [0, 1], [-60, 60]);
  const reviewsBgY2 = useTransform(reviewsScrollProgress, [0, 1], [60, -60]);

  // Modal & Gallery visibility states
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isFeaturedEventsModalOpen, setIsFeaturedEventsModalOpen] = useState(false);

  // Gallery & Toast states
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | 'Panggung' | 'Pentas' | 'Musik' | 'Seni'>('Semua');
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [likedItems, setLikedItems] = useState<Record<number, boolean>>({});
  const [savedItems, setSavedItems] = useState<Record<number, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Lock background scroll when any modal is active
  useEffect(() => {
    const isAnyModalOpen =
      isContactOpen ||
      isDetailsOpen ||
      isTrailerOpen ||
      isFeaturedEventsModalOpen ||
      activeImageIndex !== null;

    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isContactOpen, isDetailsOpen, isTrailerOpen, isFeaturedEventsModalOpen, activeImageIndex]);

  // Scroll to flyer section if URL contains invitation parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('guest') || params.has('flyer')) {
      const guestNameParam = params.get('guest');
      const flyerEl = document.getElementById('flyer-section');
      if (flyerEl) {
        flyerEl.scrollIntoView({ behavior: 'smooth' });
      }
      if (guestNameParam) {
        showToast(`Selamat datang, ${guestNameParam}! Undangan khusus Anda dapat dilihat di bawah.`);
      }
    }
  }, []);

  // Reviews states synced with Firebase Firestore in real-time
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(initialReviews);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const now = Date.now();
          const fetched: ReviewItem[] = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            let displayTime = data.time || 'Baru saja';
            if (data.createdAt && typeof data.createdAt === 'number') {
              const diffMinutes = Math.floor((now - data.createdAt) / (1000 * 60));
              if (diffMinutes < 1) {
                displayTime = 'Baru saja';
              } else if (diffMinutes < 60) {
                displayTime = `${diffMinutes} mnt lalu`;
              } else {
                const diffHours = Math.floor(diffMinutes / 60);
                if (diffHours < 24) {
                  displayTime = `${diffHours} jam lalu`;
                } else {
                  const diffDays = Math.floor(diffHours / 24);
                  displayTime = `${diffDays} hari lalu`;
                }
              }
            }
            return {
              id: docSnap.id,
              name: data.name || 'Pengunjung',
              role: data.role || 'Penonton',
              time: displayTime,
              rating: Number(data.rating) || 5,
              type: (data.type === 'saran' ? 'saran' : 'ulasan') as 'ulasan' | 'saran',
              text: data.text || '',
              isPermanent: false
            };
          });
          // Gabungkan ulasan pinned resmi (yang tidak bisa dihapus) dengan ulasan real-time dari Firestore
          setReviewsList([...pinnedExampleReviews, ...fetched]);
        } else {
          setReviewsList(pinnedExampleReviews);
        }
      }, (error) => {
        console.warn('Firestore subscription status:', error.message);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Error connecting to Firestore:', e);
    }
  }, []);

  const [reviewTab, setReviewTab] = useState<'semua' | 'ulasan' | 'saran'>('semua');
  const [reviewSort, setReviewSort] = useState<'terbaru' | 'lama' | 'rating'>('terbaru');
  const [visibleReviewCount, setVisibleReviewCount] = useState<number>(8);

  // New review form states
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewType, setNewReviewType] = useState<'ulasan' | 'saran'>('ulasan');
  const [newReviewText, setNewReviewText] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim() || isSubmittingReview) return;

    setIsSubmittingReview(true);
    const newEntry = {
      name: newReviewName.trim(),
      role: newReviewRole.trim() || 'Penonton',
      time: 'Baru saja',
      rating: newReviewRating,
      type: newReviewType,
      text: newReviewText.trim(),
      createdAt: Date.now()
    };

    try {
      await addDoc(collection(db, 'reviews'), newEntry);
      setNewReviewName('');
      setNewReviewRole('');
      setNewReviewRating(5);
      setNewReviewText('');
      showToast('Terima kasih! Ulasan kamu telah tersimpan ke database publik.');
    } catch (err) {
      console.error('Error adding review to Firestore:', err);
      const localEntry: ReviewItem = {
        id: Date.now().toString(),
        name: newEntry.name,
        role: newEntry.role,
        time: newEntry.time,
        rating: newEntry.rating,
        type: newReviewType,
        text: newEntry.text,
      };
      setReviewsList(prev => [localEntry, ...prev]);
      setNewReviewName('');
      setNewReviewRole('');
      setNewReviewRating(5);
      setNewReviewText('');
      showToast('Ulasan kamu telah tersimpan secara lokal.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = reviewsList.find(item => item.id === id);
    if (target?.isPermanent) {
      showToast('Ulasan resmi ini tersemat permanen dan tidak dapat dihapus.');
      return;
    }
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (err) {
      console.error('Error deleting review from Firestore:', err);
    }
    setReviewsList(prev => prev.filter(item => item.id !== id));
    showToast('Ulasan telah dihapus.');
  };

  const toggleLike = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleSave = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const shareItem = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setToastMessage(`Tautan disalin!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const galleryScrollRef = useRef<HTMLDivElement>(null);

  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryScrollRef.current) {
      const { scrollLeft, clientWidth } = galleryScrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      galleryScrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Philosophy Swiper states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % philosophyItems.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + philosophyItems.length) % philosophyItems.length);
  };

  // Form states
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    message: '',
  });

  const showBabaks: ShowBabak[] = [
    {
      title: 'Babak I: Gamelan Agung & Simfoni',
      description: 'Pertemuan agung harmoni gamelan pusaka berpadu dengan megahnya instrumen orkestra modern, membangkitkan spirit luhur Nusantara.',
      time: '19:00 - 19:45 WIB',
    },
    {
      title: 'Babak II: Teater Epik Kolosal Nusantara',
      description: 'Lakon mahakarya visualisasi kisah kepahlawanan menggunakan tata cahaya laser, video mapping 3D, serta koreografi puluhan aktor panggung kawakan.',
      time: '19:45 - 20:45 WIB',
    },
    {
      title: 'Babak III: Tari Cahaya Kontemporer',
      description: 'Klimaks pertunjukan magis yang memadukan tarian tradisional dinamis dengan kostum serat optik bercahaya, merefleksikan kejayaan masa kini.',
      time: '20:45 - 21:30 WIB',
    },
  ];

  const triggerToast = (message: string) => {
    showToast(message);
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;
    
    const submittedName = formData.fullName;
    try {
      await addDoc(collection(db, 'contacts'), {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        createdAt: Date.now()
      });
      setIsContactOpen(false);
      triggerToast(`Terima kasih ${submittedName}, pesan Anda telah tersimpan ke database panitia!`);
      setFormData({ fullName: '', email: '', message: '' });
    } catch (err) {
      console.warn('Firestore contact submit error (fallback local):', err);
      setIsContactOpen(false);
      triggerToast(`Terima kasih ${submittedName}, pesan Anda telah kami terima!`);
      setFormData({ fullName: '', email: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-x-hidden text-white" id="main-app-container">
      {/* Precision Custom Cursor */}
      <CustomCursor />

      {/* Fullscreen Cinematic Preloader */}
      <CinematicPreloader />

      {/* Interactive Spark Particles Backdrop */}
      <ParticleBackdrop />

      {/* Ornate Left and Right Side Border Designs */}
      <div className="hidden lg:flex fixed left-5 top-1/4 bottom-1/4 flex-col justify-between items-center pointer-events-none z-10" id="ornate-border-left">
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-amber-500/30 to-transparent relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-amber-500/50 text-[10px]">◆</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500/70 text-lg">⚜</div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-amber-500/50 text-[10px]">◆</div>
        </div>
      </div>
      <div className="hidden lg:flex fixed right-5 top-1/4 bottom-1/4 flex-col justify-between items-center pointer-events-none z-10" id="ornate-border-right">
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-amber-500/30 to-transparent relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-amber-500/50 text-[10px]">◆</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500/70 text-lg">⚜</div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-amber-500/50 text-[10px]">◆</div>
        </div>
      </div>

      {/* Top Header Navigation */}
      <Header />

      {/* Main Hero & Content Section */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-16 py-12 flex-1 flex flex-col justify-center" id="hero-main-content">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading text, Countdown timer, Call to actions */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6 lg:pr-6" id="hero-details-container">
            {/* Mobile-only logo display (above the headings) */}
            <div className="flex lg:hidden justify-center items-center w-full py-4" id="mobile-hero-logo">
              <div className="w-48 max-w-full">
                <ShieldLogo />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-[1px] bg-amber-500/50"></div>
              <p className="font-amagro text-[9px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.25em] text-amber-400 uppercase whitespace-nowrap">THE ABSOLUTE SPECTACLE</p>
              <div className="w-8 h-[1px] bg-amber-500/50"></div>
            </div>

            <div className="space-y-1" id="hero-heading-group">
              <h2 className="font-amagro text-5xl lg:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#fef4db] via-[#d4af37] to-[#8a6f27] drop-shadow-[0_2px_15px_rgba(212,175,55,0.3)] leading-none">
                PANGGUNG
              </h2>
              <h2 className="font-amagro text-4xl lg:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#fef4db] via-[#d4af37] to-[#8a6f27] drop-shadow-[0_2px_15px_rgba(212,175,55,0.3)] leading-none">
                GEMBIRA
              </h2>
            </div>

            <p className="text-xs lg:text-sm tracking-[0.5em] text-amber-500/80 font-cinzel pl-1">
              M &nbsp; M &nbsp; X &nbsp; V &nbsp; I &nbsp; I
            </p>

            {/* Hitung Mundur / Interactive Countdown */}
            <CountdownTimer />

            <p className="text-gray-300 text-sm lg:text-base max-w-xl leading-relaxed font-light">
             Panggung Gembira merupakan pagelaran seni Siswa Akhir KMI Gontor Dua sekaligus ruang lahirnya Impervious Generation—generasi tangguh, berkarakter, dan siap menghadapi perubahan zaman. Berlandaskan keyakinan bahwa pendidikan adalah kunci peradaban, Panggung Gembira memadukan edukasi dan entertainment melalui seni, kreativitas, budaya, serta nilai-nilai kepesantrenan. Eksis menjaga identitas, dinamis menuju kualitas, Panggung Gembira menjadi cerminan pendidikan holistik yang menempa santri untuk berkarya, memimpin, dan mengambil peran dalam membangun peradaban.
            </p>

            {/* Interaction Button Group */}
            <div className="flex flex-wrap items-center gap-3.5 pt-4 relative z-20" id="hero-buttons">
              {/* Show Details CTA */}
              <button
                onClick={() => setIsDetailsOpen(true)}
                className="border border-amber-500/20 bg-zinc-950/85 text-amber-100 hover:text-black hover:border-transparent px-5 py-3 rounded-lg flex items-center space-x-2.5 text-xs tracking-widest uppercase font-semibold group transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-600 hover:to-amber-400 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer backdrop-blur-md"
                id="btn-show-details"
              >
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:text-black transition-colors" />
                <span>Lihat Pertunjukan</span>
              </button>

              {/* Circle Play Trailer CTA */}
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="flex items-center space-x-2.5 text-amber-200 hover:text-amber-400 transition-colors group cursor-pointer pl-1"
                id="btn-play-trailer"
              >
                <div className="w-10 h-10 rounded-full border border-amber-500/20 flex items-center justify-center group-hover:scale-105 group-hover:border-amber-400 transition-all duration-300 bg-zinc-950/85 backdrop-blur-md">
                  <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover:fill-amber-300 group-hover:text-amber-300 transition-colors" />
                </div>
                <span className="text-xs uppercase tracking-widest font-semibold">Trailer</span>
              </button>
            </div>
          </div>

          {/* Right Column: Ornate Floating Shield Logo representation (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-5 justify-center items-center relative lg:min-h-[450px]" id="hero-shield-section">
            {/* Soft Ambient Light Glow */}
            <div className="absolute w-72 h-72 lg:w-96 lg:h-96 rounded-full bg-amber-500/5 blur-[80px] animate-pulse pointer-events-none"></div>
            
            {/* Luxurious Golden Keyhole Shield */}
            <ShieldLogo />
          </div>

        </div>
      </main>

      {/* Dedicated Section: Shareable Flyer & Digital Invitation Card */}
      <FlyerSection onShowToast={(msg) => showToast(msg)} />

      {/* Sponsor Section (Horizontal Slide Otomatis) */}
      <section className="relative z-20 w-full overflow-hidden pt-4 pb-12" id="sponsor-section">
        <div className="max-w-6xl mx-auto px-6 mb-8 text-center space-y-2">
          <p className="text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase font-cinzel">KEMITRAAN & SPONSOR</p>
          <h3 className="font-amagro text-xl md:text-2xl font-bold text-amber-100/90 tracking-wider md:gold-glow">
            Didukung Oleh
          </h3>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mx-auto mt-2"></div>
        </div>

        {/* Infinite Horizontal Sliding Marquee Container */}
        <div className="relative w-full overflow-hidden flex items-center py-6 bg-gradient-to-r from-transparent via-[#060606]/80 to-transparent border-y border-amber-900/20">
          {/* Left Gradient Cover */}
          <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#010101] via-[#010101]/80 to-transparent z-10 pointer-events-none" />
          
          {/* Right Gradient Cover */}
          <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#010101] via-[#010101]/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track */}
          <div className="animate-marquee flex gap-8 transform-gpu will-change-transform">
            {(() => {
              const sponsorList = [
                {
                  name: 'GDP',
                  logo: 'https://raw.githubusercontent.com/ImperviousGorda/img-for-web/refs/heads/main/gdp-removebg-preview.png',
                },
                {
                  name: 'Freeport Indonesia',
                  logo: 'https://raw.githubusercontent.com/ImperviousGorda/img-for-web/refs/heads/main/freeport1.png',
                },
                {
                  name: 'JC',
                  logo: 'https://raw.githubusercontent.com/ImperviousGorda/img-for-web/refs/heads/main/jc.png',
                },
                {
                  name: 'Al-Fath',
                  logo: 'https://raw.githubusercontent.com/ImperviousGorda/img-for-web/refs/heads/main/alfath.png',
                },
                {
                  name: 'Nisa Decoration',
                  logo: 'https://raw.githubusercontent.com/ImperviousGorda/img-for-web/refs/heads/main/NISA%20DECORATION.png',
                },
                {
                  name: 'Kereta Api Indonesia (KAI)',
                  logo: 'https://raw.githubusercontent.com/ImperviousGorda/img-for-web/refs/heads/main/Logo%20KAI.png',
                },
                {
                  name: 'Ngabers Random',
                  logo: 'https://raw.githubusercontent.com/ImperviousGorda/img-for-web/refs/heads/main/NGABERS%20RANDOM.png',
                },
              ];
              // Duplicate array so marquee track is filled amply
              const fullSponsors = [...sponsorList, ...sponsorList];

              return (
                <>
                  {/* First Set of Sponsor Cards */}
                  <div className="flex gap-8 pr-8 shrink-0 items-center">
                    {fullSponsors.map((sponsor, i) => (
                      <div
                        key={`sponsor-1-${i}`}
                        className="flex items-center justify-center w-48 h-24 rounded-2xl bg-zinc-950/70 border border-amber-900/30 hover:border-amber-500/50 hover:bg-zinc-900/90 transition-all duration-300 group px-6 py-3 shrink-0 shadow-lg"
                      >
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          loading="lazy"
                          decoding="async"
                          className="max-h-14 max-w-[140px] w-auto h-auto object-contain filter drop-shadow brightness-95 group-hover:brightness-110 group-hover:scale-105 transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Second Set of Sponsor Cards (Duplicated for seamless loop) */}
                  <div className="flex gap-8 pr-8 shrink-0 items-center">
                    {fullSponsors.map((sponsor, i) => (
                      <div
                        key={`sponsor-2-${i}`}
                        className="flex items-center justify-center w-48 h-24 rounded-2xl bg-zinc-950/70 border border-amber-900/30 hover:border-amber-500/50 hover:bg-zinc-900/90 transition-all duration-300 group px-6 py-3 shrink-0 shadow-lg"
                      >
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          loading="lazy"
                          decoding="async"
                          className="max-h-14 max-w-[140px] w-auto h-auto object-contain filter drop-shadow brightness-95 group-hover:brightness-110 group-hover:scale-105 transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </section>

      {/* About Impervious Generation Section (Editorial Specification Layout matching Reference Image) */}
      <section className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12" id="about-impervious-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-[#faf6ee] text-[#1a140b] border border-amber-900/15 rounded-[2rem] p-6 sm:p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden"
        >
          {/* Top Header Row / Tag */}
          <div className="flex items-center justify-between border-b border-[#1a140b]/10 pb-4 sm:pb-6 mb-8 sm:mb-12">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-700"></span>
              <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.25em] text-amber-900 uppercase">
                ABOUT THE GENERATION // IMPERVIOUS
              </span>
            </div>
            <span className="font-mono text-[10px] sm:text-xs text-amber-800/70 font-semibold tracking-widest uppercase">
              SISWA AKHIR KMI GONTOR 2
            </span>
          </div>

          {/* 3 Column Grid (Reference style text columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 text-left mb-10 sm:mb-16">
            {/* Column 1 */}
            <div className="space-y-3">
              <p className="font-serif text-xs sm:text-sm text-zinc-800 leading-relaxed font-normal">
                Generasi tonggak 100 Tahun Kedua Gontor yang tangguh dalam mengupayakan umat dan menegakkan kebenaran.
              </p>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <p className="font-serif text-xs sm:text-sm text-zinc-800 leading-relaxed font-normal">
                Impervious Generation kokoh dalam integritas, selaras antara seruan dan perbuatan, serta dinamis meningkatkan kualitas umat demi mewujudkan pusat peradaban dunia.
              </p>
            </div>

            {/* Column 3: Identity & Font Specs breakdown like reference */}
            <div className="space-y-1 font-serif text-xs sm:text-sm text-zinc-700 border-l border-[#1a140b]/15 pl-4 sm:pl-6">
              <p className="font-bold text-[#1a140b]">Impervious Generation 6101</p>
              <p className="text-zinc-600">Pondok Modern Darussalam Gontor 2</p>
              <p className="text-amber-800 font-semibold">Unshaken & Unbroken</p>
            </div>
          </div>

          {/* Bottom Display Typography (Reference "Aa123%!" layout) */}
          <div className="pt-4 sm:pt-8 border-t border-[#1a140b]/10 text-center select-none overflow-hidden">
            <h2 className="font-amagro text-4xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-bold tracking-tight text-[#1a140b] leading-none whitespace-nowrap">
              Impervious
            </h2>
          </div>
        </motion.div>
      </section>

      {/* Tentang Acara Section */}
      <section ref={aboutSectionRef} className="relative z-20 max-w-6xl mx-auto px-6 py-12 text-center space-y-12 overflow-hidden" id="about-section">
        {/* Animated Background Ornaments */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Glowing Golden Orbs */}
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-amber-500/5 blur-[80px]" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-yellow-500/5 blur-[100px]" />

          {/* Left Decorative Islamic Geometric Ring */}
          <motion.div
            style={{ rotate: aboutBgRotate1, y: aboutBgY1 }}
            className="absolute -left-20 top-20 w-80 h-80 border-2 border-amber-500/20 rounded-full flex items-center justify-center opacity-55 md:opacity-65 hidden md:flex"
          >
            <div className="w-72 h-72 border border-dashed border-amber-500/15 rounded-full flex items-center justify-center animate-spin-slow">
              <div className="w-48 h-48 border-2 border-amber-500/20 rounded-full rotate-45 flex items-center justify-center relative">
                <div className="w-48 h-48 border border-amber-500/20 absolute rotate-12"></div>
                <div className="w-48 h-48 border border-amber-500/20 absolute rotate-45"></div>
                <div className="w-48 h-48 border border-amber-500/20 absolute rotate-75"></div>
                <div className="w-16 h-16 border border-amber-500/35 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-amber-500/40" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Decorative Islamic Geometric Ring */}
          <motion.div
            style={{ rotate: aboutBgRotate2, y: aboutBgY2 }}
            className="absolute -right-24 bottom-20 w-[280px] h-[280px] md:w-[350px] md:h-[350px] border-2 border-amber-500/20 rounded-full flex items-center justify-center opacity-40 md:opacity-65 scale-[0.8] md:scale-100 origin-center"
          >
            <div className="w-[320px] h-[320px] border border-dashed border-amber-500/15 rounded-full flex items-center justify-center relative animate-spin-reverse-slow">
              <div className="w-56 h-56 border-2 border-amber-500/20 rounded-full flex items-center justify-center relative">
                <div className="w-56 h-56 border border-amber-500/20 absolute rotate-30"></div>
                <div className="w-56 h-56 border border-amber-500/20 absolute rotate-60"></div>
                <div className="w-56 h-56 border border-amber-500/20 absolute rotate-90"></div>
                <div className="w-24 h-24 border border-amber-500/35 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-500/40 animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section Header */}
        <motion.div
          className="space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="flex justify-center items-center space-x-3"
          >
            <div className="w-8 h-[1px] bg-amber-500/30"></div>
            <p className="text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase">PUNCAK PENDIDIKAN HOLISTIK</p>
            <div className="w-8 h-[1px] bg-amber-500/30"></div>
          </motion.div>
          <motion.h3
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="font-amagro text-3xl lg:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fef4db] via-[#d4af37] to-[#8a6f27]"
          >
            Tentang Panggung Gembira
          </motion.h3>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="font-amagro text-sm font-semibold tracking-widest text-amber-500/80 uppercase"
          >
            "Pesantren Menegakkan Pendidikan Holistik, Menuju Pusat Peradaban Dunia"
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: { opacity: 1, scaleX: 1, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mt-4 origin-center"
          ></motion.div>
        </motion.div>

        {/* Main Philosophy Introduction */}
        <p className="text-gray-300 text-sm lg:text-base max-w-3xl mx-auto leading-relaxed font-light">
          Panggung Gembira merupakan puncak rentetan Pekan Perkenalan Khutbatul Arsy di Pondok Modern Darussalam Gontor. Acara ini memadukan saran pendidikan yang memadukan kreativitas seni, dan nilai-nilai Islam dalam satu kesatuan proses pembelajaran. Panggung Gembira bukan sekadar panggung pertunjukan, melainkan panggung pembentukan jiwa dan karakter
        </p>

        {/* 3 Pillars / Key Features of the Show */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-12">
          {/* Card 1: Nilai Luhur */}
          <div className="bg-[#040404]/80 backdrop-blur-md rounded-xl p-8 gold-card-glow space-y-4">
            <div className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center bg-black/50 text-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
              <span className="font-cinzel text-lg font-bold">I</span>
            </div>
            <h4 className="font-amagro text-lg font-bold text-amber-100 tracking-wide gold-glow">
              Seni Edukatif
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Panggung Gembira merupakan sebuah pertunjukan seni yang tidak hanya menghibur, tetapi juga mengedukasi. Setiap penampilan dirancang dengan penuh kreativitas untuk menyampaikan nilai-nilai pendidikan, akhlak, budaya, dan kebersamaan, sehingga setiap penonton dapat menikmati sebuah pertunjukan yang berkualitas, bermakna, serta meninggalkan kesan yang mendalam.
            </p>
          </div>

          {/* Card 2: Kolosal Kreatif */}
          <div className="bg-[#040404]/80 backdrop-blur-md rounded-xl p-8 gold-card-glow space-y-4">
            <div className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center bg-black/50 text-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
              <span className="font-cinzel text-lg font-bold">II</span>
            </div>
            <h4 className="font-amagro text-lg font-bold text-amber-100 tracking-wide gold-glow">
              Entartaining
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Menghadirkan pertunjukan yang memikat melalui perpaduan seni, kreativitas, dan inovasi, sehingga setiap penampilan mampu memberikan hiburan yang berkualitas, membangkitkan inspirasi, serta menciptakan pengalaman yang berkesan bagi setiap penonton.
            </p>
          </div>

          {/* Card 3: Mandiri Penuh */}
          <div className="bg-[#040404]/80 backdrop-blur-md rounded-xl p-8 gold-card-glow space-y-4">
            <div className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center bg-black/50 text-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
              <span className="font-cinzel text-lg font-bold">III</span>
            </div>
            <h4 className="font-amagro text-lg font-bold text-amber-100 tracking-wide gold-glow">
              Key to Civilization
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Panggung Gembira menjadi simbol perjalanan pendidikan yang mempersiapkan generasi berilmu, berakhlak, dan berkarya. Dengan memadukan seni, budaya, serta nilai-nilai kepesantrenan, setiap pertunjukan menjadi langkah nyata dalam mewujudkan cita-cita pesantren sebagai pusat lahirnya peradaban dunia.
            </p>
          </div>
        </div>
      </section>

      {/* Welcome Entrance Ribbon - Full Screen Width Divider */}
      <div ref={ribbonRef} className="relative w-full overflow-hidden py-1 z-30 select-none pointer-events-none" id="welcome-ribbon-container">
        <motion.div
          style={{ clipPath: ribbonClipPath, opacity: ribbonOpacity }}
          className="w-[130vw] md:w-[115vw] relative left-1/2 right-1/2 -translate-x-1/2 flex justify-center pointer-events-none"
        >
          <img
            src={ribbonKrem}
            alt="Ribbon"
            loading="lazy"
            decoding="async"
            className="w-full h-auto max-h-[140px] md:max-h-[160px] object-cover scale-[1.25] md:scale-100 origin-center pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* Filosofi Lambang Section */}
      <section ref={logoPhilosophyRef} className="relative z-20 max-w-6xl mx-auto px-6 py-16 text-center space-y-12 overflow-hidden" id="logo-philosophy-section">
        {/* Animated Background Ornaments */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Glowing Golden Orbs */}
          <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-amber-500/5 blur-[90px]" />
          <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-yellow-500/5 blur-[80px]" />

          {/* Left Decorative Islamic Star */}
          <motion.div
            style={{ rotate: logoBgRotate1, y: logoBgY1 }}
            className="absolute -left-28 bottom-1/4 w-72 h-72 md:w-96 md:h-96 border-2 border-amber-500/20 rounded-full flex items-center justify-center opacity-40 md:opacity-65 scale-[0.8] md:scale-100 origin-center"
          >
            {/* Outer Star */}
            <div className="absolute w-80 h-80 border border-amber-500/20 rotate-12 flex items-center justify-center animate-spin-slow">
              <div className="w-80 h-80 border border-amber-500/20 rotate-45"></div>
              <div className="w-80 h-80 border border-amber-500/20 rotate-75"></div>
            </div>
            {/* Inner Ring */}
            <div className="w-60 h-60 border border-dashed border-amber-500/20 rounded-full flex items-center justify-center animate-spin-reverse-slow">
              <div className="w-32 h-32 border border-amber-500/20 rounded-full"></div>
            </div>
          </motion.div>

          {/* Right Decorative Islamic Star */}
          <motion.div
            style={{ rotate: logoBgRotate2, y: logoBgY2 }}
            className="absolute -right-28 top-1/4 w-96 h-96 border-2 border-amber-500/20 rounded-full flex items-center justify-center opacity-55 md:opacity-65 hidden md:flex"
          >
            {/* Outer Star */}
            <div className="absolute w-80 h-80 border border-amber-500/20 rotate-30 flex items-center justify-center animate-spin-reverse-slow">
              <div className="w-80 h-80 border border-amber-500/20 rotate-60"></div>
              <div className="w-80 h-80 border border-amber-500/20 rotate-90"></div>
            </div>
            {/* Inner Ring */}
            <div className="w-60 h-60 border border-dashed border-amber-500/20 rounded-full flex items-center justify-center animate-spin-slow">
              <div className="w-32 h-32 border border-amber-500/25 rounded-full"></div>
            </div>
          </motion.div>
        </div>

        {/* Section Header */}
        <motion.div
          className="space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="flex justify-center items-center space-x-3"
          >
            <div className="w-8 h-[1px] bg-amber-500/30"></div>
            <p className="text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase font-cinzel">MAKNA & SIMBOLISME</p>
            <div className="w-8 h-[1px] bg-amber-500/30"></div>
          </motion.div>
          <motion.h3
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="font-amagro text-3xl lg:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fef4db] via-[#d4af37] to-[#8a6f27]"
          >
            Filosofi Lambang
          </motion.h3>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="font-amagro text-sm font-semibold tracking-widest text-amber-500/80 uppercase"
          >
            Setiap elemen logo mencerminkan nilai, semangat, dan visi besar Panggung Gembira 101
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: { opacity: 1, scaleX: 1, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mt-4 origin-center"
          ></motion.div>
        </motion.div>

        {/* Desktop & Tablet Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left mt-12">
          {philosophyItems.map((item, index) => (
            <div 
              key={index} 
              className="bg-[#030303]/90 border border-amber-950/60 hover:border-amber-500/30 backdrop-blur-md rounded-2xl p-6 relative flex flex-col justify-between min-h-[380px] transition-all duration-500 hover:shadow-[0_15px_30px_rgba(212,175,55,0.08)] group"
            >
              {/* Number badge */}
              <span className="absolute top-4 right-6 font-mono text-[11px] text-amber-500/60 font-medium tracking-widest">{item.id}</span>
              
              {/* Actual Image */}
              <div className="w-full aspect-[4/3] rounded-lg bg-zinc-950/90 border border-amber-950/30 flex items-center justify-center relative overflow-hidden mb-6">
                <div className="absolute inset-0 bg-radial from-amber-500/5 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <img 
                  src={item.image} 
                  alt={item.title} 
                  loading="lazy"
                  decoding="async"
                  className="max-w-[70%] max-h-[70%] object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-transform duration-700 ease-out group-hover:scale-110 relative z-10"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-3">
                <h4 className="font-amagro text-base lg:text-lg font-bold text-amber-100/90 tracking-wide gold-glow">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile-only Swiper / Carousel */}
        <div className="block md:hidden relative max-w-sm mx-auto mt-8 px-4 overflow-hidden" id="philosophy-mobile-swiper">
          <div className="relative min-h-[410px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(e, info) => {
                  const swipeThreshold = 50;
                  if (info.offset.x < -swipeThreshold) {
                    handleNext();
                  } else if (info.offset.x > swipeThreshold) {
                    handlePrev();
                  }
                }}
                className="w-full bg-[#030303]/90 border border-amber-500/30 backdrop-blur-md rounded-2xl p-6 relative flex flex-col justify-between min-h-[380px] shadow-[0_15px_30px_rgba(212,175,55,0.08)] select-none cursor-grab active:cursor-grabbing touch-pan-y"
              >
                {/* Number badge */}
                <span className="absolute top-4 right-6 font-mono text-[11px] text-amber-500/60 font-medium tracking-widest">
                  {philosophyItems[currentSlide].id}
                </span>
                
                {/* Actual Image */}
                <div className="w-full aspect-[4/3] rounded-lg bg-zinc-950/90 border border-amber-950/30 flex items-center justify-center relative overflow-hidden mb-6 pointer-events-none">
                  <div className="absolute inset-0 bg-radial from-amber-500/10 to-transparent blur-xl opacity-100" />
                  <img 
                    src={philosophyItems[currentSlide].image} 
                    alt={philosophyItems[currentSlide].title} 
                    loading="lazy"
                    decoding="async"
                    className="max-w-[70%] max-h-[70%] object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.35)]"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-3 pointer-events-none">
                  <h4 className="font-amagro text-base font-bold text-amber-100/90 tracking-wide gold-glow">
                    {philosophyItems[currentSlide].title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    {philosophyItems[currentSlide].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons and Pagination Dots Container */}
          <div className="flex items-center justify-between mt-6 px-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-amber-500/30 flex items-center justify-center bg-[#050505]/80 hover:bg-amber-500/10 hover:border-amber-400 text-amber-400 transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.1)] active:scale-95 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="flex space-x-2">
              {philosophyItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentSlide ? 1 : -1);
                    setCurrentSlide(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentSlide 
                      ? 'bg-amber-400 w-4 shadow-[0_0_8px_rgba(212,175,55,0.6)]' 
                      : 'bg-zinc-700 hover:bg-zinc-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-amber-500/30 flex items-center justify-center bg-[#050505]/80 hover:bg-amber-500/10 hover:border-amber-400 text-amber-400 transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.1)] active:scale-95 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Acara Section with OceanBreak-inspired Staggered Container Design */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 py-24 overflow-hidden no-scroll-trigger" id="featured-events-section">
        {/* Giant Watermark Heading styled behind containers */}
        <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none select-none z-0 overflow-hidden opacity-10">
          <h2 className="font-amagro text-[6rem] md:text-[10rem] lg:text-[14rem] tracking-[0.15em] text-amber-500 font-black leading-none uppercase whitespace-nowrap">
            AGENDAS
          </h2>
        </div>

        <div className="relative z-10 space-y-16">
          {/* Section Heading */}
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="flex justify-center items-center space-x-3">
              <div className="w-8 h-[1px] bg-amber-500/30"></div>
              <p className="text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase font-cinzel">PROGRAM UNGGULAN</p>
              <div className="w-8 h-[1px] bg-amber-500/30"></div>
            </div>
            <h3 className="font-amagro text-3xl lg:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fef4db] via-[#d4af37] to-[#8a6f27]">
              Featured Acara
            </h3>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto"></div>
          </div>

          {/* Staggered Grid of ordinary box containers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-start pt-8" id="featured-staggered-grid">
            
            {/* CARD 1: Overview & Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-zinc-950/90 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-4 sm:p-6 lg:mt-0 hover:border-amber-400/40 transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.85)] hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col justify-between min-h-[380px] sm:min-h-[460px] group"
            >
              {/* Top metadata list */}
              <div className="space-y-2 sm:space-y-4 text-left border-b border-amber-500/10 pb-4 sm:pb-6">
                <div className="flex justify-between items-center text-[8px] sm:text-[10px] font-mono tracking-widest text-amber-500/70">
                  <span>LOCATION</span>
                  <span className="text-right text-amber-300">PONOROGO</span>
                </div>
                <div className="flex justify-between items-center text-[8px] sm:text-[10px] font-mono tracking-widest text-amber-500/70">
                  <span>FIELD</span>
                  <span className="text-right text-amber-300">SINTESA</span>
                </div>
                <div className="flex justify-between items-center text-[8px] sm:text-[10px] font-mono tracking-widest text-amber-500/70">
                  <span>RELEASE DATE</span>
                  <span className="text-right text-amber-300">SEPTEMBER 2026</span>
                </div>
                <div className="flex justify-between items-center text-[8px] sm:text-[10px] font-mono tracking-widest text-amber-500/70">
                  <span>NR. MEMBERS</span>
                  <span className="text-right text-amber-300">101 REV</span>
                </div>
              </div>

              {/* Main content */}
              <div className="text-left space-y-2 sm:space-y-4 pt-4 sm:pt-6">
                <h4 className="font-amagro text-sm sm:text-xl font-bold text-amber-100/90 leading-tight tracking-wide">
                  Welcome to Our Great Spectacle
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed font-light line-clamp-4 sm:line-clamp-none">
                  Di atas panggung pembentukan karakter ini, terpahat sebuah kunci peradaban! Inilah menara nilai yang mengawal kreativitas kami agar senantiasa bernafaskan syariat dan keluhuran budi.
                </p>
              </div>

              {/* Action button */}
              <div className="pt-4 sm:pt-6 text-left">
                <button
                  onClick={() => setIsFeaturedEventsModalOpen(true)}
                  className="inline-flex items-center space-x-1 sm:space-x-2 text-[8px] sm:text-[10px] font-mono tracking-widest text-amber-400 hover:text-amber-300 transition-colors cursor-pointer group-hover:translate-x-1 duration-300"
                >
                  <span>EXPLORE ACARA</span>
                  <span className="text-xs">↓</span>
                </button>
              </div>
            </motion.div>

            {/* CARD 2: Seni Tari Kolosal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-zinc-950/90 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-3 sm:p-4 lg:mt-12 hover:border-amber-400/40 transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.85)] hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col justify-between min-h-[380px] sm:min-h-[460px]"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-amber-500/10">
                <img
                  src={pgDance}
                  alt="Sajak Selaras Nusantara"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-700 ease-out"
                />
              </div>

              <div className="text-left pt-4 sm:pt-6 space-y-1 sm:space-y-2">
                <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-amber-500/80">// SENI TARI KOLOSAL</span>
                <p className="text-[9px] sm:text-[11px] font-mono tracking-widest text-amber-300/80 leading-relaxed font-semibold uppercase line-clamp-3 sm:line-clamp-none">
                  BESPOKE CHOREOGRAPHY CRAFTED EXCLUSIVELY FOR THIS GRAND NIGHT
                </p>
              </div>
            </motion.div>

            {/* CARD 3: Call to Action / Schedule Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-zinc-950/90 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-4 sm:p-6 lg:mt-4 hover:border-amber-400/40 transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.85)] hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col justify-between min-h-[380px] sm:min-h-[460px] group"
            >
              {/* Header */}
              <div className="text-left space-y-1 sm:space-y-2">
                <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-amber-500">// SPECTATOR INFO</span>
                <h4 className="font-amagro text-sm sm:text-xl font-bold text-amber-100/90 leading-tight">
                  Schedule a visit to Panggung Gembira
                </h4>
              </div>

              {/* Schedule Quick CTA */}
              <div className="py-3 sm:py-6 text-left border-y border-amber-500/10 my-2 sm:my-4">
                <button
                  onClick={() => setIsDetailsOpen(true)}
                  className="w-full py-2 sm:py-3 border border-amber-500/20 hover:border-amber-400/50 hover:bg-amber-500/5 rounded-xl text-[8px] sm:text-[10px] font-mono tracking-widest text-amber-300 flex items-center justify-center space-x-1 sm:space-x-2 transition-all duration-300 cursor-pointer"
                >
                  <span>SEE SCHEDULE</span>
                  <span className="text-xs">→</span>
                </button>
              </div>

              {/* Bottom metadata list */}
              <div className="space-y-2 sm:space-y-3 text-left pt-1 sm:pt-2">
                <div className="flex items-start justify-between text-[8px] sm:text-[10px] font-mono tracking-widest text-amber-500/70">
                  <span>ADDRESS //</span>
                  <span className="text-right text-amber-300 max-w-[80px] sm:max-w-[140px] truncate">KAMPUS 2</span>
                </div>
                <div className="flex items-start justify-between text-[8px] sm:text-[10px] font-mono tracking-widest text-amber-500/70">
                  <span>PHONE //</span>
                  <span className="text-right text-amber-300 max-w-[80px] sm:max-w-[140px] truncate">+62 352</span>
                </div>
                <div className="flex items-start justify-between text-[8px] sm:text-[10px] font-mono tracking-widest text-amber-500/70">
                  <span>SPECTATORS //</span>
                  <span className="text-right text-amber-300">PUBLIC</span>
                </div>
              </div>
            </motion.div>

            {/* CARD 4: Elegant high-contrast light text block card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-[#faf6ee] text-[#1a1308] border border-amber-500/10 rounded-2xl p-4 sm:p-6 lg:mt-20 hover:border-amber-400/30 transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.85)] hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col justify-between min-h-[380px] sm:min-h-[460px]"
            >
              <div className="text-left space-y-1 sm:space-y-2">
                <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-amber-800/80 font-bold">// Motto Panggung Gembira</span>
              </div>

              <div className="text-left py-4 sm:py-6">
                <p className="font-amagro text-xs sm:text-[1.25rem] lg:text-[1.35rem] font-bold leading-relaxed text-[#2a1e0b] line-clamp-6 sm:line-clamp-none">
                  Pesantren Menegakkan Pendidikan Holistik, Menuju Pusat Peradaban Dunia.
                </p>
              </div>

              <div className="text-left border-t border-amber-900/10 pt-4 sm:pt-6">
                <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-amber-700/80">SOUL // 101</span>
                <p className="text-[8px] sm:text-[10px] text-zinc-600 mt-1 leading-normal line-clamp-3 sm:line-clamp-none">
                  Dengan mengusung tema Pendidikan Kunci Kejayaan, Panggung Gembira menjadi refleksi untuk meneguhkan pendidikan.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Toast Notification for Share / Save */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.88, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, x: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-8 left-1/2 z-50 bg-[#d4af37] text-zinc-950 px-6 py-3 rounded-full text-xs font-mono font-bold shadow-[0_10px_35px_rgba(212,175,55,0.5)] border border-amber-200/60 flex items-center space-x-2.5 backdrop-blur-md"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.25, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <Sparkles className="w-4 h-4 text-zinc-950 fill-zinc-950" />
            </motion.div>
            <span className="tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Gallery Section (Social/Editorial Reference Layout) */}
      <section ref={gallerySectionRef} className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center space-y-12 no-scroll-trigger" id="gallery-section">
        {/* Animated Background Ornaments */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-10 left-1/4 w-80 h-80 rounded-full bg-amber-500/5 blur-[100px]" />
          <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-yellow-500/5 blur-[120px]" />

          {/* Left Decorative Islamic Geometric Ring */}
          <motion.div
            style={{ rotate: galleryBgRotate1, y: galleryBgY1 }}
            className="absolute -left-20 top-20 w-80 h-80 border-2 border-amber-500/20 rounded-full flex items-center justify-center opacity-55 md:opacity-65 hidden md:flex"
          >
            <div className="w-72 h-72 border border-dashed border-amber-500/15 rounded-full flex items-center justify-center animate-spin-slow">
              <div className="w-48 h-48 border-2 border-amber-500/20 rounded-full rotate-45 flex items-center justify-center relative">
                <div className="w-48 h-48 border border-amber-500/20 absolute rotate-12"></div>
                <div className="w-48 h-48 border border-amber-500/20 absolute rotate-45"></div>
                <div className="w-48 h-48 border border-amber-500/20 absolute rotate-75"></div>
                <div className="w-16 h-16 border border-amber-500/35 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-amber-500/40" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Decorative Islamic Geometric Ring */}
          <motion.div
            style={{ rotate: galleryBgRotate2, y: galleryBgY2 }}
            className="absolute -right-24 bottom-20 w-[280px] h-[280px] md:w-[350px] md:h-[350px] border-2 border-amber-500/20 rounded-full flex items-center justify-center opacity-40 md:opacity-65 scale-[0.8] md:scale-100 origin-center"
          >
            <div className="w-[320px] h-[320px] border border-dashed border-amber-500/15 rounded-full flex items-center justify-center relative animate-spin-reverse-slow">
              <div className="w-56 h-56 border-2 border-amber-500/20 rounded-full flex items-center justify-center relative">
                <div className="w-56 h-56 border border-amber-500/20 absolute rotate-30"></div>
                <div className="w-56 h-56 border border-amber-500/20 absolute rotate-60"></div>
                <div className="w-56 h-56 border border-amber-500/20 absolute rotate-90"></div>
                <div className="w-24 h-24 border border-amber-500/35 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-500/40 animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section Header */}
        <motion.div
          className="space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.2 }
            }
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="flex justify-center items-center space-x-3"
          >
            <div className="w-8 h-[1px] bg-amber-500/30"></div>
            <p className="text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase font-cinzel">JEJAK KREATIF</p>
            <div className="w-8 h-[1px] bg-amber-500/30"></div>
          </motion.div>
          <motion.h3
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="font-amagro text-3xl lg:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fef4db] via-[#d4af37] to-[#8a6f27]"
          >
            Galeri Panggung Gembira
          </motion.h3>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="font-amagro text-sm font-semibold tracking-widest text-amber-500/80 uppercase"
          >
            Bedah Lebih Lanjut Tentang Panggung Gembira
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: { opacity: 1, scaleX: 1, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mt-4 origin-center"
          ></motion.div>
        </motion.div>

        {/* Reference Image Style Cards Grid (2 Columns on Mobile like Instagram, 4 Columns on Desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 items-stretch max-w-7xl mx-auto mt-8 text-left" id="gallery-cards-grid">
          {galleryItems.map((item, index) => {
            const isLiked = !!likedItems[index];
            const isSaved = !!savedItems[index];
            const currentLikes = (item.likes || 1200) + (isLiked ? 1 : 0);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                className="group relative flex flex-col justify-between bg-[#0c0a07] rounded-[1.25rem] sm:rounded-[2rem] overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.9)] border border-amber-500/25 hover:border-amber-400/60 transition-all duration-300"
              >
                {/* 1. TOP HEADER BAR (Luxurious dark obsidian header with gold accents) */}
                <div className="bg-[#0c0a07] px-2.5 sm:px-4 py-2 sm:py-3.5 flex items-center justify-between border-b border-amber-500/15 rounded-t-[1.25rem] sm:rounded-t-[2rem]">
                  <div className="flex items-center space-x-1.5 sm:space-x-3 min-w-0">
                    {/* Avatar frame with profile logo image */}
                    <div className="w-6 h-6 sm:w-8.5 sm:h-8.5 rounded-full bg-[#1c140a] border border-amber-500/40 p-0.5 sm:p-1 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                      <img
                        src={shieldLogoImg}
                        alt="Profile Avatar"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* Brand & Location Stack */}
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-[8px] sm:text-[11px] font-extrabold tracking-wider text-amber-100 uppercase leading-none truncate">
                        {item.brand}
                      </span>
                      <span className="font-mono text-[7px] sm:text-[9px] text-amber-400/70 tracking-wide mt-0.5 truncate">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                  {/* Category Pill Tag */}
                  <span className="text-[7px] sm:text-[9px] font-mono tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold uppercase shrink-0">
                    {item.category}
                  </span>
                </div>

                {/* 2. CENTER IMAGE BODY (Clean Square 1:1 Aspect Ratio without text overlay) */}
                <div
                  onClick={() => setActiveImageIndex(index)}
                  className="relative aspect-square w-full overflow-hidden bg-zinc-950 cursor-pointer group/image"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover/image:scale-105 ${
                      item.isGrayscale ? 'grayscale contrast-125' : ''
                    }`}
                  />

                  {/* Hover Overlay Zoom Indicator */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center text-amber-300 transform scale-90 group-hover/image:scale-100 transition-all duration-300 shadow-xl border border-amber-500/40">
                      <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-300 rotate-90 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* 3. BOTTOM ACTION BAR (Dark obsidian action bar with gold controls) */}
                <div className="bg-[#0c0a07] px-2.5 sm:px-4 py-2 sm:py-3 rounded-b-[1.25rem] sm:rounded-b-[2rem] border-t border-amber-500/15 flex flex-col space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-between text-amber-200/90">
                    {/* Left Action Buttons */}
                    <div className="flex items-center space-x-2.5 sm:space-x-4">
                      {/* Heart / Like Button */}
                      <button
                        onClick={(e) => toggleLike(index, e)}
                        className="group/btn transition-transform active:scale-90"
                        title="Sukai Foto"
                        aria-label="Like post"
                      >
                        <Heart
                          className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
                            isLiked
                              ? 'text-red-500 fill-red-500 scale-110'
                              : 'text-amber-200/80 hover:text-red-500 group-hover/btn:scale-110'
                          }`}
                        />
                      </button>

                      {/* Comment / Detail Modal Button */}
                      <button
                        onClick={() => setActiveImageIndex(index)}
                        className="group/btn transition-transform active:scale-90"
                        title="Lihat Detail & Deskripsi"
                        aria-label="View comments and details"
                      >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200/80 hover:text-amber-400 group-hover/btn:scale-110 transition-all duration-200" />
                      </button>

                      {/* Share Button */}
                      <button
                        onClick={(e) => shareItem(item.title, e)}
                        className="group/btn transition-transform active:scale-90"
                        title="Bagikan Tautan"
                        aria-label="Share post"
                      >
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200/80 hover:text-amber-400 group-hover/btn:scale-110 transition-all duration-200" />
                      </button>
                    </div>

                    {/* Right Save / Bookmark Button */}
                    <button
                      onClick={(e) => toggleSave(index, e)}
                      className="group/btn transition-transform active:scale-90"
                      title="Simpan Foto"
                      aria-label="Save post"
                    >
                      <Bookmark
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
                          isSaved
                            ? 'text-amber-400 fill-amber-400 scale-110'
                            : 'text-amber-200/80 hover:text-amber-400 group-hover/btn:scale-110'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Likes Counter & Title line */}
                  <div className="flex items-center justify-between text-[8px] sm:text-[10px] font-mono text-amber-400/80 pt-0.5 border-t border-amber-500/10">
                    <span className="font-bold text-amber-200 truncate">
                      {currentLikes.toLocaleString('id-ID')} suka
                    </span>
                    <span className="truncate max-w-[70px] sm:max-w-[120px] text-amber-400/50 font-sans hidden min-[340px]:inline">
                      {item.title}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Ulasan & Saran Section (Matching Reference Image) */}
      <section ref={reviewsSectionRef} className="relative z-20 w-full py-20 px-4 sm:px-6 lg:px-12 bg-[#040404] text-amber-100 overflow-hidden border-t border-amber-500/15 space-y-10" id="reviews-section">
        {/* Ambient background glow & rotating wheels pattern */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-amber-600/5 blur-[160px]" />

          {/* Left Decorative Rotating Wheel / Star */}
          <motion.div
            style={{ rotate: reviewsBgRotate1, y: reviewsBgY1 }}
            className="absolute -left-28 bottom-1/4 w-72 h-72 md:w-96 md:h-96 border-2 border-amber-500/20 rounded-full flex items-center justify-center opacity-40 md:opacity-65 scale-[0.8] md:scale-100 origin-center pointer-events-none"
          >
            {/* Outer Star */}
            <div className="absolute w-80 h-80 border border-amber-500/20 rotate-12 flex items-center justify-center animate-spin-slow">
              <div className="w-80 h-80 border border-amber-500/20 rotate-45"></div>
              <div className="w-80 h-80 border border-amber-500/20 rotate-75"></div>
            </div>
            {/* Inner Ring */}
            <div className="w-60 h-60 border border-dashed border-amber-500/20 rounded-full flex items-center justify-center animate-spin-reverse-slow">
              <div className="w-32 h-32 border border-amber-500/20 rounded-full"></div>
            </div>
          </motion.div>

          {/* Right Decorative Rotating Wheel / Star (Positioned next to H2) */}
          <motion.div
            style={{ rotate: reviewsBgRotate2, y: reviewsBgY2 }}
            className="absolute -right-20 sm:-right-12 md:right-6 lg:right-20 top-2 w-64 h-64 sm:w-72 sm:h-72 md:w-88 md:h-88 border-2 border-amber-500/20 rounded-full flex items-center justify-center opacity-60 md:opacity-75 origin-center pointer-events-none"
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

        {/* Section Header */}
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-amber-500/40 bg-amber-950/30 text-amber-300 font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase shadow-inner">
            <span>THE ABSOLUTE SPECTACLE</span>
          </div>

          {/* Title */}
          <div className="flex items-center justify-center text-amber-400">
            <h2 className="font-amagro text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wider text-amber-100 gold-glow uppercase">
              ULASAN &amp; SARAN
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-amber-200/80 font-sans text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Terima kasih telah menjadi bagian dari pertunjukan ini.
          </p>

          <div className="flex justify-center space-x-2 text-amber-500/60 text-[10px] pt-1">
            <span>♦</span><span>♦</span><span>♦</span>
          </div>
        </div>


        {/* Subheader & Filter Controls */}
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-b border-amber-500/10 pb-4">
          <div className="flex flex-col items-center sm:items-start space-y-1">
            <h3 className="font-amagro text-base sm:text-lg font-bold tracking-wider text-amber-100 uppercase">
              ULASAN & SARAN PENGUNJUNG
            </h3>
            <div className="flex space-x-1 text-amber-500/60 text-[10px]">
              <span>♦</span><span>♦</span><span>♦</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dropdown sort */}
            <div className="relative">
              <select
                value={reviewSort}
                onChange={(e) => setReviewSort(e.target.value as any)}
                className="appearance-none bg-[#0c0a07] text-amber-200 text-xs px-3 py-1.5 pr-7 rounded-lg border border-amber-500/30 focus:outline-none focus:border-amber-400 cursor-pointer font-mono"
              >
                <option value="terbaru">Terbaru</option>
                <option value="lama">Terlama</option>
                <option value="rating">Rating</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-[#0a0805] border border-amber-500/20 rounded-lg p-0.5 space-x-1">
              {(['semua', 'ulasan', 'saran'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setReviewTab(tab)}
                  className={`px-3 py-1 rounded-md text-xs font-mono capitalize transition-all duration-200 ${
                    reviewTab === tab
                      ? 'bg-amber-600/90 text-amber-950 font-bold shadow-sm'
                      : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-500/10'
                  }`}
                >
                  {tab === 'semua' ? 'Semua' : tab === 'ulasan' ? 'Ulasan' : 'Saran'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        {reviewsList.filter(item => reviewTab === 'semua' || item.type === reviewTab).length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-12 px-6 bg-[#0c0a07]/60 border border-amber-500/20 rounded-2xl space-y-3">
            <MessageSquare className="w-8 h-8 text-amber-500/50 mx-auto" />
            <p className="text-amber-200/80 font-sans text-sm">
              Belum ada ulasan atau saran. Jadilah yang pertama membagikan kesan kamu di bawah!
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviewsList
              .filter(item => reviewTab === 'semua' || item.type === reviewTab)
              .sort((a, b) => {
                if (reviewSort === 'rating') return b.rating - a.rating;
                if (reviewSort === 'lama') return a.id.localeCompare(b.id);
                return b.id.localeCompare(a.id);
              })
              .slice(0, visibleReviewCount)
              .map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group relative flex flex-col justify-between bg-[#0c0a07]/90 border border-amber-500/20 hover:border-amber-400/50 rounded-xl p-4 sm:p-5 shadow-md hover:shadow-[0_8px_25px_rgba(212,175,55,0.1)] transition-all duration-300 min-h-[190px] overflow-hidden"
                >
                  {/* Crest watermark background */}
                  <div className="absolute right-2 bottom-2 w-16 h-16 opacity-[0.04] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                    <img src={shieldLogoImg} alt="Shield Crest Watermark" loading="lazy" decoding="async" className="w-full h-full object-contain" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-serif text-2xl text-amber-500/80 leading-none">“</span>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
                          item.type === 'saran'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
                        }`}>
                          {item.type === 'saran' ? 'Saran' : 'Ulasan'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-0.5 text-amber-400 text-xs">
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        {item.isPermanent ? (
                          <span
                            title="Ulasan Resmi Tersemat (Permanen)"
                            className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[9px] font-mono tracking-tight"
                          >
                            <ShieldCheck className="w-3 h-3 text-amber-400" />
                            <span>Pinned</span>
                          </span>
                        ) : (
                          <button
                            onClick={(e) => handleDeleteReview(item.id, e)}
                            title="Hapus ulasan"
                            className="opacity-0 group-hover:opacity-100 text-amber-500/40 hover:text-red-400 transition-all p-0.5 rounded hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-amber-100/90 text-xs leading-relaxed font-sans line-clamp-4 mb-4">
                      {item.text}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-amber-500/10 mt-auto">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="w-7 h-7 rounded-full object-cover border border-amber-500/30 shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-200 text-xs font-bold shrink-0">
                          {item.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-amber-300 truncate font-mono">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-amber-400/60 truncate font-sans">
                          {item.role}
                        </span>
                      </div>
                    </div>

                    <span className="text-[9px] text-amber-400/50 shrink-0 font-mono ml-2">
                      {item.time}
                    </span>
                  </div>
                </motion.div>
              ))}
          </div>
        )}

        {/* Tampilkan Lebih Banyak Button */}
        {visibleReviewCount < reviewsList.filter(item => reviewTab === 'semua' || item.type === reviewTab).length && (
          <div className="text-center pt-2">
            <button
              onClick={() => setVisibleReviewCount(prev => prev + 4)}
              className="inline-flex items-center space-x-2 px-6 py-2 rounded-full border border-amber-500/40 bg-[#0a0805] hover:bg-amber-500/20 text-amber-300 text-xs font-mono tracking-wider uppercase transition-all duration-300 shadow-md hover:border-amber-400"
            >
              <span className="text-amber-500 text-[10px]">♦</span>
              <span>Tampilkan Lebih Banyak</span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-500 text-[10px]">♦</span>
            </button>
          </div>
        )}

        {/* Interactive Form Card: BAGIKAN KESANMU */}
        <div className="max-w-5xl mx-auto mt-8 bg-[#090704]/95 border border-amber-500/30 rounded-2xl p-6 sm:p-8 relative shadow-[0_15px_40px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Corner gold brackets */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-500/40 pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-500/40 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-500/40 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-500/40 pointer-events-none" />

          <form onSubmit={handleReviewSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Box: Feather Illustration / Icon + Headings */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-2 border-b lg:border-b-0 lg:border-r border-amber-500/15 lg:pr-6 pb-6 lg:pb-0">
              <div className="w-12 h-12 rounded-full bg-amber-950/50 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-1 shadow-inner">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="font-amagro text-xl font-bold tracking-wider text-amber-100 uppercase">
                BAGIKAN KESANMU
              </h3>
              <div className="flex space-x-1 text-amber-500/60 text-[10px]">
                <span>♦</span><span>♦</span><span>♦</span>
              </div>
              <p className="text-amber-300/70 text-xs leading-relaxed max-w-xs font-sans">
                Pendapatmu sangat membantu kami untuk terus menjadi lebih baik.
              </p>
            </div>

            {/* Right Box: Form inputs */}
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Nama Lengkap */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-amber-300/80 flex items-center space-x-1">
                    <User className="w-3 h-3 text-amber-400" />
                    <span>Nama Lengkap</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    placeholder="Masukkan nama kamu"
                    className="w-full bg-[#0d0a07] border border-amber-500/25 rounded-lg px-3 py-2 text-xs text-amber-100 placeholder-amber-500/40 focus:outline-none focus:border-amber-400 transition-colors font-sans"
                  />
                </div>

                {/* Asal / Status */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-amber-300/80 flex items-center space-x-1">
                    <GraduationCap className="w-3 h-3 text-amber-400" />
                    <span>Asal / Status</span>
                  </label>
                  <input
                    type="text"
                    value={newReviewRole}
                    onChange={(e) => setNewReviewRole(e.target.value)}
                    placeholder="Contoh: Kelas 3, Alumni, dll"
                    className="w-full bg-[#0d0a07] border border-amber-500/25 rounded-lg px-3 py-2 text-xs text-amber-100 placeholder-amber-500/40 focus:outline-none focus:border-amber-400 transition-colors font-sans"
                  />
                </div>

                {/* Rating */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-amber-300/80 flex items-center space-x-1">
                    <Star className="w-3 h-3 text-amber-400" />
                    <span>Rating</span>
                  </label>
                  <div className="flex items-center space-x-1 bg-[#0d0a07] border border-amber-500/25 rounded-lg px-3 py-1.5 h-[34px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= (hoverRating ?? newReviewRating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Textarea + Submit */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-8 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-amber-300/80 flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3 text-amber-400" />
                      <span>Pesan / Kesan</span>
                    </label>
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] text-amber-400/60 font-mono mr-1">Jenis:</span>
                      <button
                        type="button"
                        onClick={() => setNewReviewType('ulasan')}
                        className={`px-2.5 py-0.5 text-[10px] font-mono rounded-md border transition-all ${
                          newReviewType === 'ulasan'
                            ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-sm'
                            : 'bg-amber-950/40 text-amber-300/70 border-amber-500/20 hover:bg-amber-500/20'
                        }`}
                      >
                        Ulasan
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewReviewType('saran')}
                        className={`px-2.5 py-0.5 text-[10px] font-mono rounded-md border transition-all ${
                          newReviewType === 'saran'
                            ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-sm'
                            : 'bg-amber-950/40 text-amber-300/70 border-amber-500/20 hover:bg-amber-500/20'
                        }`}
                      >
                        Saran
                      </button>
                    </div>
                  </div>
                  <textarea
                    required
                    rows={2}
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder={newReviewType === 'ulasan' ? "Tulis ulasan/kesan positif kamu tentang acara..." : "Tulis saran/masukan perbaikan untuk acara kami..."}
                    className="w-full bg-[#0d0a07] border border-amber-500/25 rounded-lg px-3 py-2 text-xs text-amber-100 placeholder-amber-500/40 focus:outline-none focus:border-amber-400 transition-colors font-sans resize-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full h-[40px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold text-xs font-mono uppercase tracking-wider rounded-lg border border-amber-300/80 shadow-[0_4px_15px_rgba(212,175,55,0.25)] flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmittingReview ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span>MENYIMPAN...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-black" />
                        <span>KIRIM {newReviewType === 'ulasan' ? 'ULASAN' : 'SARAN'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Gallery Divider Ribbon Cocoa - Full Screen Width Divider */}
      <div ref={cocoaRibbonRef} className="relative w-full overflow-hidden py-1 z-30 select-none pointer-events-none" id="gallery-ribbon-container">
        <motion.div
          style={{ clipPath: cocoaRibbonClipPath, opacity: cocoaRibbonOpacity }}
          className="w-[130vw] md:w-[115vw] relative left-1/2 right-1/2 -translate-x-1/2 flex justify-center pointer-events-none"
        >
          <img
            src={ribbonCocoa}
            alt="Ribbon Cocoa"
            loading="lazy"
            decoding="async"
            className="w-full h-auto max-h-[140px] md:max-h-[160px] object-cover scale-[1.25] md:scale-100 origin-center pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* Lokasi & Waktu Acara Section (Immersive Full-Width Bleed) */}
      <section className="relative z-20 w-full py-24 text-center space-y-12 overflow-hidden border-y border-amber-500/10" id="location-time-section">
        {/* Decorative background lights and image */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Elegant Background Image */}
          <div className="absolute inset-0 opacity-100">
            <img
              src="https://raw.githubusercontent.com/ImperviousGorda/img-for-web/refs/heads/main/BG.jpg"
              alt="Decorative Background Pattern"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Smooth Edge Blend and Light Overlay for Text Readability */}
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040404] via-transparent to-[#040404]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#040404] via-transparent to-[#040404]" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[150px]" />
        </div>

        {/* Section Header */}
        {/* Main Content Wrapper */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 space-y-12">
          <motion.div
          className="space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="flex justify-center items-center space-x-3"
          >
            <div className="w-8 h-[1px] bg-amber-500/30"></div>
            <p className="text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase font-cinzel">LOKASI & JADWAL</p>
            <div className="w-8 h-[1px] bg-amber-500/30"></div>
          </motion.div>
          <motion.h3
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="font-amagro text-3xl lg:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fef4db] via-[#d4af37] to-[#8a6f27]"
          >
            Waktu & Tempat Pelaksanaan
          </motion.h3>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="font-amagro text-sm font-semibold tracking-widest text-amber-500/80 uppercase"
          >
            Hadiri dan Saksikan The Absolute Panggung Gembira
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: { opacity: 1, scaleX: 1, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mt-4 origin-center"
          ></motion.div>
        </motion.div>

        {/* Info Grid & Maps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
          {/* Information Cards (5 cols) */}
          <motion.div
            className="lg:col-span-5 flex flex-col justify-between gap-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Card 1: Waktu */}
            <div className="bg-[#030303]/80 border border-amber-500/15 rounded-2xl p-6 md:p-8 flex items-start space-x-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-amber-500/30 transition-all duration-300 relative group">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-2xl group-hover:h-full transition-all duration-300"></div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400 shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                <Clock className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="space-y-2">
                <h4 className="font-amagro text-lg font-bold text-amber-300 tracking-wide">
                  Waktu Pelaksanaan
                </h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <p className="font-semibold text-amber-100">Ahad, 13 September 2026</p>
                  <p className="text-xs text-gray-400">Pukul 19.00 WIB s.d. Selesai</p>
                  <p className="text-xs text-amber-500/70 italic mt-1">* Diharapkan hadir 15 menit sebelum acara dimulai</p>
                </div>
              </div>
            </div>

            {/* Card 2: Tempat */}
            <div className="bg-[#030303]/80 border border-amber-500/15 rounded-2xl p-6 md:p-8 flex items-start space-x-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-amber-500/30 transition-all duration-300 relative group flex-1">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-2xl group-hover:h-full transition-all duration-300"></div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400 shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                <MapPin className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="space-y-2">
                <h4 className="font-amagro text-lg font-bold text-amber-300 tracking-wide">
                  Lokasi Pagelaran
                </h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <p className="font-semibold text-amber-100">Lapangan Sintesa Gontor Kampus 2</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Darussalam, Madusari, Kec. Siman, Kabupaten Ponorogo, Jawa Timur 63471
                  </p>
                  <span className="inline-block mt-2 text-[10px] bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded border border-amber-500/20 font-mono tracking-widest uppercase">
                    KAMPUS PUTRA GONTOR 2
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map Embed (7 cols) */}
          <motion.div
            className="lg:col-span-7 h-[320px] md:h-[400px] rounded-2xl overflow-hidden border-2 border-amber-500/20 shadow-[0_15px_40px_rgba(0,0,0,0.8)] relative bg-[#040404]"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Elegant outer frame glow */}
            <div className="absolute inset-0 border border-amber-500/10 pointer-events-none rounded-2xl z-10" />
            <iframe
              title="Peta Pondok Modern Darussalam Gontor Kampus 2"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3288.0941984122287!2d111.4578156741049!3d-7.906782178686045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e797566935729b7%3A0x6528662bf74ac3e0!2sPondok%20Modern%20Darussalam%20Gontor%202%20Putera!5e1!3m2!1sid!2sid!4v1782923087498!5m2!1sid!2sid"
              className="w-full h-full border-0 filter grayscale opacity-80 contrast-125 brightness-90 hover:filter-none hover:opacity-100 transition-all duration-500"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
        </div>
      </section>

      {/* Main Theme Footer (Matching Reference Design) */}
      <Footer
        onOpenContact={() => setIsContactOpen(true)}
        onOpenGuidebook={() => setIsDetailsOpen(true)}
        onScrollToFlyer={() => {
          const el = document.getElementById('flyer-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* MODAL 1: TRAILER (YOUTUBE EMBED) */}
      {isTrailerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm transition-all duration-300" id="trailer-modal-backdrop">
          <div className="relative w-full max-w-4xl mx-4 bg-[#030303] rounded-xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.95)] gold-outer-glow">
            <button
              onClick={() => setIsTrailerOpen(false)}
              className="absolute top-4 right-4 text-amber-400 hover:text-amber-200 text-3xl z-20 cursor-pointer p-1"
              id="close-trailer-btn"
              aria-label="Close trailer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video w-full bg-black">
              <iframe
                id="trailer-video-iframe"
                className="w-full h-full"
                src="https://www.youtube.com/embed/gEP2B_yH3I0?autoplay=1"
                title="Panggung Gembira Trailer Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PERTUNJUKAN BABAK SCHEDULE DETAILS */}
      {isDetailsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-all duration-300 p-4 sm:p-6 overflow-y-auto"
          id="details-modal-backdrop"
          data-lenis-prevent
        >
          <div
            className="relative w-full max-w-xl mx-auto my-auto bg-[#040404] rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)] max-h-[85vh] overflow-y-auto scrollbar-hidden gold-outer-glow"
            data-lenis-prevent
          >
            <button
              onClick={() => setIsDetailsOpen(false)}
              className="absolute top-4 right-4 text-amber-400 hover:text-amber-200 cursor-pointer p-1"
              id="close-details-btn"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-cinzel text-2xl font-bold text-amber-300 text-center mb-6 tracking-wide">
              SUSUNAN ACARA SPECTACULAR
            </h3>
            
            <div className="space-y-6 text-sm text-gray-300">
              {showBabaks.map((babak, index) => (
                <div key={index} className="border-b border-amber-500/10 pb-4 last:border-none">
                  <div className="flex justify-between items-start">
                    <span className="text-amber-400 font-semibold block text-sm tracking-wider uppercase">
                      {babak.title}
                    </span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-300 font-medium px-2 py-0.5 rounded border border-amber-500/20">
                      {babak.time}
                    </span>
                  </div>
                  <p className="text-xs mt-2 text-gray-400 leading-relaxed">{babak.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FEATURED EVENTS CATEGORIES GRID */}
      {isFeaturedEventsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-all duration-300 p-4 sm:p-6 md:p-8 overflow-y-auto"
          id="featured-events-modal-backdrop"
          data-lenis-prevent
        >
          <div
            className="relative w-full max-w-7xl mx-auto my-auto bg-[#040404] border border-amber-500/10 rounded-2xl p-6 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.95)] max-h-[85vh] overflow-y-auto scrollbar-hidden gold-outer-glow"
            data-lenis-prevent
          >
            {/* Close Button */}
            <button
              onClick={() => setIsFeaturedEventsModalOpen(false)}
              className="absolute top-4 right-4 text-amber-400 hover:text-amber-200 cursor-pointer p-1 transition-colors duration-200"
              id="close-featured-modal-btn"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-2 mb-10">
              <span className="text-[10px] font-semibold tracking-[0.3em] text-amber-500 uppercase font-mono">// MAHA KARYA</span>
              <h3 className="font-amagro text-2xl md:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#fef4db] via-[#d4af37] to-[#8a6f27]">
                Daftar Seluruh Acara
              </h3>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mt-2"></div>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start" id="events-categories-grid">
              {[
                {
                  title: "MUSIK & SUARA",
                  count: 6,
                  icon: <Volume2 className="w-5 h-5 text-amber-500/90" />,
                  items: [
                    "Hadroh 6101",
                    "Choir Panggung Gembira",
                    "Catalyst Band (Grand Opening : OST PG 6101)",
                    "Catalyst Band (Wali : Kuy Hijrah)",
                    "Catalyst Band (Grand Closing : Selama Kau Ada)",
                    "Absolute Nasheed 101",
                  ],
                  hasRightBar: true
                },
                {
                  title: "NON-PERFORMANCE",
                  count: 4,
                  icon: <Languages className="w-5 h-5 text-amber-500/90" />,
                  items: [
                    "Master of Ceremony",
                    "Sambutan Ketua",
                    "Tilawah Ayat Suci Al-Quran",
                    "Grand Opening",
                  ],
                  hasRightBar: false
                },
                {
                  title: "TEATER & ATRAKSI",
                  count: 6,
                  icon: <Drama className="w-5 h-5 text-amber-500/90" />,
                  items: [
                    "Puisi",
                    "Sulap",
                    "Drama Kabaret",
                    "Lisanul Udaba",
                    "Wayang Duryadhana",
                    "Drama The Absolute Wisdom",
                  ],
                  hasRightBar: true
                },
                {
                  title: "TARI-TARIAN",
                  count: 13,
                  icon: <Sparkles className="w-5 h-5 text-amber-500/90" />,
                  items: [
                    "Tari Aceh",
                    "Etnic Art Java",
                    "Reog Ponorogo",
                    "Tari Kecak",
                    "Campursari",
                    "Tari Piring",
                    "Tari TImur",
                    "Six Archive",
                    "Double Edge Katana",
                    "Bollywood Dance",
                    "KInjaz",
                    "Imperstyle",
                    "Khap-Khap",
                  ],
                  hasRightBar: true
                }
              ].map((category, catIndex) => (
                <div
                  key={catIndex}
                  className="relative bg-[#080705]/95 border border-amber-500/20 rounded-3xl p-6 min-h-[480px] shadow-[0_15px_35px_rgba(0,0,0,0.85)] hover:border-amber-400/40 transition-all duration-300 flex flex-col"
                >
                  {/* Right yellow accent bar as in screenshot */}
                  {category.hasRightBar && (
                    <div className="absolute right-0 top-[15%] bottom-[15%] w-[3px] bg-[#d4af37] rounded-l-full shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
                  )}

                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-amber-500/10">
                    <div className="flex items-center space-x-3">
                      {category.icon}
                      <h4 className="font-amagro text-xs sm:text-sm font-bold tracking-wider text-amber-100">
                        {category.title}
                      </h4>
                    </div>
                    {/* Badge Count */}
                    <div className="w-5 h-5 rounded-full border border-amber-500/40 flex items-center justify-center text-[10px] font-mono text-amber-400">
                      {category.count}
                    </div>
                  </div>

                  {/* List of Items */}
                  <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[280px] sm:max-h-[340px] pr-1 scrollbar-hidden" data-lenis-prevent>
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start text-left group">
                        <span className="text-amber-500/60 font-mono text-xs mr-3 select-none pt-0.5 group-hover:text-amber-400 transition-colors">
                          +
                        </span>
                        <span className="text-xs sm:text-[13px] text-gray-300 font-sans tracking-wide leading-relaxed font-light group-hover:text-white transition-colors">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CONTACT FORM */}
      {isContactOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-all duration-300 p-4 overflow-y-auto"
          id="contact-modal-backdrop"
          data-lenis-prevent
        >
          <div
            className="relative w-full max-w-md mx-auto my-auto bg-[#040404] rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)] gold-outer-glow max-h-[90vh] overflow-y-auto scrollbar-hidden"
            data-lenis-prevent
          >
            <button
              onClick={() => setIsContactOpen(false)}
              className="absolute top-4 right-4 text-amber-400 hover:text-amber-200 cursor-pointer p-1"
              id="close-contact-btn"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-cinzel text-xl font-bold text-amber-300 text-center mb-6 tracking-wider">
              HUBUNGI KAMI
            </h3>
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-amber-400 tracking-wider mb-1.5 uppercase font-semibold">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-black/60 border border-amber-500/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <label className="block text-amber-400 tracking-wider mb-1.5 uppercase font-semibold">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black/60 border border-amber-500/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="Masukkan email aktif"
                />
              </div>
              <div>
                <label className="block text-amber-400 tracking-wider mb-1.5 uppercase font-semibold">Isi Pesan</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-black/60 border border-amber-500/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="Ketik pesan Anda di sini..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-400 text-black font-bold uppercase tracking-wider hover:brightness-110 transition-all duration-300 rounded-xl flex items-center justify-center space-x-2 cursor-pointer text-xs"
                id="btn-submit-contact"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Pesan</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ELEGANT GALLERY LIGHTBOX */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/98 backdrop-blur-md p-4 md:p-8"
            id="lightbox-modal-backdrop"
            onClick={() => setActiveImageIndex(null)}
          >
            {/* Upper control header */}
            <div className="absolute top-4 right-4 md:top-6 md:right-8 flex items-center space-x-4 z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(null);
                }}
                className="w-12 h-12 rounded-full bg-zinc-900/80 border border-amber-500/20 text-amber-400 hover:text-amber-200 hover:border-amber-400 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.1)] active:scale-95"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Stage & Carousel Controls */}
            <div 
              className="relative w-full max-w-5xl flex items-center justify-center" 
              id="lightbox-carousel-stage"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : null));
                }}
                className="absolute left-2 md:-left-16 z-50 w-12 h-12 rounded-full bg-zinc-900/80 border border-amber-500/20 text-amber-400 hover:text-amber-200 hover:border-amber-400 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.1)] active:scale-95"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Central Image with Animation */}
              <motion.div
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full max-h-[70vh] aspect-video rounded-2xl overflow-hidden border border-amber-500/10 shadow-[0_0_50px_rgba(0,0,0,0.9)] bg-black flex items-center justify-center"
              >
                <img
                  src={galleryItems[activeImageIndex].image}
                  alt={galleryItems[activeImageIndex].title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </motion.div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev !== null ? (prev + 1) % galleryItems.length : null));
                }}
                className="absolute right-2 md:-right-16 z-50 w-12 h-12 rounded-full bg-zinc-900/80 border border-amber-500/20 text-amber-400 hover:text-amber-200 hover:border-amber-400 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.1)] active:scale-95"
                aria-label="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Content Footer */}
            <motion.div
              key={`desc-${activeImageIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="mt-6 md:mt-8 text-center max-w-2xl px-4 space-y-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                {galleryItems[activeImageIndex].category}
              </span>
              <h4 className="font-cinzel text-xl md:text-2xl font-bold text-amber-300 tracking-wide pt-2">
                {galleryItems[activeImageIndex].title}
              </h4>
              
              {/* Pagination indicators */}
              <div className="flex justify-center space-x-2 pt-4">
                {galleryItems.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeImageIndex ? 'bg-amber-400 w-3' : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
