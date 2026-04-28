/*
 * CAZABANDERAS Achievements Section
 * Design: Carousel-style layout with CTF awards, trophy cards, smooth animations
 * Dark with crimson accent highlights
 */

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Trophy, Medal, Star, Award, ChevronLeft, ChevronRight } from "lucide-react";

const achievements: Array<{
  event: string;
  placement: string;
  category: string;
  date: string;
  icon: React.ComponentType<any>;
  highlight: boolean;
  description: string;
}> = [
  {
    event: "HackTheBox CTF 2025",
    placement: "1st Place",
    category: "Web Exploitation",
    date: "2025-03-15",
    icon: Trophy,
    highlight: true,
    description: "Dominated the web exploitation category with 15 flags captured in record time.",
  },
  {
    event: "TryHackMe Championship",
    placement: "2nd Place",
    category: "Overall",
    date: "2025-02-28",
    icon: Medal,
    highlight: true,
    description: "Strong performance across multiple categories with consistent flag captures.",
  },
  {
    event: "Crypto Challenge 2025",
    placement: "1st Place",
    category: "Cryptography",
    date: "2025-02-10",
    icon: Star,
    highlight: true,
    description: "Cracked complex RSA and elliptic curve challenges with innovative approaches.",
  },
  {
    event: "Regional CTF Tournament",
    placement: "3rd Place",
    category: "Overall",
    date: "2025-01-20",
    icon: Award,
    highlight: false,
    description: "Competed against 50+ teams from Latin America with strong performance.",
  },
  {
    event: "Reverse Engineering Sprint",
    placement: "1st Place",
    category: "Reversing",
    date: "2024-12-15",
    icon: Trophy,
    highlight: true,
    description: "Successfully reverse engineered 8 binaries with anti-debug protections.",
  },
  {
    event: "HackingClub Monthly",
    placement: "1st Place",
    category: "Overall",
    date: "2024-11-30",
    icon: Medal,
    highlight: false,
    description: "Consistent monthly winner with diverse skill demonstrations.",
  },
];

// Stats are now loaded from i18n translations

function AchievementCard({ item, isActive }: { item: typeof achievements[0]; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.3, x: -20 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className={`card-classified p-6 group transition-all duration-300 ${
        item.highlight ? "border-[#e63946]/30 glow-crimson" : "hover:border-white/10"
      } ${isActive ? "ring-1 ring-[#e63946]/50" : ""}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`mt-0.5 p-3 border flex-shrink-0 ${
            item.highlight
              ? "border-[#e63946]/50 text-[#e63946] bg-[#e63946]/10"
              : "border-white/10 text-white/30"
          }`}
        >
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-display text-lg text-white tracking-wider leading-tight">
              {item.event}
            </h4>
            <span className="font-mono text-[0.6rem] text-white/25 tracking-widest flex-shrink-0">
              {new Date(item.date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`font-mono text-sm tracking-widest font-bold ${
                item.highlight ? "text-[#e63946]" : "text-white/60"
              }`}
            >
              {item.placement}
            </span>
            <span className="text-white/20">·</span>
            <span className="font-mono text-xs text-white/30 tracking-widest uppercase">
              {item.category}
            </span>
          </div>
          <p className="font-body text-sm text-white/50 leading-relaxed">{item.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function AchievementsSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const stats = t('achievements.stats', { returnObjects: true }) as Array<{ value: string; label: string }> || [];
  
  // Load achievements from i18n, fallback to hardcoded data if not available
  const achievementItems = t('achievements.items', { returnObjects: true }) as Array<any> || achievements.map(a => ({
    event: a.event,
    placement: a.placement,
    category: a.category,
    date: a.date,
    description: a.description
  }));
  
  // Merge with icon and highlight data
  const displayAchievements = achievementItems.map((item: any, idx: number) => ({
    ...item,
    icon: achievements[idx]?.icon || Trophy,
    highlight: achievements[idx]?.highlight !== false
  }));

  const itemsPerView = 3;
  const maxIndex = Math.max(0, displayAchievements.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  const visibleItems = displayAchievements.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <section id="achievements" className="relative py-24 bg-[#0d0f14]">
      {/* Diagonal slash top */}
      <div
        className="absolute top-0 left-0 right-0 h-16 bg-[#111318]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 100%)" }}
      />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[2px] bg-[#e63946]" />
            <span className="section-label">{t("achievements.label")}</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white tracking-wider">
              {t("achievements.title")}
            </h2>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8">
              {stats.map((stat: any) => (
                <div key={stat.label} className="border-left-accent">
                  <div className="stat-number text-3xl">{stat.value}</div>
                  <div className="font-mono text-[0.6rem] text-white/35 tracking-widest uppercase mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Carousel - Empty for now */}
        <div className="relative">
          {/* Empty state - achievements carousel will be populated with real data */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[280px] flex items-center justify-center">
            <div className="col-span-full text-center py-12">
              <p className="text-white/30 font-mono text-sm tracking-widest uppercase">Coming soon...</p>
            </div>
          </div>
        </div>

        {/* CTFtime link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 text-center"
        >
          <a
            href="https://ctftime.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs text-white/30 hover:text-[#e63946] tracking-widest uppercase transition-colors"
          >
            {t("achievements.viewFullRecord")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
