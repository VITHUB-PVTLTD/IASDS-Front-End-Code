import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  FlaskConical,
  GraduationCap,
  Handshake,
  ChevronRight,
  CheckCircle,
  BarChart3,
  Award,
  Users,
  Building2,
  HeartHandshake,
  LineChart,
  Briefcase,
  Calculator,
  ClipboardList,
  TrendingUp,
  Landmark,
  Lightbulb,
} from "lucide-react";

// ─── Page Data ──────────────────────────────────────────────────────────────

const SERVICES_NAV = [
  { label: "Research", path: "/services/research", icon: FlaskConical },
  { label: "Academic & Skill Training", path: "/services/training", icon: GraduationCap },
  { label: "Consultancy & Community Outreach", path: "/services/consultancy", icon: Handshake },
];

// Research page content
// const RESEARCH_AREAS = [
//   {
//     icon: BarChart3,
//     title: "Statistical Modelling & Inference",
//     desc: "Development and validation of parametric and non-parametric statistical models for complex datasets arising from social, biological, and industrial contexts.",
//   },
//   {
//     icon: Brain,
//     title: "Machine Learning & AI Research",
//     desc: "Applied research on predictive algorithms, deep learning architectures, and unsupervised learning techniques bridging classical statistics and modern AI.",
//   },
//   {
//     icon: Microscope,
//     title: "Biostatistics & Clinical Research",
//     desc: "Design and analysis of clinical trials, epidemiological studies, and biomedical data using advanced statistical methodology.",
//   },
//   {
//     icon: Globe,
//     title: "Spatial & Environmental Statistics",
//     desc: "Geostatistical analysis, remote sensing data processing, and environmental risk modelling for national and international research programs.",
//   },
//   {
//     icon: BookOpenCheck,
//     title: "Educational & Social Statistics",
//     desc: "Research on learning analytics, census data analysis, and evidence-based policy research supporting national development planning.",
//   },
//   {
//     icon: Laptop,
//     title: "Computational Statistics",
//     desc: "High-performance computing, simulation studies, Monte Carlo methods, and development of open-source statistical software packages.",
//   },
// ];

const RESEARCH_SUPPORT = [
  "Collaborative and interdisciplinary research projects.",
  "Statistical modeling and methodological research.",
  "Data analytics and predictive modeling studies.",
  "Research publications, technical reports, and knowledge dissemination.",
  "Research networking and partnerships with academic, industrial, and governmental organizations.",
  "Development of innovative statistical tools, algorithms, and data science solutions."
];


// Training page content
const TRAINING_PROGRAMS = [
  {
    title: "Certificate & Professional Development Programs",
    desc: "Structured learning programs designed to strengthen professional competencies in Statistics, Data Science, Analytics, and related disciplines.",
    badge: "Professional",
    badgeColor: "bg-blue-100 text-blue-700",
    duration: "Short-Term",
    mode: "Online & Offline",
    icon: Award
  },
  {
    title: "Statistics & Data Science Workshops",
    desc: "Hands-on workshops covering Statistics, Data Science, Machine Learning, Artificial Intelligence, and modern analytical techniques.",
    badge: "Workshop",
    badgeColor: "bg-green-100 text-green-700",
    duration: "1-5 Days",
    mode: "Hybrid",
    icon: BarChart3
  },
  {
    title: "Faculty Development Programs (FDPs)",
    desc: "Specialized training initiatives aimed at enhancing teaching, research, and academic leadership capabilities of faculty members.",
    badge: "Academic",
    badgeColor: "bg-purple-100 text-purple-700",
    duration: "Short-Term",
    mode: "Hybrid",
    icon: GraduationCap
  },
  {
    title: "Research Methodology Training",
    desc: "Programs focused on research design, statistical methodologies, software tools, and evidence-based analytical approaches.",
    badge: "Research",
    badgeColor: "bg-orange-100 text-orange-700",
    duration: "Flexible",
    mode: "Online",
    icon: FlaskConical
  },
  {
    title: "Data Visualization & Business Analytics",
    desc: "Training on modern visualization tools, dashboards, business intelligence solutions, and decision-support analytics.",
    badge: "Industry",
    badgeColor: "bg-cyan-100 text-cyan-700",
    duration: "Practical",
    mode: "Hybrid",
    icon: LineChart
  },
  {
    title: "Summer Schools & Boot Camps",
    desc: "Intensive learning programs designed to build practical skills and industry readiness among students and professionals.",
    badge: "Skill Development",
    badgeColor: "bg-pink-100 text-pink-700",
    duration: "1-4 Weeks",
    mode: "Residential / Online",
    icon: Briefcase
  }
];


