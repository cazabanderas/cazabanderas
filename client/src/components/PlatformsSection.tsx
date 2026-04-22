/*
 * CAZABANDERAS Platforms Section
 * Design: Horizontal cards with platform logos, dark background with circuit texture
 * Asymmetric layout with large platform names
 */

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";

const CTF_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663561350743/fQrwPhmvRnJkdAC8zKsvoi/cazabanderas-ctf-bg-iaN85chb8NkEHHFjbVvx9v.webp";

// Platform colors for styling
const platformColors: Record<string, string> = {
  HTB: "#9fef00",
  THM: "#88cc14",
  HC: "#e63946",
  IRL: "#f4a261",
};

function PlatformCard({ platform, index }: { platform: any; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const color = platformColors[platform.abbr] || "#9fef00";

  return (
    <motion.a
      ref={ref}
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group card-classified p-6 hover:border-white/15 transition-all duration-300 block"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          {/* Platform abbr badge */}
          <div
            className="w-12 h-12 flex items-center justify-center border font-mono text-sm font-bold tracking-wider"
            style={{ borderColor: `${color}40`, color: color, backgroundColor: `${color}10` }}
          >
            {platform.abbr}
          </div>
          <div>
            <h3 className="font-display text-2xl text-white tracking-wider leading-none">{platform.name}</h3>
            <div className="font-mono text-[0.6rem] tracking-widest uppercase mt-1" style={{ color: color }}>
              {platform.rank}
            </div>
          </div>
        </div>
        <ExternalLink size={14} className="text-white/20 group-hover:text-white/50 transition-colors mt-1" />
      </div>

      <p className="font-body text-sm text-white/50 leading-relaxed mb-4">{platform.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {platform.categories.map((cat: string) => (
          <span
            key={cat}
            className="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 border"
            style={{ borderColor: `${color}25`, color: `${color}80` }}
          >
            {cat}
          </span>
        ))}
      </div>
    </motion.a>
  );
}

export default function PlatformsSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Get platforms from i18n
  const platforms = t('platforms.items', { returnObjects: true }) as any[];

  return (
    <section
      id="platforms"
      className="relative py-24"
      style={{
        backgroundImage: `url(${CTF_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#0d0f14]/88" />

      <div className="container relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[2px] bg-[#e63946]" />
            <span className="section-label">{t('platforms.label')}</span>
          </div>
          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white tracking-wider">
            {t('platforms.title')}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {platforms && platforms.map((platform, i) => (
            <PlatformCard key={platform.name} platform={platform} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
