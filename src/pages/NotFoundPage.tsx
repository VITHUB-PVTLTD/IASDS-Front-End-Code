import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(10);

  // Auto-redirect to home after 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF4FC] via-white to-[#EAF4FC] flex flex-col items-center justify-center px-4 py-16">
      {/* Decorative background circles */}
      <div
        aria-hidden="true"
        className="absolute top-24 left-10 w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #0D5C99, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #083B66, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* 404 Large Display */}
        <div className="relative mb-6 select-none">
          <span
            className="text-[10rem] sm:text-[14rem] font-extrabold leading-none tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #0D5C99 0%, #083B66 60%, #0D5C99 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: 0.15,
            }}
          >
            404
          </span>
          {/* Centered icon on top of the 404 text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(180deg, #0D5C99 0%, #083B66 100%)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#083B66] mb-3">
          Page Not Found
        </h1>

        {/* Attempted path */}
        {location.pathname && (
          <p className="text-sm text-slate-400 font-mono mb-4 break-all">
            <span className="text-slate-500">Requested path: </span>
            <span className="text-[#0D5C99]">{location.pathname}</span>
          </p>
        )}

        {/* Description */}
        <p className="text-slate-600 text-base sm:text-lg max-w-md mx-auto mb-8 leading-relaxed">
          The page you are looking for doesn't exist, has been moved, or is
          temporarily unavailable. Please check the URL or navigate back to the
          main site.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            to="/"
            id="not-found-go-home"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            style={{ background: "linear-gradient(180deg, #0D5C99 0%, #083B66 100%)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Homepage
          </Link>

          <button
            id="not-found-go-back"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded font-semibold text-sm border transition-all duration-200 hover:bg-[#EAF4FC] active:scale-95"
            style={{ borderColor: "#0D5C99", color: "#0D5C99" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>

        {/* Auto-redirect countdown */}
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            style={{ animationDuration: "3s" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
          </svg>
          Redirecting to homepage in{" "}
          <span className="font-bold text-[#0D5C99]">{countdown}s</span>
        </div>

        {/* Divider + Helpful links */}
        <div className="mt-10 pt-8 border-t border-slate-200">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-4 font-medium">
            You might be looking for
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { label: "Home", to: "/" },
              { label: "About", to: "/about/origin" },
              { label: "Services", to: "/services/research" },
              { label: "Membership", to: "/membership/types" },
              { label: "Publications", to: "/publications" },
              { label: "Contact", to: "/contact" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium transition-colors duration-150 hover:underline"
                style={{ color: "#0D5C99" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
