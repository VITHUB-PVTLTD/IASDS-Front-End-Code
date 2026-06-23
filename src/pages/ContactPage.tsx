import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../services/api";

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ status: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);

    try {
      const res = await api.post("/public/contact", formData);
      setNotice({ status: "success", message: res.data.message });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      setNotice({
        status: "error",
        message: err.response?.data?.message || "Failed to submit message. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Banner Section */}
        <div className="bg-brand-gradient text-white rounded-3xl p-10 sm:p-14 shadow-lg mb-12 text-center relative overflow-hidden">
          <span className="text-white/80 text-xs uppercase tracking-widest font-bold block mb-2">Support Channels</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="text-slate-200 mt-2 text-sm sm:text-base font-light max-w-lg mx-auto">
            Reach out regarding membership registration audits, publication reviews, or event collaborations.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Column */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-6 flex flex-col justify-between relative overflow-hidden min-h-[400px]">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-heading">IASDS Office</h2>
              <p className="text-slate-350 text-xs leading-relaxed">
                Connect directly through official support lines, or drop by our academic headquarters.
              </p>

              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span>1-c, Malar Sunflower Apartment, 2nd sub lane, 16th Cross Street, Krishna Nagar, Lawspet, Puducherry (UTI), 605008.</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-secondary shrink-0" />
                  <span>+91 9629862241</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-secondary shrink-0" />
                  <span>indianasandds@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Embed Google Map Frame */}
            <div className="h-44 w-full bg-slate-800 rounded-2xl overflow-hidden mt-6 relative">
              <iframe
                title="Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.3324067959293!2d79.81739097453196!3d11.949948736454122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5361768182cb81%3A0x577c9023a3df8858!2sMalar&#39;s%20Sunflower%20Apartment!5e1!3m2!1sen!2sin!4v1782213326530!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm flex flex-col justify-center text-left">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Send Message</h2>
            <p className="text-slate-500 text-xs mb-8">Please fill in details below, and our office clerk will contact you.</p>

            {notice && (
              <div
                className={`p-4 rounded-xl flex items-start space-x-3 mb-6 text-sm ${notice.status === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
                  }`}
              >
                {notice.status === "success" ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                )}
                <span>{notice.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-primary focus:bg-white transition-all text-slate-700"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-primary focus:bg-white transition-all text-slate-700"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-primary focus:bg-white transition-all text-slate-700"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Subject Query
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-primary focus:bg-white transition-all text-slate-700"
                    placeholder="E.g. Membership Query"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Message Body
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-primary focus:bg-white transition-all text-slate-700"
                  placeholder="Detail your inquiry request..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Sending Message..." : "Send Message"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
export default ContactPage;
