import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const isExpired = searchParams.get("expired") === "true";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      
      // Redirect based on role
      const storedUserStr = localStorage.getItem("user");
      if (storedUserStr) {
        const storedUser = JSON.parse(storedUserStr);
        if (storedUser.role === "Member") {
          navigate("/portal");
        } else {
          navigate("/admin");
        }
      }
    } catch (err: any) {
      console.error("Login component error:", err);
      setError(err.response?.data?.message || "Invalid credentials or login server offline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-10 relative overflow-hidden">
        {/* Brand highlight */}
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-gradient"></div>

        <div className="text-center space-y-3 mb-8">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Portal Login</h2>
          <p className="text-slate-500 text-xs">Access your member profile dashboard or admin console panel.</p>
        </div>

        {isExpired && (
          <div className="p-3 bg-yellow-50 text-yellow-800 border border-yellow-100 rounded-xl text-xs text-left mb-6 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-yellow-600 mt-0.5" />
            <span>Session expired. Please re-enter your credentials.</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-800 border border-red-100 rounded-xl text-xs text-left mb-6 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="text-left">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-primary focus:bg-white text-slate-700"
                placeholder=" E.g. member@iasds.org"
              />
              <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password input */}
          <div className="text-left">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-[10px] text-primary hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-primary focus:bg-white text-slate-700"
                placeholder="Enter password"
              />
              <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? "Authenticating Session..." : "Secure Login"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center text-xs text-slate-500">
          Not registered as an IASDS member?{" "}
          <Link to="/membership/register" className="text-primary font-bold hover:underline">
            Apply online
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
