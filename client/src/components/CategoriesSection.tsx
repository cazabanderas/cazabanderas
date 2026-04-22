/*
 * CAZABANDERAS Categories Section
 * Design: Dark section with large category cards showing CTF disciplines
 * Asymmetric grid, hover reveals crimson accent
 */

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Binary, Lock, Search, FileSearch, Shield, Wifi, Eye, Smartphone, Code, Zap, Database, Cpu, Blocks } from "lucide-react";
import { trpc } from "@/lib/trpc";

const categoryIcons = [
  Eye, Smartphone, Globe, Zap, Search,
  Cpu, Lock, Database, Code, FileSearch, Blocks,
];

interface CategoryItem {
  name: string;
  desc: string;
}

function CategoryCard({ cat, index, icon: Icon, count, countLabel }: { cat: CategoryItem; index: number; icon: React.ComponentType<{ size: number }>; count: string; countLabel: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group card-classified p-5 hover:border-[#e63946]/25 transition-all duration-300"
    >
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
    </motion.div>
  );
}

export default function CategoriesSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const categories = t('categories.items', { returnObjects: true }) as CategoryItem[];
  
  // Fetch live challenge counts from HTB
  const { data: challengeCounts = [] } = trpc.htb.getChallengeCounts.useQuery();
  
  // Map category names to their counts
  const countMap = useMemo(() => {
    const map: Record<string, number> = {};
    challengeCounts.forEach((item: any) => {
      map[item.category] = item.count;
    });
    return map;
  }, [challengeCounts]);
  
  // Build display counts with live data
  const categoryCounts = useMemo(() => {
    const categoryNames = ['OSINT', 'Mobile', 'Web', 'GamePwn', 'Reversing', 'AI/ML', 'Crypto', 'Hardware', 'Coding', 'Forensics', 'Blockchain'];
    return categoryNames.map((name) => {
      const count = countMap[name] || 0;
      return {
        count: count.toString(),
        countLabel: count === 1 ? 'flag' : 'flags',
      };
    });
  }, [countMap]);

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
            />
          ))}
        </div>
      </div>
    </section>
  );
}
