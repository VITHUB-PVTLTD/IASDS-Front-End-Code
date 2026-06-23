import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, FileText, CheckCircle2, AlertCircle, Download, Upload, RefreshCw, LogOut, Bell } from "lucide-react";
import api from "../services/api";

export const PortalDashboard: React.FC = () => {
  const { logout, updateUserMeta } = useAuth();
  const [member, setMember] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Form Edit state
  const [profileData, setProfileData] = useState({
    mobileNumber: "",
    qualification: "",
    institution: "",
    organization: "",
    designation: "",
    address: ""
  });
  
  // Payment Form State
  const [paymentData, setPaymentData] = useState({ amount: "", paymentMethod: "bank_transfer", transactionReference: "" });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);
  const [profileNotice, setProfileNotice] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/members/dashboard");
      setMember(res.data.member);
      setNotifications(res.data.notifications);

      // Populate edit fields
      const p = res.data.member.profile;
      setProfileData({
        mobileNumber: p.mobileNumber || "",
        qualification: p.qualification || "",
        institution: p.institution || "",
        organization: p.organization || "",
        designation: p.designation || "",
        address: p.address || ""
      });

      // Update auth context state if details changed
      updateUserMeta({
        status: res.data.member.status,
        membershipNumber: res.data.member.membershipNumber
      });
    } catch (err) {
      console.error("Failed to load member dashboard details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileNotice(null);
    try {
      await api.put("/members/profile", profileData);
      setProfileNotice("Profile updated successfully!");
      fetchDashboardData();
    } catch (err: any) {
      setProfileNotice(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentNotice(null);
    const payFormData = new FormData();
    payFormData.append("amount", paymentData.amount);
    payFormData.append("paymentMethod", paymentData.paymentMethod);
    payFormData.append("transactionReference", paymentData.transactionReference);
    if (receiptFile) {
      payFormData.append("receipt", receiptFile);
    }

    try {
      await api.post("/members/payment", payFormData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setPaymentNotice("Receipt uploaded successfully. Admin will verify shortly.");
      setPaymentData({ amount: "", paymentMethod: "bank_transfer", transactionReference: "" });
      setReceiptFile(null);
      fetchDashboardData();
    } catch (err: any) {
      setPaymentNotice(err.response?.data?.message || "Payment submission failed.");
    }
  };

  const handleMarkAsRead = async (notifId: string) => {
    try {
      await api.put(`/members/notifications/${notifId}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error("Failed to update notification status", err);
    }
  };

  const handleDownloadCard = () => {
    // Instead of raw links, perform an Axios request to receive as blob and trigger download natively in browser
    api.get("/members/download-card", { responseType: "blob" })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `iasds-membership-card-${member.membershipNumber}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error("Card download failed", err);
        alert("Failed to download PDF. Verify application status is Approved.");
      });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Title Panel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-left">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={member.profile?.profilePhotoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"}
                alt="Member Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Welcome, {member.profile?.fullName}</h1>
              <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
                Status: {member.status} | ID: {member.membershipNumber || "PENDING"}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={fetchDashboardData}
              className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
              title="Refresh Dashboard"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              className="bg-red-50 text-red-500 hover:bg-red-100 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: MEM STATS & DOWNLOADS */}
          <div className="space-y-6">
            
            {/* Status and Action Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-left space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-50 pb-2">Membership Status</h3>
              
              {member.status === "approved" ? (
                <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <p className="font-bold">Active Member</p>
                    <p className="mt-1">Joined Date: {new Date(member.joinedDate).toLocaleDateString()}</p>
                    <p>Expiry Date: {new Date(member.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-xl text-xs flex gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
                  <div>
                    <p className="font-bold">Application Pending Review</p>
                    <p className="mt-1">The Review Board is auditing your qualifications. Digital credentials will be issued upon approval.</p>
                  </div>
                </div>
              )}

              {/* ID Card Download Button */}
              {member.status === "approved" && (
                <button
                  onClick={handleDownloadCard}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition-all"
                >
                  <Download className="w-4.5 h-4.5" />
                  <span>Download Digital ID Card (PDF)</span>
                </button>
              )}
            </div>

            {/* Notifications Alert Center */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-left">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-50 pb-2 flex items-center space-x-1.5">
                <Bell className="w-4.5 h-4.5 text-primary" />
                <span>Recent Notifications</span>
              </h3>
              
              <div className="space-y-3 pt-3">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        n.isRead
                          ? "bg-slate-50 border-slate-100 text-slate-500"
                          : "bg-primary/5 border-primary/10 text-slate-800 font-medium"
                      }`}
                    >
                      <p className="line-clamp-2">{n.message}</p>
                      <span className="text-[9px] text-slate-400 block mt-1">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs py-4 text-center">No notifications available.</p>
                )}
              </div>
            </div>

          </div>

          {/* MIDDLE COLUMN: PROFILE DATA EDITOR */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-left">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-50 pb-2 flex items-center space-x-1.5">
              <User className="w-4.5 h-4.5 text-primary" />
              <span>Edit Profile Details</span>
            </h3>

            {profileNotice && (
              <div className="p-3 bg-blue-50 text-blue-800 border border-blue-100 rounded-xl text-xs mt-3 mb-2">
                {profileNotice}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={profileData.mobileNumber}
                  onChange={(e) => setProfileData({ ...profileData, mobileNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Qualification</label>
                <input
                  type="text"
                  value={profileData.qualification}
                  onChange={(e) => setProfileData({ ...profileData, qualification: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">College/Institution</label>
                <input
                  type="text"
                  value={profileData.institution}
                  onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Organization</label>
                <input
                  type="text"
                  value={profileData.organization}
                  onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Designation</label>
                <input
                  type="text"
                  value={profileData.designation}
                  onChange={(e) => setProfileData({ ...profileData, designation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Street Address</label>
                <textarea
                  rows={2}
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2.5 rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                Save Profile Changes
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: RENEWAL & PAYMENTS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-left">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-50 pb-2 flex items-center space-x-1.5">
              <FileText className="w-4.5 h-4.5 text-primary" />
              <span>Payments & Renewal Receipt</span>
            </h3>

            {paymentNotice && (
              <div className="p-3 bg-blue-50 text-blue-800 border border-blue-100 rounded-xl text-xs mt-3 mb-2">
                {paymentNotice}
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Amount Paid (INR)</label>
                <input
                  type="number"
                  required
                  placeholder="E.g. 1000"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Payment Method</label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                >
                  <option value="bank_transfer">Bank Transfer (IMPS/NEFT)</option>
                  <option value="online">Online Payment (Gateway)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Transaction Ref Code</label>
                <input
                  type="text"
                  placeholder="UTR / Txn Ref Number"
                  value={paymentData.transactionReference}
                  onChange={(e) => setPaymentData({ ...paymentData, transactionReference: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                />
              </div>
              
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-350">
                <label className="block font-bold text-slate-600 mb-2">Upload Transfer Receipt Receipt File (PDF/Image)</label>
                <input
                  type="file"
                  required
                  onChange={(e) => e.target.files && setReceiptFile(e.target.files[0])}
                  className="text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-2.5 rounded-lg font-bold hover:bg-primary-dark transition-colors flex items-center justify-center space-x-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Payment receipt</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
export default PortalDashboard;
