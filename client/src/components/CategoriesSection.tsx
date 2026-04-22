/*
 * CAZABANDERAS Categories Section
 * Design: Dark section with large category cards showing CTF disciplines
 * Asymmetric grid, hover reveals crimson accent
 * Now displays live challenge counts and names from database
 */

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Binary, Lock, Search, FileSearch, Shield, Wifi, Eye, Smartphone, Code, Zap, Database, Cpu, Blocks } from "lucide-react";
import { trpc } from "@/lib/trpc";

const categoryIcons = [
  Eye, Smartphone, Globe, Zap, Search,
  Cpu, Lock, Database, Code, FileSearch, Blocks, Binary, Shield,
];

interface CategoryItem {
  name: string;
  desc: string;
}

function CategoryCard({ 
  cat, 
  index, 
  icon: Icon, 
  count, 
  countLabel,
  challenges 
}: { 
  cat: CategoryItem; 
  index: number; 
  icon: React.ComponentType<{ size: number }>; 
  count: string; 
  countLabel: string;
  challenges: string[];
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [showChallenges, setShowChallenges] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group card-classified p-5 hover:border-[#e63946]/25 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setShowChallenges(true)}
      onMouseLeave={() => setShowChallenges(false)}
    >
      {!showChallenges ? (
        <>
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 border border-white/8 text-white/30 group-hover:border-[#e63946]/30 group-hover:text-[#e63946] transition-all duration-300">
              <Icon size={18} />
            </div>
            <div className="text-right">
              <div className="font-display text-2xl text-[#e63946] leading-none">{count}</div>
              <div className="font-mono text-[0.55rem] text-white/25 tracking-widest uppercase">{countLabel}</div>
            </div>
          </div>
          <h4 className="font-display text-lg text-white tracking-wider mb-2 group-hover:text-[#e63946] transition-colors">{cat.name}</h4>
          <p className="font-body text-xs text-white/40 leading-relaxed">{cat.desc}</p>
        </>
      ) : (
        <div className="space-y-2">
          <h4 className="font-display text-sm text-[#e63946] tracking-wider mb-3">Desafíos ({challenges.length})</h4>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {challenges.length > 0 ? (
              challenges.map((challenge, idx) => (
                <div key={idx} className="font-body text-xs text-white/70 truncate hover:text-white/100">
                  • {challenge}
                </div>
              ))
            ) : (
              <div className="font-body text-xs text-white/40">Sin desafíos completados</div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function CategoriesSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const categories = t('categories.items', { returnObjects: true }) as CategoryItem[];
  
  // Fetch live challenge counts and details from database
  const { data: allChallenges = [] } = trpc.htb.getAllChallenges.useQuery();
  
  // Group challenges by category
  const challengesByCategory = useMemo(() => {
    const grouped: Record<string, string[]> = {
        OSINT: [],
        Mobile: [],
        Web: [],
        GamePwn: [],
        Reversing: [],
        "AI/ML": [],
        Crypto: [],
        Hardware: [],
        "Secure Coding": [],
        Forensics: [],
        Blockchain: [],
        Coding: [],
        Misc: [],
      };

    allChallenges.forEach((challenge: any) => {
      const category = challenge.category;
      if (grouped.hasOwnProperty(category)) {
        grouped[category].push(challenge.challengeName);
      }
    });

    return grouped;
  }, [allChallenges]);
  
  // Build display counts with live data
  const categoryCounts = useMemo(() => {
      const categoryNames = ['OSINT', 'Mobile', 'Web', 'GamePwn', 'Reversing', 'AI/ML', 'Crypto', 'Hardware', 'Secure Coding', 'Forensics', 'Blockchain', 'Coding', 'Misc'];
    return categoryNames.map((name) => {
      const count = challengesByCategory[name]?.length || 0;
      return {
        count: count.toString(),
        countLabel: count === 1 ? 'flag' : 'flags',
        challenges: challengesByCategory[name] || [],
      };
    });
  }, [challengesByCategory]);

  return (
    <section className="relative py-24 bg-[#111318]">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[2px] bg-[#e63946]" />
            <span className="section-label">{t('categories.label')}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white tracking-wider">
              {t('categories.title')}
            </h2>
            <p className="font-body text-sm text-white/40 max-w-xs leading-relaxed">
              {t('categories.subtitle')}
            </p>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <CategoryCard 
              key={cat.name} 
              cat={cat} 
              index={i} 
              icon={categoryIcons[i]}
              count={categoryCounts[i]?.count || '0'}
              countLabel={categoryCounts[i]?.countLabel || 'flags'}
              challenges={categoryCounts[i]?.challenges || []}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
