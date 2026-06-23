import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Check, ShieldAlert, Award, FileText, UserPlus } from "lucide-react";
import api from "../services/api";

export const MembershipInfoPages: React.FC = () => {
  const { pathname } = useLocation();
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        const res = await api.get("/public/membership-types");
        setTypes(res.data);
      } catch (err) {
        console.error("Failed to load membership types data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembershipData();
  }, []);

  const getPageTitle = () => {
    if (pathname.includes("types")) return "Membership Types";
    if (pathname.includes("benefits")) return "Membership Benefits";
    return "Terms & Conditions";
  };

  if (loading && pathname.includes("types")) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Banner Section */}
        <div className="bg-brand-gradient text-white rounded-3xl p-8 sm:p-12 shadow-lg mb-12 text-center relative overflow-hidden">
          <span className="text-white/80 text-xs uppercase tracking-widest font-bold block mb-2">Membership Portal</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{getPageTitle()}</h1>
        </div>

        {/* Categories / Types comparison grid */}
        {pathname.includes("types") && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {types.map((t) => (
                <div key={t.id} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-lg relative overflow-hidden group">
                  {/* Visual Highlight indicator */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>

                  <div className="space-y-4">
                    <span className="text-xs font-extrabold uppercase text-secondary tracking-widest block">{t.name}</span>
                    <div className="flex items-baseline text-slate-800">
                      <span className="text-4xl font-extrabold font-heading">
                        {t.currency === "USD" ? "$" : "₹"}
                        {parseFloat(t.feeAmount).toLocaleString()}
                      </span>
                      <span className="text-slate-500 text-sm ml-2">/ {t.durationMonths >= 1200 ? "Lifetime" : `${t.durationMonths} Months`}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{t.description}</p>

                    <ul className="space-y-2 pt-6 text-sm">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="text-slate-600">Download Digital ID Card</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="text-slate-600">Register in Members Directory</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="text-slate-600">Free PDF publication access</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="text-slate-600">Priority Conference booking</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-8">
                    <Link to="/membership/register" className="w-full bg-slate-100 hover:bg-primary hover:text-white text-slate-700 text-center py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-2">
                      <UserPlus className="w-4 h-4" />
                      <span>Apply Online</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Benefits View */}
        {pathname.includes("benefits") && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 space-y-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-3 mb-6">
              <Award className="w-7 h-7 text-primary" />
              <span>Privileges of an IASDS Member</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
              {[
                {
                  title: "Academic Benefits",
                  desc: "Access professional networking opportunities with statisticians, data scientists, researchers, and industry experts. Collaborate on interdisciplinary research projects and participate in technical committees, working groups, and special interest forums."
                },
                {
                  title: "Professional Development",
                  desc: "Access training programs in Statistics, Data Science, Machine Learning, Artificial Intelligence, and Analytics. Gain exposure to emerging methodologies, tools, technologies, mentoring opportunities, and professional recognition."
                },
                {
                  title: "Research Benefits",
                  desc: "Participate in collaborative research initiatives and receive expert guidance on research design, statistical analysis, and data science applications."
                },
                {
                  title: "Industry & Consultancy Benefits",
                  desc: "Access consultancy and project opportunities, collaborate with industry partners and government agencies, and participate in applied research and data-driven innovation projects."
                },
                {
                  title: "Membership Privileges",
                  desc: "Enjoy voting rights for eligible membership categories and eligibility to contest and hold positions in the Executive Committee as per the Constitution and By-Laws of IASDS."
                },
                {
                  title: "Official Communications & Publications",
                  desc: "Receive access to official communications, newsletters, announcements, publications, and updates issued by IASDS."
                },
                {
                  title: "Event & Training Discounts",
                  desc: "Avail discounts on registration fees for IASDS conferences, seminars, workshops, training programs, and professional development activities whenever applicable."
                },
                {
                  title: "Professional Recognition",
                  desc: "Enhance your professional visibility and recognition through participation in IASDS activities, research collaborations, academic programs, and association initiatives."
                }
              ]
                .map((b, idx) => (
                  <div key={idx} className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-sm">
                    <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-xl shrink-0 font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-base mb-1">{b.title}</h3>
                      <p className="text-slate-600 text-xs leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Terms & Conditions text block */}
        {pathname.includes("terms") && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 space-y-6 text-slate-700 leading-relaxed">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-3 mb-6">
              <FileText className="w-7 h-7 text-primary" />
              <span>Membership Guidelines & Code of Conduct</span>
            </h2>
            <div className="space-y-5 text-sm leading-7">

              <h3 className="font-bold text-slate-800">1. Membership Application</h3>
              <p>
                Membership applications shall be submitted in the prescribed format along with the applicable membership fee and supporting documents, wherever required.
              </p>

              <h3 className="font-bold text-slate-800">2. Membership Approval</h3>
              <p>
                Membership shall become effective only upon approval by the competent authority of the Indian Association of Statistics & Data Science (IASDS). Submission of an application does not guarantee admission to membership.
              </p>

              <h3 className="font-bold text-slate-800">3. Adherence to Association Objectives</h3>
              <p>
                Members shall uphold and promote the objectives, values, mission, and professional standards of IASDS and contribute positively towards its growth and reputation.
              </p>

              <h3 className="font-bold text-slate-800">4. Professional and Ethical Conduct</h3>
              <p>
                Members shall maintain the highest standards of integrity, ethics, and professionalism in academic, research, consulting, organizational, and professional activities.
              </p>

              <h3 className="font-bold text-slate-800">5. Disciplinary Action</h3>
              <p>
                Any member found engaging in activities detrimental to the reputation, objectives, or interests of IASDS may be subject to disciplinary action, including warning, suspension, or termination of membership, as determined by the Executive Committee.
              </p>

              <h3 className="font-bold text-slate-800">6. Membership Fee Policy</h3>
              <p>
                Membership fees once paid shall ordinarily be non-refundable and non-transferable, except under circumstances specifically approved by the competent authority of IASDS.
              </p>

              <h3 className="font-bold text-slate-800">7. Member Information Updates</h3>
              <p>
                Members shall promptly inform IASDS of any changes to their contact details, institutional affiliation, professional designation, or other relevant information.
              </p>

              <h3 className="font-bold text-slate-800">8. Voting Rights and Elections</h3>
              <p>
                Voting rights, eligibility to contest elections, and participation in governance matters shall be governed by the Constitution, By-Laws, and regulations of IASDS.
              </p>

              <h3 className="font-bold text-slate-800">9. Authority of the Executive Committee</h3>
              <p>
                The Executive Committee reserves the right to approve, reject, suspend, or terminate membership applications and memberships in accordance with the Constitution and applicable rules of IASDS.
              </p>

              <h3 className="font-bold text-slate-800">10. Amendments to Membership Policies</h3>
              <p>
                IASDS reserves the right to amend membership categories, fees, privileges, policies, and regulations from time to time, subject to approval by the competent governing body.
              </p>

              <h3 className="font-bold text-slate-800">11. Acceptance of Terms</h3>
              <p>
                All members shall be deemed to have accepted and agreed to these Terms & Conditions upon approval and admission to membership in IASDS.
              </p>

              <h3 className="font-bold text-slate-800">12. Member Commitment</h3>
              <p>
                By joining IASDS, members commit themselves to promoting excellence in Statistics and Data Science, fostering collaboration, advancing research and innovation, and contributing to the responsible use of data and evidence-based decision-making for societal and national development.
              </p>
              <div className="flex gap-3 bg-yellow-50 p-4 border-l-4 border-yellow-500 rounded-lg text-xs text-yellow-800 mt-8">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <p>
                  <strong>Important Notice:</strong> Membership benefits are non-transferable. Using digital membership IDs to facilitate duplicate access to publications or conference discounts for non-members will result in portal ban.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};
export default MembershipInfoPages;
