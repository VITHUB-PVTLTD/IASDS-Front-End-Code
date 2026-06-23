import React, { useEffect, useState } from "react";
import { Calendar, MapPin, ExternalLink, MessageSquare, Clock, X, FileText } from "lucide-react";
import api from "../services/api";

export const NewsEventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"news" | "events">("news");
  const [news, setNews] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  useEffect(() => {
    const fetchNewsEvents = async () => {
      try {
        const newsRes = await api.get("/public/news");
        setNews(newsRes.data);

        const eventsRes = await api.get("/public/events");
        setUpcomingEvents(eventsRes.data.upcoming || []);
        setPastEvents(eventsRes.data.past || []);
      } catch (err) {
        console.error("Failed to load news and events logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsEvents();
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
        
        {/* Tab Selector Nav */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex space-x-1">
            <button
              onClick={() => setActiveTab("news")}
              className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "news"
                  ? "bg-primary text-white shadow-md"
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              Latest News & Announcements
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "events"
                  ? "bg-primary text-white shadow-md"
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              Conferences & Workshops Calendar
            </button>
          </div>
        </div>

        {/* 1. NEWS BULLETINS LIST */}
        {activeTab === "news" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            {news.length > 0 ? (
              news.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedNews(item)}
                  className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 md:grid-cols-3 gap-6 cursor-pointer hover:border-[#00357D]/20 hover:-translate-y-0.5"
                >
                  <div className="h-44 bg-slate-100 rounded-2xl overflow-hidden md:col-span-1">
                    <img
                      src={item.imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-3 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(item.createdAt).toLocaleDateString("default", { day: "numeric", month: "long", year: "numeric" })}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg sm:text-xl mt-1 leading-snug hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-slate-600 text-sm mt-2 line-clamp-3 leading-relaxed">{item.description}</p>
                    </div>

                    {/* Full Content HTML modal link or toggle */}
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-xs text-primary font-bold flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>Official Bulletin</span>
                      </span>
                      <span className="text-xs font-bold text-primary hover:underline">
                        Read More →
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl py-16 text-center border border-slate-100 shadow-sm text-slate-400">
                No announcements or newsletter feeds found.
              </div>
            )}
          </div>
        )}

        {/* 2. CONFERENCES & EVENTS CALENDAR */}
        {activeTab === "events" && (
          <div className="space-y-12">
            
            {/* UPCOMING EVENTS BLOCK */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-2 flex items-center space-x-2 text-primary">
                <Calendar className="w-5 h-5" />
                <h2 className="text-xl font-bold text-slate-800">Upcoming Events</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((e) => (
                    <div key={e.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between text-left">
                      <div className="space-y-4">
                        <span className="inline-block px-2.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                          {e.eventType}
                        </span>
                        <h3 className="font-bold text-slate-800 text-lg leading-snug">{e.title}</h3>
                        <p className="text-slate-600 text-xs leading-relaxed">{e.description}</p>

                        <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 pt-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{new Date(e.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{e.venueDetails}</span>
                          </div>
                        </div>
                      </div>

                      {/* Registration and external links */}
                      <div className="pt-6 border-t border-slate-50 mt-6 flex items-center justify-between">
                        {e.registrationDeadline && (
                          <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                            Reg Ends: {new Date(e.registrationDeadline).toLocaleDateString()}
                          </span>
                        )}
                        {e.registrationLink && (
                          <a
                            href={e.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg flex items-center space-x-1"
                          >
                            <span>Register</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 bg-white rounded-2xl py-12 text-center border border-slate-100 shadow-sm text-slate-400">
                    No upcoming workshops or conferences listed.
                  </div>
                )}
              </div>
            </div>

            {/* PAST EVENTS BLOCK */}
            <div className="space-y-6 pt-6">
              <div className="border-b border-slate-200 pb-2 flex items-center space-x-2 text-slate-500">
                <Calendar className="w-5 h-5" />
                <h2 className="text-xl font-bold text-slate-800">Past Conducted Events</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
                {pastEvents.length > 0 ? (
                  pastEvents.map((e) => (
                    <div key={e.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between text-left">
                      <div className="space-y-3">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider">
                          Concluded
                        </span>
                        <h3 className="font-bold text-slate-700 text-sm leading-snug line-clamp-2">{e.title}</h3>
                        <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3">{e.description}</p>
                      </div>

                      <div className="border-t border-slate-50 pt-4 mt-4 text-[10px] text-slate-400 flex justify-between">
                        <span>Concluded: {new Date(e.startDate).toLocaleDateString()}</span>
                        <span>📍 {e.venueDetails?.split(",")[0]}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-10 text-slate-400">
                    No past events records indexed.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Premium Announcement Modal */}
      {selectedNews && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedNews(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Banner */}
            <div className="relative h-56 bg-brand-gradient flex items-end p-6 text-white overflow-hidden rounded-t-3xl">
              <img 
                src={selectedNews.imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-25"
              />
              <button 
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative z-10 space-y-2 text-left">
                <span className="inline-block px-2.5 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                  Official Bulletin
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">{selectedNews.title}</h2>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-8 space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                <span>Date Published</span>
                <span className="text-primary">
                  {new Date(selectedNews.createdAt).toLocaleDateString("default", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>

              {selectedNews.description && (
                <p className="text-slate-500 italic text-sm border-l-4 border-primary/20 pl-4">
                  {selectedNews.description}
                </p>
              )}

              <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {selectedNews.content}
              </div>

              {/* Document/File Attachment Download Option */}
              {selectedNews.attachmentUrl && (
                <div className="bg-[#EEF4FF] rounded-2xl p-4 border border-blue-100/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-xs">Official Document Attachment</p>
                      <p className="text-[10px] text-slate-400">PDF, DOC, or Image file available</p>
                    </div>
                  </div>
                  <a
                    href={selectedNews.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-primary hover:bg-[#002a63] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>View / Download Attachment</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={() => setSelectedNews(null)}
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
export default NewsEventsPage;
