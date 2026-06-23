import React, { useEffect, useState } from "react";
import { Award, Building, Shield } from "lucide-react";
import api from "../services/api";

export const AwardsPage: React.FC = () => {
  const [awards, setAwards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const res = await api.get("/public/awards");
        setAwards(res.data);
      } catch (err) {
        console.error("Failed to load awards", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAwards();
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-brand-gradient text-white rounded-3xl p-10 sm:p-14 shadow-lg mb-16 text-center relative overflow-hidden">
          <span className="text-white/80 text-xs uppercase tracking-widest font-bold block mb-2">Honors Registry</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">IASDS Honors & Awards</h1>
          <p className="text-slate-200 mt-2 text-sm sm:text-base font-light max-w-lg mx-auto">
            Celebrating outstanding research contributions, lifetime achievements, and mathematical excellence in statistical data science.
          </p>
        </div>

        {/* Awards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {awards.length > 0 ? (
            awards.map((award) => (
              <div
                key={award.id}
                className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex gap-6 hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Visual Accent bar */}
                <div className="absolute top-0 left-0 w-2 h-full bg-brand-gradient"></div>
                
                <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shrink-0">
                  <Award className="w-7 h-7" />
                </div>

                <div className="space-y-3 w-full text-left">
                  <div>
                    <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">
                      Awarded Year: {award.year}
                    </span>
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors">
                      {award.title}
                    </h3>
                  </div>

                  <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100/50 space-y-2">
                    <p className="text-sm text-slate-700 font-semibold flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary shrink-0" />
                      <span>Recipient: {award.recipientName}</span>
                    </p>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{award.designation}, {award.institution}</span>
                    </p>
                  </div>

                  {award.details && (
                    <p className="text-slate-600 text-xs leading-relaxed mt-2 pl-1">
                      {award.details}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-slate-400">
              No awards records indexed yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AwardsPage;
