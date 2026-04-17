/*
 * CAZABANDERAS About Section
 * Design: Asymmetric two-column layout, wolf pack imagery left, editorial text right
 * Diagonal slash top divider, staggered entrance animations
 */

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Shield, Users, Target, Globe } from "lucide-react";

const ABOUT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663561350743/fQrwPhmvRnJkdAC8zKsvoi/cazabanderas-about-MWGHfhXtwcvoBFKYQQoekX.webp";

function ValueCard({ icon: Icon, title, desc, delay }: { icon: typeof Shield; title: string; desc: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="card-classified p-5 group hover:border-[#e63946]/30 transition-colors duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 p-2 border border-[#e63946]/30 text-[#e63946] group-hover:bg-[#e63946]/10 transition-colors">
          <Icon size={16} />
        </div>
        <div>
          <h4 className="font-display text-lg text-white tracking-wider mb-1">{title}</h4>
          <p className="font-body text-sm text-white/50 leading-relaxed">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const values = [
    {
      icon: Shield,
      title: t('about.values.ethicalHacking.title'),
      desc: t('about.values.ethicalHacking.desc'),
    },
    {
      icon: Users,
      title: t('about.values.packMentality.title'),
      desc: t('about.values.packMentality.desc'),
    },
    {
      icon: Target,
      title: t('about.values.relentlessPursuit.title'),
      desc: t('about.values.relentlessPursuit.desc'),
    },
    {
      icon: Globe,
      title: t('about.values.latinRoots.title'),
      desc: t('about.values.latinRoots.desc'),
    },
  ];

  return (
    <section id="about" className="relative py-24 bg-[#0d0f14]">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative overflow-hidden">
              <img
                src={ABOUT_IMG}
                alt="Cazabanderas wolf pack"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0d0f14]/60 to-transparent" />
            </div>
            {/* Corner accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-[#e63946]/40" />
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-[#e63946]/40" />
          </motion.div>

          {/* Right: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-[2px] bg-[#e63946]" />
                <span className="section-label">{t('about.label')}</span>
              </div>
              <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white tracking-wider mb-6">
                {t('about.title')}
              </h2>
              <p className="font-body text-base text-white/60 leading-relaxed mb-4">
                {t('about.intro1')}
              </p>
              <p className="font-body text-base text-white/60 leading-relaxed mb-8">
                {t('about.intro2')}
              </p>
            </motion.div>

            {/* Values grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {values.map((v, i) => (
                <ValueCard key={v.title} {...v} delay={0.3 + i * 0.1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
