import { useState } from "react";
import { useLocation } from "wouter";
import { BookOpen, Package, LogOut } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTranslation } from "react-i18next";

interface TeamMember {
  id: number;
  displayName: string;
  specialty?: string;
  openId: string;
}

export default function TeamDashboard() {
  const [, setLocation] = useLocation();
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const { user } = useAuth();
  const { t } = useTranslation();

  // Check if user is logged in as team member
  const isTeamMemberLoggedIn = localStorage.getItem("teamMemberLoggedIn");
  const storedMember = localStorage.getItem("teamMember");

  if (storedMember) {
    try {
      const member = JSON.parse(storedMember);
      if (!teamMember) {
        setTeamMember(member);
      }
    } catch (err) {
      console.error("Failed to parse team member:", err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("teamMember");
    localStorage.removeItem("teamMemberLoggedIn");
    setLocation("/team-login");
  };

  if (!isTeamMemberLoggedIn) {
    setLocation("/team-login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0f14] to-[#1a1d2e] text-white">
      {/* Header */}
      <div className="border-b border-red-900/30 bg-[#0d0f14]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-red-500">TEAM DASHBOARD</h1>
            <p className="text-sm text-gray-400 mt-1">Welcome, {teamMember?.displayName || "Team Member"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 transition-all"
          >
            <LogOut size={18} />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">COMMAND CENTER</h2>
          <p className="text-gray-400">Select a section to manage team operations</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          {/* Team Resources Button */}
          <button
            onClick={() => setLocation("/team-resources")}
            className="group relative overflow-hidden rounded-lg border border-red-600/50 bg-gradient-to-br from-red-900/20 to-transparent p-8 hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-red-500/5 transition-all" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="p-4 rounded-lg bg-red-600/20 group-hover:bg-red-600/30 transition-all">
                <Package size={32} className="text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">TEAM RESOURCES</h3>
                <p className="text-sm text-gray-400">Manage team materials, tools, and documentation</p>
              </div>
            </div>
          </button>

          {/* Knowledge Base Button */}
          <button
            onClick={() => setLocation("/knowledge-base")}
            className="group relative overflow-hidden rounded-lg border border-red-600/50 bg-gradient-to-br from-red-900/20 to-transparent p-8 hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-red-500/5 transition-all" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="p-4 rounded-lg bg-red-600/20 group-hover:bg-red-600/30 transition-all">
                <BookOpen size={32} className="text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">KNOWLEDGE BASE</h3>
                <p className="text-sm text-gray-400">Create and manage CTF write-ups and tutorials</p>
              </div>
            </div>
          </button>
        </div>

        {/* Future Sections Placeholder */}
        <div className="mt-16 p-6 rounded-lg border border-gray-700/50 bg-gray-900/30">
          <p className="text-gray-400 text-center">
            More sections coming soon: Activity Log, Team Members, Leaderboard, and more...
          </p>
        </div>
      </div>
    </div>
  );
}
