import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Users, ShieldCheck, Database, Library } from "lucide-react";
import api from "../services/api";

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({
    contact_address: "IASDS Headquarters, Academic Complex, New Delhi, India",
    contact_email: "info@iasds.org",
    contact_phone: "+91-11-23456789"
  });
  const [socials, setSocials] = useState<any[]>([]);
  // const [visitorCount, setVisitorCount] = useState(145827);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const res = await api.get("/public/settings");
        if (res.data.settings) {
          setSettings((prev) => ({ ...prev, ...res.data.settings }));
        }
        if (res.data.socialLinks) {
          setSocials(res.data.socialLinks);
        }
      } catch (err) {
        console.error("Failed to load footer config setting data:", err);
      }
    };
    fetchFooterData();

    // Increment visitor count slightly on load to simulate real-time traffic
    // const randomIncrement = Math.floor(Math.random() * 5) + 1;
    // setVisitorCount(prev => prev + randomIncrement);
  }, []);

  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "facebook":
        return <Facebook className="w-4 h-4" />;
      case "twitter":
      case "x":
        return <Twitter className="w-4 h-4" />;
      case "linkedin":
        return <Linkedin className="w-4 h-4" />;
      default:
        return <Linkedin className="w-4 h-4" />;
    }
  };

  // Convert visitor count to 6-digit padded string
  // const paddedCount = String(visitorCount).padStart(6, "0");

  return (
    <footer className="bg-[#031826] text-[#EAF4FC]/80 border-t-4 border-[#0D5C99] select-none text-xs sm:text-sm font-sans">

      {/* Upper Footer: Branding and Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

        {/* Col 1: Brand & Crest (4/12 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/logo.jpg"
              alt="IASDS Logo"
              className="w-20 h-20 object-contain rounded-full border border-white/10"
            />
            <div>
              <span className="font-extrabold text-[20px] tracking-wider text-white block font-heading">
                IASDS
              </span>
              <span className="text-[9px] text-[#D87AB4] uppercase font-bold tracking-widest block -mt-0.5">
                Indian Association of Statistics & Data Science
              </span>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs">
            The Indian Association of Statistics & Data Science (IASDS) is the national apex academic body promoting advanced empirical reasoning, data analytics modeling, and statistical research methodologies across India.
          </p>

          {/* Social Platform Links */}
          <div className="space-y-2">
            <span className="text-white text-[11px] font-bold uppercase tracking-wider block">Connect With Us</span>
            <div className="flex space-x-2.5">
              {socials.length > 0 ? (
                socials.map((s) => (
                  <a
                    key={s.platformName}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#0D5C99] hover:text-white transition-all duration-200"
                    title={s.platformName}
                  >
                    {getSocialIcon(s.platformName)}
                  </a>
                ))
              ) : (
                <>
                  <a href="#" className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#0D5C99] hover:text-white transition-all"><Facebook className="w-4 h-4" /></a>
                  <a href="#" className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#0D5C99] hover:text-white transition-all"><Twitter className="w-4 h-4" /></a>
                  <a href="#" className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#0D5C99] hover:text-white transition-all"><Linkedin className="w-4 h-4" /></a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Col 2: Association Quick Links (2/12 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-white text-xs uppercase tracking-widest border-b border-white/10 pb-2">
            About & Governance
          </h3>
          <ul className="space-y-2.5 text-s">
            <li>
              <Link to="/about/origin" className="hover:text-white hover:underline transition-colors flex items-center space-x-1.5">
                <Library className="w-3.5 h-3.5 text-[#D87AB4]" />
                <span>Origin & History</span>
              </Link>
            </li>
            <li>
              <Link to="/about/vision-mission" className="hover:text-white hover:underline transition-colors flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D87AB4]" />
                <span>Vision & Mission</span>
              </Link>
            </li>
            <li>
              <Link to="/about/objectives" className="hover:text-white hover:underline transition-colors flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5 text-[#D87AB4]" />
                <span>Core Objectives</span>
              </Link>
            </li>
            <li>
              <Link to="/council" className="hover:text-white hover:underline transition-colors flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-[#D87AB4]" />
                <span>Executive Council</span>
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-white hover:underline transition-colors flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-[#D87AB4]" />
                <span>Event Gallery</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Memberships & Services (3/12 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="font-extrabold text-white text-xs uppercase tracking-widest border-b border-white/10 pb-2">
            Memberships & Research
          </h3>
          <ul className="space-y-2.5 text-s">
            <li>
              <Link to="/membership/types" className="hover:text-white hover:underline transition-colors">Membership Options</Link>
            </li>
            <li>
              <Link to="/membership/benefits" className="hover:text-white hover:underline transition-colors">Professional Benefits</Link>
            </li>
            <li>
              <Link to="/membership/directory" className="hover:text-white hover:underline transition-colors">Public Member Directory</Link>
            </li>
            <li>
              <Link to="/publications" className="hover:text-white hover:underline transition-colors flex items-center space-x-1.5">Research Publications</Link>
            </li>
            <li>
              <Link to="/awards" className="hover:text-white hover:underline transition-colors">Honors & Awards</Link>
            </li>
            <li>
              <Link to="/membership/register" className="text-[#D87AB4] font-bold hover:underline">Apply for Membership →</Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Visitor Counter (3/12 cols) */}
        <div className="lg:col-span-3 space-y-5">
          <h3 className="font-extrabold text-white text-xs uppercase tracking-widest border-b border-white/10 pb-2">
            Headquarters Office
          </h3>
          <ul className="space-y-3 text-s text-slate-400">
            <li className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-[#D87AB4] shrink-0 mt-0.5" />
              <span>{settings.contact_address}</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-[#D87AB4] shrink-0" />
              <span>{settings.contact_phone}</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-[#D87AB4] shrink-0" />
              <span>{settings.contact_email}</span>
            </li>
          </ul>

          {/* Visitor Counter Section */}
          {/* <div className="bg-[#083B66]/40 border border-white/10 p-4 rounded mt-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">
              Portal Traffic Indicator
            </span>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-xs font-medium">Visitor Counter:</span>
              <div className="flex space-x-1">
                {paddedCount.split("").map((digit, idx) => (
                  <span
                    key={idx}
                    className="w-6 h-8 bg-[#0D5C99] text-white font-mono font-bold text-base flex items-center justify-center rounded border border-white/10 shadow shadow-black/45"
                  >
                    {digit}
                  </span>
                ))}
              </div>
            </div>
          </div> */}
        </div>

      </div>

      {/* Bottom Footer: Copyright and Credentials */}
      <div className="bg-[#021019] border-t border-white/5 py-6 select-none">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <div className="text-center md:text-left space-y-1">
            <p>© {new Date().getFullYear()} Indian Association of Statistics & Data Science (IASDS). All rights reserved.</p>
            <p className="text-[10px] text-slate-600">Registered Scientific & Professional Association under National Academic Societies.</p>
          </div>
          <div className="flex items-center space-x-4 mt-3 md:mt-0 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
            <Link to="/membership/terms" className="hover:text-white">Terms of Use</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white">Contact Registry</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
