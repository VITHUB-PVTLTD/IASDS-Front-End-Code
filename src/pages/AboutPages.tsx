import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Shield, Target, Compass, Award, Lightbulb, TrendingUp, Users, BookOpen, Globe, Building, Handshake } from "lucide-react";
import api from "../services/api";

export const AboutPages: React.FC = () => {
  const { pathname } = useLocation();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutSettings = async () => {
      try {
        const res = await api.get("/public/settings");
        if (res.data.settings) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        console.error("Failed to load about settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutSettings();
  }, []);

  const getPageTitle = () => {
    if (pathname.includes("origin")) return "History & Origin";
    if (pathname.includes("vision-mission")) return "Vision & Mission";
    if (pathname.includes("contribution")) return "Expected Contribution";
    return "Objectives";
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Banner Section */}
        <div className="bg-brand-gradient text-white rounded-3xl p-8 sm:p-12 shadow-lg mb-12 text-center relative overflow-hidden">
          <span className="text-white/80 text-xs uppercase tracking-widest font-bold block mb-2">
            IASDS Profile
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {getPageTitle()}
          </h1>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-xl" />
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 leading-relaxed text-slate-700 space-y-6">
          {pathname.includes("origin") && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-primary mb-2">
                <Compass className="w-7 h-7" />
                <h2 className="text-2xl font-bold">Our Legacy</h2>
              </div>
              <p>
                {settings.about_origin ||
                  "The Indian Association of Statistics & Data Science (IASDS) was founded to create an internationally recognized platform for statisticians, academic researchers, and industrial practitioners. By integrating traditional statistical logic with modern data science algorithms, the association advances the state of analytical sciences."}
              </p>
              <p>
                Since inception, the association has grown to foster cooperation across academic institutions, editing scientific newsletters and organizing global meetups to promote education, policy research, and mathematical accuracy.
              </p>
              <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-primary mt-8">
                <p className="italic text-sm text-slate-600">
                  "Advancing scientific research methodologies remains a core pillar. We are proud to expand access to high-impact resources for analytical minds."
                </p>
              </div>
            </div>
          )}

          {pathname.includes("vision-mission") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-4 bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Our Vision</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {settings.about_vision ||
                    "To be a leading global voice for statisticians and data scientists, inspiring computational discoveries and shaping sound data policies worldwide."}
                </p>
              </div>

              <div className="space-y-4 bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-secondary/15 text-secondary rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Our Mission</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {settings.about_mission ||
                    "To build a robust community of researchers, university instructors, and industrial practitioners by delivering state-of-the-art training and publishing peer-reviewed journals."}
                </p>
              </div>
            </div>
          )}

          {pathname.includes("objectives") && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-primary mb-2">
                <Lightbulb className="w-7 h-7" />
                <h2 className="text-2xl font-bold">Objectives</h2>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                The objectives of the Association shall be the advancement of, the conducting of research in, the study of, the promotion and propagation of knowledge in Statistics and Data Science through exchange of information, the establishment and maintenance of professional and academic standards of work known as Statistics, the improvement of methods and techniques of Statistics and Data Science, publishing Technical Reports and conducting professional examinations as listed below.              </p>
              <div className="flex items-center space-x-3 text-primary mb-2">
                <Award className="w-7 h-7" />
                <h2 className="text-2xl font-bold">Key Objectives of IASDS</h2>
              </div>
              <ul className="space-y-3.5 pl-2">
                {[
                  "To provide Statistical Consultancy Services.",
                  "To provide Statistical Training.",
                  "Can assist to choose software tools and data visualization techniques.",
                  "To Develop the customized statistical models and algorithms tailored to clients' specific needs involves a structured process to ensure accuracy, relevance, and usability.",
                  "To Conduct data mining and predictive analysis involves leveraging advanced statistical and machine learning techniques to extract actionable insights from data and make informed decisions.",
                  "To Collaborate with researchers on data-driven projects across various fields involves bringing together interdisciplinary teams to tackle complex problems and leverage data to drive insights and innovation.",
                  "Contributing to the advancement of statistical science through in-house research and publication of technical reports involves conducting innovative research, developing new methodologies, and disseminating findings to the broader scientific community. ",
                  "To Develop the statistical tools for enhancing AI techniques through machine learning involves creating methodologies, algorithms, and software frameworks that improve the performance, robustness, and interpretability of machine learning models.",
                  "To conduct Conferences, Seminars, Workshops, Symposiums, summer schools, Faculty Development Programs for propagation of the Statistical Knowledge among the academic and research Community. Periodic academic/research networking with the above mentioned (not limited to the specified) activities have to be arranged.",
                  "To Promote the data literacy and fostering a culture of evidence-based decision-making within an organization and communities involves empowering individuals with the knowledge, skills, and mindset necessary to understand, analyze, and interpret data effectively.",
                  "To assist policy makers like Local Governments, State Government, Central Government, NITI AYOG, etc. statutory bodies for policy formulation for sustainable development of the country."
                ].map((obj, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-600 text-sm">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pathname.includes("contribution") && (
            <div className="space-y-8">
              <div className="flex items-center space-x-3 text-primary mb-2">
                <Lightbulb className="w-7 h-7" />
                <h2 className="text-2xl font-bold">Expected Contribution</h2>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                The Indian Association of Statistics and Data Science is expected to make significant contributions to academia, industry, government, and society through the following initiatives:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                {[
                  {
                    icon: BookOpen,
                    title: "Academic Advancement",
                    desc1: "To enhance the quality of education and research in Statistics and Data Science.",
                    desc2: "To enhance the quality of education and research in Statistics and Data Science.",
                    color: "bg-blue-50 text-blue-700 border-blue-100"
                  },
                  {
                    icon: Users,
                    title: "Professional Development",
                    desc1: "Develop highly skilled professionals capable of addressing modern analytical challenges.",
                    desc2: "Provide industry-oriented training in statistical software, machine learning, data visualization, and predictive analytics.",
                    color: "bg-purple-50 text-purple-700 border-purple-100"
                  },
                  {
                    icon: TrendingUp,
                    title: "Research and Innovation",
                    desc1: "Promote cutting-edge research in statistical methodologies, artificial intelligence, and data science.",
                    desc2: "Encourage publication of technical reports, research papers, and innovative analytical solutions.",
                    color: "bg-emerald-50 text-emerald-700 border-emerald-100"
                  },
                  {
                    icon: Globe,
                    title: "Industry and Consultancy Support",
                    desc1: "Offer expert statistical consultancy services to industries, institutions, and organizations.",
                    desc2: "Assist in designing customized analytical models for business and research applications.",
                    color: "bg-amber-50 text-amber-700 border-amber-100"
                  },
                  {
                    icon: Building,
                    title: "Policy and Governance",
                    desc1: "Support local, state, and central governments with data-driven policy formulation.",
                    desc2: "Contribute to national initiatives focused on sustainable development and evidence-based governance.",
                    color: "bg-amber-50 text-amber-700 border-amber-100"
                  },
                  {
                    icon: Handshake,
                    title: "Social Impact",
                    desc1: "Improve data literacy among communities and organizations.",
                    desc2: "Foster a culture where decisions are made based on scientific analysis and reliable data.",
                    color: "bg-green-50 text-green-700 border-green-100"
                  },
                  {
                    icon: Globe,
                    title: "National and International Networking",
                    desc1: "Build a strong network of statisticians, data scientists, researchers, and institutions.",
                    desc2: "Promote interdisciplinary collaboration and knowledge exchange at national and global levels.",
                    color: "bg-blue-50 text-blue-700 border-blue-100"
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl border ${item.color} space-y-3 hover:shadow-sm transition-shadow`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 shrink-0" />
                      <h3 className="font-bold text-sm">{item.title}</h3>
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">{item.desc1}</p>
                    <p className="text-xs leading-relaxed opacity-90">{item.desc2}</p>
                  </div>
                ))}
              </div>

              {/* <div className="bg-[#EEF4FF] border border-blue-100 rounded-2xl p-6 mt-6">
                <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">Member Commitment Charter</h3>
                <ul className="space-y-2">
                  {[
                    "Uphold the highest standards of academic integrity and ethical data practices.",
                    "Actively participate in at least one IASDS-sanctioned event or workshop annually.",
                    "Collaborate with peers across disciplines to advance interdisciplinary research.",
                    "Contribute to the IASDS newsletter, journal, or public-facing data repository.",
                    "Support emerging researchers and student members through formal mentorship.",
                  ].map((point, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                      <span className="text-primary font-bold shrink-0">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AboutPages;
