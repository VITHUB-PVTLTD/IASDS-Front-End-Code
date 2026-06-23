import React, { useEffect, useState } from "react";
import { X, Play, ZoomIn } from "lucide-react";
import api from "../services/api";

export const GalleryPage: React.FC = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxAsset, setLightboxAsset] = useState<{ url: string; type: "image" | "video"; caption?: string } | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get("/public/gallery");
        setAlbums(res.data);
        if (res.data.length > 0) {
          setSelectedAlbum(res.data[0]); // default to first album
        }
      } catch (err) {
        console.error("Failed to load gallery folders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Header */}
        <div className="bg-brand-gradient text-white rounded-3xl p-10 sm:p-14 shadow-lg mb-12 text-center relative overflow-hidden">
          <span className="text-white/80 text-xs uppercase tracking-widest font-bold block mb-2">IASDS Media Album</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Association Photo & Video Gallery</h1>
          <p className="text-slate-200 mt-2 text-sm sm:text-base font-light max-w-lg mx-auto">
            Visual highlights from international ICDSA conferences, technical coding workshops, and awards ceremonies.
          </p>
        </div>

        {/* Album Selector Tabs */}
        {albums.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {albums.map((album) => (
              <button
                key={album.id}
                onClick={() => setSelectedAlbum(album)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  selectedAlbum?.id === album.id
                    ? "bg-primary text-white scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {album.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl py-16 text-center border border-slate-100 shadow-sm text-slate-400">
            No albums found. Seed database to populate mock gallery events.
          </div>
        )}

        {/* Media Grid */}
        {selectedAlbum && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 mb-6">
              <h2 className="text-xl font-bold text-slate-800">{selectedAlbum.name}</h2>
              <p className="text-slate-500 text-xs mt-1">{selectedAlbum.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Photo Media items */}
              {selectedAlbum.images?.map((img: any) => (
                <div
                  key={img.id}
                  onClick={() => setLightboxAsset({ url: img.imageUrl, type: "image", caption: img.caption })}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm relative group cursor-zoom-in hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="h-48 overflow-hidden bg-slate-100 relative">
                    <img
                      src={img.imageUrl}
                      alt={img.caption || "Gallery"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <ZoomIn className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  {img.caption && (
                    <div className="p-3 text-xs text-slate-600 font-medium line-clamp-1 border-t border-slate-50">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}

              {/* Video Media items */}
              {selectedAlbum.videos?.map((vid: any) => (
                <div
                  key={vid.id}
                  onClick={() => setLightboxAsset({ url: vid.videoUrl, type: "video", caption: vid.caption })}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm relative group cursor-pointer hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="h-48 overflow-hidden bg-slate-950 relative flex items-center justify-center">
                    {/* Dark placeholder background with play icon */}
                    <div className="w-14 h-14 bg-secondary text-slate-900 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-slate-900 ml-1" />
                    </div>
                    <div className="absolute top-3 left-3 bg-secondary/95 text-slate-900 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Video Playback
                    </div>
                  </div>
                  <div className="p-3 text-xs text-slate-600 font-medium line-clamp-1 border-t border-slate-50">
                    {vid.caption || "Event Video Video"}
                  </div>
                </div>
              ))}
            </div>

            {(!selectedAlbum.images?.length && !selectedAlbum.videos?.length) && (
              <div className="text-center py-10 text-slate-400">
                This album does not currently contain any images or videos.
              </div>
            )}
          </div>
        )}
      </div>

      {/* LIGHTBOX OVERLAY PORTAL */}
      {lightboxAsset && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxAsset(null)}
            className="absolute top-4 right-4 text-white hover:text-slate-300 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[80vh] w-full flex flex-col items-center justify-center">
            {lightboxAsset.type === "image" ? (
              <img
                src={lightboxAsset.url}
                alt="Enlarged gallery view"
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                {/* Embed video if YouTube link, otherwise fall back to native video tag */}
                {lightboxAsset.url.includes("youtube.com") || lightboxAsset.url.includes("youtu.be") ? (
                  <iframe
                    title="Youtube Video Player"
                    width="100%"
                    height="100%"
                    src={lightboxAsset.url.replace("watch?v=", "embed/")}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={lightboxAsset.url} controls className="w-full h-full" autoPlay />
                )}
              </div>
            )}

            {lightboxAsset.caption && (
              <p className="text-slate-300 text-sm mt-4 font-semibold text-center leading-relaxed">
                {lightboxAsset.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default GalleryPage;