const TRAINING_FEATURES = [
  "Certificate and Professional Development Programs",
  "Workshops on Statistics, Data Science, Machine Learning, Artificial Intelligence, and Analytics",
  "Faculty Development Programs (FDPs)",
  "Research Methodology and Statistical Software Training",
  "Data Visualization and Business Analytics Training",
  "Summer Schools, Boot Camps, and Skill Enhancement Programs",
  "Career Guidance and Mentoring for Students and Research Scholars",
  "Competitive Examination Preparation and Research Aptitude Development"
];


// Consultancy & Outreach page content
const CONSULTANCY_SERVICES = [
  {
    title: "Statistical Consultancy",
    desc: "Expert statistical support for research projects, academic studies, dissertations, and scientific investigations.",
    clientTypes: ["Researchers", "Universities", "Faculty"],
    icon: Calculator
  },
  {
    title: "Data Analysis & Reporting",
    desc: "Comprehensive data analysis, interpretation, visualization, and reporting services for evidence-based decision making.",
    clientTypes: ["Organizations", "Institutions", "Industry"],
    icon: BarChart3
  },
  {
    title: "Survey Design & Impact Assessment",
    desc: "Survey methodology, sampling design, questionnaire development, and impact assessment studies.",
    clientTypes: ["Government", "NGOs", "Research Bodies"],
    icon: ClipboardList
  },
  {
    title: "Predictive Analytics Solutions",
    desc: "Development of customized statistical models, forecasting systems, and predictive analytics solutions.",
    clientTypes: ["Industry", "Business", "Startups"],
    icon: TrendingUp
  },
  {
    title: "Policy & Decision Support",
    desc: "Support for policy formulation and evidence-based decision-making through analytical insights and data-driven approaches.",
    clientTypes: ["Government", "Policy Makers"],
    icon: Landmark
  },
  {
    title: "Industrial Data Analytics",
    desc: "Applied analytics and data-driven solutions for operational efficiency, quality improvement, and business intelligence.",
    clientTypes: ["Industry", "Corporates"],
    icon: Building2
  }
];


const OUTREACH_INITIATIVES = [
  {
    title: "Data Literacy Awareness",
    desc: "Promoting awareness of data literacy, statistical thinking, and evidence-based decision making among communities.",
    icon: Users
  },
  {
    title: "Educational Institution Collaboration",
    desc: "Partnerships with schools, colleges, universities, and research institutions to strengthen analytical competencies.",
    icon: GraduationCap
  },
  {
    title: "NGO & Social Sector Engagement",
    desc: "Supporting NGOs and social organizations through data analysis, surveys, and impact assessment initiatives.",
    icon: HeartHandshake
  },
  {
    title: "Government Collaboration",
    desc: "Collaborating with government departments for policy research, program evaluation, and data-driven governance.",
    icon: Landmark
  },
  {
    title: "Industry Partnerships",
    desc: "Working with industry partners to address practical challenges through statistical and analytical solutions.",
    icon: Briefcase
  },
  {
    title: "Community Capacity Building",
    desc: "Conducting workshops and awareness programs that foster analytical skills and informed decision-making.",
    icon: Lightbulb
  }
];


