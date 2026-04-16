import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Plus } from "lucide-react";
import TeamResources from "@/components/TeamResources";
import { useTranslation } from "react-i18next";

interface TeamMember {
  id: number;
  displayName: string;
  specialty?: string;
  openId: string;
}

export default function TeamResourcesPage() {
  const [, setLocation] = useLocation();
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const stored = localStorage.getItem("teamMember");
    const isLoggedIn = localStorage.getItem("teamMemberLoggedIn");

    if (stored && isLoggedIn) {
      try {
        const member = JSON.parse(stored);
        setTeamMember(member);
      } catch (err) {
        setLocation("/team-login");
      }
    } else {
      setLocation("/team-login");
    }
    setIsLoading(false);
  }, [setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0f14]">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0f14] to-[#1a1d2e] text-white">
      {/* Header */}
      <div className="border-b border-red-900/30 bg-[#0d0f14]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/team-dashboard")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-600/20 text-gray-400 hover:text-red-400 transition-all"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-gray-700/50" />
            <h1 className="text-2xl font-bold text-red-500">TEAM RESOURCES</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <TeamResources />
      </div>
    </div>
  );
}
