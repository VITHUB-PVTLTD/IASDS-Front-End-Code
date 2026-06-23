import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// ─── Multilingual title rotator ────────────────────────────────────────────
const TITLES = [
  "Indian Association of Statistics & Data Science",
  "भारतीय सांख्यिकी एवं डेटा विज्ञान संघ",
  "భారతీయ గణాంక శాస్త్ర & డేటా సైన్స్ సంఘం",
];

const LanguageRotator: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % TITLES.length);
        setVisible(true);
      }, 500); // wait for fade-out before swapping text
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1
      style={{
        color: "#00357D",
        fontWeight: 700,
        fontSize: "28px",
        lineHeight: 1.2,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        margin: 0,
        minHeight: "34px",
        transition: "opacity 0.5s ease",
        opacity: visible ? 1 : 0,
        textAlign: "center",
      }}
    >
      {TITLES[index]}
    </h1>
  );
};

// ─── Mobile / Tablet compact rotator (white text, fits nav bar) ────────────
const MOBILE_TITLES = [
  "Indian Association of Statistics & Data Science (IASDS)",
  "भारतीय सांख्यिकी एवं डेटा विज्ञान संघ (IASDS)",
  "భారతీయ గణాంక శాస్త్ర & డేటా సైన్స్ సంఘం (IASDS)",
];

const MobileLanguageRotator: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [_visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % MOBILE_TITLES.length);
        setVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
      <span
        style={{
          color: "#fff",
          fontWeight: 800,
          fontSize: "14px",
          letterSpacing: "0.06em",
        }}
      >
        {MOBILE_TITLES[index]}
      </span>
      {/* <span
        style={{
          color: "rgba(255,255,255,0.75)",
          fontWeight: 500,
          fontSize: "9px",
          letterSpacing: "0.02em",
          marginTop: "2px",
          maxWidth: "180px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transition: "opacity 0.5s ease",
          opacity: visible ? 1 : 0,
        }}
      >
        {MOBILE_TITLES[index]}
      </span> */}
    </div>
  );
};

// ─── Sidebar drawer: rotating org-name subtitle only ───────────────────────
const RotatingOrgName: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % MOBILE_TITLES.length);
        setVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      style={{
        display: "block",
        fontSize: "16px",
        fontWeight: 800,
        letterSpacing: "0.08em",
        color: "#fff",
        maxWidth: "200px",
        whiteSpace: "wrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        transition: "opacity 0.5s ease",
        opacity: visible ? 1 : 0,
      }}
    >
      {MOBILE_TITLES[index]}
    </span>
  );
};

// ─── Nav configuration ──────────────────────────────────────────────────────
interface SubItem {
  name: string;
  path: string;
}
interface NavItem {
  name: string;
  path: string;
  submenu?: SubItem[];
}

const NAV_ITEMS: NavItem[] = [
  { name: "Home", path: "/" },
  {
    name: "About IASDS",
    path: "/about/objectives",
    submenu: [
      { name: "Objectives", path: "/about/objectives" },
      { name: "Vision & Mission", path: "/about/vision-mission" },
      // { name: "Mission", path: "/about/vision-mission#mission" },
      { name: "Expected Contribution", path: "/about/contribution" },
    ],
  },
  {
    name: "Governance",
    path: "/documents/IASDS-Constitution.pdf",
    submenu: [
      { name: "Constitution", path: "/documents/IASDS-Constitution.pdf" },
      { name: "Executive Council", path: "/council" },
    ],
  },
  {
    name: "Membership",
    path: "/membership/types",
    submenu: [
      { name: "Membership Eligibility", path: "/membership/eligibility" },
      { name: "Membership Types", path: "/membership/types" },
      { name: "Membership Benefits", path: "/membership/benefits" },
      { name: "Terms & Conditions", path: "/membership/terms" },
      { name: "Registration Form", path: "/membership/register" },
      // { name: "Member Directory", path: "/membership/directory" },
    ],
  },
  {
    name: "Services",
    path: "/services/research",
    submenu: [
      { name: "Research", path: "/services/research" },
      { name: "Academic & Skill Training", path: "/services/training" },
      { name: "Consultancy & Community Outreach", path: "/services/consultancy" },
    ],
  },
  { name: "Gallery", path: "/gallery" },
  { name: "News & Events", path: "/news-events" },
  { name: "Achievements", path: "/achievements" },
  { name: "Contact Us", path: "/contact" },
];

