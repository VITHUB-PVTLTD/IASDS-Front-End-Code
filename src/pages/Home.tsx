import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {

  BookOpen,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  X,
  ChevronRight,
  ChevronLeft,
  Building
} from "lucide-react";
import api from "../services/api";

export const Home: React.FC = () => {
  // Counters State
  // const [counters] = useState({ members: 2500, publications: 180, events: 45, awards: 12 });

  // Dynamic Bulletin Feeds
  const [updates, setUpdates] = useState<any[]>([]);
  const [councilMembers, setCouncilMembers] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  // Interactive Overlays
  const [isPresidentOpen, setIsPresidentOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState<any | null>(null);

  // Gallery items
  // const DEFAULT_GALLERY_IMAGES = [
  //   {
  //     url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
  //     caption: "IASDS National Conference 2026 Keynote Session"
  //   },
  //   {
  //     url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop",
  //     caption: "Executive Panel Discussion on Machine Learning & Statistics"
  //   },
  //   {
  //     url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
  //     caption: "Advanced Data Modelling Workshop - IIT Bombay"
  //   },
  //   {
  //     url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
  //     caption: "Felicitation Ceremony of Fellowship Inductees"
  //   },
  //   {
  //     url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
  //     caption: "Symposium on Mathematical Foundations of Artificial Intelligence"
  //   },
  //   {
  //     url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
  //     caption: "Colloquium of Young Researchers and Statisticians"
  //   }
  // ];

  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  // Carousel state
  // const DEFAULT_SLIDES = [
  //   {
  //     id: 0,
  //     imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop",
  //     title: "Advancing Statistics and Data Science Across India",
  //     subtitle: "Connecting researchers, academicians, students, and industry professionals to foster mathematical excellence, analytical breakthroughs, and empirical reasoning.",
  //     buttonLabel: "Become a Member",
  //     buttonLink: "/membership/register",
  //   },
  //   {
  //     id: 1,
  //     imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1600&auto=format&fit=crop",
  //     title: "National Conference on Statistics & Data Science 2026",
  //     subtitle: "Join India's leading statistical minds for keynote sessions, workshops, and collaborative research presentations at IASDS annual convention.",
  //     buttonLabel: "Explore Events",
  //     buttonLink: "/news-events",
  //   },
  //   {
  //     id: 2,
  //     imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1600&auto=format&fit=crop",
  //     title: "Academic Excellence in Statistical Research",
  //     subtitle: "IASDS supports peer-reviewed publications, skill-development workshops, and industry-academia collaborations across India.",
  //     buttonLabel: "View Achievements",
  //     buttonLink: "/achievements",
  //   },
  // ];

  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselTimerRef = useRef<number | null>(null);

  const startCarouselTimer = (total: number) => {
    if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
    carouselTimerRef.current = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % total);
    }, 5000);
  };

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    startCarouselTimer(slides.length);
  };

  const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);

  // Fetch News, Events, Council, Gallery, and Achievements from backend on mount
  useEffect(() => {
    const fetchHomeDetails = async () => {
      try {
        const [newsRes, carouselRes, councilRes, galleryRes, achievementsRes] = await Promise.all([
          api.get("/public/news"),
          api.get("/public/carousel"),
          api.get("/public/council"),
          api.get("/public/gallery"),
          api.get("/public/achievements"),
        ]);
        setUpdates(newsRes.data.slice(0, 3));
        if (carouselRes.data && carouselRes.data.length > 0) {
          setSlides(carouselRes.data);
        }
        if (councilRes.data && councilRes.data.length > 0) {
          const flatMembers = Array.isArray(councilRes.data) && councilRes.data.length > 0 && "type" in councilRes.data[0]
            ? councilRes.data.flatMap((g: any) => g.members)
            : councilRes.data;
          setCouncilMembers(flatMembers.slice(0, 4));
        }
        if (achievementsRes.data && achievementsRes.data.length > 0) {
          setAchievements(achievementsRes.data.slice(0, 3));
        }
        if (galleryRes.data && galleryRes.data.length > 0) {
          // Flatten all images from all albums and limit to 6
          const allImages: any[] = [];
          galleryRes.data.forEach((album: any) => {
            if (album.images && Array.isArray(album.images)) {
              album.images.forEach((img: any) => {
                allImages.push({
                  url: img.imageUrl,
                  caption: img.caption || album.name,
                });
              });
            }
          });
          if (allImages.length > 0) {
            setGalleryImages(allImages.slice(0, 6));
          }
        }
      } catch (err) {
        console.error("Failed to load home page feed data:", err);
      }
    };
    fetchHomeDetails();
  }, []);

  // Start auto-advance after slides are set
  useEffect(() => {
    startCarouselTimer(slides.length);
    return () => { if (carouselTimerRef.current) clearInterval(carouselTimerRef.current); };
  }, [slides.length]);

  // Animated Counter Item
  // const CounterItem = ({ target, label, icon: Icon }: any) => {
  //   const [count, setCount] = useState(0);
  //   useEffect(() => {
  //     let start = 0;
  //     const end = target;
  //     if (start === end) return;
  //     const duration = 1500;
  //     const stepTime = Math.abs(Math.floor(duration / end));
  //     const timer = setInterval(() => {
  //       start += Math.ceil(end / 100);
  //       if (start >= end) {
  //         start = end;
  //         clearInterval(timer);
  //       }
  //       setCount(start);
  //     }, Math.max(stepTime, 15));
  //     return () => clearInterval(timer);
  //   }, [target]);

  //   return (
  //     <div className="bg-slate-50 p-6 rounded border border-gray-200/80 text-center select-none flex flex-col items-center">
  //       <div className="w-10 h-10 bg-[#EAF4FC] text-[#0D5C99] flex items-center justify-center rounded mb-3">
  //         <Icon className="w-5 h-5" />
  //       </div>
  //       <span className="font-heading font-extrabold text-2xl text-slate-800 tracking-tight">
  //         {count.toLocaleString()}+
  //       </span>
  //       <span className="text-[10px] font-bold text-slate-500 mt-1.5 uppercase tracking-widest">
  //         {label}
  //       </span>
  //     </div>
  //   );
  // };

  return (
    <div className="relative min-h-screen bg-white">

      {/* SECTION 1: HERO CAROUSEL */}
      <section
        className="relative w-full overflow-hidden bg-slate-950 select-none"
        style={{ height: "490px" }}
      >
        {/* Slides */}
        {(() => {
          const hasText = !!slides[currentSlide]?.title;
          return (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${slides[currentSlide]?.imageUrl}')`, opacity: hasText ? 0.75 : 1.0 }}
                  />
                  {hasText && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#031826]/75 via-[#031826]/55 to-transparent" />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Content overlay */}
              {hasText && (
                <div className="relative h-full w-full z-10 flex items-center px-8 sm:px-14">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`content-${currentSlide}`}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.55, delay: 0.1 }}
                      className="max-w-3xl space-y-6 text-white text-left"
                    >
                      <span className="inline-flex items-center px-3 py-1 rounded bg-white/10 border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest">
                        National Governing Body
                      </span>
                      <h2 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
                        {slides[currentSlide]?.title}
                      </h2>
                      {slides[currentSlide]?.subtitle && (
                        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
                          {slides[currentSlide].subtitle}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 pt-3">
                        {slides[currentSlide]?.buttonLabel && slides[currentSlide]?.buttonLink && (
                          <Link
                            to={slides[currentSlide].buttonLink}
                            className="bg-[#0D5C99] hover:bg-[#083B66] text-white px-6 py-3 rounded text-sm font-bold shadow-md transition-all flex items-center space-x-2"
                          >
                            <span>{slides[currentSlide].buttonLabel}</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          to="/membership/register"
                          className="bg-transparent hover:bg-white/5 text-white border border-white/40 px-6 py-3 rounded text-sm font-bold transition-all"
                        >
                          Apply for Membership
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </>
          );
        })()}

        {/* Previous arrow */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/55 text-white flex items-center justify-center transition-all border border-white/15"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next arrow */}
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/55 text-white flex items-center justify-center transition-all border border-white/15"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="transition-all duration-300"
              style={{
                width: idx === currentSlide ? "28px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: idx === currentSlide ? "#D30090" : "rgba(255,255,255,0.45)",
              }}
            />
          ))}
        </div>

        {/* Slide counter */}
        {/* <div className="absolute bottom-5 right-6 z-20 text-white/50 text-xs font-mono">
          {currentSlide + 1} / {slides.length}
        </div> */}
      </section>

      {/* NOTIFICATIONS TICKER */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          background: "#1A3A5C",
          borderBottom: "3px solid #D30090",
          minHeight: "44px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Left label panel */}
        <div
          style={{
            flexShrink: 0,
            background: "#00357D",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 20px",
            zIndex: 10,
            boxShadow: "4px 0 12px rgba(0,0,0,0.25)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: "13px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Notifications
          </span>
        </div>

        {/* Scrolling ticker area */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          {updates.length === 0 ? (
            // Fallback static items while loading
            <div
              className="notif-ticker-track"
              style={{ display: "flex", gap: "0", whiteSpace: "nowrap" }}
            >
              {[
                "IASDS Annual Conference 2026 – Registration Now Open",
                "New Fellowship Applications Invited – Apply by July 31",
                "Journal of Statistics & Data Science – Volume 12 Published",
                "IASDS Regional Workshop on Machine Learning – Delhi Chapter",
                "Call for Abstracts: National Symposium on Biostatistics 2026",
              ].concat([
                "IASDS Annual Conference 2026 – Registration Now Open",
                "New Fellowship Applications Invited – Apply by July 31",
                "Journal of Statistics & Data Science – Volume 12 Published",
                "IASDS Regional Workshop on Machine Learning – Delhi Chapter",
                "Call for Abstracts: National Symposium on Biostatistics 2026",
              ]).map((text, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "8px", paddingRight: "56px" }}>
                  <span style={{
                    background: "#D30090", color: "#fff", fontSize: "9px",
                    fontWeight: 800, padding: "2px 6px", borderRadius: "3px",
                    letterSpacing: "0.08em", flexShrink: 0,
                  }}>NEW</span>
                  <span style={{ color: "#E0EEFF", fontSize: "13px", fontWeight: 600, letterSpacing: "0.01em" }}>{text}</span>
                </span>
              ))}
            </div>
          ) : (
            <div
              className="notif-ticker-track"
              style={{ display: "flex", gap: "0", whiteSpace: "nowrap" }}
            >
              {/* Duplicate for seamless loop */}
              {[...updates, ...updates].map((item: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setNotifOpen(item)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    paddingRight: "56px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span style={{
                    background: "#D30090", color: "#fff", fontSize: "9px",
                    fontWeight: 800, padding: "2px 6px", borderRadius: "3px",
                    letterSpacing: "0.08em", flexShrink: 0,
                  }}>NEW</span>
                  <span
                    style={{
                      color: "#E0EEFF",
                      fontSize: "13px",
                      fontWeight: 600,
                      letterSpacing: "0.01em",
                      transition: "color 200ms",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#E0EEFF")}
                  >
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notification Detail Modal */}
      {notifOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setNotifOpen(null)}
        >
          <div
            style={{
              background: "#fff", borderRadius: "16px", maxWidth: "560px", width: "100%",
              boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
              overflow: "hidden", position: "relative",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ background: "#00357D", padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{
                background: "#D30090", color: "#fff", fontSize: "9px",
                fontWeight: 800, padding: "3px 8px", borderRadius: "4px",
                letterSpacing: "0.1em", flexShrink: 0, marginTop: "3px",
              }}>NEW</span>
              <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "17px", lineHeight: 1.35, margin: 0, flex: 1 }}>
                {notifOpen.title}
              </h3>
              <button
                onClick={() => setNotifOpen(null)}
                style={{
                  background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
                  width: "28px", height: "28px", borderRadius: "8px",
                  cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0, fontSize: "16px", fontWeight: 700,
                }}
              >×</button>
            </div>

            {/* Modal image if present */}
            {notifOpen.imageUrl && (
              <img
                src={notifOpen.imageUrl}
                alt={notifOpen.title}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            )}

            {/* Modal body */}
            <div style={{ padding: "24px" }}>
              {notifOpen.description && (
                <div
                  dangerouslySetInnerHTML={{ __html: notifOpen.description }}
                  style={{ color: "#374151", fontSize: "14px", lineHeight: 1.7, marginBottom: "16px" }}
                />
              )}
              {notifOpen.content && (
                <div
                  dangerouslySetInnerHTML={{ __html: notifOpen.content }}
                  style={{ color: "#6B7280", fontSize: "13px", lineHeight: 1.8 }}
                />
              )}
              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#9CA3AF", fontSize: "11px" }}>
                  {notifOpen.createdAt ? new Date(notifOpen.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "IASDS Notice"}
                </span>
                <button
                  onClick={() => setNotifOpen(null)}
                  style={{
                    background: "#00357D", color: "#fff", border: "none",
                    borderRadius: "8px", padding: "8px 20px", fontWeight: 700,
                    fontSize: "13px", cursor: "pointer",
                  }}
                >Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticker animation CSS */}
      <style>{`
        .notif-ticker-track {
          animation: ticker-scroll 18s linear infinite;
        }
        .notif-ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* SECTION 2: ABOUT IASDS */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left: Image (5/12 cols) */}
            <div className="lg:col-span-5 relative">
              <img
                src="./assets/logo.jpg"
                alt="IASDS Council Board"
                className="rounded border border-gray-200 shadow shadow-black/5 object-cover w-full h-full"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#EAF4FC] -z-10 rounded" />
            </div>

            {/* Right: Content (7/12 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[#0D5C99] text-[11px] font-bold uppercase tracking-widest block">About IASDS</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
                  The Indian Association of Statistics & Data Science
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">
                Indian Association of Statistics and Data Science (IASDS) is a national
                professional forum dedicated to the advancement of Statistics and Data
                Science through research, education, consultancy, innovation, and policy support. The Association serves
                as a platform for academicians, researchers, students, industry experts, and policymakers to collaborate
                and create impactful data-driven solutions for the development of society and the nation. The IASDS is
                committed to nurturing future generations of statisticians and data scientists. By bringing together
                experts and enthusiasts from diverse domains, the association seeks to create a knowledge-driven society.
              </p>

              {/* Vision & Mission Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded bg-slate-50 border border-gray-200/80 hover:border-[#0D5C99]/30 hover:bg-[#EAF4FC]/10 transition-all group">
                  <h4 className="font-bold text-slate-800 text-sm mb-2">Our Vision</h4>
                  <p className="text-slate-800 text-sm leading-relaxed">
                    To emerge as India's premier professional body in Statistics and Data Science, fostering innovation,
                    research excellence, data-driven decision making, and sustainable national development through the
                    advancement and dissemination of statistical knowledge and modern data science practices.                  </p>
                </div>

                <div className="p-5 rounded bg-slate-50 border border-gray-200/80 hover:border-[#D87AB4]/30 hover:bg-[#EAF4FC]/10 transition-all group">
                  <h4 className="font-bold text-slate-800 text-sm mb-2">Our Mission</h4>
                  <p className="text-slate-800 text-sm leading-relaxed">
                    The mission of IASDS is to promote and propagate knowledge in Statistics and Data Science by encouraging
                    research, academic collaboration, professional training, consultancy, technological innovation, and
                    policy support. The Association is committed to building a strong ecosystem that connects academicians,
                    researchers, students, industry professionals, and policymakers to address real-world challenges
                    through statistical and data-driven solutions in India and beyond.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: EXECUTIVE COUNCIL HIGHLIGHTS */}
      {councilMembers.length > 0 && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-[85rem] mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="text-[#0D5C99] text-[11px] font-bold uppercase tracking-widest">Leadership</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                Executive Council
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Distinguished academicians guiding the association's strategies and scientific agendas.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {councilMembers.slice(0, 4).map((member) => {
                const badgeCls =
                  member.memberType === "Executive Council"
                    ? "bg-[#00357D]/10 text-[#00357D]"
                    : member.memberType === "Executive Council Members"
                      ? "bg-[#D30090]/10 text-[#D30090]"
                      : "bg-emerald-50 text-emerald-700";

                return (
                  <div
                    key={member.id}
                    className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group text-left"
                  >
                    {/* Card header gradient */}
                    <div className="h-20 bg-gradient-to-r from-primary/10 to-secondary/10" />

                    {/* Photo */}
                    <div className="flex justify-center -mt-12 relative z-10">
                      <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 shadow-md overflow-hidden">
                        <img
                          src={
                            member.photoUrl ||
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
                          }
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="p-5 text-center space-y-3">
                      <div>
                        <h3 className="font-bold text-base text-slate-800 tracking-tight group-hover:text-primary transition-colors leading-tight">
                          {member.name}
                        </h3>
                        <span
                          className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1.5 ${badgeCls}`}
                        >
                          {member.designation}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-50 pt-3 text-left">
                        <div className="flex items-center space-x-2">
                          <Building className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="line-clamp-2 leading-tight">{member.institution}</span>
                        </div>
                        {member.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                            <a
                              href={`mailto:${member.email}`}
                              className="hover:underline text-primary truncate"
                            >
                              {member.email}
                            </a>
                          </div>
                        )}
                        {member.phoneNumber && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{member.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/council"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0D5C99] hover:underline uppercase tracking-wider"
            >
              <span>View Full Council Directory</span>
            </Link>
          </div>
        </section>
      )}

      {/* SECTION 5: LATEST NEWS & EVENTS */}
      < section className="py-20 bg-[#EAF4FC]/10 border-b border-gray-100" >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <span className="text-[#0D5C99] text-[11px] font-bold uppercase tracking-widest block">Bulletin</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
                Announcements & Conventions
              </h3>
            </div>
            <Link
              to="/news-events"
              className="text-xs font-bold text-[#0D5C99] hover:underline uppercase tracking-wider flex items-center space-x-1 mt-3 sm:mt-0"
            >
              <span>Bulletin Archives</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {updates.length > 0 ? (
              updates.map((item) => (
                <div key={item.id} className="academic-card overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="h-44 bg-slate-100 relative">
                      <img
                        src={item.imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-3 left-3 bg-[#083B66] text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest rounded-sm">
                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="p-6 space-y-3">
                      <span className="text-[10px] text-[#D87AB4] font-bold uppercase tracking-wider">News Release</span>
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-2">{item.title}</h4>
                      <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-2">
                    <Link
                      to="/news-events"
                      className="text-[#0D5C99] text-xs font-bold hover:underline flex items-center space-x-1"
                    >
                      <span>Read Full Release</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // Fallback News Items if none in database
              <>
                <div className="academic-card p-6 space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
                    <span>12 June 2026</span>
                    <span className="text-[#D87AB4]">Conference</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Call for Papers: National Symposium 2026</h4>
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    Submissions are now open for the Annual Symposium on Advanced Computational Statistics to be hosted in Chennai.
                  </p>
                  <Link to="/news-events" className="text-[#0D5C99] text-xs font-bold hover:underline inline-flex items-center space-x-1">
                    <span>Details →</span>
                  </Link>
                </div>

                <div className="academic-card p-6 space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
                    <span>01 June 2026</span>
                    <span className="text-[#D87AB4]">Fellowship</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Nomination for IASDS Fellowship Inductions</h4>
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    Distinguished statisticians are invited to nominate candidates for the IASDS Fellow grade of membership for 2026.
                  </p>
                  <Link to="/news-events" className="text-[#0D5C99] text-xs font-bold hover:underline inline-flex items-center space-x-1">
                    <span>Details →</span>
                  </Link>
                </div>

                <div className="academic-card p-6 space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
                    <span>20 May 2026</span>
                    <span className="text-[#D87AB4]">Journal</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Release of Vol. 4 Issue 2 of IASDS Journal</h4>
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    Featuring pioneering peer-reviewed manuscripts focusing on statistical learning theory and regression models.
                  </p>
                  <Link to="/news-events" className="text-[#0D5C99] text-xs font-bold hover:underline inline-flex items-center space-x-1">
                    <span>Details →</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section >

      {/* SECTION 6: PUBLICATIONS */}
      {/* < section className="py-20 bg-white border-b border-gray-100" >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            Left: Content Description (5/12 cols)
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[#0D5C99] text-[11px] font-bold uppercase tracking-widest block">IASDS Press</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
                  Peer-Reviewed Journals & Conference Archives
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                IASDS publishes high-impact academic works, including quarterly research journals and national conference proceeding registries, keeping scholars up to date on mathematical modeling and statistical computer programming algorithms.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                  <Bookmark className="w-4 h-4 text-[#D87AB4]" />
                  <span>ISSN: 2584-387X (Print Version)</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                  <Bookmark className="w-4 h-4 text-[#D87AB4]" />
                  <span>Indexing: Google Scholar, CrossRef, Scopus Pending</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/publications"
                  className="bg-[#0D5C99] hover:bg-[#083B66] text-white px-5 py-2.5 rounded text-xs font-bold shadow"
                >
                  Explore Journal Archive
                </Link>
              </div>
            </div>

            Right: Featured Publications Cards (7/12 cols)
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">

              Publication Cover Card 1
              <div className="academic-card p-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-full h-48 bg-slate-50 border border-gray-100 flex items-center justify-center p-2 rounded">
                    <img
                      src="/assets/journal.png"
                      alt="Journal Cover"
                      className="h-full object-contain shadow shadow-black/10 border border-gray-200"
                    />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">IASDS Journal of Statistical Informatics</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Vol. 4, Issue 2 • June 2026. Peer-reviewed journal covering analytical proofs.</p>
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert("File download initiated (Demo)."); }}
                    className="text-xs text-[#0D5C99] hover:underline font-bold flex items-center space-x-1"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Cover PDF</span>
                  </a>
                </div>
              </div>

              Publication Cover Card 2
              <div className="academic-card p-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-full h-48 bg-slate-50 border border-gray-100 flex items-center justify-center p-4 rounded">
                    SVG representation of standard conference proceedings
                    <div className="h-full w-32 bg-[#083B66] text-white p-3 flex flex-col justify-between border-r-4 border-l border-t border-b border-[#D87AB4] shadow">
                      <span className="text-[8px] uppercase tracking-widest font-bold">IASDS</span>
                      <span className="text-[10px] font-extrabold uppercase leading-snug">National Proceedings</span>
                      <span className="text-[6px] text-white/70">Estd 2026</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Proceedings of IASDS Annual Convention</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Annual registry compiling 45 papers from the 2025 National Convention.</p>
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert("File download initiated (Demo)."); }}
                    className="text-xs text-[#0D5C99] hover:underline font-bold flex items-center space-x-1"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Proceedings</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section > */}

      {/* SECTION 7: HONORS & AWARDS */}
      {/* <section className="py-20 bg-[#EAF4FC]/30 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-[#0D5C99] text-[11px] font-bold uppercase tracking-widest">Honors & Accolades</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Honors & Annual Awards
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Celebrating distinguished excellence and scientific impact in the disciplines of mathematical and data-centric science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white border border-gray-200 rounded p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#EAF4FC] text-[#0D5C99] rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">IASDS Lifetime Achievement Award</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Conferred upon senior academicians who have dedicated over three decades to statistical teaching, publications, and foundational theoretical proofs.
                </p>
              </div>
              <div className="pt-6 border-t border-gray-100 mt-6 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">2026 Nominee Selected</span>
                <Link to="/awards" className="text-xs font-bold text-[#0D5C99] hover:underline">View Laureate</Link>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#EAF4FC] text-[#0D5C99] rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Young Statistician Award</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Honoring brilliant early-career scientists under 35 years who have published breakthrough algorithms or novel statistical learning concepts.
                </p>
              </div>
              <div className="pt-6 border-t border-gray-100 mt-6 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Applications Open</span>
                <Link to="/awards" className="text-xs font-bold text-[#0D5C99] hover:underline">View Laureate</Link>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#EAF4FC] text-[#0D5C99] rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Fellow of the Association (FIASDS)</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  The highest grade of membership, awarded selectively to scholars demonstrating outstanding contributions in high-performance computing algorithms.
                </p>
              </div>
              <div className="pt-6 border-t border-gray-100 mt-6 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Nomination Format</span>
                <Link to="/awards" className="text-xs font-bold text-[#0D5C99] hover:underline">View Laureate</Link>
              </div>
            </div>

          </div>
        </div >
      </section > */}

      {/* SECTION 8: ACHIEVEMENTS */}
      {achievements.length > 0 && (
        <section className="py-20 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
              <span className="text-[#0D5C99] text-[11px] font-bold uppercase tracking-widest">Milestones</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                IASDS Achievements
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Documenting the milestones of our association as we build a robust mathematical infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {achievements.slice(0, 3).map((ach) => (
                <div key={ach.id} className="academic-card p-6 flex flex-col justify-between space-y-4">
                  <span className="text-[#D87AB4] text-xs font-extrabold tracking-widest uppercase">
                    {ach.category || "Success Story"}
                  </span>
                  <h4 className="font-bold text-slate-800 text-base">{ach.title}</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {ach.description && ach.description.length > 185
                      ? `${ach.description.substring(0, 185)}...`
                      : ach.description}
                  </p>
                  <Link to="/achievements" className="text-[#0D5C99] text-xs font-bold hover:underline inline-flex items-center space-x-1 mt-2">
                    <span>Explore Details →</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 9: PHOTO GALLERY */}
      < section className="py-20 bg-[#EAF4FC]/10 border-b border-gray-100 select-none" >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <span className="text-[#0D5C99] text-[11px] font-bold uppercase tracking-widest block">Photos</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
                Media Gallery
              </h3>
            </div>
            <Link
              to="/gallery"
              className="text-xs font-bold text-[#0D5C99] hover:underline uppercase tracking-wider flex items-center space-x-1 mt-3 sm:mt-0"
            >
              <span>Explore Gallery Archives</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Masonry Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className="group relative cursor-pointer overflow-hidden border border-gray-200 rounded-sm shadow-sm"
                onClick={() => setLightboxImage(img.url)}
              >
                <div className="h-56 overflow-hidden bg-slate-900">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                  <p className="text-white text-xs font-semibold uppercase tracking-wider leading-snug">{img.caption}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Click to view image</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* SECTION 10: COLLABORATIONS */}
      {/* < section className="py-16 bg-slate-900 text-white overflow-hidden select-none border-b border-gray-800" >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-[#D87AB4] text-[11px] uppercase tracking-widest font-extrabold">Collaborations</span>
          <h3 className="text-xl font-bold mt-1.5 mb-10">Supporting Academic Institutions & Industry</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center opacity-60">
            <div className="border border-white/10 py-3 rounded text-slate-300 font-heading font-extrabold text-sm uppercase tracking-wider select-none">
              ISI DELHI
            </div>
            <div className="border border-white/10 py-3 rounded text-slate-300 font-heading font-extrabold text-sm uppercase tracking-wider select-none">
              IIT BOMBAY
            </div>
            <div className="border border-white/10 py-3 rounded text-slate-300 font-heading font-extrabold text-sm uppercase tracking-wider select-none">
              IISc BANGALORE
            </div>
            <div className="border border-white/10 py-3 rounded text-slate-300 font-heading font-extrabold text-sm uppercase tracking-wider select-none">
              IIT DELHI
            </div>
            <div className="border border-white/10 py-3 rounded text-slate-300 font-heading font-extrabold text-sm uppercase tracking-wider select-none">
              NIT TRICHY
            </div>
            <div className="border border-white/10 py-3 rounded text-slate-300 font-heading font-extrabold text-sm uppercase tracking-wider select-none">
              CSIR INDIA
            </div>
          </div>
        </div>
      </section > */}

      {/* SECTION 11: MEMBERSHIP BENEFITS */}
      < section className="py-5 bg-white border-b border-gray-100" >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-[#0D5C99] text-[11px] font-bold uppercase tracking-widest">Admissions</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Membership Benefits
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Gain professional credentials and tap into a rich national network of research colleagues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Benefit 1 */}
            <div className="bg-slate-50 p-8 rounded border border-gray-200/80 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-[#EAF4FC] text-[#0D5C99] rounded flex items-center justify-center mb-6">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-3">Academic Benefits</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Access professional networking opportunities with statisticians, data scientists, researchers, and industry experts. Collaborate on interdisciplinary research projects and participate in technical committees, working groups, and special interest forums.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-slate-50 p-8 rounded border border-gray-200/80 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-[#EAF4FC] text-[#0D5C99] rounded flex items-center justify-center mb-6">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-3">Professional Development</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Access training programs in Statistics, Data Science, Machine Learning, Artificial Intelligence, and Analytics. Gain exposure to emerging methodologies, tools, technologies, mentoring opportunities, and professional recognition.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-slate-50 p-8 rounded border border-gray-200/80 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-[#EAF4FC] text-[#0D5C99] rounded flex items-center justify-center mb-6">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-3">Industry & Consultancy Benefits</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Access consultancy and project opportunities, collaborate with industry partners and government agencies, and participate in applied research and data-driven innovation projects.
              </p>
            </div>

          </div>

          <div className="text-center mt-12">
            <Link
              to="/membership/types"
              className="bg-[#0D5C99] hover:bg-[#083B66] text-white px-6 py-3 rounded text-sm font-bold shadow transition-all inline-block"
            >
              Learn More & Join Today
            </Link>
          </div>
        </div>
      </section >

      {/* SECTION 12: CONTACT SECTION */}
      < section className="py-20 bg-[#EAF4FC]/20" >
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2">

            {/* Left Column: Embed Map */}
            <div className="h-[400px] lg:h-auto bg-slate-100 min-h-[300px]">
              <iframe
                title="IASDS Delhi Office Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.3324067959293!2d79.81739097453196!3d11.949948736454122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5361768182cb81%3A0x577c9023a3df8858!2sMalar&#39;s%20Sunflower%20Apartment!5e1!3m2!1sen!2sin!4v1782213326530!5m2!1sen!2sin"
                className="w-full h-full border-none opacity-85"
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Right Column: Inquiry Form & Details */}
            <div className="p-8 sm:p-12 space-y-6 flex flex-col justify-center">
              <div>
                <span className="text-[#0D5C99] text-[11px] font-bold uppercase tracking-widest">Office Desk</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight mt-1">
                  IASDS Office Registry
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider block">Office Location</span>
                  <p className="text-slate-600 font-semibold flex items-start space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D87AB4] shrink-0 mt-0.5" />
                    <span>1-c, Malar Sunflower Apartment, 2nd sub lane, 16th Cross Street, Krishna Nagar, Lawspet, Puducherry (UTI), 605008.</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider block">Central Registry Desk</span>
                  <p className="text-slate-600 font-semibold flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-[#D87AB4] shrink-0" />
                    <span>+91 9629862241</span>
                  </p>
                  <p className="text-slate-600 font-semibold flex items-center space-x-1 mt-1">
                    <Mail className="w-3.5 h-3.5 text-[#D87AB4] shrink-0" />
                    <span>indianasandds@gmail.com</span>
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-150 pt-6">
                <h4 className="font-bold text-slate-800 text-sm mb-3">Quick Inquiry Submission</h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Please visit the Contact Us page to submit your inquiry.");
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="FullName"
                      className="bg-slate-50 border border-gray-200 rounded p-2 text-xs focus:outline-[#0D5C99]"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="bg-slate-50 border border-gray-200 rounded p-2 text-xs focus:outline-[#0D5C99]"
                      required
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Your inquiry description..."
                    className="w-full bg-slate-50 border border-gray-200 rounded p-2 text-xs focus:outline-[#0D5C99]"
                    required
                  />
                  <Link
                    to="/contact"
                    className="w-full bg-[#0D5C99] hover:bg-[#083B66] text-white text-center py-2.5 rounded text-xs font-bold transition-all block"
                  >
                    Go to Registry Form Page
                  </Link>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section >

      {/* MODAL 1: PRESIDENT MESSAGE READ MORE */}
      <AnimatePresence>
        {
          isPresidentOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsPresidentOpen(false)}
                className="absolute inset-0 bg-black"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded p-6 sm:p-8 z-50 shadow-2xl overflow-y-auto max-h-[85vh] text-slate-700"
              >
                <div className="flex justify-between items-center pb-4 border-b border-gray-150">
                  <h4 className="font-heading font-extrabold text-lg text-slate-800 uppercase tracking-wider">President's Greeting Message</h4>
                  <button onClick={() => setIsPresidentOpen(false)} className="p-1 hover:bg-slate-100 rounded">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <div className="space-y-4 pt-6 text-xs sm:text-sm leading-relaxed text-slate-600">
                  <p><strong>Dear Colleagues, Researchers, and Students,</strong></p>
                  <p>
                    On behalf of the Executive Council, it is my distinct honour to welcome you to the web portal of the Indian Association of Statistics & Data Science (IASDS).
                  </p>
                  <p>
                    Statistics has always been the key tool for logical reasoning, planning, and scientific discovery. Today, with the exponential rise of computing capabilities and massive datasets, data science has emerged to complement classical statistical learning theory. The synergy between these disciplines represents one of the most exciting developments in modern academia.
                  </p>
                  <p>
                    At IASDS, our mission is to foster this synergy across India. We aim to support academicians by publishing high-impact peer-reviewed journals, establishing student chapters in regional universities, and organizing national symposiums. We are committed to maintaining the highest standards of scientific rigour and teaching methodology.
                  </p>
                  <p>
                    I invite you to review our membership application criteria and become an active participant in our national research ecosystem.
                  </p>
                  <p className="pt-4">
                    Warm regards,
                    <br />
                    <strong>Prof. Dr. S. K. Srinivasan</strong>
                    <br />
                    President, IASDS Executive Council
                  </p>
                </div>
              </motion.div>
            </div>
          )
        }
      </AnimatePresence >

      {/* MODAL 2: GALLERY LIGHTBOX */}
      <AnimatePresence>
        {
          lightboxImage && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxImage(null)}
                className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4 cursor-zoom-out"
              >
                <div className="relative max-w-4xl max-h-[90vh] flex flex-col justify-center items-center">
                  <button
                    onClick={() => setLightboxImage(null)}
                    className="absolute -top-12 right-0 p-1 hover:bg-white/10 rounded text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <img
                    src={lightboxImage}
                    alt="Enlarged gallery view"
                    className="max-w-full max-h-[80vh] rounded object-contain border border-white/20"
                  />
                </div>
              </motion.div>
            </>
          )
        }
      </AnimatePresence >

    </div >
  );
};

export default Home;
