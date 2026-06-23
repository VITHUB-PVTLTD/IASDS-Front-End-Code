import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  FlaskConical,
  BookOpen,
  BarChart3,
  Landmark,
  Building2,
  CheckCircle,
  ChevronRight,
  UserPlus,
  Info,
} from "lucide-react";

// ─── Eligibility Categories ──────────────────────────────────────────────────

const ELIGIBILITY_CATEGORIES = [
  {
    icon: GraduationCap,
    title: "Faculty Members & Academicians",
    desc: "Faculty members and academicians from universities, colleges, and research institutions engaged in teaching, research, or academic administration in Statistics, Data Science, and allied disciplines.",
    color: "bg-blue-50 border-blue-100",
    iconColor: "bg-blue-100 text-blue-700",
    badgeColor: "bg-blue-100 text-blue-700",
    badge: "Academic",
  },
  {
    icon: FlaskConical,
    title: "Research Scholars",
    desc: "Research scholars pursuing M.Phil., Ph.D., Post-Doctoral, or equivalent research programs in Statistics, Data Science, Mathematics, or allied disciplines at recognized institutions.",
    color: "bg-purple-50 border-purple-100",
    iconColor: "bg-purple-100 text-purple-700",
    badgeColor: "bg-purple-100 text-purple-700",
    badge: "Research",
  },
  {
    icon: BookOpen,
    title: "Undergraduate & Postgraduate Students",
    desc: "Undergraduate and postgraduate students enrolled in Statistics, Data Science, Mathematics, Computer Science, and allied disciplines at recognized universities and colleges.",
    color: "bg-emerald-50 border-emerald-100",
    iconColor: "bg-emerald-100 text-emerald-700",
    badgeColor: "bg-emerald-100 text-emerald-700",
    badge: "Students",
  },
  {
    icon: BarChart3,
    title: "Industry Professionals & Practitioners",
    desc: "Industry professionals, consultants, and practitioners engaged in data analytics, statistical modelling, machine learning, business intelligence, and related fields.",
    color: "bg-amber-50 border-amber-100",
    iconColor: "bg-amber-100 text-amber-700",
    badgeColor: "bg-amber-100 text-amber-700",
    badge: "Industry",
  },
  {
    icon: Landmark,
    title: "Government Officials & Policymakers",
    desc: "Government officials, policymakers, and professionals involved in data-driven planning, statistical surveys, census operations, and evidence-based decision-making at local, state, or national level.",
    color: "bg-rose-50 border-rose-100",
    iconColor: "bg-rose-100 text-rose-700",
    badgeColor: "bg-rose-100 text-rose-700",
    badge: "Government",
  },
  {
    icon: Building2,
    title: "Institutional Members",
    desc: "National and international institutions, organizations, departments, research centers, and corporate entities interested in supporting the objectives of IASDS and contributing to the advancement of Statistics and Data Science.",
    color: "bg-cyan-50 border-cyan-100",
    iconColor: "bg-cyan-100 text-cyan-700",
    badgeColor: "bg-cyan-100 text-cyan-700",
    badge: "Institutional",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Complete the Application Form",
    desc: "Fill in the online membership application form with your personal, academic, and professional details.",
  },
  {
    step: "02",
    title: "Submit Required Documents",
    desc: "Upload supporting documents such as academic certificates, institutional ID, or proof of professional engagement.",
  },
  {
    step: "03",
    title: "Pay Membership Fee",
    desc: "Pay the applicable membership fee for your chosen category via the secure online payment gateway.",
  },
  {
    step: "04",
    title: "Review & Approval",
    desc: "Your application is reviewed by the IASDS Membership Committee. The process takes 3–5 business days.",
  },
  {
    step: "05",
    title: "Receive Membership Credentials",
    desc: "Upon approval, receive your IASDS Membership Number, digital ID card, and a welcome communication.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export const MembershipEligibilityPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ── Banner ─────────────────────────────────────────────── */}
        <div className="bg-brand-gradient text-white rounded-3xl p-8 sm:p-12 shadow-lg mb-12 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-white/70 text-xs uppercase tracking-widest font-bold block mb-2">
              Membership
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Membership Eligibility
            </h1>
            <p className="text-white/75 text-sm mt-3 max-w-2xl leading-relaxed">
              Membership in the Indian Association of Statistics and Data Science (IASDS) is open to individuals and institutions
              interested in the advancement, application, teaching, research, and promotion of Statistics, Data Science and allied disciplines.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-52 h-52 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute right-16 -top-8 w-28 h-28 bg-white/5 rounded-full blur-xl" />
        </div>

        {/* ── Notice Box ─────────────────────────────────────────── */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-10">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 leading-relaxed">
            Any person interested in becoming a member shall, before they can do so, sign and deliver to the Association
            an <strong>application for admission to membership</strong>, addressed to the Secretary or their designated representative.
          </p>
        </div>

        {/* ── Eligible Categories ─────────────────────────────────── */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-1 h-8 bg-[#00357D] rounded-full" />
            <h2 className="text-2xl font-extrabold text-slate-800">
              Who Can Apply?
            </h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            The following categories of applicants are eligible for membership in IASDS:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ELIGIBILITY_CATEGORIES.map((cat, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-6 ${cat.color} hover:shadow-md transition-all group`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cat.iconColor}`}
                  >
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-slate-800 text-sm leading-snug">
                        {cat.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${cat.badgeColor}`}
                      >
                        {cat.badge}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                  Eligible for IASDS Membership
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Application Process ─────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 mb-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#D30090] rounded-full" />
            <h2 className="text-2xl font-extrabold text-slate-800">
              How to Apply
            </h2>
          </div>

          <div className="space-y-0">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-5 group">
                {/* Step indicator & connector */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#00357D] text-white flex items-center justify-center font-extrabold text-xs shadow-md group-hover:bg-[#D30090] transition-colors">
                    {step.step}
                  </div>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="w-0.5 h-10 bg-slate-200 mt-1" />
                  )}
                </div>
                {/* Step content */}
                <div className={`pb-8 ${i === PROCESS_STEPS.length - 1 ? "pb-0" : ""}`}>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{step.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Key Conditions ──────────────────────────────────────── */}
        <div className="bg-[#EEF4FF] border border-blue-100 rounded-2xl p-6 mb-10">
          <h3 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wide">
            Key Conditions for Membership
          </h3>
          <ul className="space-y-2.5">
            {[
              "Membership applications must be submitted in the prescribed format along with the applicable fee and supporting documents.",
              "Membership becomes effective only upon approval by the competent authority of IASDS.",
              "Submission of an application does not guarantee admission to membership.",
              "Members must uphold the objectives, values, and professional standards of IASDS.",
              "Membership fees once paid are ordinarily non-refundable and non-transferable.",
              "IASDS reserves the right to amend membership categories, fees, and regulations from time to time.",
            ].map((condition, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle className="w-3.5 h-3.5 text-[#00357D] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{condition}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <div className="bg-[#00357D] rounded-3xl p-8 sm:p-10 text-center text-white shadow-lg">
          <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-extrabold mb-2">Ready to Join IASDS?</h3>
          <p className="text-white/70 text-sm mb-7 max-w-md mx-auto leading-relaxed">
            If you meet the eligibility criteria, apply today to become part of India's leading
            Statistics &amp; Data Science association.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/membership/register"
              className="inline-flex items-center justify-center space-x-2 bg-[#D30090] hover:bg-[#B10078] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-md"
            >
              <span>Apply for Membership</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/membership/types"
              className="inline-flex items-center justify-center space-x-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              <span>View Membership Types</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MembershipEligibilityPage;
