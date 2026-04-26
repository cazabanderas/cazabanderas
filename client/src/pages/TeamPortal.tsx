import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import TeamResources from "@/components/TeamResources";
import WriteUpsManager from "@/components/WriteUpsManager";
import { useAuth } from "@/_core/hooks/useAuth";

interface TeamMember {
  id: number;
  displayName: string;
  specialty?: string;
  openId: string;
}

/**
 * Team Portal - Restricted access for official Cazabanderas team members only
 * Shows team-only content and resources
 */
export default function TeamPortal() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

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

  const handleLogout = () => {
    localStorage.removeItem("teamMember");
    localStorage.removeItem("teamMemberLoggedIn");
    setLocation("/team-login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0f14]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#e63946] mx-auto mb-4" />
          <p className="text-white/60">{t('adminPanel.loadingMembers')}</p>
        </div>
      </div>
    );
  }

  if (!teamMember) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0d0f14]/95 backdrop-blur-md border-b border-white/5">
        <div className="container flex items-center justify-between h-16">
          <div>
            <h1 className="font-display text-white text-xl tracking-widest">{t('teamPortal.title')}</h1>
            <p className="font-mono text-[0.6rem] text-[#e63946]/70 tracking-[0.2em] uppercase">{t('teamPortal.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-sm">{teamMember.displayName}</span>
            {teamMember.specialty?.includes("Owner") && (
              <a
                href="/admin"
                className="px-3 py-2 text-[#e63946] font-mono text-xs tracking-widest uppercase hover:text-white transition-colors"
              >
                {t('teamPortal.admin')}
              </a>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-[#e63946] text-[#e63946] font-mono text-xs tracking-widest uppercase hover:bg-[#e63946] hover:text-white transition-all duration-200"
            >
              <LogOut size={16} />
              {t('teamPortal.signOut')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container max-w-4xl">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-[#e63946]" />
              <span className="font-mono text-xs text-[#e63946]/70 tracking-widest uppercase">{t('teamPortal.welcomeHunter')}</span>
            </div>
            <h2 className="font-display text-5xl text-white mb-4 tracking-wider">
              {t('teamPortal.operationsCenter')}
            </h2>
            <p className="text-white/60 text-lg">
              {t('teamPortal.accessTeamResources')}
            </p>
          </div>

          {/* Team Resources Section */}
          <TeamResources />

          {/* Write-ups Management Section */}
          <div className="mt-16 border-t border-white/10 pt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-[2px] bg-[#e63946]" />
                  <span className="font-mono text-xs text-[#e63946]/70 tracking-widest uppercase">{t('teamPortal.knowledgeBase')}</span>
                </div>
                <h3 className="font-display text-3xl text-white tracking-wider">{t('teamPortal.writeUpsAndTutorials')}</h3>
              </div>
              <button
                onClick={() => setLocation("/write-ups")}
                className="px-6 py-3 bg-[#e63946] hover:bg-[#e63946]/90 text-white font-mono text-xs tracking-widest uppercase transition-colors"
              >
                {t('teamPortal.goToWriteups')}
              </button>
            </div>
            <p className="text-white/60 text-lg mb-8">
              {t('teamPortal.manageWriteupsDescription')}
            </p>
            <WriteUpsManager teamMemberId={teamMember.id} />
          </div>

          {/* Other Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">

            {/* Challenge Tracker - Coming Soon */}
            <div className="border border-[#e63946]/30 p-6 hover:border-[#e63946]/60 transition-colors">
              <h3 className="font-display text-xl text-white mb-3 tracking-wider">{t('teamPortal.challengeTracker')}</h3>
              <p className="text-white/60 text-sm mb-4">
                {t('teamPortal.trackActiveCTFs')}
              </p>
              <button className="text-[#e63946] font-mono text-xs tracking-widest uppercase hover:text-white transition-colors">
                {t('teamPortal.comingSoon')}
              </button>
            </div>

            {/* Team Chat */}
            <div className="border border-[#e63946]/30 p-6 hover:border-[#e63946]/60 transition-colors">
              <h3 className="font-display text-xl text-white mb-3 tracking-wider">{t('teamPortal.teamChat')}</h3>
              <p className="text-white/60 text-sm mb-4">
                {t('teamPortal.collaborateRealtime')}
              </p>
              <button className="text-[#e63946] font-mono text-xs tracking-widest uppercase hover:text-white transition-colors">
                {t('teamPortal.comingSoon')}
              </button>
            </div>

            {/* Leaderboard */}
            <div className="border border-[#e63946]/30 p-6 hover:border-[#e63946]/60 transition-colors">
              <h3 className="font-display text-xl text-white mb-3 tracking-wider">{t('teamPortal.leaderboard')}</h3>
              <p className="text-white/60 text-sm mb-4">
                {t('teamPortal.viewRankings')}
              </p>
              <button onClick={() => setLocation('/leaderboard')} className="text-[#e63946] font-mono text-xs tracking-widest uppercase hover:text-white transition-colors">
                {t('teamPortal.viewRankings')} →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
