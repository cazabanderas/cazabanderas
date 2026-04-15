/*
 * CAZABANDERAS Hero Section
 * Design: Full-bleed dark image, 60/40 split layout, large stacked Bebas Neue type
 * Framer Motion staggered entrance, animated crimson accent line
 */

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663561350743/fQrwPhmvRnJkdAC8zKsvoi/cazabanderas-hero-TN4yaWimja3G9s299KtJy2.webp";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function HeroSection() {
  const handleScroll = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMG}
          alt="Cazabanderas hero"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f14] via-[#0d0f14]/80 to-[#0d0f14]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14] via-transparent to-[#0d0f14]/60" />
      </div>

      {/* Diagonal slash overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              rgba(230, 57, 70, 0.15) 40px,
              rgba(230, 57, 70, 0.15) 41px
            )`,
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-24 pb-16">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Label */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[2px] bg-[#e63946]" />
            <span className="section-label">Latin American CTF Team</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-[clamp(4rem,12vw,9rem)] leading-[0.9] text-white tracking-wider mb-2"
          >
            CAZA
          </motion.h1>
          <motion.h1
            variants={itemVariants}
            className="font-display text-[clamp(4rem,12vw,9rem)] leading-[0.9] tracking-wider mb-6"
            style={{ color: "#e63946" }}
          >
            BANDERAS
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="font-body text-lg text-white/60 max-w-xl leading-relaxed mb-3"
          >
            We hunt together, learn together, and conquer challenges as a united front.
            From web exploitation to reverse engineering — every flag has a hunter.
          </motion.p>

          {/* Mono subtitle */}
          <motion.div
            variants={itemVariants}
            className="font-mono text-xs text-[#e63946]/60 tracking-widest uppercase mb-10"
          >
            HackTheBox · TryHackMe · HackingClub · Live CTFs
          </motion.div>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <a
              href="#join"
              onClick={(e) => { e.preventDefault(); document.querySelector("#join")?.scrollIntoView({ behavior: "smooth" }); }}
              className="group flex items-center gap-2 px-6 py-3 bg-[#e63946] text-white font-mono text-sm tracking-widest uppercase hover:bg-[#c1121f] transition-all duration-200 glow-crimson"
            >
              Join the Pack
            </a>
            <a
              href="#achievements"
              onClick={(e) => { e.preventDefault(); document.querySelector("#achievements")?.scrollIntoView({ behavior: "smooth" }); }}
              className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white/70 font-mono text-sm tracking-widest uppercase hover:border-white/50 hover:text-white transition-all duration-200"
            >
              Our Hunts
            </a>
          </motion.div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
          className="mt-16 flex flex-wrap gap-8 md:gap-16 pb-8"
        >
          {[
            { value: "50+", label: "CTFs Competed" },
            { value: "200+", label: "Flags Captured" },
            { value: "15+", label: "Active Members" },
            { value: "4", label: "Platforms" },
          ].map((stat) => (
            <div key={stat.label} className="border-left-accent">
              <div className="stat-number text-4xl">{stat.value}</div>
              <div className="font-mono text-xs text-white/40 tracking-widest uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={handleScroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/30 hover:text-[#e63946] transition-colors"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.button>
    </section>
  );
}
