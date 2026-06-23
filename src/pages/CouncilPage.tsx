import React, { useEffect, useState } from "react";
import { Mail, Phone, Building, Crown, Users, UserCheck } from "lucide-react";
import api from "../services/api";

type CouncilMemberType =
  | "Executive Council"
  | "Executive Council Members"
  | "Advisory Council Members";

interface CouncilMember {
  id: number;
  name: string;
  designation: string;
  institution: string;
  email?: string;
  phoneNumber?: string;
  photoUrl?: string;
  displayOrder: number;
  memberType: CouncilMemberType;
}

interface GroupedSection {
  type: CouncilMemberType;
  members: CouncilMember[];
}

const SECTION_META: Record<
  CouncilMemberType,
  { icon: React.ElementType; accent: string; badge: string; description: string }
> = {
  "Executive Council": {
    icon: Crown,
    accent: "from-[#00357D] to-[#0050B3]",
    badge: "bg-[#00357D]/10 text-[#00357D]",
    description:
      "The senior governing body of IASDS responsible for strategic direction and institutional decisions.",
  },
  "Executive Council Members": {
    icon: UserCheck,
    accent: "from-[#D30090] to-[#A0006E]",
    badge: "bg-[#D30090]/10 text-[#D30090]",
    description:
      "Elected members who form the operational executive committee of the Association.",
  },
  "Advisory Council Members": {
    icon: Users,
    accent: "from-emerald-600 to-teal-700",
    badge: "bg-emerald-50 text-emerald-700",
    description:
      "Eminent experts who provide strategic advice, academic guidance, and domain expertise to the Association.",
  },
};

const MemberCard: React.FC<{ member: CouncilMember; badgeCls: string }> = ({
  member,
  badgeCls,
}) => (
  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group">
    {/* Card header gradient */}
    <div className="h-20 bg-gradient-to-r from-primary/10 to-secondary/10" />

    {/* Photo */}
    <div className="flex justify-center -mt-12 relative z-10">
      <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 shadow-md overflow-hidden">
        <img
          src={
            member.photoUrl ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
          }
          alt={member.name}
          className="w-full h-full object-cover"
        />
      </div>
    </div>

    <div className="p-5 text-center space-y-3">
      <div>
        <h3 className="font-bold text-base text-slate-800 tracking-tight group-hover:text-primary transition-colors leading-tight">
          {member.name}
        </h3>
        <span
          className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1.5 ${badgeCls}`}
        >
          {member.designation}
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-50 pt-3 text-left">
        <div className="flex items-center space-x-2">
          <Building className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="line-clamp-2 leading-tight">{member.institution}</span>
        </div>
        {member.email && (
          <div className="flex items-center space-x-2">
            <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
            <a
              href={`mailto:${member.email}`}
              className="hover:underline text-primary truncate"
            >
              {member.email}
            </a>
          </div>
        )}
        {member.phoneNumber && (
          <div className="flex items-center space-x-2">
            <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{member.phoneNumber}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const CouncilPage: React.FC = () => {
  const [sections, setSections] = useState<GroupedSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCouncil = async () => {
      try {
        const res = await api.get("/public/council");
        // API now returns grouped array; fall back gracefully if it's a flat array
        if (Array.isArray(res.data) && res.data.length > 0 && "type" in res.data[0]) {
          setSections(res.data);
        } else {
          // Legacy flat array — group client-side
          const flat: CouncilMember[] = res.data;
          const types: CouncilMemberType[] = [
            "Executive Council",
            "Executive Council Members",
            "Advisory Council Members",
          ];
          setSections(
            types.map((t) => ({ type: t, members: flat.filter((m) => m.memberType === t) }))
          );
        }
      } catch (err) {
        console.error("Failed to load council members", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCouncil();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const totalMembers = sections.reduce((acc, s) => acc + s.members.length, 0);

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Banner ──────────────────────────────────── */}
        <div className="bg-brand-gradient text-white rounded-3xl p-10 sm:p-14 shadow-lg mb-14 text-center relative overflow-hidden">
          <span className="text-white/70 text-xs uppercase tracking-widest font-bold block mb-2">
            Leadership &amp; Governance
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Executive Council 2026
          </h1>
          <p className="text-slate-200 mt-3 text-sm sm:text-base font-light max-w-xl mx-auto">
            The visionary leadership guiding IASDS's academic, research, and institutional excellence.
          </p>
          {totalMembers > 0 && (
            <div className="mt-6 inline-flex items-center space-x-2 bg-white/15 rounded-full px-5 py-2 text-sm font-semibold">
              <Users className="w-4 h-4" />
              <span>{totalMembers} Council Members</span>
            </div>
          )}
          <div className="absolute -right-10 -bottom-10 w-52 h-52 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -left-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        </div>

        {/* ── Three Sections ───────────────────────────────── */}
        {sections.every((s) => s.members.length === 0) ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            No council members have been added yet.
          </div>
        ) : (
          <div className="space-y-16">
            {sections.map((section) => {
              if (section.members.length === 0) return null;
              const meta = SECTION_META[section.type];
              const SectionIcon = meta.icon;

              return (
                <div key={section.type}>
                  {/* Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.accent} flex items-center justify-center shadow-md shrink-0`}
                    >
                      <SectionIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                        {section.type}
                      </h2>
                      <p className="text-sm text-slate-500 mt-0.5 max-w-2xl">
                        {meta.description}
                      </p>
                    </div>
                    <div className="sm:ml-auto shrink-0">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${meta.badge}`}>
                        {section.members.length} Member{section.members.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-slate-200 mb-8" />

                  {/* Member Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {section.members.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        badgeCls={meta.badge}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouncilPage;
