import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  BookOpen,
  Scale,
  Users,
  ChevronRight,
  Shield,
  Gavel,
  Building2,
} from "lucide-react";

const CONSTITUTION_ARTICLES = [
  {
    article: "Article I",
    title: "Name & Identity",
    content:
      "This organization shall be known as the Indian Association of Statistics & Data Science, hereinafter referred to as 'IASDS' or 'the Association'. The Association shall be registered under applicable Indian laws and shall operate as a non-profit academic professional body.",
  },
  {
    article: "Article II",
    title: "Registered Office",
    content:
      "The registered office of the Association shall be located at Puducherry (UTI), India. The Executive Council may, by resolution, change the location of the registered office, subject to compliance with applicable regulations.",
  },
  {
    article: "Article III",
    title: "Aims & Objectives",
    content:
      "The Association shall endeavour to advance the study, practice, and application of Statistics and Data Science; promote research, education, consultancy and innovation; organize national and international conferences, workshops, and seminars; publish peer-reviewed academic journals and bulletins; and foster collaboration between academic institutions and industry.",
  },
  {
    article: "Article IV",
    title: "Membership",
    content:
      "Membership shall be open to individuals engaged in or associated with Statistics, Data Science, Mathematics, or allied disciplines. Categories include Life Members, Annual Members, Student Members, and Honorary Fellows (FIASDS). All membership applications shall be reviewed and approved by the Executive Council.",
  },
  {
    article: "Article V",
    title: "Executive Council",
    content:
      "The governance of the Association shall vest in an Executive Council comprising the President, Vice President(s), General Secretary, Treasurer, and elected Members. The Council shall be constituted through a democratic election process held biennially among the registered membership.",
  },
  {
    article: "Article VI",
    title: "General Body",
    content:
      "The General Body shall consist of all enrolled members in good standing. An Annual General Meeting (AGM) shall be convened at least once per year to review the association's progress, finances, and strategic direction.",
  },
  {
    article: "Article VII",
    title: "Finance & Accounts",
    content:
      "All financial transactions shall be conducted through designated bank accounts. Annual audited statements shall be presented at the AGM. No funds shall be utilized for purposes outside the Association's stated objectives.",
  },
  {
    article: "Article VIII",
    title: "Amendments",
    content:
      "Amendments to this Constitution may be proposed by any member and must be approved by a two-thirds majority at a General Body Meeting. Proposed amendments must be communicated to members at least 30 days prior to the meeting.",
  },
];

// const BYLAWS = [
//   "Members must maintain their annual membership fees to retain voting rights.",
//   "The term of office for each elected Executive Council member shall be two (2) years, with a limit of two consecutive terms.",
//   "Decisions of the Executive Council shall be by simple majority; the President shall cast the deciding vote in the event of a tie.",
//   "All official communications and publications of the Association shall bear the IASDS seal and be authorized by the General Secretary.",
//   "Sub-committees may be formed for specific projects or regions, reporting to the Executive Council.",
//   "Disciplinary action against any member for misconduct shall follow a documented review process with the right of appeal.",
//   "The Association shall not affiliate with any political party or institution that conflicts with its stated non-partisan academic mission.",
// ];