// ─── Component ───────────────────────────────────────────────────────────────

export const ServicesPage: React.FC = () => {
  const { pathname } = useLocation();

  const isResearch = pathname.includes("research");
  const isTraining = pathname.includes("training");
  const isConsultancy = pathname.includes("consultancy");

  const getTitle = () => {
    if (isResearch) return "Research Services";
    if (isTraining) return "Academic & Skill Training";
    return "Consultancy & Community Outreach";
  };

  const getSubtitle = () => {
    if (isResearch)
      return "Advancing statistical knowledge through collaborative, high-impact research programs and publications.";
    if (isTraining)
      return "Empowering researchers, faculty, and students with cutting-edge analytical skills and knowledge.";
    return "Delivering expert data consulting and driving grassroots statistical awareness across India.";
  };

  const getIcon = () => {
    if (isResearch) return FlaskConical;
    if (isTraining) return GraduationCap;
    return Handshake;
  };

  const PageIcon = getIcon();

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Page Banner */}
        <div className="bg-brand-gradient text-white rounded-3xl p-8 sm:p-12 shadow-lg mb-10 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center shrink-0">
              <PageIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-white/70 text-xs uppercase tracking-widest font-bold block mb-1">
                IASDS Services
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {getTitle()}
              </h1>
              <p className="text-white/70 text-sm mt-2 max-w-2xl leading-relaxed">
                {getSubtitle()}
              </p>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute right-20 -top-6 w-24 h-24 bg-white/5 rounded-full blur-xl" />
        </div>

        {/* Sub-menu Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {SERVICES_NAV.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${active
                  ? "bg-[#00357D] text-white border-[#00357D] shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#00357D]/40 hover:text-[#00357D]"
                  }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* ─── RESEARCH CONTENT ─────────────────────────────────────────── */}
        {isResearch && (
          <div className="space-y-10">
            {/* Intro */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#00357D]/10 flex items-center justify-center">
                  <FlaskConical className="w-6 h-6 text-[#00357D]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Research at IASDS
                  </h2>
                  <p className="text-sm text-slate-500">
                    Advancing knowledge through statistics, data science, and innovation.
                  </p>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                The Indian Association of Statistics and Data Science (IASDS) promotes
                high-quality research in Statistics, Data Science, Artificial Intelligence,
                Machine Learning, Analytics, and interdisciplinary domains. The Association
                facilitates collaborative research among academicians, researchers,
                industry experts, and policymakers to address real-world challenges through
                data-driven approaches.
              </p>
            </div>


            {/* Research Areas Grid */}
            {/* <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 px-1">Key Research Areas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {RESEARCH_AREAS.map((area, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-[#00357D]/20 transition-all group"
                  >
                    <div className="w-10 h-10 bg-[#EEF4FF] text-[#00357D] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00357D] group-hover:text-white transition-colors">
                      <area.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-2">{area.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{area.desc}</p>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Research Support */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6">IASDS supports</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RESEARCH_SUPPORT.map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-[#00357D] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-[#00357D] rounded-3xl p-10 text-center text-white shadow-lg">
              <h3 className="text-2xl font-bold mb-3">
                Driving Innovation Through Research
              </h3>

              <p className="text-white/80 text-sm max-w-3xl mx-auto leading-relaxed mb-6">
                Through its research initiatives, IASDS aims to contribute to scientific
                advancement, evidence-based policymaking, and sustainable societal
                development. The Association remains committed to fostering innovation,
                collaboration, and excellence in Statistics and Data Science.
              </p>

              <Link
                to="/membership/register"
                className="inline-flex items-center gap-2 bg-[#D30090] hover:bg-[#B10078] px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Become a Member
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        )}

        {/* ─── TRAINING CONTENT ─────────────────────────────────────────── */}
        {isTraining && (
          <div className="space-y-10">
            {/* Intro */}
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Academic & Skill Training
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              IASDS is committed to enhancing knowledge, professional competencies, and analytical skills among students, researchers, faculty members, and working professionals. The Association conducts comprehensive training programs designed to meet the evolving demands of academia, industry, and research.
            </p>


            {/* Programs Grid */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 px-1">Training Programs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {TRAINING_PROGRAMS.map((program, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-[#EEF4FF] text-[#00357D] rounded-xl flex items-center justify-center">
                        <program.icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${program.badgeColor}`}>
                        {program.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-2">{program.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed flex-grow">{program.desc}</p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                      <span>⏱ {program.duration}</span>
                      <span>📍 {program.mode}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6">What's Included</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TRAINING_FEATURES.map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-[#00357D] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-[#00357D] rounded-3xl p-8 text-center text-white shadow-lg">
              <h3 className="text-2xl font-bold mb-3">
                Empowering Academic and Professional Excellence
              </h3>

              <p className="text-white/80 text-sm max-w-3xl mx-auto leading-relaxed mb-6">
                Through its academic and skill training initiatives, IASDS equips students,
                researchers, faculty members, and professionals with practical knowledge,
                analytical capabilities, and industry-relevant competencies required for
                academic success, research excellence, and professional growth.
              </p>

              <Link
                to="/news-events"
                className="inline-flex items-center space-x-2 bg-[#D30090] hover:bg-[#B10078] text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md"
              >
                <span>Explore Upcoming Programs</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        )}

        {/* ─── CONSULTANCY & OUTREACH CONTENT ──────────────────────────── */}
        {isConsultancy && (
          <div className="space-y-10">
            {/* Intro */}
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Consultancy & Community Outreach
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              The Indian Association of Statistics and Data Science (IASDS) provides expert consultancy services and community engagement initiatives to support institutions, industries, government agencies, researchers, and social organizations in making informed decisions through data and statistical evidence. Through consultancy, collaboration, and outreach activities, IASDS promotes the effective application of Statistics and Data Science for societal and organizational development.
            </p>


            {/* Consultancy Services */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 px-1">Our consultancy and outreach services include:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {CONSULTANCY_SERVICES.map((svc, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-[#00357D]/20 transition-all"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-[#EEF4FF] text-[#00357D] rounded-xl flex items-center justify-center">
                        <svc.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm">{svc.title}</h3>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed mb-4">{svc.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {svc.clientTypes.map((type, j) => (
                        <span key={j} className="text-[10px] font-semibold bg-[#EEF4FF] text-[#00357D] px-2.5 py-1 rounded-full">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Outreach */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Community Outreach Initiatives</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {OUTREACH_INITIATIVES.map((init, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-[#EEF4FF] hover:border-[#00357D]/20 transition-all"
                  >
                    <div className="w-9 h-9 bg-[#00357D]/10 text-[#00357D] rounded-xl flex items-center justify-center shrink-0">
                      <init.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">{init.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">{init.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Process / How it Works */}
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Areas of Impact
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                "Research and Academic Studies",
                "Government Policy and Evaluation",
                "Industrial Analytics and Innovation",
                "Survey Research and Social Studies",
                "Data-Driven Decision Making",
                "Community Development Initiatives"
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <CheckCircle className="w-5 h-5 text-[#00357D]" />
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>


            {/* CTA */}
            <div className="bg-[#00357D] rounded-3xl p-8 text-center text-white shadow-lg">
              <h3 className="text-2xl font-bold mb-3">
                Bridging Statistical Science and Social Needs
              </h3>

              <p className="text-white/80 text-sm max-w-3xl mx-auto leading-relaxed mb-6">
                Through consultancy services and community outreach initiatives, IASDS
                seeks to bridge the gap between statistical science and societal needs,
                promoting data-driven solutions for sustainable growth, innovation,
                informed decision-making, and national development.
              </p>

              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 bg-[#D30090] hover:bg-[#B10078] text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md"
              >
                <span>Contact IASDS</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
