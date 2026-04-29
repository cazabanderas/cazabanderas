/*
 * CAZABANDERAS Join Section
 * Design: Vertical timeline showing the journey CAZA → APRENDE → CONQUISTA → MANADA
 * Military brutalism + Latin futurism with tactical icons and connecting lines
 */

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

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
    },
    {
      icon: "📚",
      titleKey: "join.learn",
      descKey: "join.learnDesc",
      delay: 0.3,
      number: "02",
    },
    {
      icon: "🎯",
      titleKey: "join.conquer",
      descKey: "join.conquerDesc",
      delay: 0.4,
      number: "03",
    },
    {
      icon: "⚡",
      titleKey: "join.pack",
      descKey: "join.packDesc",
      delay: 0.5,
      number: "04",
    },
  ];

  return (
    <section
      id="join"
      className="relative py-24"
      style={{
        backgroundImage: `url(${CTF_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#0d0f14]/88" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Text content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-[2px] bg-[#e63946]" />
              <span className="section-label">{t('join.label')}</span>
            </div>

            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-tight text-white tracking-wider mb-6">
              {t('join.title')}
            </h2>

            <p className="font-body text-lg text-white/60 leading-relaxed mb-8 max-w-md">
              {t('join.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/recruitment">
                <Button
                  size="lg"
                  className="bg-[#e63946] hover:bg-[#d62828] text-white font-display tracking-wider"
                >
                  {t('join.apply') || 'JOIN APPLY'}
                </Button>
              </Link>
              <a href="https://discord.gg/cazabanderas" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5"
                >
                  {t('join.discord') || 'JOIN DISCORD'}
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Right: Vertical Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-sm">
              {/* Vertical connecting line */}
              <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#e63946] via-[#e63946]/50 to-transparent" />

              {/* Timeline steps */}
              <div className="space-y-8">
                {timelineSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: step.delay }}
                    className="relative pl-24 group"
                  >
                    {/* Timeline node (circle with icon) */}
                    <div className="absolute left-0 top-0 w-16 h-16 flex items-center justify-center">
                      {/* Outer ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-[#e63946] group-hover:border-[#e63946] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(230,57,70,0.5)]" />
                      
                      {/* Inner circle with icon */}
                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#e63946]/20 to-[#e63946]/5 border border-[#e63946]/50 flex items-center justify-center group-hover:from-[#e63946]/40 group-hover:to-[#e63946]/10 transition-all duration-300">
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          {step.icon}
                        </span>
                      </div>

                      {/* Step number */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#e63946] text-white text-xs font-bold flex items-center justify-center border border-[#0d0f14]">
                        {step.number}
                      </div>
                    </div>

                    {/* Content box */}
                    <div className="pt-2 pb-4">
                      <h3 className="font-display text-lg text-white tracking-wider mb-2 group-hover:text-[#e63946] transition-colors duration-300">
                        {t(step.titleKey) || step.titleKey}
                      </h3>
                      <p className="font-body text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                        {t(step.descKey) || step.descKey}
                      </p>

                      {/* Hover accent line */}
                      <div className="mt-3 h-[1px] w-0 bg-gradient-to-r from-[#e63946] to-transparent group-hover:w-12 transition-all duration-300" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom accent */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={inView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-8 h-[2px] bg-gradient-to-r from-[#e63946] via-[#e63946]/50 to-transparent origin-left"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
