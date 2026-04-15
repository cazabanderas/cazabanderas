/*
 * CAZABANDERAS Achievements Section
 * Design: Timeline-style layout with CTF results, trophy cards, horizontal scroll on mobile
 * Dark with crimson accent highlights
 */

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Medal, Star, Award } from "lucide-react";

const achievements: Array<{
  event: string;
  placement: string;
  category: string;
  date: string;
  icon: React.ComponentType<any>;
  highlight: boolean;
  description: string;
}> = [];

const stats = [
  { value: "0", label: "CTFs Completed" },
  { value: "0+", label: "Flags Captured" },
  { value: "5", label: "Active Members" },
  { value: "4", label: "Platforms" },
];

function AchievementCard({ item, index }: { item: typeof achievements[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.1 }}
      className={`card-classified p-5 group transition-all duration-300 ${
        item.highlight ? "border-[#e63946]/30 glow-crimson" : "hover:border-white/10"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`mt-0.5 p-2 border flex-shrink-0 ${item.highlight ? "border-[#e63946]/50 text-[#e63946] bg-[#e63946]/10" : "border-white/10 text-white/30"}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-display text-base text-white tracking-wider leading-tight">{item.event}</h4>
            <span className="font-mono text-[0.6rem] text-white/25 tracking-widest flex-shrink-0">{item.date}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-mono text-xs tracking-widest font-bold ${item.highlight ? "text-[#e63946]" : "text-white/60"}`}>
              {item.placement}
            </span>
            <span className="text-white/20">·</span>
            <span className="font-mono text-[0.6rem] text-white/30 tracking-widest uppercase">{item.category}</span>
          </div>
          <p className="font-body text-xs text-white/40 leading-relaxed">{item.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function AchievementsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="achievements" className="relative py-24 bg-[#0d0f14]">
      {/* Diagonal slash top */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-[#111318]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 100%)" }} />

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
            <span className="section-label">Battle Record</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white tracking-wider">
              FLAGS<br />
              <span className="text-[#e63946]">CAPTURED</span>
            </h2>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="border-left-accent">
                  <div className="stat-number text-3xl">{stat.value}</div>
                  <div className="font-mono text-[0.6rem] text-white/35 tracking-widest uppercase mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Achievement cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((item, i) => (
            <AchievementCard key={item.event} item={item} index={i} />
          ))}
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
            View full record on CTFtime →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
