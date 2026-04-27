/*
 * CAZABANDERAS Join Section
 * Design: Call-to-action section with recruitment info
 * Card-based visual layout with 4 value cards
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

  const cards = [
    {
      icon: "🐺",
      titleKey: "join.hunt",
      descKey: "join.huntDesc",
      delay: 0.2,
    },
    {
      icon: "📚",
      titleKey: "join.learn",
      descKey: "join.learnDesc",
      delay: 0.3,
    },
    {
      icon: "🎯",
      titleKey: "join.conquer",
      descKey: "join.conquerDesc",
      delay: 0.4,
    },
    {
      icon: "⚡",
      titleKey: "join.pack",
      descKey: "join.packDesc",
      delay: 0.5,
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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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

          {/* Right: Card-based visual element */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: card.delay }}
                  className="relative p-6 rounded-lg border border-[#e63946]/30 bg-gradient-to-br from-[#e63946]/10 to-transparent hover:border-[#e63946]/60 transition-all duration-300 group cursor-pointer"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  <h3 className="font-display text-sm text-white tracking-wider mb-2">
                    {t(card.titleKey) || card.titleKey}
                  </h3>
                  <p className="font-body text-xs text-white/50 leading-relaxed">
                    {t(card.descKey) || card.descKey}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
