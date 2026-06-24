import React, { useEffect, useState, useCallback } from "react";
import { jsPDF } from "jspdf";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, UserCheck, GraduationCap, Newspaper, CalendarDays,
  BookOpen, Image as ImageIcon, MessageSquare, Trophy, Settings, ShieldCheck, LogOut,
  Plus, Pencil, Trash2, Check, X, Eye, RefreshCw,
  Mail, FileText, Upload, AlertTriangle,
  TrendingUp, Menu, UserCog,
  Clock, CheckCircle2, XCircle, AlertCircle
} from "lucide-react";
import api from "../services/api";

// ─── Types ──────────────────────────────────────────────────────────────────
type TabId =
  | "overview" | "applications" | "members" | "council"
  | "news" | "events" | "publications" | "gallery"
  | "contacts" | "achievements" | "settings" | "users" | "carousel";

interface Toast { id: number; message: string; type: "success" | "error" | "info"; }

// ─── Toast Notification Hook ─────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  return { toasts, showToast };
}

// ─── Download as PDF helper ──────────────────────────────────────────────────
async function downloadReceiptAsPdf(url: string, filename = "transaction_receipt.pdf") {
  // If already a PDF data URL, decode and save directly
  if (url.startsWith("data:application/pdf")) {
    const base64 = url.split(",")[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    return;
  }

  // For images (data URL or external URL), draw on canvas and export as PDF
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  const imgData = canvas.toDataURL("image/jpeg", 0.92);
  const pdfW = 210; // A4 width mm
  const pdfH = Math.round((img.naturalHeight / img.naturalWidth) * pdfW);
  const pdf = new jsPDF({ orientation: pdfH > pdfW ? "portrait" : "landscape", unit: "mm", format: [pdfW, pdfH] });
  pdf.addImage(imgData, "JPEG", 0, 0, pdfW, pdfH);
  pdf.save(filename);
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 animate-bounce-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-bold text-slate-800">Confirm Action</h3>
        </div>
        <p className="text-sm text-slate-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-emerald-100 text-emerald-700",
    active: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    pending_review: "bg-amber-100 text-amber-700",
    rejected: "bg-red-100 text-red-700",
    suspended: "bg-red-100 text-red-700",
    unread: "bg-blue-100 text-blue-700",
    read: "bg-slate-100 text-slate-600",
    replied: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${map[status] || "bg-slate-100 text-slate-600"}`}>
      {status?.replace(/_/g, " ")}
    </span>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
          <p className="text-3xl font-extrabold text-slate-800 mt-1 font-heading">{value ?? 0}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ────────────────────────────────────────────────────
export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { toasts, showToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; message: string; onConfirm: () => void } | null>(null);

  // Data States
  const [stats, setStats] = useState<any>({ counters: {}, recentApplications: [], recentMembers: [] });
  const [applications, setApplications] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [council, setCouncil] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [settingsForm, setSettingsForm] = useState({ about_origin: "", about_vision: "", about_mission: "", contact_email: "", contact_phone: "", contact_address: "" });

  // Carousel state
  const [carouselSlides, setCarouselSlides] = useState<any[]>([]);
  const [carouselForm, setCarouselForm] = useState({ title: "", subtitle: "", buttonLabel: "", buttonLink: "", isActive: "true" });
  const [carouselImage, setCarouselImage] = useState<File | null>(null);
  const [editSlide, setEditSlide] = useState<any | null>(null);

  // Form States
  const [reviewerNotes, setReviewerNotes] = useState<Record<string, string>>({});
  const [councilForm, setCouncilForm] = useState({ name: "", designation: "", institution: "", email: "", phone: "", year: "2026", memberType: "Executive Council Members" });
  const [councilPhoto, setCouncilPhoto] = useState<File | null>(null);
  const [editCouncil, setEditCouncil] = useState<any | null>(null);

  const [newsForm, setNewsForm] = useState({ title: "", description: "", content: "" });
  const [newsImage, setNewsImage] = useState<File | null>(null);
  const [newsAttachment, setNewsAttachment] = useState<File | null>(null);
  const [editNews, setEditNews] = useState<any | null>(null);

  const [eventForm, setEventForm] = useState({ title: "", description: "", content: "", startDate: "", endDate: "", registrationDeadline: "", eventType: "Conference", venueDetails: "", registrationLink: "" });
  const [eventBanner, setEventBanner] = useState<File | null>(null);
  const [editEvent, setEditEvent] = useState<any | null>(null);

  const [pubForm, setPubForm] = useState({ title: "", description: "", categoryId: "1" });
  const [pubFile, setPubFile] = useState<File | null>(null);

  const [albumForm, setAlbumForm] = useState({ name: "", description: "" });
  const [albumCover, setAlbumCover] = useState<File | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoCaption, setPhotoCaption] = useState("");

  const [achForm, setAchForm] = useState({ title: "", description: "", date: "", category: "Milestones" });
  const [achImage, setAchImage] = useState<File | null>(null);
  const [editAch, setEditAch] = useState<any | null>(null);

  const [replyContent, setReplyContent] = useState<Record<string, string>>({});

  const [newUserForm, setNewUserForm] = useState({ email: "", password: "", roleName: "Admin" });

  // ─── Data Loaders ──────────────────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    const res = await api.get("/admin/stats");
    setStats(res.data);
  }, []);

  const loadTabData = useCallback(async (tab: TabId) => {
    setLoading(true);
    try {
      switch (tab) {
        case "overview": await loadStats(); break;
        case "applications": {
          const res = await api.get("/admin/applications");
          setApplications(res.data);
          break;
        }
        case "members": {
          const res = await api.get("/admin/members");
          setMembers(res.data);
          break;
        }
        case "council": {
          const res = await api.get("/public/council");
          // API now returns grouped array — flatten for admin list
          if (Array.isArray(res.data) && res.data.length > 0 && "type" in res.data[0]) {
            setCouncil(res.data.flatMap((g: any) => g.members));
          } else {
            setCouncil(res.data);
          }
          break;
        }
        case "news": {
          const res = await api.get("/admin/news");
          setNews(res.data);
          break;
        }
        case "events": {
          const res = await api.get("/admin/events");
          setEvents(res.data);
          break;
        }
        case "publications": {
          const res = await api.get("/admin/publications");
          setPublications(res.data);
          break;
        }
        case "gallery": {
          const res = await api.get("/admin/gallery");
          setGallery(res.data);
          break;
        }
        case "contacts": {
          const res = await api.get("/admin/contacts");
          setContacts(res.data);
          break;
        }
        case "achievements": {
          const res = await api.get("/admin/achievements");
          setAchievements(res.data);
          break;
        }
        case "settings": {
          const res = await api.get("/public/settings");
          if (res.data.settings) {
            setSettingsForm({
              about_origin: res.data.settings.about_origin || "",
              about_vision: res.data.settings.about_vision || "",
              about_mission: res.data.settings.about_mission || "",
              contact_email: res.data.settings.contact_email || "",
              contact_phone: res.data.settings.contact_phone || "",
              contact_address: res.data.settings.contact_address || ""
            });
          }
          break;
        }
        case "users": {
          const res = await api.get("/admin/users");
          setSystemUsers(res.data);
          break;
        }
        case "carousel": {
          const res = await api.get("/admin/carousel");
          setCarouselSlides(res.data);
          break;
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || `Failed to load ${tab} data`, "error");
    } finally {
      setLoading(false);
    }
  }, [loadStats, showToast]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { loadTabData(activeTab); }, [activeTab]);

  const switchTab = (tab: TabId) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const confirmDelete = (message: string, onConfirm: () => void) => {
    setConfirmDialog({ show: true, message, onConfirm });
  };

  // ─── Application Review ────────────────────────────────────────────────────
  const handleReview = async (memberId: string, action: "approve" | "reject") => {
    const notes = reviewerNotes[memberId] || "";
    if (!notes && action === "reject") { showToast("Please provide rejection notes", "error"); return; }
    try {
      const res = await api.post(`/admin/applications/${memberId}/review`, { action, reviewerNotes: notes || "Approved by admin" });
      showToast(res.data.message);
      loadTabData("applications");
    } catch (err: any) { showToast(err.response?.data?.message || "Review failed", "error"); }
  };

  // ─── Council Actions ──────────────────────────────────────────────────────
  const handleCouncilSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(councilForm).forEach(([k, v]) => fd.append(k, v));
    if (councilPhoto) fd.append("photo", councilPhoto);
    try {
      if (editCouncil) {
        await api.put(`/admin/council/${editCouncil.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        showToast("Council member updated");
      } else {
        await api.post("/admin/council", fd, { headers: { "Content-Type": "multipart/form-data" } });
        showToast("Council member added");
      }
      setCouncilForm({ name: "", designation: "", institution: "", email: "", phone: "", year: "2026", memberType: "Executive Council Members" });
      setCouncilPhoto(null);
      setEditCouncil(null);
      loadTabData("council");
    } catch { showToast("Operation failed", "error"); }
  };

  const handleDeleteCouncil = (id: number) => {
    confirmDelete("Are you sure you want to delete this council member?", async () => {
      try {
        await api.delete(`/admin/council/${id}`);
        showToast("Council member deleted");
        loadTabData("council");
      } catch { showToast("Delete failed", "error"); }
      setConfirmDialog(null);
    });
  };

  // ─── News Actions ─────────────────────────────────────────────────────────
  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(newsForm).forEach(([k, v]) => fd.append(k, v));
    if (newsImage) fd.append("image", newsImage);
    if (newsAttachment) fd.append("attachment", newsAttachment);
    try {
      if (editNews) {
        await api.put(`/admin/news/${editNews.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        showToast("News updated successfully");
      } else {
        await api.post("/admin/news", fd, { headers: { "Content-Type": "multipart/form-data" } });
        showToast("News published successfully");
      }
      setNewsForm({ title: "", description: "", content: "" });
      setNewsImage(null);
      setNewsAttachment(null);
      setEditNews(null);
      loadTabData("news");
    } catch { showToast("Operation failed", "error"); }
  };

  const handleDeleteNews = (id: string) => {
    confirmDelete("Delete this news article permanently?", async () => {
      try {
        await api.delete(`/admin/news/${id}`);
        showToast("News deleted");
        loadTabData("news");
      } catch { showToast("Delete failed", "error"); }
      setConfirmDialog(null);
    });
  };

  // ─── Event Actions ────────────────────────────────────────────────────────
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(eventForm).forEach(([k, v]) => fd.append(k, v));
    if (eventBanner) fd.append("banner", eventBanner);
    try {
      if (editEvent) {
        await api.put(`/admin/events/${editEvent.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        showToast("Event updated successfully");
      } else {
        await api.post("/admin/events", fd, { headers: { "Content-Type": "multipart/form-data" } });
        showToast("Event created successfully");
      }
      setEventForm({ title: "", description: "", content: "", startDate: "", endDate: "", registrationDeadline: "", eventType: "Conference", venueDetails: "", registrationLink: "" });
      setEventBanner(null);
      setEditEvent(null);
      loadTabData("events");
    } catch { showToast("Operation failed", "error"); }
  };

  const handleDeleteEvent = (id: string) => {
    confirmDelete("Delete this event permanently?", async () => {
      try {
        await api.delete(`/admin/events/${id}`);
        showToast("Event deleted");
        loadTabData("events");
      } catch { showToast("Delete failed", "error"); }
      setConfirmDialog(null);
    });
  };

  // ─── Publication Actions ──────────────────────────────────────────────────
  const handlePubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubFile) { showToast("Please select a file", "error"); return; }
    const fd = new FormData();
    Object.entries(pubForm).forEach(([k, v]) => fd.append(k, v));
    fd.append("file", pubFile);
    try {
      await api.post("/admin/publications", fd, { headers: { "Content-Type": "multipart/form-data" } });
      showToast("Publication uploaded successfully");
      setPubForm({ title: "", description: "", categoryId: "1" });
      setPubFile(null);
      loadTabData("publications");
    } catch { showToast("Upload failed", "error"); }
  };

  const handleDeletePub = (id: string) => {
    confirmDelete("Delete this publication permanently?", async () => {
      try {
        await api.delete(`/admin/publications/${id}`);
        showToast("Publication deleted");
        loadTabData("publications");
      } catch { showToast("Delete failed", "error"); }
      setConfirmDialog(null);
    });
  };

  // ─── Gallery Actions ──────────────────────────────────────────────────────
  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", albumForm.name);
    fd.append("description", albumForm.description);
    if (albumCover) fd.append("cover", albumCover);
    try {
      await api.post("/admin/gallery/albums", fd, { headers: { "Content-Type": "multipart/form-data" } });
      showToast("Album created successfully");
      setAlbumForm({ name: "", description: "" });
      setAlbumCover(null);
      loadTabData("gallery");
    } catch { showToast("Failed to create album", "error"); }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile || !selectedAlbum) { showToast("Select album and photo", "error"); return; }
    const fd = new FormData();
    fd.append("photo", photoFile);
    fd.append("caption", photoCaption);
    try {
      await api.post(`/admin/gallery/albums/${selectedAlbum.id}/photos`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      showToast("Photo added successfully");
      setPhotoFile(null);
      setPhotoCaption("");
      loadTabData("gallery");
    } catch { showToast("Upload failed", "error"); }
  };

  const handleDeleteAlbum = (id: string) => {
    confirmDelete("Delete this album and all its photos?", async () => {
      try {
        await api.delete(`/admin/gallery/albums/${id}`);
        showToast("Album deleted");
        loadTabData("gallery");
      } catch { showToast("Delete failed", "error"); }
      setConfirmDialog(null);
    });
  };

  // ─── Achievement Actions ──────────────────────────────────────────────────
  const handleAchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(achForm).forEach(([k, v]) => fd.append(k, v));
    if (achImage) fd.append("image", achImage);
    try {
      if (editAch) {
        await api.put(`/admin/achievements/${editAch.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        showToast("Achievement updated");
      } else {
        await api.post("/admin/achievements", fd, { headers: { "Content-Type": "multipart/form-data" } });
        showToast("Achievement added");
      }
      setAchForm({ title: "", description: "", date: "", category: "Milestones" });
      setAchImage(null);
      setEditAch(null);
      loadTabData("achievements");
    } catch { showToast("Operation failed", "error"); }
  };

  const handleDeleteAch = (id: string) => {
    confirmDelete("Delete this achievement record?", async () => {
      try {
        await api.delete(`/admin/achievements/${id}`);
        showToast("Achievement deleted");
        loadTabData("achievements");
      } catch { showToast("Delete failed", "error"); }
      setConfirmDialog(null);
    });
  };

  // ─── Contact Actions ──────────────────────────────────────────────────────
  const handleMarkRead = async (id: string) => {
    try {
      await api.put(`/admin/contacts/${id}/read`);
      showToast("Marked as read");
      loadTabData("contacts");
    } catch { showToast("Failed", "error"); }
  };

  const handleReply = async (id: string) => {
    const content = replyContent[id];
    if (!content) { showToast("Write a reply first", "error"); return; }
    try {
      await api.post(`/admin/contacts/${id}/reply`, { replyContent: content });
      showToast("Reply sent successfully");
      setReplyContent(p => ({ ...p, [id]: "" }));
      loadTabData("contacts");
    } catch { showToast("Failed to send reply", "error"); }
  };

  const handleDeleteContact = (id: string) => {
    confirmDelete("Delete this contact message?", async () => {
      try {
        await api.delete(`/admin/contacts/${id}`);
        showToast("Message deleted");
        loadTabData("contacts");
      } catch { showToast("Delete failed", "error"); }
      setConfirmDialog(null);
    });
  };

  // ─── Settings Save ────────────────────────────────────────────────────────
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put("/admin/settings", settingsForm);
      showToast("Settings saved successfully");
    } catch { showToast("Failed to save settings", "error"); }
  };

  // ─── Carousel Actions ─────────────────────────────────────────────────────
  const handleCarouselSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSlide && !carouselImage) { showToast("Please upload a slide image", "error"); return; }
    const fd = new FormData();
    Object.entries(carouselForm).forEach(([k, v]) => fd.append(k, v));
    if (carouselImage) fd.append("image", carouselImage);
    try {
      if (editSlide) {
        await api.put(`/admin/carousel/${editSlide.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        showToast("Slide updated successfully");
      } else {
        await api.post("/admin/carousel", fd, { headers: { "Content-Type": "multipart/form-data" } });
        showToast("Slide added successfully");
      }
      setCarouselForm({ title: "", subtitle: "", buttonLabel: "", buttonLink: "", isActive: "true" });
      setCarouselImage(null);
      setEditSlide(null);
      loadTabData("carousel");
    } catch { showToast("Operation failed", "error"); }
  };

  const handleDeleteSlide = (id: number) => {
    confirmDelete("Delete this carousel slide permanently?", async () => {
      try {
        await api.delete(`/admin/carousel/${id}`);
        showToast("Slide deleted");
        loadTabData("carousel");
      } catch { showToast("Delete failed", "error"); }
      setConfirmDialog(null);
    });
  };

  const handleToggleSlide = async (slide: any) => {
    const fd = new FormData();
    fd.append("isActive", String(!slide.isActive));
    try {
      await api.put(`/admin/carousel/${slide.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      showToast(slide.isActive ? "Slide hidden" : "Slide activated");
      loadTabData("carousel");
    } catch { showToast("Toggle failed", "error"); }
  };

  // ─── User Management ──────────────────────────────────────────────────────
  const handleUpdateUserStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/users/${id}/status`, { status });
      showToast(`User ${status}`);
      loadTabData("users");
    } catch { showToast("Failed to update user", "error"); }
  };

  const handleUpdateUserRole = async (id: string, roleName: string) => {
    try {
      await api.put(`/admin/users/${id}/role`, { roleName });
      showToast("Role updated successfully");
      loadTabData("users");
    } catch { showToast("Failed to update role", "error"); }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/users", newUserForm);
      showToast("Admin user created successfully");
      setNewUserForm({ email: "", password: "", roleName: "Admin" });
      loadTabData("users");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to create user", "error");
    }
  };

  const handleMemberStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/members/${id}/status`, { status });
      showToast("Member status updated");
      loadTabData("members");
    } catch { showToast("Failed to update member", "error"); }
  };

  const handleDeleteMemberProfile = (id: string, name: string) => {
    confirmDelete(
      `Permanently delete ${name}'s profile? This will remove all their application data and allow them to re-apply from scratch.`,
      async () => {
        try {
          await api.delete(`/admin/members/${id}`);
          showToast("Member profile deleted. User can now re-apply.");
          loadTabData("members");
        } catch (err: any) {
          showToast(err.response?.data?.message || "Failed to delete profile", "error");
        }
        setConfirmDialog(null);
      }
    );
  };

  // ─── Sidebar Nav ──────────────────────────────────────────────────────────
  const navItems: { id: TabId; label: string; icon: any; badge?: number }[] = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "applications", label: "Applications", icon: UserCheck, badge: stats.counters.pendingMembers },
    { id: "members", label: "All Members", icon: Users },
    { id: "council", label: "Executive Council", icon: GraduationCap },
    { id: "news", label: "News & Bulletins", icon: Newspaper },
    { id: "events", label: "Events", icon: CalendarDays },
    { id: "publications", label: "Publications", icon: BookOpen },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "carousel", label: "Hero Carousel", icon: ImageIcon },
    { id: "contacts", label: "Contact Messages", icon: MessageSquare, badge: stats.counters.unreadMessages },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "settings", label: "Website Settings", icon: Settings },
    { id: "users", label: "User Management", icon: UserCog },
  ];

  // ─── Input Classes ────────────────────────────────────────────────────────
  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";
  const btnPrimary = "inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow";
  const btnDanger = "inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-semibold transition-all";
  const btnSecondary = "inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold transition-all";

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Toast Notifications ── */}
      <div className="fixed top-5 right-5 z-[100] space-y-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-3 animate-slide-in ${t.type === "success" ? "bg-emerald-600 text-white" :
            t.type === "error" ? "bg-red-600 text-white" : "bg-blue-600 text-white"
            }`}>
            {t.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> :
              t.type === "error" ? <XCircle className="w-4 h-4 shrink-0" /> :
                <AlertCircle className="w-4 h-4 shrink-0" />}
            {t.message}
          </div>
        ))}
      </div>

      {/* ── Confirm Dialog ── */}
      {confirmDialog?.show && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 lg:flex-shrink-0`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">IASDS Admin</p>
              <p className="text-[10px] text-slate-400">Control Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => switchTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${activeTab === item.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {!!item.badge && item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.email}</p>
              <p className="text-[10px] text-slate-400">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 text-xs font-semibold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800">{navItems.find(n => n.id === activeTab)?.label}</h1>
            <p className="text-xs text-slate-400">Indian Association of Statistics & Data Science</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={() => loadTabData(activeTab)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="Refresh">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ════════════════════════════════════════════ */}
          {/* TAB: OVERVIEW DASHBOARD                      */}
          {/* ════════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                <StatCard label="Approved Members" value={stats.counters.approvedMembers} icon={UserCheck} color="bg-emerald-500" />
                <StatCard label="Pending Reviews" value={stats.counters.pendingMembers} icon={Clock} color="bg-amber-500" />
                <StatCard label="Total Publications" value={stats.counters.totalPublications} icon={BookOpen} color="bg-blue-500" />
                <StatCard label="Unread Messages" value={stats.counters.unreadMessages} icon={MessageSquare} color="bg-purple-500" />
                <StatCard label="Total Users" value={stats.counters.totalUsers} icon={Users} color="bg-indigo-500" />
                <StatCard label="Total Downloads" value={stats.counters.totalDownloads} icon={TrendingUp} color="bg-cyan-500" />
                <StatCard label="News Articles" value={stats.counters.totalNews} icon={Newspaper} color="bg-rose-500" />
                <StatCard label="Total Events" value={stats.counters.totalEvents} icon={CalendarDays} color="bg-orange-500" />
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="font-bold text-slate-800 text-sm mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Review Applications", icon: UserCheck, tab: "applications" as TabId, color: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
                    { label: "Add News", icon: Newspaper, tab: "news" as TabId, color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
                    { label: "Create Event", icon: CalendarDays, tab: "events" as TabId, color: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
                    { label: "View Messages", icon: MessageSquare, tab: "contacts" as TabId, color: "bg-rose-50 text-rose-700 hover:bg-rose-100" },
                  ].map(a => (
                    <button key={a.tab} onClick={() => switchTab(a.tab)} className={`flex flex-col items-center gap-2 p-4 rounded-xl text-xs font-semibold transition-all ${a.color}`}>
                      <a.icon className="w-5 h-5" />
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Recent Applications</h3>
                  <div className="space-y-3">
                    {stats.recentApplications?.length > 0 ? stats.recentApplications.map((app: any) => (
                      <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{app.user?.email}</p>
                          <p className="text-[10px] text-slate-400">Applied recently</p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                    )) : <p className="text-slate-400 text-xs text-center py-4">No recent applications</p>}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Recent Members</h3>
                  <div className="space-y-3">
                    {stats.recentMembers?.length > 0 ? stats.recentMembers.map((m: any) => (
                      <div key={m.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
                          {m.profile?.fullName?.charAt(0) || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{m.profile?.fullName}</p>
                          <p className="text-[10px] text-slate-400">{m.membershipType?.name}</p>
                        </div>
                        <StatusBadge status={m.status} />
                      </div>
                    )) : <p className="text-slate-400 text-xs text-center py-4">No recent members</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* TAB: MEMBERSHIP APPLICATIONS                 */}
          {/* ════════════════════════════════════════════ */}
          {activeTab === "applications" && (
            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 text-sm shadow-sm">No applications found.</div>
              ) : applications.map(app => (
                <div key={app.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-5 flex flex-col lg:flex-row gap-5">
                    {/* Profile Photo */}
                    <div className="shrink-0">
                      {app.profile?.profilePhotoUrl ? (
                        <img src={app.profile.profilePhotoUrl} alt="" className="w-16 h-16 rounded-xl object-cover border-2 border-slate-100" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-blue-600 text-xl font-bold">
                          {app.profile?.fullName?.charAt(0) || "?"}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-800">{app.profile?.fullName}</h4>
                        <StatusBadge status={app.status} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-xs text-slate-500">
                        <span><strong className="text-slate-700">Email:</strong> {app.user?.email}</span>
                        <span><strong className="text-slate-700">Mobile:</strong> {app.profile?.mobileNumber}</span>
                        <span><strong className="text-slate-700">Qualification:</strong> {app.profile?.qualification}</span>
                        <span><strong className="text-slate-700">Institution:</strong> {app.profile?.institution}</span>
                        <span><strong className="text-slate-700">Membership:</strong> {app.membershipType?.name}</span>
                        <span><strong className="text-slate-700">Location:</strong> {app.profile?.city}, {app.profile?.state}</span>
                      </div>
                      {app.profile?.supportingDocumentsUrl && (() => {
                        const url: string = app.profile.supportingDocumentsUrl;
                        const isPdf =
                          url.startsWith("data:application/pdf") ||
                          url.toLowerCase().includes(".pdf") ||
                          url.toLowerCase().includes("application/pdf") || url.toLowerCase().includes("image/jpeg;base64");
                        return (
                          <div className="mt-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Transaction Receipt</p>
                            {isPdf ? (
                              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border-b border-red-100">
                                  <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center shrink-0">
                                    <span className="text-white text-[8px] font-bold">PDF</span>
                                  </div>
                                  <span className="text-xs text-slate-700 font-semibold">PDF Transaction Receipt</span>
                                  <button
                                    type="button"
                                    onClick={() => downloadReceiptAsPdf(url)}
                                    className="ml-auto text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
                                  >
                                    Download PDF
                                  </button>
                                </div>
                                {/* Use <object> instead of <iframe> — <iframe> can trigger auto-downloads
                                    for unsupported MIME types; <object> shows a fallback instead */}
                                <object
                                  data={url}
                                  type="application/pdf"
                                  className="w-full"
                                  style={{ height: "280px", border: "none" }}
                                >
                                  <div className="flex flex-col items-center justify-center h-full py-8 text-slate-400 text-xs gap-2">
                                    <FileText className="w-8 h-8 text-slate-300" />
                                    <span>PDF preview not available in this browser.</span>
                                    <button
                                      type="button"
                                      onClick={() => downloadReceiptAsPdf(url)}
                                      className="text-blue-600 hover:underline font-semibold"
                                    >
                                      Click here to download
                                    </button>
                                  </div>
                                </object>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="relative group cursor-pointer" onClick={() => window.open(url, "_blank")}>
                                  <img
                                    src={url}
                                    alt="Transaction Receipt"
                                    className="w-full max-h-48 object-contain rounded-xl border border-slate-200 bg-slate-50 transition-opacity group-hover:opacity-80"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
                                      <FileText className="w-3.5 h-3.5" /> Click to open full size
                                    </span>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => downloadReceiptAsPdf(url)}
                                    className="text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
                                  >
                                    Download PDF
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Review Actions */}
                    {app.status === "pending_review" && (
                      <div className="flex flex-col gap-2 shrink-0 lg:w-52">
                        <textarea
                          rows={2}
                          placeholder="Reviewer notes..."
                          value={reviewerNotes[app.id] || ""}
                          onChange={e => setReviewerNotes(p => ({ ...p, [app.id]: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleReview(app.id, "approve")} className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2 text-xs font-bold transition-all">
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button onClick={() => handleReview(app.id, "reject")} className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-xs font-bold transition-all">
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* TAB: ALL MEMBERS                             */}
          {/* ════════════════════════════════════════════ */}
          {activeTab === "members" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm">All Registered Members ({members.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Member</th>
                      <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Membership ID</th>
                      <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Type</th>
                      <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                      <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {members.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
                              {m.profile?.fullName?.charAt(0) || "?"}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-xs">{m.profile?.fullName}</p>
                              <p className="text-[10px] text-slate-400">{m.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-600 font-mono">{m.membershipNumber || "—"}</td>
                        <td className="px-5 py-3.5 text-xs text-slate-600">{m.membershipType?.name || "—"}</td>
                        <td className="px-5 py-3.5"><StatusBadge status={m.status} /></td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            {m.status !== "suspended" && (
                              <button onClick={() => handleMemberStatus(m.id, "suspended")} className="text-[10px] bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded-lg font-semibold transition-all">Suspend</button>
                            )}
                            {m.status === "suspended" && (
                              <button onClick={() => handleMemberStatus(m.id, "approved")} className="text-[10px] bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2.5 py-1 rounded-lg font-semibold transition-all">Reactivate</button>
                            )}
                            {/* Super Admin only: delete rejected/suspended profiles so user can re-apply */}
                            {user?.role === "Super Admin" && ["rejected", "suspended"].includes(m.status) && (
                              <button
                                onClick={() => handleDeleteMemberProfile(m.id, m.profile?.fullName || "this member")}
                                className="text-[10px] bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1"
                                title="Delete profile so user can re-apply"
                              >
                                <Trash2 className="w-3 h-3" /> Delete Profile
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {members.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">No members found</div>}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* TAB: EXECUTIVE COUNCIL                       */}
          {/* ════════════════════════════════════════════ */}
          {activeTab === "council" && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              {/* Form */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-20">
                  <h3 className="font-bold text-slate-800 text-sm mb-5">{editCouncil ? "Edit Council Member" : "Add Council Member"}</h3>
                  <form onSubmit={handleCouncilSubmit} className="space-y-4">
                    {[
                      { label: "Full Name", field: "name", placeholder: "Prof. John Doe" },
                      { label: "Designation", field: "designation", placeholder: "President" },
                      { label: "Institution", field: "institution", placeholder: "IIT Delhi" },
                      { label: "Email", field: "email", placeholder: "name@institute.ac.in" },
                      { label: "Phone", field: "phone", placeholder: "+91-9876543210" },
                      { label: "Year", field: "year", placeholder: "2026" },
                    ].map(({ label, field, placeholder }) => (
                      <div key={field}>
                        <label className={labelCls}>{label}</label>
                        <input required={["name", "designation", "institution"].includes(field)} type="text" placeholder={placeholder} value={(councilForm as any)[field]} onChange={e => setCouncilForm(p => ({ ...p, [field]: e.target.value }))} className={inputCls} />
                      </div>
                    ))}
                    <div>
                      <label className={labelCls}>Council Category</label>
                      <select
                        value={councilForm.memberType}
                        onChange={e => setCouncilForm(p => ({ ...p, memberType: e.target.value }))}
                        className={inputCls}
                        required
                      >
                        <option value="Executive Council">Executive Council</option>
                        <option value="Executive Council Members">Executive Council Members</option>
                        <option value="Advisory Council Members">Advisory Council Members</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Portrait Photo</label>
                      <input type="file" accept="image/*" onChange={e => e.target.files && setCouncilPhoto(e.target.files[0])} className="text-xs text-slate-600" />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button type="submit" className={btnPrimary}>
                        <Plus className="w-4 h-4" /> {editCouncil ? "Update Member" : "Add Member"}
                      </button>
                      {editCouncil && (
                        <button type="button" onClick={() => { setEditCouncil(null); setCouncilForm({ name: "", designation: "", institution: "", email: "", phone: "", year: "2026", memberType: "Executive Council Members" }); }} className={btnSecondary}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* List */}
              <div className="xl:col-span-3 space-y-3">
                {council.map(c => (
                  <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
                    {c.photoUrl ? (
                      <img src={c.photoUrl} alt={c.name} className="w-12 h-12 rounded-xl object-cover border-2 border-slate-100 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-blue-600 text-lg font-bold shrink-0">
                        {c.name?.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.designation} · {c.institution}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Order #{c.displayOrder}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => { setEditCouncil(c); setCouncilForm({ name: c.name, designation: c.designation, institution: c.institution, email: c.email || "", phone: c.phoneNumber || "", year: c.year || "2026", memberType: c.memberType || "Executive Council Members" }); }} className={btnSecondary}>
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteCouncil(c.id)} className={btnDanger}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {council.length === 0 && <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400 text-sm shadow-sm">No council members added yet</div>}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* TAB: NEWS & BULLETINS                        */}
          {/* ════════════════════════════════════════════ */}
          {activeTab === "news" && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              <div className="xl:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-20">
                  <h3 className="font-bold text-slate-800 text-sm mb-5">{editNews ? "Edit News Article" : "Publish News"}</h3>
                  <form onSubmit={handleNewsSubmit} className="space-y-4">
                    <div>
                      <label className={labelCls}>Title</label>
                      <input required type="text" value={newsForm.title} onChange={e => setNewsForm(p => ({ ...p, title: e.target.value }))} className={inputCls} placeholder="News headline..." />
                    </div>
                    <div>
                      <label className={labelCls}>Short Description</label>
                      <input type="text" value={newsForm.description} onChange={e => setNewsForm(p => ({ ...p, description: e.target.value }))} className={inputCls} placeholder="Brief summary..." />
                    </div>
                    <div>
                      <label className={labelCls}>Full Content</label>
                      <textarea rows={5} value={newsForm.content} onChange={e => setNewsForm(p => ({ ...p, content: e.target.value }))} className={inputCls} placeholder="Full article text or HTML..." />
                    </div>
                    <div>
                      <label className={labelCls}>Banner Image</label>
                      <input type="file" accept="image/*" onChange={e => e.target.files && setNewsImage(e.target.files[0])} className="text-xs text-slate-600" />
                    </div>
                    <div>
                      <label className={labelCls}>File Attachment (PDF, DOC, Images)</label>
                      <input type="file" accept="image/*,application/pdf,.doc,.docx" onChange={e => e.target.files && setNewsAttachment(e.target.files[0])} className="text-xs text-slate-600" />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button type="submit" className={btnPrimary}>
                        <Plus className="w-4 h-4" /> {editNews ? "Update News" : "Publish"}
                      </button>
                      {editNews && (
                        <button type="button" onClick={() => { setEditNews(null); setNewsForm({ title: "", description: "", content: "" }); setNewsImage(null); setNewsAttachment(null); }} className={btnSecondary}>Cancel</button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
              <div className="xl:col-span-3 space-y-3">
                {news.map(n => (
                  <div key={n.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-4 items-start">
                    {n.imageUrl ? (
                      <img src={n.imageUrl} alt={n.title} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <Newspaper className="w-6 h-6 text-blue-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm line-clamp-1">{n.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{n.description}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => { setEditNews(n); setNewsForm({ title: n.title, description: n.description || "", content: n.content || "" }); }} className={btnSecondary}><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteNews(n.id)} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
                {news.length === 0 && <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400 text-sm shadow-sm">No news articles published</div>}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* TAB: EVENTS                                  */}
          {/* ════════════════════════════════════════════ */}
          {activeTab === "events" && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              <div className="xl:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-20">
                  <h3 className="font-bold text-slate-800 text-sm mb-5">{editEvent ? "Edit Event" : "Create Event"}</h3>
                  <form onSubmit={handleEventSubmit} className="space-y-4">
                    <div>
                      <label className={labelCls}>Event Title</label>
                      <input required type="text" value={eventForm.title} onChange={e => setEventForm(p => ({ ...p, title: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <input type="text" value={eventForm.description} onChange={e => setEventForm(p => ({ ...p, description: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Full Content</label>
                      <textarea rows={3} value={eventForm.content} onChange={e => setEventForm(p => ({ ...p, content: e.target.value }))} className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Start Date</label>
                        <input required type="datetime-local" value={eventForm.startDate} onChange={e => setEventForm(p => ({ ...p, startDate: e.target.value }))} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>End Date</label>
                        <input required type="datetime-local" value={eventForm.endDate} onChange={e => setEventForm(p => ({ ...p, endDate: e.target.value }))} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Event Type</label>
                      <select value={eventForm.eventType} onChange={e => setEventForm(p => ({ ...p, eventType: e.target.value }))} className={inputCls}>
                        {["Conference", "Workshop", "Seminar", "Webinar", "Announcement"].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Venue Details</label>
                      <input type="text" value={eventForm.venueDetails} onChange={e => setEventForm(p => ({ ...p, venueDetails: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Registration Link</label>
                      <input type="url" value={eventForm.registrationLink} onChange={e => setEventForm(p => ({ ...p, registrationLink: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Banner Image</label>
                      <input type="file" accept="image/*" onChange={e => e.target.files && setEventBanner(e.target.files[0])} className="text-xs text-slate-600" />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button type="submit" className={btnPrimary}><Plus className="w-4 h-4" /> {editEvent ? "Update Event" : "Create Event"}</button>
                      {editEvent && <button type="button" onClick={() => { setEditEvent(null); setEventForm({ title: "", description: "", content: "", startDate: "", endDate: "", registrationDeadline: "", eventType: "Conference", venueDetails: "", registrationLink: "" }); }} className={btnSecondary}>Cancel</button>}
                    </div>
                  </form>
                </div>
              </div>
              <div className="xl:col-span-3 space-y-3">
                {events.map(ev => (
                  <div key={ev.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-4 items-start">
                    {ev.bannerUrl ? (
                      <img src={ev.bannerUrl} alt={ev.title} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                        <CalendarDays className="w-6 h-6 text-purple-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <p className="font-bold text-slate-800 text-sm line-clamp-1 flex-1">{ev.title}</p>
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">{ev.eventType}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{ev.venueDetails}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(ev.startDate).toLocaleDateString()} → {new Date(ev.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => { setEditEvent(ev); setEventForm({ title: ev.title, description: ev.description || "", content: ev.content || "", startDate: ev.startDate?.slice(0, 16) || "", endDate: ev.endDate?.slice(0, 16) || "", registrationDeadline: ev.registrationDeadline?.slice(0, 16) || "", eventType: ev.eventType, venueDetails: ev.venueDetails || "", registrationLink: ev.registrationLink || "" }); }} className={btnSecondary}><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteEvent(ev.id)} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
                {events.length === 0 && <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400 text-sm shadow-sm">No events created</div>}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* TAB: PUBLICATIONS                            */}
          {/* ════════════════════════════════════════════ */}
          {activeTab === "publications" && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              <div className="xl:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-20">
                  <h3 className="font-bold text-slate-800 text-sm mb-5">Upload Publication</h3>
                  <form onSubmit={handlePubSubmit} className="space-y-4">
                    <div>
                      <label className={labelCls}>Title</label>
                      <input required type="text" value={pubForm.title} onChange={e => setPubForm(p => ({ ...p, title: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea rows={3} value={pubForm.description} onChange={e => setPubForm(p => ({ ...p, description: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Category</label>
                      <select value={pubForm.categoryId} onChange={e => setPubForm(p => ({ ...p, categoryId: e.target.value }))} className={inputCls}>
                        <option value="1">Research Papers</option>
                        <option value="2">Journals</option>
                        <option value="3">Proceedings</option>
                        <option value="4">Reports</option>
                        <option value="5">Newsletters</option>
                      </select>
                    </div>
                    <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                      <label className="block text-xs font-semibold text-slate-500 mb-2">Upload File (PDF / DOC / DOCX)</label>
                      <input type="file" accept=".pdf,.doc,.docx" onChange={e => e.target.files && setPubFile(e.target.files[0])} className="text-xs text-slate-600" />
                    </div>
                    <button type="submit" className={btnPrimary}><Upload className="w-4 h-4" /> Upload Publication</button>
                  </form>
                </div>
              </div>
              <div className="xl:col-span-3 space-y-3">
                {publications.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm line-clamp-1">{p.title}</p>
                      <p className="text-[10px] text-slate-400">{p.category?.name} · {p.downloadCount || 0} downloads</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a href={p.fileUrl} target="_blank" rel="noopener noreferrer" className={btnSecondary}><Eye className="w-3.5 h-3.5" /></a>
                      <button onClick={() => handleDeletePub(p.id)} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
                {publications.length === 0 && <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400 text-sm shadow-sm">No publications uploaded</div>}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* TAB: GALLERY                                 */}
          {/* ════════════════════════════════════════════ */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Create Album Form */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Create New Album</h3>
                  <form onSubmit={handleCreateAlbum} className="space-y-4">
                    <div>
                      <label className={labelCls}>Album Name</label>
                      <input required type="text" value={albumForm.name} onChange={e => setAlbumForm(p => ({ ...p, name: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <input type="text" value={albumForm.description} onChange={e => setAlbumForm(p => ({ ...p, description: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Cover Image</label>
                      <input type="file" accept="image/*" onChange={e => e.target.files && setAlbumCover(e.target.files[0])} className="text-xs text-slate-600" />
                    </div>
                    <button type="submit" className={btnPrimary}><Plus className="w-4 h-4" /> Create Album</button>
                  </form>
                </div>

                {/* Add Photo Form */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Add Photo to Album</h3>
                  <form onSubmit={handleAddPhoto} className="space-y-4">
                    <div>
                      <label className={labelCls}>Select Album</label>
                      <select value={selectedAlbum?.id || ""} onChange={e => setSelectedAlbum(gallery.find(a => a.id === e.target.value) || null)} className={inputCls}>
                        <option value="">-- Select Album --</option>
                        {gallery.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Photo File</label>
                      <input type="file" accept="image/*" onChange={e => e.target.files && setPhotoFile(e.target.files[0])} className="text-xs text-slate-600" />
                    </div>
                    <div>
                      <label className={labelCls}>Caption (Optional)</label>
                      <input type="text" value={photoCaption} onChange={e => setPhotoCaption(e.target.value)} className={inputCls} />
                    </div>
                    <button type="submit" className={btnPrimary}><Upload className="w-4 h-4" /> Upload Photo</button>
                  </form>
                </div>
              </div>

              {/* Albums Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {gallery.map(album => (
                  <div key={album.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
                    {album.coverImageUrl ? (
                      <img src={album.coverImageUrl} alt={album.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-slate-400" />
                      </div>
                    )}
                    <div className="p-4 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{album.name}</p>
                        <p className="text-[10px] text-slate-400">{album.images?.length || 0} photos</p>
                      </div>
                      <button onClick={() => handleDeleteAlbum(album.id)} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    {album.images?.length > 0 && (
                      <div className="px-4 pb-4 grid grid-cols-4 gap-1">
                        {album.images.slice(0, 4).map((img: any) => (
                          <img key={img.id} src={img.imageUrl} alt="" className="w-full h-10 object-cover rounded-lg" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {gallery.length === 0 && <div className="col-span-full bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400 text-sm shadow-sm">No albums created yet</div>}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* TAB: CONTACT MESSAGES                        */}
          {/* ════════════════════════════════════════════ */}
          {activeTab === "contacts" && (
            <div className="space-y-4">
              {contacts.map(msg => (
                <div key={msg.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${msg.status === "unread" ? "border-blue-200 ring-1 ring-blue-100" : "border-slate-100"}`}>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800 text-sm">{msg.name}</p>
                          <StatusBadge status={msg.status} />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{msg.email} · {msg.phone}</p>
                        <p className="text-xs font-semibold text-slate-700 mt-1">Subject: {msg.subject}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {msg.status === "unread" && (
                          <button onClick={() => handleMarkRead(msg.id)} className={btnSecondary}><Eye className="w-3.5 h-3.5" /> Mark Read</button>
                        )}
                        <button onClick={() => handleDeleteContact(msg.id)} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3">{msg.message}</p>

                    {msg.adminReply && (
                      <div className="mt-3 bg-blue-50 rounded-xl p-3">
                        <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Admin Reply</p>
                        <p className="text-xs text-slate-700">{msg.adminReply}</p>
                      </div>
                    )}

                    {msg.status !== "replied" && (
                      <div className="flex gap-2 mt-3">
                        <input
                          type="text"
                          placeholder="Type your reply..."
                          value={replyContent[msg.id] || ""}
                          onChange={e => setReplyContent(p => ({ ...p, [msg.id]: e.target.value }))}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={() => handleReply(msg.id)} className={btnPrimary}><Mail className="w-3.5 h-3.5" /> Send</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {contacts.length === 0 && <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 text-sm shadow-sm">No contact messages received</div>}
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* TAB: ACHIEVEMENTS                            */}
          {/* ════════════════════════════════════════════ */}
          {activeTab === "achievements" && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              <div className="xl:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-20">
                  <h3 className="font-bold text-slate-800 text-sm mb-5">{editAch ? "Edit Achievement" : "Add Achievement"}</h3>
                  <form onSubmit={handleAchSubmit} className="space-y-4">
                    <div>
                      <label className={labelCls}>Title</label>
                      <input required type="text" value={achForm.title} onChange={e => setAchForm(p => ({ ...p, title: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea required rows={3} value={achForm.description} onChange={e => setAchForm(p => ({ ...p, description: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Date (e.g. May 2026)</label>
                      <input type="text" value={achForm.date} onChange={e => setAchForm(p => ({ ...p, date: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Category</label>
                      <select value={achForm.category} onChange={e => setAchForm(p => ({ ...p, category: e.target.value }))} className={inputCls}>
                        {["Milestones", "Success Stories", "Recognitions", "Awards"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Image (Optional)</label>
                      <input type="file" accept="image/*" onChange={e => e.target.files && setAchImage(e.target.files[0])} className="text-xs text-slate-600" />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button type="submit" className={btnPrimary}><Plus className="w-4 h-4" /> {editAch ? "Update" : "Add Achievement"}</button>
                      {editAch && <button type="button" onClick={() => { setEditAch(null); setAchForm({ title: "", description: "", date: "", category: "Milestones" }); }} className={btnSecondary}>Cancel</button>}
                    </div>
                  </form>
                </div>
              </div>
              <div className="xl:col-span-3 space-y-3">
                {achievements.map(a => (
                  <div key={a.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm">{a.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{a.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">{a.category}</span>
                        {a.date && <span className="text-[10px] text-slate-400">{a.date}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => { setEditAch(a); setAchForm({ title: a.title, description: a.description, date: a.date || "", category: a.category || "Milestones" }); }} className={btnSecondary}><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteAch(a.id)} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
                {achievements.length === 0 && <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400 text-sm shadow-sm">No achievements added</div>}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* TAB: WEBSITE SETTINGS                        */}
          {/* ════════════════════════════════════════════ */}
          {activeTab === "settings" && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                  <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">About Content</h3>
                  <div>
                    <label className={labelCls}>Origin Narrative</label>
                    <textarea rows={4} value={settingsForm.about_origin} onChange={e => setSettingsForm(p => ({ ...p, about_origin: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Vision Statement</label>
                    <textarea rows={3} value={settingsForm.about_vision} onChange={e => setSettingsForm(p => ({ ...p, about_vision: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Mission Statement</label>
                    <textarea rows={3} value={settingsForm.about_mission} onChange={e => setSettingsForm(p => ({ ...p, about_mission: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                  <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">Contact Information</h3>
                  <div>
                    <label className={labelCls}>Contact Email</label>
                    <input type="email" value={settingsForm.contact_email} onChange={e => setSettingsForm(p => ({ ...p, contact_email: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Contact Phone</label>
                    <input type="text" value={settingsForm.contact_phone} onChange={e => setSettingsForm(p => ({ ...p, contact_phone: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Office Address</label>
                    <textarea rows={3} value={settingsForm.contact_address} onChange={e => setSettingsForm(p => ({ ...p, contact_address: e.target.value }))} className={inputCls} />
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
                <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-sm text-blue-700">Changes to website settings are applied immediately and visible to all visitors.</p>
                <button type="submit" className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap shadow-sm">
                  Save All Settings
                </button>
              </div>
            </form>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* TAB: USER MANAGEMENT                         */}
          {/* ════════════════════════════════════════════ */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Create Admin User Form */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 text-sm mb-4">Create Admin / Editor User</h3>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className={labelCls}>Email Address</label>
                    <input required type="email" value={newUserForm.email} onChange={e => setNewUserForm(p => ({ ...p, email: e.target.value }))} className={inputCls} placeholder="admin@iasds.org" />
                  </div>
                  <div>
                    <label className={labelCls}>Password</label>
                    <input required type="password" value={newUserForm.password} onChange={e => setNewUserForm(p => ({ ...p, password: e.target.value }))} className={inputCls} placeholder="Secure password" />
                  </div>
                  <div>
                    <label className={labelCls}>Role</label>
                    <select value={newUserForm.roleName} onChange={e => setNewUserForm(p => ({ ...p, roleName: e.target.value }))} className={inputCls}>
                      <option>Super Admin</option>
                      <option>Admin</option>
                      <option>Editor</option>
                    </select>
                  </div>
                  <button type="submit" className={btnPrimary}><Plus className="w-4 h-4" /> Create User</button>
                </form>
              </div>

              {/* User Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm">All System Users ({systemUsers.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Email</th>
                        <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Current Role</th>
                        <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                        <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Joined</th>
                        <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {systemUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3.5 text-xs font-medium text-slate-800">{u.email}</td>
                          <td className="px-5 py-3.5">
                            <select
                              defaultValue={u.role?.name}
                              onChange={e => handleUpdateUserRole(u.id, e.target.value)}
                              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option>Super Admin</option>
                              <option>Admin</option>
                              <option>Editor</option>
                              <option>Member</option>
                            </select>
                          </td>
                          <td className="px-5 py-3.5"><StatusBadge status={u.status} /></td>
                          <td className="px-5 py-3.5 text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              {u.status === "active" ? (
                                <button onClick={() => handleUpdateUserStatus(u.id, "suspended")} className="text-[10px] bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded-lg font-semibold">Suspend</button>
                              ) : (
                                <button onClick={() => handleUpdateUserStatus(u.id, "active")} className="text-[10px] bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2.5 py-1 rounded-lg font-semibold">Activate</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {systemUsers.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">No users found</div>}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* TAB: HERO CAROUSEL MANAGER                   */}
          {/* ════════════════════════════════════════════ */}
          {activeTab === "carousel" && (
            <div className="space-y-6">
              {/* Add / Edit Form */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 text-sm mb-5">
                  {editSlide ? "✏️ Edit Carousel Slide" : "➕ Add New Slide"}
                </h3>
                <form onSubmit={handleCarouselSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Slide Title</label>
                    <input
                      className={inputCls}
                      placeholder="E.g. National Conference 2026"
                      value={carouselForm.title}
                      onChange={e => setCarouselForm(p => ({ ...p, title: e.target.value }))}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Subtitle / Description</label>
                    <textarea
                      rows={2} className={inputCls}
                      placeholder="Short description shown below the title..."
                      value={carouselForm.subtitle}
                      onChange={e => setCarouselForm(p => ({ ...p, subtitle: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Button Label</label>
                    <input
                      className={inputCls}
                      placeholder="E.g. Learn More"
                      value={carouselForm.buttonLabel}
                      onChange={e => setCarouselForm(p => ({ ...p, buttonLabel: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Button Link (URL path)</label>
                    <input
                      className={inputCls}
                      placeholder="E.g. /membership/register"
                      value={carouselForm.buttonLink}
                      onChange={e => setCarouselForm(p => ({ ...p, buttonLink: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Slide Image {editSlide ? "(leave blank to keep current)" : "*"}</label>
                    <input
                      type="file" accept="image/*"
                      className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      onChange={e => setCarouselImage(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Visibility</label>
                    <select
                      className={inputCls}
                      value={carouselForm.isActive}
                      onChange={e => setCarouselForm(p => ({ ...p, isActive: e.target.value }))}
                    >
                      <option value="true">Active (Visible on homepage)</option>
                      <option value="false">Hidden</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 flex gap-3">
                    <button type="submit" className={btnPrimary}>
                      <Upload className="w-4 h-4" />
                      {editSlide ? "Update Slide" : "Add Slide"}
                    </button>
                    {editSlide && (
                      <button type="button" className={btnSecondary} onClick={() => { setEditSlide(null); setCarouselForm({ title: "", subtitle: "", buttonLabel: "", buttonLink: "", isActive: "true" }); setCarouselImage(null); }}>
                        <X className="w-4 h-4" /> Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Slides Grid */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 text-sm mb-4">Current Carousel Slides ({carouselSlides.length})</h3>
                {carouselSlides.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm">No slides yet. Add your first slide above.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {carouselSlides.map((slide, idx) => (
                      <div
                        key={slide.id}
                        className={`rounded-xl border overflow-hidden transition-all ${slide.isActive ? "border-slate-200" : "border-slate-100 opacity-60"
                          }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative h-36 bg-slate-100">
                          <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Order badge */}
                          <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            #{idx + 1}
                          </div>
                          {/* Status badge */}
                          <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded ${slide.isActive ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
                            }`}>
                            {slide.isActive ? "Active" : "Hidden"}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-3 space-y-1">
                          <p className="font-bold text-slate-800 text-xs leading-snug line-clamp-2">{slide.title}</p>
                          {slide.subtitle && (
                            <p className="text-[11px] text-slate-500 line-clamp-2">{slide.subtitle}</p>
                          )}
                          {slide.buttonLabel && (
                            <p className="text-[10px] text-blue-600 font-semibold">CTA: {slide.buttonLabel} → {slide.buttonLink}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="px-3 pb-3 flex gap-2">
                          <button
                            className={btnSecondary}
                            onClick={() => {
                              setEditSlide(slide);
                              setCarouselForm({
                                title: slide.title,
                                subtitle: slide.subtitle || "",
                                buttonLabel: slide.buttonLabel || "",
                                buttonLink: slide.buttonLink || "",
                                isActive: String(slide.isActive),
                              });
                              setCarouselImage(null);
                            }}
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${slide.isActive
                              ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                            onClick={() => handleToggleSlide(slide)}
                          >
                            {slide.isActive ? <Eye className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            {slide.isActive ? "Hide" : "Show"}
                          </button>
                          <button
                            className={btnDanger}
                            onClick={() => handleDeleteSlide(slide.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Del
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(100px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        @keyframes bounce-in {
          0%   { transform: scale(0.8); opacity: 0; }
          80%  { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in { animation: bounce-in 0.25s ease-out; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
