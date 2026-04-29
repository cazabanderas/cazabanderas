/*
 * CAZABANDERAS Join Section
 * Design: Mission statement + Call to action with bilingual text content
 * Military brutalism + Latin futurism with enhanced visual hierarchy
 */

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CTF_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663561350743/fQrwPhmvRnJkdAC8zKsvoi/cazabanderas-ctf-bg-iaN85chb8NkEHHFjbVvx9v.webp";

export default function JoinSection() {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const isSpanish = i18n.language.startsWith('es');

  const missionContent = {
    es: {
      title: "ÚNETE A LA MANADA",
      subtitle: "Somos más que un equipo",
      mission: [
        "Cazamos banderas en las plataformas más desafiantes del mundo.",
        "Cada reto es una oportunidad para crecer, aprender y dominar nuevas técnicas.",
        "Desde exploración web hasta ingeniería inversa, no hay límites en nuestro arsenal.",
        "Somos una comunidad unida por la pasión, el conocimiento y la determinación."
      ],
      cta: "Si tienes hambre de desafíos y quieres ser parte de algo épico, es hora de unirte a la caza."
    },
    en: {
      title: "JOIN THE PACK",
      subtitle: "We are more than a team",
      mission: [
        "We hunt flags across the world's most challenging platforms.",
        "Every challenge is an opportunity to grow, learn, and master new techniques.",
        "From web exploitation to reverse engineering, there are no limits to our arsenal.",
        "We are a community united by passion, knowledge, and determination."
      ],
      cta: "If you hunger for challenges and want to be part of something epic, it's time to join the hunt."
    }
  };

  const content = isSpanish ? missionContent.es : missionContent.en;

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
          {/* Left: CTA Section */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-[#e63946]" />
                <span className="text-sm font-mono font-bold text-[#e63946] tracking-widest">
                  {t('join.label') || 'JOIN THE HUNT'}
                </span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-black font-heading text-white mb-6 leading-tight">
                {t('join.title') || 'BECOME A FLAG\nHUNTER'}
              </h2>
              <p className="text-lg text-white/70 leading-relaxed max-w-md">
                {t('join.description') || 'Ready to join the pack? We\'re always looking for skilled hunters who are passionate about cybersecurity and CTF competitions.'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href="/recruitment">
                <Button
                  size="lg"
                  className="bg-[#e63946] hover:bg-[#d62828] text-white font-bold px-8 py-6 text-base transition-all duration-300 hover:shadow-[0_0_20px_rgba(230,57,70,0.4)]"
                >
                  {t('join.applyNow') || 'APPLY NOW'}
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

          {/* Right: Mission Statement & Call to Action */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-2"
            >
              <p className="text-sm font-mono font-bold text-[#ffd60a] tracking-widest uppercase">
                {content.subtitle}
              </p>
              <div className="w-12 h-1 bg-gradient-to-r from-[#e63946] to-[#ffd60a]" />
            </motion.div>

            {/* Mission Points */}
            <div className="space-y-4">
              {content.mission.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex gap-4 group"
                >
                  {/* Accent bullet */}
                  <div className="flex-shrink-0 pt-1">
                    <div className="w-2 h-2 rounded-full bg-[#e63946] group-hover:bg-[#ffd60a] transition-colors duration-300" />
                  </div>
                  {/* Text */}
                  <p className="text-base text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300">
                    {point}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Call to Action Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="pt-6 border-t border-white/10"
            >
              <p className="text-lg text-[#ffd60a] font-semibold leading-relaxed italic">
                "{content.cta}"
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
