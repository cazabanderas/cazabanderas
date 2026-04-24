/*
 * CAZABANDERAS — Home Page
 * Design: "Predator Pack" — Dark Military Brutalism + Latin Futurism
 * Assembles all sections in order with smooth scroll layout
 */

import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkillsTicker from "@/components/SkillsTicker";
import AboutSection from "@/components/AboutSection";
import CategoriesSection from "@/components/CategoriesSection";
import TeamSection from "@/components/TeamSection";
import PlatformsSection from "@/components/PlatformsSection";
import AchievementsSection from "@/components/AchievementsSection";
import RecentActivitySection from "@/components/RecentActivitySection";
import WriteupsSection from "@/components/WriteupsSection";
import JoinSection from "@/components/JoinSection";
import Footer from "@/components/Footer";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();
  const syncTeamMembers = trpc.htb.syncTeamMembers.useMutation();

  // Sync HTB team members on component mount
  useEffect(() => {
    syncTeamMembers.mutate();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white overflow-x-hidden" suppressHydrationWarning>
      <Navbar />
      <HeroSection />
      <SkillsTicker />
      <AboutSection />
      <CategoriesSection />
      <TeamSection />
      <PlatformsSection />
      <AchievementsSection />
      <RecentActivitySection />
      <WriteupsSection />
      <JoinSection />
      <Footer />
    </div>
  );
}
