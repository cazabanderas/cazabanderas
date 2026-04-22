/*
 * CAZABANDERAS Recent Activity Section
 * Design: Display latest team pwns from HackTheBox
 * Dark with crimson accent highlights
 */

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import RecentPwns from "./RecentPwns";

export default function RecentActivitySection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 bg-[#111318]">
      <div className="container">
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
            <span className="section-label">ACTIVIDAD EN VIVO</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white tracking-wider">
              ÚLTIMAS CONQUISTAS
            </h2>
            <p className="font-body text-sm text-white/40 max-w-xs leading-relaxed">
              Los desafíos más recientes completados por nuestro equipo en HackTheBox.
            </p>
          </div>
        </motion.div>

        {/* Recent Pwns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <RecentPwns />
        </motion.div>
      </div>
    </section>
  );
}
