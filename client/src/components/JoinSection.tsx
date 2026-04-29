/*
 * CAZABANDERAS Join Section
 * Design: Enhanced vertical timeline with dramatic animations, tactical elements
 * Military brutalism + Latin futurism with enhanced visual hierarchy
 */

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const CTF_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663561350743/fQrwPhmvRnJkdAC8zKsvoi/cazabanderas-ctf-bg-iaN85chb8NkEHHFjbVvx9v.webp";

export default function JoinSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const timelineSteps = [
    {
      icon: "🐺",
      titleKey: "join.hunt",
      descKey: "join.huntDesc",
      delay: 0.2,
      number: "01",
      color: "#e63946",
      bgColor: "from-[#e63946]/30 to-[#e63946]/5",
    },
    {
      icon: "📚",
      titleKey: "join.learn",
      descKey: "join.learnDesc",
      delay: 0.35,
      number: "02",
      color: "#ff6b6b",
      bgColor: "from-[#ff6b6b]/30 to-[#ff6b6b]/5",
    },
    {
      icon: "🎯",
      titleKey: "join.conquer",
      descKey: "join.conquerDesc",
      delay: 0.5,
      number: "03",
      color: "#ff8c42",
      bgColor: "from-[#ff8c42]/30 to-[#ff8c42]/5",
    },
    {
      icon: "⚡",
      titleKey: "join.pack",
      descKey: "join.packDesc",
      delay: 0.65,
      number: "04",
      color: "#ffd60a",
      bgColor: "from-[#ffd60a]/30 to-[#ffd60a]/5",
    },
  ];

  return (
    <section
      id="join"
      className="relative py-32 overflow-hidden"
      style={{
        backgroundImage: `url(${CTF_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-[#0d0f14]/88" />
      
      {/* Decorative background elements */}
      <motion.div
        className="absolute top-10 right-10 w-96 h-96 rounded-full opacity-5"
        style={{
          background: "radial-gradient(circle, #e63946 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <motion.div
        className="absolute bottom-20 left-5 w-80 h-80 rounded-full opacity-5"
        style={{
          background: "radial-gradient(circle, #ffd60a 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Text content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="w-8 h-[2px] bg-[#e63946]"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ originX: 0 }}
              />
              <span className="section-label text-[#e63946] tracking-widest text-sm font-bold">
                {t('join.label')}
              </span>
            </div>

            <motion.h2
              className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-tight text-white tracking-wider mb-8 font-black"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {t('join.title')}
            </motion.h2>

            <motion.p
              className="font-body text-lg text-white/70 leading-relaxed mb-10 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {t('join.description')}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link href="/recruitment">
                <Button
                  size="lg"
                  className="bg-[#e63946] hover:bg-[#d62828] text-white font-display tracking-wider font-bold shadow-lg hover:shadow-[0_0_30px_rgba(230,57,70,0.5)] transition-all duration-300"
                >
                  {t('join.apply') || 'JOIN APPLY'}
                </Button>
              </Link>
              <a href="https://discord.gg/cazabanderas" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-[#e63946] font-bold transition-all duration-300"
                >
                  {t('join.discord') || 'JOIN DISCORD'}
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Enhanced Vertical Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Animated vertical connecting line with gradient */}
              <motion.div
                className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-[#e63946] via-[#ff6b6b] via-[#ff8c42] to-[#ffd60a]"
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.3 }}
                style={{ originY: 0 }}
              />

              {/* Animated dashed overlay line for tactical effect */}
              <motion.div
                className="absolute left-12 top-0 bottom-0 w-1 border-l-2 border-dashed border-[#e63946]/30"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
              />

              {/* Timeline steps */}
              <div className="space-y-12">
                {timelineSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: step.delay }}
                    className="relative pl-32 group"
                  >
                    {/* Timeline node container */}
                    <div className="absolute left-0 top-0 w-24 h-24 flex items-center justify-center">
                      {/* Outer glow ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2"
                        style={{ borderColor: step.color }}
                        initial={{ scale: 1, opacity: 0.3 }}
                        whileHover={{ scale: 1.3, opacity: 0.8 }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Middle ring */}
                      <motion.div
                        className="absolute inset-2 rounded-full border border-[#e63946]/40"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Inner circle with gradient background */}
                      <motion.div
                        className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${step.bgColor} border-2 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(230,57,70,0.6)] transition-all duration-300`}
                        style={{ borderColor: step.color }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: step.delay + 0.1 }}
                        whileHover={{ scale: 1.2 }}
                      >
                        {/* Icon */}
                        <motion.span
                          className="text-3xl group-hover:scale-125 transition-transform duration-300"
                          initial={{ rotate: -180 }}
                          animate={inView ? { rotate: 0 } : {}}
                          transition={{ duration: 0.6, delay: step.delay + 0.2 }}
                        >
                          {step.icon}
                        </motion.span>
                      </motion.div>

                      {/* Step number badge */}
                      <motion.div
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-white text-xs font-black flex items-center justify-center border-2 border-[#0d0f14] shadow-lg"
                        style={{ backgroundColor: step.color }}
                        initial={{ scale: 0 }}
                        animate={inView ? { scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: step.delay + 0.3, type: "spring" }}
                      >
                        {step.number}
                      </motion.div>

                      {/* Checkmark indicator */}
                      <motion.div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#00ff00] border border-[#0d0f14] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Check size={12} className="text-[#0d0f14]" strokeWidth={3} />
                      </motion.div>
                    </div>

                    {/* Content box with enhanced styling */}
                    <motion.div
                      className="pt-2 pb-6 group-hover:pl-4 transition-all duration-300"
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: step.delay + 0.2 }}
                    >
                      {/* Title with accent line */}
                      <div className="flex items-center gap-3 mb-2">
                        <motion.div
                          className="h-[2px] w-0 group-hover:w-3 transition-all duration-300"
                          style={{ backgroundColor: step.color }}
                        />
                        <h3 className="font-display text-xl text-white tracking-wider font-bold group-hover:text-white transition-colors duration-300 uppercase">
                          {t(step.titleKey) || step.titleKey}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="font-body text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300 ml-5">
                        {t(step.descKey) || step.descKey}
                      </p>

                      {/* Animated bottom accent line */}
                      <motion.div
                        className="mt-4 h-[1px] w-0 origin-left transition-all duration-300 group-hover:w-20"
                        style={{ background: `linear-gradient(to right, ${step.color}, transparent)` }}
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom accent element */}
              <motion.div
                className="mt-12 flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="h-[2px] flex-1 bg-gradient-to-r from-[#e63946] to-transparent" />
                <span className="text-[#e63946] text-xs font-bold tracking-widest">READY TO HUNT</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
