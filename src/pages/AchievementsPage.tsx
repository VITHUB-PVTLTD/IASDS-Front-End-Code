import React, { useEffect, useState } from "react";
import { Award, Compass, Flag, X } from "lucide-react";
import api from "../services/api";

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAch, setSelectedAch] = useState<any | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await api.get("/public/achievements");
        setAchievements(res.data);
      } catch (err) {
        console.error("Failed to load achievements", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Banner */}
        <div className="bg-brand-gradient text-white rounded-3xl p-10 sm:p-14 shadow-lg mb-12 text-center relative overflow-hidden">
          <span className="text-white/80 text-xs uppercase tracking-widest font-bold block mb-2">Milestones & History</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">IASDS Key Achievements</h1>
          <p className="text-slate-200 mt-2 text-sm sm:text-base font-light max-w-lg mx-auto">
            Reviewing the association's growth, research publications impact, and outreach accomplishments.
          </p>
        </div>

        {/* Brief Introduction */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-12 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Welcome to the Indian Association of Statistics and Data Science (IASDS) accomplishments portal. 
            Here we celebrate our significant milestones, recognitions, and successes that drive the advancement 
            of statistical sciences and data-driven policies. Explore our key historical accomplishments below.
          </p>
        </div>

        {/* Timeline achievements list */}
        <div className="space-y-8">
          {achievements.length > 0 ? (
            achievements.map((ach) => (
              <div
                key={ach.id}
                onClick={() => setSelectedAch(ach)}
                className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition-all duration-300 relative cursor-pointer hover:border-[#00357D]/20 hover:-translate-y-0.5"
              >
                {/* Badge Icon depending on category */}
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                  {ach.category === "Milestones" ? (
                    <Flag className="w-8 h-8" />
                  ) : ach.category === "Recognitions" ? (
                    <Award className="w-8 h-8" />
                  ) : (
                    <Compass className="w-8 h-8" />
                  )}
                </div>

                <div className="space-y-2 text-left w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-secondary/15 text-secondary text-[10px] font-bold uppercase tracking-wider">
                      {ach.category || "Success Story"}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      {ach.date}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors">{ach.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {ach.description && ach.description.length > 180
                      ? `${ach.description.substring(0, 180)}...`
                      : ach.description}
                  </p>
                  {ach.description && ach.description.length > 180 && (
                    <span className="inline-block text-xs font-bold text-primary hover:underline pt-1">
                      Read Full Achievement →
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl py-16 text-center border border-slate-100 shadow-sm text-slate-400">
              No achievements registered.
            </div>
          )}
        </div>
      </div>

      {/* Premium Details Modal */}
      {selectedAch && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedAch(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Banner */}
            <div className="relative h-48 bg-brand-gradient flex items-end p-6 text-white overflow-hidden rounded-t-3xl">
              {selectedAch.imageUrl && (
                <img 
                  src={selectedAch.imageUrl} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
                />
              )}
              <button 
                onClick={() => setSelectedAch(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative z-10 space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                  {selectedAch.category || "Success Story"}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">{selectedAch.title}</h2>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                <span>Date Accomplished</span>
                <span className="text-secondary">{selectedAch.date}</span>
              </div>

              <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {selectedAch.description}
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={() => setSelectedAch(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-2.5 rounded-xl text-sm transition-all focus:outline-none"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AchievementsPage;
