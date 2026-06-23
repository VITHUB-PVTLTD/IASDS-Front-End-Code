import React, { useState, useEffect } from "react";
import { Search, Download, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/api";

export const PublicationsPage: React.FC = () => {
  const [publications, setPublications] = useState<any[]>([]);
  const [categories] = useState(["Research Papers", "Journals", "Proceedings", "Reports", "Newsletters"]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/public/publications", {
        params: {
          category: selectedCategory || undefined,
          search: searchQuery || undefined,
          page,
          limit: 8
        }
      });
      setPublications(res.data.publications);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to load publications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, [selectedCategory, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPublications();
  };

  const handleDownload = async (pubId: string, fileUrl: string) => {
    try {
      // Trigger download tracking
      await api.post(`/public/publications/${pubId}/download`);
      // Open file in new tab
      window.open(fileUrl, "_blank");
      // Update local state download count
      setPublications((prev) =>
        prev.map((p) => (p.id === pubId ? { ...p, downloadCount: p.downloadCount + 1 } : p))
      );
    } catch (err) {
      console.error("Failed to log download tracking", err);
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="bg-brand-gradient text-white rounded-3xl p-10 sm:p-14 shadow-lg mb-12 relative overflow-hidden">
          <span className="text-white/80 text-xs uppercase tracking-widest font-bold block mb-2">Publications Database</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Academic Resources & Research</h1>
          <p className="text-slate-200 mt-2 text-sm sm:text-base font-light max-w-xl">
            Access statistics journals, conference proceedings, policy briefs, and monthly newsletters curated by IASDS members.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => { setSelectedCategory(""); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === ""
                  ? "bg-primary text-white shadow-md"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-md"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="w-full md:w-80 flex relative">
            <input
              type="text"
              placeholder="Search by publication title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-xs text-slate-700 placeholder-slate-400 focus:outline-primary focus:bg-white transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Publications Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : publications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {publications.map((pub) => (
              <div
                key={pub.id}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-secondary uppercase tracking-widest">
                      {pub.category?.name}
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 mt-1">
                      {pub.title}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">
                    {pub.description || "Access the complete document download below for detailed methodologies, equations, and references."}
                  </p>
                </div>

                <div className="border-t border-slate-50 pt-4 mt-6 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {pub.downloadCount} Downloads
                  </span>
                  <button
                    onClick={() => handleDownload(pub.id, pub.fileUrl)}
                    className="p-2 bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl py-16 text-center border border-slate-100 shadow-sm text-slate-400">
            No papers or journals found matching the search criteria.
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-slate-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default PublicationsPage;