// ─── Main Component ─────────────────────────────────────────────────────────
export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<number | null>(null);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeoutRef.current) window.clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = window.setTimeout(() => {
      setActiveDropdown(null);
    }, 160);
  };

  const toggleMobileDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const isActive = (item: NavItem) => {
    if (item.submenu) return item.submenu.some((s) => location.pathname.startsWith(s.path));
    return location.pathname === item.path;
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          TOP HEADER — White background, institutional look
      ═══════════════════════════════════════════════════════════════ */}
      <div
        className="hidden lg:block select-none"
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <div
          className="w-full px-8 flex items-center justify-between"
          style={{ minHeight: "110px", paddingTop: "12px", paddingBottom: "12px" }}
        >
          {/* ── LEFT: Logo + Short Name ── */}
          <Link to="/" className="flex items-center shrink-0" style={{ gap: "16px" }}>
            <img
              src="/assets/logo.jpg"
              alt="IASDS Logo"
              style={{
                width: "90px",
                height: "90px",
                objectFit: "contain",
                borderRadius: "50%",
                border: "2px solid #E5E7EB",
              }}
            />
            <div style={{ borderLeft: "2px solid #E5E7EB", paddingLeft: "16px" }}>
              <span
                style={{
                  display: "block",
                  color: "#00357D",
                  fontWeight: 700,
                  fontSize: "40px",
                  lineHeight: 1,
                  letterSpacing: "0.04em",
                }}
              >
                IASDS
              </span>
              {/* <span
                style={{
                  display: "block",
                  color: "#00357D",
                  opacity: 0.7,
                  fontWeight: 600,
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginTop: "5px",
                }}
              >
                Estd 2026 • New Delhi
              </span> */}
            </div>
          </Link>

          {/* ── CENTER: Language Rotator (acts as h1) ── */}
          <div style={{ flex: 1, textAlign: "center", padding: "0 24px" }}>
            <LanguageRotator />
          </div>

          {/* ── RIGHT: Membership Button only ── */}
          <div className="shrink-0">
            {user ? (
              <div className="flex items-center" style={{ gap: "10px" }}>
                <Link
                  to={user.role === "Member" ? "/portal" : "/admin"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#00357D",
                    color: "#fff",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "14px",
                    textDecoration: "none",
                    transition: "background 300ms",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#002a63")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#00357D")}
                >
                  <User size={15} />
                  <span>{user.role} Portal</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  style={{
                    background: "#c0392b",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    cursor: "pointer",
                    transition: "background 300ms",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#a93226")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#c0392b")}
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link
                to="/membership/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#D30090",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "15px",
                  padding: "14px 28px",
                  borderRadius: "12px",
                  height: "52px",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  boxShadow: "0 4px 14px rgba(211,0,144,0.25)",
                  transition: "background 300ms ease, box-shadow 300ms ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#B10078";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(211,0,144,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#D30090";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(211,0,144,0.25)";
                }}
              >
                Apply for Membership
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          NAVIGATION BAR — Navy #00357D, sticky
      ═══════════════════════════════════════════════════════════════ */}
      <nav
        className="sticky top-0 z-50 select-none"
        style={{
          background: "#00357D",
          height: "70px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
        }}
      >
        <div
          className="w-full h-full px-8 flex items-center justify-between"
        >
          {/* Mobile: Logo + Name */}
          <Link
            to="/"
            className="lg:hidden flex items-center"
            style={{ gap: "10px", textDecoration: "none" }}
          >
            <img
              src="/assets/logo.jpg"
              alt="IASDS Logo"
              style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "50%" }}
            />
            <MobileLanguageRotator />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center h-full w-full justify-center" style={{ gap: "2px" }}>
            {NAV_ITEMS.map((item) => (
              <div
                key={item.name}
                className="relative h-full flex items-center"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                {item.submenu ? (
                  <button
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "0 14px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color:
                        isActive(item) || activeDropdown === item.name
                          ? "#D30090"
                          : "#fff",
                      fontWeight: 600,
                      fontSize: "18px",
                      letterSpacing: "0.3px",
                      borderBottom:
                        isActive(item) || activeDropdown === item.name
                          ? "3px solid #D30090"
                          : "3px solid transparent",
                      transition: "color 300ms ease, border-color 300ms ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#D30090";
                      e.currentTarget.style.borderBottomColor = "#D30090";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item) && activeDropdown !== item.name) {
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.borderBottomColor = "transparent";
                      }
                    }}
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      size={14}
                      style={{
                        transition: "transform 200ms ease",
                        transform: activeDropdown === item.name ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>
                ) : (
                  (() => {
                    const isFile = item.path.endsWith(".pdf") || item.path.startsWith("/documents/");
                    const linkProps = isFile
                      ? { href: item.path, target: "_blank", rel: "noopener noreferrer" }
                      : { to: item.path };
                    const LinkComponent = isFile ? "a" : Link;
                    return (
                      <LinkComponent
                        {...linkProps as any}
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          padding: "0 14px",
                          textDecoration: "none",
                          color: isActive(item) ? "#D30090" : "#fff",
                          fontWeight: 600,
                          fontSize: "18px",
                          letterSpacing: "0.3px",
                          borderBottom: isActive(item)
                            ? "3px solid #D30090"
                            : "3px solid transparent",
                          transition: "color 300ms ease, border-color 300ms ease",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#D30090";
                          e.currentTarget.style.borderBottomColor = "#D30090";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive(item)) {
                            e.currentTarget.style.color = "#fff";
                            e.currentTarget.style.borderBottomColor = "transparent";
                          }
                        }}
                      >
                        {item.name}
                      </LinkComponent>
                    );
                  })()
                )}

                {/* Desktop Dropdown */}
                <AnimatePresence>
                  {item.submenu && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "100%",
                        minWidth: "240px",
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)",
                        padding: "8px 0",
                        zIndex: 100,
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      {item.submenu.map((sub) => {
                        const isFile = sub.path.endsWith(".pdf") || sub.path.startsWith("/documents/");
                        const linkProps = isFile
                          ? { href: sub.path, target: "_blank", rel: "noopener noreferrer" }
                          : { to: sub.path };
                        const LinkComponent = isFile ? "a" : Link;
                        return (
                          <LinkComponent
                            key={sub.name}
                            {...linkProps as any}
                            style={{
                              display: "block",
                              padding: "10px 20px",
                              color:
                                location.pathname === sub.path
                                  ? "#00357D"
                                  : "#374151",
                              fontWeight: location.pathname === sub.path ? 700 : 500,
                              fontSize: "14px",
                              textDecoration: "none",
                              background:
                                location.pathname === sub.path
                                  ? "#EEF4FF"
                                  : "transparent",
                              transition: "background 200ms ease, color 200ms ease",
                              borderLeft:
                                location.pathname === sub.path
                                  ? "3px solid #00357D"
                                  : "3px solid transparent",
                            }}
                            onMouseEnter={(e) => {
                              if (location.pathname !== sub.path) {
                                e.currentTarget.style.background = "#F5F8FF";
                                e.currentTarget.style.color = "#00357D";
                                e.currentTarget.style.borderLeftColor = "#D30090";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (location.pathname !== sub.path) {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "#374151";
                                e.currentTarget.style.borderLeftColor = "transparent";
                              }
                            }}
                          >
                            {sub.name}
                          </LinkComponent>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Mobile: Right side actions */}
          <div className="flex lg:hidden items-center" style={{ gap: "10px" }}>
            {/* Membership button visible on tablet */}
            <Link
              to="/membership/register"
              className="hidden sm:inline-flex"
              style={{
                background: "#D30090",
                color: "#fff",
                fontWeight: 700,
                fontSize: "13px",
                padding: "8px 16px",
                borderRadius: "10px",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background 300ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#B10078")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#D30090")}
            >
              Apply for Membership
            </Link>

            {user && (
              <Link
                to={user.role === "Member" ? "/portal" : "/admin"}
                title="Portal"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "7px",
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <User size={16} />
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                transition: "background 200ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE DRAWER
      ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 40,
                background: "#000",
              }}
              className="lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", duration: 0.28 }}
              className="lg:hidden"
              style={{
                position: "fixed",
                right: 0,
                top: 0,
                bottom: 0,
                width: "300px",
                zIndex: 50,
                background: "#00357D",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                padding: "0",
                overflowY: "auto",
                boxShadow: "-4px 0 30px rgba(0,0,0,0.25)",
              }}
            >
              {/* Drawer Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img
                    src="/assets/logo.jpg"
                    alt="IASDS"
                    style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "contain" }}
                  />
                  <div>
                    <RotatingOrgName />
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    borderRadius: "8px",
                    padding: "6px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav Items */}
              <div style={{ padding: "12px 0", flex: 1 }}>
                {NAV_ITEMS.map((item) => (
                  <div key={item.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {item.submenu ? (
                      <>
                        <button
                          onClick={() => toggleMobileDropdown(item.name)}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "14px 24px",
                            background: "none",
                            border: "none",
                            color: isActive(item) ? "#D30090" : "#fff",
                            fontWeight: 600,
                            fontSize: "15px",
                            cursor: "pointer",
                            letterSpacing: "0.2px",
                            textAlign: "left",
                          }}
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            size={16}
                            style={{
                              transition: "transform 200ms ease",
                              transform: activeDropdown === item.name ? "rotate(180deg)" : "rotate(0deg)",
                              color: "#D30090",
                            }}
                          />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              style={{ overflow: "hidden", background: "rgba(0,0,0,0.12)" }}
                            >
                              {item.submenu.map((sub) => {
                                const isFile = sub.path.endsWith(".pdf") || sub.path.startsWith("/documents/");
                                const linkProps = isFile
                                  ? { href: sub.path, target: "_blank", rel: "noopener noreferrer" }
                                  : { to: sub.path };
                                const LinkComponent = isFile ? "a" : Link;
                                return (
                                  <LinkComponent
                                    key={sub.name}
                                    {...linkProps as any}
                                    style={{
                                      display: "block",
                                      padding: "11px 24px 11px 40px",
                                      color:
                                        location.pathname === sub.path ? "#D30090" : "rgba(255,255,255,0.8)",
                                      fontWeight: location.pathname === sub.path ? 700 : 500,
                                      fontSize: "14px",
                                      textDecoration: "none",
                                      borderLeft: location.pathname === sub.path
                                        ? "3px solid #D30090"
                                        : "3px solid transparent",
                                      transition: "color 200ms, border-color 200ms",
                                    }}
                                  >
                                    {sub.name}
                                  </LinkComponent>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      (() => {
                        const isFile = item.path.endsWith(".pdf") || item.path.startsWith("/documents/");
                        const linkProps = isFile
                          ? { href: item.path, target: "_blank", rel: "noopener noreferrer" }
                          : { to: item.path };
                        const LinkComponent = isFile ? "a" : Link;
                        return (
                          <LinkComponent
                            {...linkProps as any}
                            style={{
                              display: "block",
                              padding: "14px 24px",
                              color: isActive(item) ? "#D30090" : "#fff",
                              fontWeight: 600,
                              fontSize: "15px",
                              textDecoration: "none",
                              letterSpacing: "0.2px",
                              borderLeft: isActive(item) ? "3px solid #D30090" : "3px solid transparent",
                              transition: "color 200ms",
                            }}
                          >
                            {item.name}
                          </LinkComponent>
                        );
                      })()
                    )}
                  </div>
                ))}
              </div>

              {/* Drawer Footer – Auth + Membership */}
              <div
                style={{
                  padding: "20px 24px",
                  borderTop: "1px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {/* Membership button always visible in mobile */}
                <Link
                  to="/membership/register"
                  style={{
                    display: "block",
                    background: "#D30090",
                    color: "#fff",
                    textAlign: "center",
                    padding: "13px 20px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "14px",
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(211,0,144,0.3)",
                    transition: "background 300ms",
                  }}
                >
                  Apply for Membership
                </Link>

                {user ? (
                  <>
                    <Link
                      to={user.role === "Member" ? "/portal" : "/admin"}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        background: "rgba(255,255,255,0.1)",
                        color: "#fff",
                        padding: "11px 20px",
                        borderRadius: "10px",
                        fontWeight: 600,
                        fontSize: "14px",
                        textDecoration: "none",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      <User size={15} />
                      <span>{user.role} Portal</span>
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); logout(); }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        background: "#c0392b",
                        color: "#fff",
                        padding: "11px 20px",
                        borderRadius: "10px",
                        fontWeight: 600,
                        fontSize: "14px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <LogOut size={15} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : null}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