export const GovernancePage: React.FC = () => {
  const { pathname } = useLocation();
  const isConstitution = pathname.includes("constitution");

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Page Banner */}
        <div className="bg-brand-gradient text-white rounded-3xl p-8 sm:p-12 shadow-lg mb-12 text-center relative overflow-hidden">
          <span className="text-white/80 text-xs uppercase tracking-widest font-bold block mb-2">
            Governance &amp; Legal Framework
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {isConstitution ? "IASDS Constitution" : "Governance"}
          </h1>
          <p className="text-white/70 text-sm mt-3 max-w-xl mx-auto">
            The foundational legal document outlining the structure, purpose, and operating principles of the Indian Association of Statistics &amp; Data Science.
          </p>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-xl" />
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {[
            { icon: FileText, label: "Constitution", desc: "Full constitutional charter", path: "/governance/constitution", color: "text-blue-600 bg-blue-50 border-blue-100" },
            { icon: Users, label: "Executive Council", desc: "Leadership & council members", path: "/council", color: "text-purple-600 bg-purple-50 border-purple-100" },
            // { icon: ClipboardList, label: "Bylaws", desc: "Operating rules & procedures", path: "/governance/constitution#bylaws", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          ].map((card, i) => (
            <Link
              key={i}
              to={card.path}
              className={`flex items-center space-x-4 p-5 rounded-2xl border ${card.color} hover:shadow-md transition-all group`}
            >
              <div className="shrink-0">
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-sm">{card.label}</div>
                <div className="text-xs opacity-75 mt-0.5">{card.desc}</div>
              </div>
              <ChevronRight className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        {/* Preamble */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center space-x-3 text-[#00357D] mb-6">
            <Shield className="w-6 h-6 shrink-0" />
            <h2 className="text-xl font-bold">Preamble</h2>
          </div>
          <blockquote className="border-l-4 border-[#00357D] pl-6 italic text-slate-600 text-sm leading-relaxed">
            We, the members of the Indian Association of Statistics &amp; Data Science, recognizing the vital role of statistical reasoning and data science in national development, academic progress, and evidence-based policymaking, hereby constitute this association to serve as a national forum for advancing the disciplines of Statistics and Data Science. We commit to upholding academic excellence, promoting ethical data practices, and fostering inclusive participation from researchers, educators, students, and practitioners across India and internationally.
          </blockquote>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center space-x-1"><Building2 className="w-3.5 h-3.5" /><span>Puducherry, India</span></span>
            <span className="flex items-center space-x-1"><Scale className="w-3.5 h-3.5" /><span>Non-profit Academic Body</span></span>
            <span className="flex items-center space-x-1"><BookOpen className="w-3.5 h-3.5" /><span>Registered in India</span></span>
          </div>
        </div>

        {/* Articles */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center space-x-3 text-[#00357D] mb-8">
            <Gavel className="w-6 h-6 shrink-0" />
            <h2 className="text-xl font-bold">Constitutional Articles</h2>
          </div>
          <div className="space-y-6">
            {CONSTITUTION_ARTICLES.map((item, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl border border-slate-100 hover:border-[#00357D]/20 hover:bg-[#F5F8FF] transition-all"
              >
                <div className="flex items-start space-x-4">
                  <span className="shrink-0 w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#00357D] flex items-center justify-center font-bold text-xs uppercase tracking-wide">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#D30090]">{item.article}</span>
                      <span className="text-slate-300">·</span>
                      <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bylaws Section */}
        {/* <div id="bylaws" className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center space-x-3 text-[#00357D] mb-6">
            <ClipboardList className="w-6 h-6 shrink-0" />
            <h2 className="text-xl font-bold">Operating Bylaws</h2>
          </div>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            The following bylaws govern the day-to-day operational conduct of the Association, as approved by the founding Executive Council and ratified by the General Body.
          </p>
          <ul className="space-y-3">
            {BYLAWS.map((bylaw, i) => (
              <li key={i} className="flex items-start space-x-3 text-sm text-slate-700">
                <span className="shrink-0 w-5 h-5 rounded-full bg-[#00357D]/10 text-[#00357D] flex items-center justify-center font-bold text-[10px] mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{bylaw}</span>
              </li>
            ))}
          </ul>
        </div> */}

        {/* Footer CTA */}
        <div className="bg-[#00357D] rounded-3xl p-8 text-center text-white shadow-lg">
          <h3 className="text-xl font-bold mb-2">Become a Governing Member</h3>
          <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
            Join IASDS and participate in the democratic governance of India's leading Statistics &amp; Data Science association.
          </p>
          <Link
            to="/membership/register"
            className="inline-flex items-center space-x-2 bg-[#D30090] hover:bg-[#B10078] text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md"
          >
            <span>Apply for Membership</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GovernancePage;
