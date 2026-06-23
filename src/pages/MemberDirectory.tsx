import React, { useState, useEffect } from "react";
import { Search, MapPin, Building, Calendar, Award } from "lucide-react";
import api from "../services/api";

export const MemberDirectory: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [institution, setInstitution] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDirectory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/public/members-directory", {
        params: {
          search: search || undefined,
          state: state || undefined,
          institution: institution || undefined,
          page,
          limit: 12
        }
      });
      setMembers(res.data.members);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to load public members directory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectory();
  }, [page, state]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchDirectory();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="bg-brand-gradient text-white rounded-3xl p-10 sm:p-14 shadow-lg mb-12 relative overflow-hidden">
          <span className="text-white/80 text-xs uppercase tracking-widest font-bold block mb-2">Member Directory</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Active Academic Network</h1>
          <p className="text-slate-200 mt-2 text-sm sm:text-base font-light max-w-lg">
            Search and verify IASDS registered professionals, researchers, faculty heads, and data professionals.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-8">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search Name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-xs text-slate-700 placeholder-slate-400 focus:outline-primary focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Institution Input */}
            <div>
              <input
                type="text"
                placeholder="Filter by Institution..."
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-700 placeholder-slate-400 focus:outline-primary focus:bg-white"
              />
            </div>

            {/* State Input */}
            <div>
              <input
                type="text"
                placeholder="Filter by State..."
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-700 placeholder-slate-400 focus:outline-primary focus:bg-white"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-2.5 text-xs font-bold transition-all shadow-sm"
              >
                Search Registry
              </button>
            </div>
          </form>
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : members.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between text-left group"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-[9px] font-extrabold text-secondary uppercase tracking-widest block">
                        {m.membershipType}
                      </span>
                      <h3 className="font-bold text-slate-800 text-sm mt-1 leading-snug">
                        {m.fullName}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-bold tracking-wider mt-0.5 block">
                        ID: {m.membershipNumber}
                      </span>
                    </div>

                    <div className="space-y-2 border-t border-slate-50 pt-4 text-[11px] text-slate-600">
                      <div className="flex items-center space-x-2">
                        <Building className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="line-clamp-1">{m.institution || "Independent Researcher"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{m.state || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-50 flex items-center justify-between text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-300" />
                      <span>Joined: {m.joinedDate ? new Date(m.joinedDate).getFullYear() : "N/A"}</span>
                    </span>
                    <span className="flex items-center space-x-0.5 text-green-600">
                      <Award className="w-3 h-3 fill-green-600" />
                      <span>Verified</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-xs font-bold text-slate-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl py-16 text-center border border-slate-100 shadow-sm text-slate-400">
            No active members found matching the search criteria.
          </div>
        )}
      </div>
    </div>
  );
};
export default MemberDirectory;
