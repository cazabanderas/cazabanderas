/*
 * CAZABANDERAS — Home Page
 * Design: "Predator Pack" — Dark Military Brutalism + Latin Futurism
 * Assembles all sections in order with smooth scroll layout
 */

import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkillsTicker from "@/components/SkillsTicker";
import AboutSection from "@/components/AboutSection";
import CategoriesSection from "@/components/CategoriesSection";
import TeamSection from "@/components/TeamSection";
import PlatformsSection from "@/components/PlatformsSection";
import AchievementsSection from "@/components/AchievementsSection";
import WriteupsSection from "@/components/WriteupsSection";
import JoinSection from "@/components/JoinSection";
import Footer from "@/components/Footer";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <SkillsTicker />
      <AboutSection />
      <CategoriesSection />
      <TeamSection />
      <PlatformsSection />
      <AchievementsSection />
      <WriteupsSection />
      <JoinSection />
      <Footer />
    </div>
  );
}
