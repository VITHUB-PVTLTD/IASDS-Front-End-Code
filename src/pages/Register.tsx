import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck,
  FileCheck, ArrowRight, User, BookOpen, Briefcase,
  MapPin, Upload, Mail, Lock, AlertCircle,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// ─────────────────────────────────────────────────────────
// TAB TYPES
// ─────────────────────────────────────────────────────────
type Tab = "signin" | "signup";

// ─────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────
export const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Default to signup when arriving from "Apply for Membership"
  const searchParams = new URLSearchParams(location.search);
  const defaultTab: Tab = searchParams.get("tab") === "signin" ? "signin" : "signup";
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

  // ── Sign-In State ──────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const isExpired = searchParams.get("expired") === "true";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      await login({ email: loginEmail, password: loginPassword });
      const storedUserStr = localStorage.getItem("user");
      if (storedUserStr) {
        const storedUser = JSON.parse(storedUserStr);
        navigate(storedUser.role === "Member" ? "/portal" : "/admin");
      }
    } catch (err: any) {
      setLoginError(err.response?.data?.message || "Invalid credentials or server offline.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Sign-Up State ──────────────────────────────────────
  const [step, setStep] = useState(1);
  const [membershipTypes, setMembershipTypes] = useState<any[]>([]);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "", password: "", fullName: "", gender: "Male",
    dateOfBirth: "", mobileNumber: "", qualification: "",
    institution: "", specialization: "", organization: "",
    designation: "", experience: "", country: "India",
    state: "", city: "", postalCode: "", address: "",
    membershipTypeId: "",
  });

  const [files, setFiles] = useState<{ profilePhoto: File | null; supportingDocument: File | null }>({
    profilePhoto: null, supportingDocument: null,
  });
  const [receiptPreview, setReceiptPreview] = useState<{ url: string; isPdf: boolean } | null>(null);

  useEffect(() => {
    api.get("/public/membership-types").then((res) => {
      setMembershipTypes(res.data);
    }).catch(console.error);
  }, []);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profilePhoto" | "supportingDocument"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFiles({ ...files, [field]: file });
    if (field === "supportingDocument") {
      const isPdf = file.type === "application/pdf";
      const reader = new FileReader();
      reader.onload = (ev) => {
        setReceiptPreview({ url: ev.target?.result as string, isPdf });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = () => {
    setRegError(null);
    if (step === 1 && (!formData.fullName || !formData.email || !formData.password || !formData.mobileNumber)) {
      setRegError("Please fill in Name, Email, Password, and Mobile Number."); return false;
    }
    if (step === 4 && (!formData.state || !formData.city || !formData.address)) {
      setRegError("State, City, and Physical Address are required."); return false;
    }
    if (step === 5 && !files.supportingDocument) {
      setRegError("A payment transaction receipt (PDF or Image) is required for verification."); return false;
    }
    return true;
  };

  const handleNext = () => { if (validateStep()) setStep((s) => s + 1); };
  const handlePrev = () => { setRegError(null); setStep((s) => s - 1); };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Guard: only allow actual submission from the final review step
    if (step !== 6) return;
    // Also guard: membership type must be selected
    if (!formData.membershipTypeId) {
      setRegError("Please select a membership type before submitting.");
      return;
    }
    setRegLoading(true);
    setRegError(null);
    const submitData = new FormData();
    Object.keys(formData).forEach((k) => submitData.append(k, (formData as any)[k]));
    if (files.profilePhoto) submitData.append("profilePhoto", files.profilePhoto);
    if (files.supportingDocument) submitData.append("supportingDocument", files.supportingDocument);
    try {
      const res = await api.post("/auth/register", submitData, { headers: { "Content-Type": "multipart/form-data" } });
      alert(res.data.message);
      navigate("/membership/register?tab=signin");
    } catch (err: any) {
      setRegError(err.response?.data?.message || "Registration failed. Please verify inputs.");
    } finally {
      setRegLoading(false);
    }
  };

  const STEPS = [
    { id: 1, label: "Personal", icon: User },
    { id: 2, label: "Academic", icon: BookOpen },
    { id: 3, label: "Professional", icon: Briefcase },
    { id: 4, label: "Address", icon: MapPin },
    { id: 5, label: "Uploads", icon: Upload },
    { id: 6, label: "Submit", icon: FileCheck },
  ];

  // ── Shared Tab Header ──────────────────────────────────
  const tabBtn = (id: Tab, label: string) => (
    <button
      key={id}
      onClick={() => setActiveTab(id)}
      style={{
        flex: 1,
        padding: "14px 0",
        fontWeight: 700,
        fontSize: "15px",
        letterSpacing: "0.03em",
        border: "none",
        cursor: "pointer",
        borderBottom: activeTab === id ? "3px solid #00357D" : "3px solid transparent",
        color: activeTab === id ? "#00357D" : "#6B7280",
        background: "none",
        transition: "color 250ms, border-color 250ms",
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #EEF4FF 0%, #F9FAFB 60%, #FFF0FA 100%)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "48px",
        paddingBottom: "60px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: activeTab === "signin" ? "460px" : "720px" }}>

        {/* ── Brand strip ── */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <img
            src="/assets/logo.jpg"
            alt="IASDS"
            style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "contain", margin: "0 auto 10px" }}
          />
          <div style={{ color: "#00357D", fontWeight: 800, fontSize: "20px", letterSpacing: "0.06em" }}>IASDS</div>
          <div style={{ color: "#6B7280", fontSize: "12px", marginTop: "2px" }}>
            Indian Association of Statistics &amp; Data Science
          </div>
        </div>

        {/* ── Tab Card ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 8px 40px rgba(0,53,125,0.10), 0 2px 8px rgba(0,0,0,0.04)",
            overflow: "hidden",
            border: "1px solid #E5E7EB",
          }}
        >
          {/* Tab switcher */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #F3F4F6",
              background: "#FAFAFA",
            }}
          >
            {tabBtn("signin", "Sign In")}
            {tabBtn("signup", "Apply for Membership")}
          </div>

          {/* ════════════════════════════════════════════════
              SIGN IN TAB
          ════════════════════════════════════════════════ */}
          {activeTab === "signin" && (
            <div style={{ padding: "36px 36px 32px" }}>
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <div
                  style={{
                    width: "48px", height: "48px", borderRadius: "14px",
                    background: "#EEF4FF", display: "flex", alignItems: "center",
                    justifyContent: "center", margin: "0 auto 12px",
                  }}
                >
                  <ShieldCheck size={24} color="#00357D" />
                </div>
                <h2 style={{ color: "#111827", fontWeight: 800, fontSize: "22px", margin: 0 }}>Member Portal Login</h2>
                <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "6px" }}>
                  Access your member profile or admin console.
                </p>
              </div>

              {isExpired && (
                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "10px", padding: "12px 14px", marginBottom: "18px", display: "flex", gap: "8px", fontSize: "13px", color: "#92400E" }}>
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "1px" }} />
                  Session expired. Please re-enter your credentials.
                </div>
              )}
              {loginError && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "10px", padding: "12px 14px", marginBottom: "18px", display: "flex", gap: "8px", fontSize: "13px", color: "#991B1B" }}>
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "1px" }} />
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "6px" }}>
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="email" required value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="member@iasds.org"
                      style={{ width: "100%", boxSizing: "border-box", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "12px 14px 12px 40px", fontSize: "14px", color: "#111827", outline: "none" }}
                      onFocus={(e) => (e.target.style.borderColor = "#00357D")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                    <Mail size={15} color="#9CA3AF" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.12em" }}>Password</label>
                    <Link to="/forgot-password" style={{ fontSize: "11px", color: "#00357D", fontWeight: 600, textDecoration: "none" }}>
                      Forgot password?
                    </Link>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      type="password" required value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      style={{ width: "100%", boxSizing: "border-box", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "12px 14px 12px 40px", fontSize: "14px", color: "#111827", outline: "none" }}
                      onFocus={(e) => (e.target.style.borderColor = "#00357D")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                    <Lock size={15} color="#9CA3AF" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                  </div>
                </div>

                <button
                  type="submit" disabled={loginLoading}
                  style={{
                    width: "100%", background: loginLoading ? "#6B7280" : "#00357D",
                    color: "#fff", border: "none", borderRadius: "12px",
                    padding: "14px", fontWeight: 700, fontSize: "15px",
                    cursor: loginLoading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    boxShadow: "0 4px 14px rgba(0,53,125,0.25)",
                    transition: "background 300ms",
                    marginTop: "4px",
                  }}
                  onMouseEnter={(e) => { if (!loginLoading) e.currentTarget.style.background = "#002a63"; }}
                  onMouseLeave={(e) => { if (!loginLoading) e.currentTarget.style.background = "#00357D"; }}
                >
                  <span>{loginLoading ? "Authenticating..." : "Secure Login"}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "#6B7280" }}>
                Not an IASDS member?{" "}
                <button
                  onClick={() => setActiveTab("signup")}
                  style={{ color: "#D30090", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: "13px", textDecoration: "underline" }}
                >
                  Apply for Membership
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
              SIGN UP TAB — multi-step membership registration
          ════════════════════════════════════════════════ */}
          {activeTab === "signup" && (
            <div style={{ padding: "28px 32px 32px" }}>

              {/* Step progress bar */}
              <div
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  overflowX: "auto", paddingBottom: "20px", borderBottom: "1px solid #F3F4F6",
                  marginBottom: "28px", gap: "8px",
                }}
              >
                {STEPS.map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    <div
                      style={{
                        width: "32px", height: "32px", borderRadius: "10px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 800, fontSize: "12px",
                        background: step === item.id ? "#00357D" : step > item.id ? "#D1FAE5" : "#F3F4F6",
                        color: step === item.id ? "#fff" : step > item.id ? "#065F46" : "#9CA3AF",
                        boxShadow: step === item.id ? "0 2px 8px rgba(0,53,125,0.3)" : "none",
                      }}
                    >
                      {step > item.id ? <CheckCircle2 size={16} /> : item.id}
                    </div>
                    <span
                      style={{
                        fontSize: "10px", fontWeight: 700, textTransform: "uppercase",
                        letterSpacing: "0.1em", display: "none",
                        color: step === item.id ? "#00357D" : "#9CA3AF",
                      }}
                      className="sm:inline"
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Error banner */}
              {regError && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "10px", padding: "12px 14px", marginBottom: "20px", display: "flex", gap: "8px", fontSize: "13px", color: "#991B1B" }}>
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "1px" }} />
                  {regError}
                </div>
              )}

              <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                {/* STEP 1: PERSONAL */}
                {step === 1 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <h2 style={{ margin: 0, color: "#111827", fontWeight: 800, fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <User size={18} color="#00357D" /> Personal Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Full Name", name: "fullName", type: "text", placeholder: "Enter Full Name" },
                      ].map((f) => (
                        <div key={f.name}>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{f.label}</label>
                          <input type={f.type} name={f.name} value={(formData as any)[f.name]} onChange={handleTextChange} placeholder={f.placeholder} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" style={{ outline: "none" }} onFocus={(e) => (e.target.style.borderColor = "#00357D")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                        </div>
                      ))}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleTextChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm">
                          <option>Male</option><option>Female</option><option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date of Birth</label>
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleTextChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" onFocus={(e) => (e.target.style.borderColor = "#00357D")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mobile Number</label>
                        <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleTextChange} placeholder="+91 9876543210" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" onFocus={(e) => (e.target.style.borderColor = "#00357D")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleTextChange} placeholder="user@domain.com" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" onFocus={(e) => (e.target.style.borderColor = "#00357D")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleTextChange} placeholder="Create portal password" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" onFocus={(e) => (e.target.style.borderColor = "#00357D")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: ACADEMIC */}
                {step === 2 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <h2 style={{ margin: 0, color: "#111827", fontWeight: 800, fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <BookOpen size={18} color="#00357D" /> Academic Information
                    </h2>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Highest Qualification</label>
                      <input type="text" name="qualification" value={formData.qualification} onChange={handleTextChange} placeholder="E.g. Ph.D. in Statistics" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" onFocus={(e) => (e.target.style.borderColor = "#00357D")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">College / Institution</label>
                        <input type="text" name="institution" value={formData.institution} onChange={handleTextChange} placeholder="E.g. Indian Statistical Institute" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" onFocus={(e) => (e.target.style.borderColor = "#00357D")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Specialization Area</label>
                        <input type="text" name="specialization" value={formData.specialization} onChange={handleTextChange} placeholder="E.g. Computational Inference" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" onFocus={(e) => (e.target.style.borderColor = "#00357D")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: PROFESSIONAL */}
                {step === 3 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <h2 style={{ margin: 0, color: "#111827", fontWeight: 800, fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Briefcase size={18} color="#00357D" /> Professional Background
                    </h2>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Current Organization</label>
                      <input type="text" name="organization" value={formData.organization} onChange={handleTextChange} placeholder="E.g. IIT Delhi, Tech Analytics Corp" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" onFocus={(e) => (e.target.style.borderColor = "#00357D")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Designation / Role</label>
                        <input type="text" name="designation" value={formData.designation} onChange={handleTextChange} placeholder="E.g. Assistant Professor" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" onFocus={(e) => (e.target.style.borderColor = "#00357D")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Years of Experience</label>
                        <input type="text" name="experience" value={formData.experience} onChange={handleTextChange} placeholder="E.g. 5 Years" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" onFocus={(e) => (e.target.style.borderColor = "#00357D")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: ADDRESS */}
                {step === 4 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <h2 style={{ margin: 0, color: "#111827", fontWeight: 800, fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <MapPin size={18} color="#00357D" /> Address Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Country</label>
                        <input type="text" name="country" value={formData.country} onChange={handleTextChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" onFocus={(e) => (e.target.style.borderColor = "#00357D")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">State / Region</label>
                        <input type="text" name="state" value={formData.state} onChange={handleTextChange} placeholder="E.g. Delhi, Maharashtra" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" onFocus={(e) => (e.target.style.borderColor = "#00357D")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleTextChange} placeholder="E.g. New Delhi" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" onFocus={(e) => (e.target.style.borderColor = "#00357D")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Postal / ZIP Code</label>
                        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleTextChange} placeholder="E.g. 110001" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" onFocus={(e) => (e.target.style.borderColor = "#00357D")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Street Address</label>
                      <textarea name="address" rows={2} value={formData.address} onChange={handleTextChange} placeholder="Room/Flat, Street, Block" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" onFocus={(e) => (e.target.style.borderColor = "#00357D")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                    </div>
                  </div>
                )}

                {/* STEP 5: UPLOADS */}
                {step === 5 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <h2 style={{ margin: 0, color: "#111827", fontWeight: 800, fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Upload size={18} color="#00357D" /> Document Uploads
                    </h2>

                    {/* Profile Photo upload */}
                    <div style={{ background: "#F9FAFB", border: "2px dashed #D1D5DB", borderRadius: "14px", padding: "24px" }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>Profile Photo (JPG / PNG)</label>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "profilePhoto")} style={{ fontSize: "12px" }} />
                      {files.profilePhoto && (
                        <span style={{ display: "block", marginTop: "6px", fontSize: "11px", color: "#059669", fontWeight: 600 }}>
                          ✓ {files.profilePhoto.name}
                        </span>
                      )}
                    </div>

                    {/* Transaction Receipt upload with live preview */}
                    <div style={{ background: "#F9FAFB", border: `2px dashed ${files.supportingDocument ? "#059669" : "#D1D5DB"}`, borderRadius: "14px", padding: "24px" }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>
                        Payment Transaction Receipt (PDF or Image) *
                      </label>
                      <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "supportingDocument")} style={{ fontSize: "12px" }} />
                      {files.supportingDocument && (
                        <span style={{ display: "block", marginTop: "6px", fontSize: "11px", color: "#059669", fontWeight: 600 }}>
                          ✓ {files.supportingDocument.name}
                        </span>
                      )}
                      {/* Live preview */}
                      {receiptPreview && (
                        <div style={{ marginTop: "14px" }}>
                          {receiptPreview.isPdf ? (
                            <div style={{ background: "#EEF4FF", border: "1px solid #C7D7F9", borderRadius: "10px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{ width: "36px", height: "36px", background: "#DC2626", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <span style={{ color: "#fff", fontSize: "9px", fontWeight: 800, letterSpacing: "0.04em" }}>PDF</span>
                              </div>
                              <div>
                                <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: "#1E3A8A" }}>PDF Document Ready</p>
                                <p style={{ margin: 0, fontSize: "10px", color: "#6B7280", marginTop: "2px" }}>{files.supportingDocument?.name}</p>
                              </div>
                              <span style={{ marginLeft: "auto", fontSize: "11px", color: "#059669", fontWeight: 700 }}>✓ Uploaded</span>
                            </div>
                          ) : (
                            <div style={{ marginTop: "4px" }}>
                              <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: 700, color: "#374151" }}>Preview:</p>
                              <img
                                src={receiptPreview.url}
                                alt="Receipt preview"
                                style={{ maxWidth: "100%", maxHeight: "240px", borderRadius: "10px", border: "1px solid #E5E7EB", objectFit: "contain" }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 6: REVIEW */}
                {step === 6 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <h2 style={{ margin: 0, color: "#111827", fontWeight: 800, fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <ShieldCheck size={18} color="#00357D" /> Membership Plan Review
                    </h2>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Membership Tier</label>
                      <select name="membershipTypeId" value={formData.membershipTypeId} onChange={handleTextChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold">
                        <option value="" disabled>-- Select Membership Type --</option>
                        {membershipTypes.map((t) => (
                          <option key={t.id} value={t.id}>{t.name} ({t.currency === "USD" ? "USD " : "₹"}{parseFloat(t.feeAmount).toLocaleString()})</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ background: "#F9FAFB", borderRadius: "14px", padding: "20px", border: "1px solid #E5E7EB" }}>
                      <h3 style={{ margin: "0 0 12px", fontWeight: 700, fontSize: "13px", color: "#111827" }}>Application Summary</h3>
                      {[
                        ["Name", formData.fullName],
                        ["Email", formData.email],
                        ["Institution", formData.institution || "N/A"],
                        ["State", formData.state],
                      ].map(([k, v]) => (
                        <p key={k} style={{ margin: "6px 0", fontSize: "13px", color: "#374151" }}>
                          <strong>{k}:</strong> {v}
                        </p>
                      ))}
                      {/* Receipt preview in summary */}
                      <div style={{ marginTop: "10px" }}>
                        <strong style={{ fontSize: "13px", color: "#374151" }}>Transaction Receipt:</strong>
                        {!files.supportingDocument ? (
                          <span style={{ fontSize: "13px", color: "#DC2626", marginLeft: "6px" }}>⚠ Missing — please go back to Step 5</span>
                        ) : receiptPreview ? (
                          receiptPreview.isPdf ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "8px", padding: "8px 12px" }}>
                              <div style={{ width: "28px", height: "28px", background: "#DC2626", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <span style={{ color: "#fff", fontSize: "8px", fontWeight: 800 }}>PDF</span>
                              </div>
                              <span style={{ fontSize: "12px", color: "#374151", fontWeight: 600 }}>{files.supportingDocument.name}</span>
                              <span style={{ fontSize: "11px", color: "#059669", marginLeft: "auto", fontWeight: 700 }}>✓ Ready</span>
                            </div>
                          ) : (
                            <div style={{ marginTop: "8px" }}>
                              <img
                                src={receiptPreview.url}
                                alt="Receipt"
                                style={{ maxWidth: "100%", maxHeight: "160px", borderRadius: "8px", border: "1px solid #E5E7EB", objectFit: "contain" }}
                              />
                            </div>
                          )
                        ) : (
                          <span style={{ fontSize: "13px", color: "#059669", marginLeft: "6px" }}>✓ {files.supportingDocument.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation footer */}
                <div style={{ paddingTop: "20px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {step > 1 ? (
                    <button type="button" onClick={handlePrev}
                      style={{ background: "#F3F4F6", color: "#374151", border: "none", borderRadius: "10px", padding: "11px 20px", fontWeight: 600, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "background 200ms" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#E5E7EB")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#F3F4F6")}
                    >
                      <ChevronLeft size={15} /> Previous
                    </button>
                  ) : (
                    <button type="button" onClick={() => setActiveTab("signin")}
                      style={{ background: "none", border: "none", fontSize: "13px", color: "#6B7280", cursor: "pointer", fontWeight: 600 }}
                    >
                      Already registered? Sign In
                    </button>
                  )}

                  {step < 6 ? (
                    <button type="button" onClick={handleNext}
                      style={{ background: "#00357D", color: "#fff", border: "none", borderRadius: "10px", padding: "11px 22px", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 12px rgba(0,53,125,0.25)", transition: "background 300ms" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#002a63")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#00357D")}
                    >
                      Next Step <ChevronRight size={15} />
                    </button>
                  ) : (
                    <button type="submit" disabled={regLoading}
                      style={{ background: regLoading ? "#6B7280" : "#D30090", color: "#fff", border: "none", borderRadius: "10px", padding: "11px 24px", fontWeight: 700, fontSize: "14px", cursor: regLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 12px rgba(211,0,144,0.25)", transition: "background 300ms" }}
                      onMouseEnter={(e) => { if (!regLoading) e.currentTarget.style.background = "#B10078"; }}
                      onMouseLeave={(e) => { if (!regLoading) e.currentTarget.style.background = "#D30090"; }}
                    >
                      {regLoading ? "Submitting..." : "Submit Application"} <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
