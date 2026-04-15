/*
 * CAZABANDERAS About Section
 * Design: Asymmetric two-column layout, wolf pack imagery left, editorial text right
 * Diagonal slash top divider, staggered entrance animations
 */

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Users, Target, Globe } from "lucide-react";

const ABOUT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663561350743/fQrwPhmvRnJkdAC8zKsvoi/cazabanderas-about-MWGHfhXtwcvoBFKYQQoekX.webp";

const values = [
  {
    icon: Shield,
    title: "Ethical Hacking",
    desc: "We operate strictly within legal and ethical boundaries, using our skills to learn, compete, and contribute to a safer digital world.",
  },
  {
    icon: Users,
    title: "Pack Mentality",
    desc: "No hunter is left behind. We share knowledge, mentor newcomers, and tackle every challenge as a unified front.",
  },
  {
    icon: Target,
    title: "Relentless Pursuit",
    desc: "Every flag is a lesson. We approach each challenge with determination, creativity, and methodical precision.",
  },
  {
    icon: Globe,
    title: "Latin Roots",
    desc: "Born in Latin America, competing worldwide. We carry our culture and identity into every competition we enter.",
  },
];

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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

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
                <span className="section-label">Who We Are</span>
              </div>
              <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white tracking-wider mb-6">
                THE PACK<br />
                <span className="text-[#e63946]">HUNTS AS ONE</span>
              </h2>
              <p className="font-body text-base text-white/60 leading-relaxed mb-4">
                Cazabanderas — <em>Flag Hunters</em> — is an elite competitive CTF team rooted in Latin America and competing on the world stage. We were forged from a shared passion for cybersecurity, ethical hacking, and the thrill of the hunt.
              </p>
              <p className="font-body text-base text-white/60 leading-relaxed mb-8">
                Whether you're a seasoned hunter with years of experience or just starting your journey into ethical hacking, our pack thrives on collaboration, knowledge sharing, and the relentless pursuit of flags. Every skill — from web exploitation to reverse engineering, binary exploitation to cryptography — has its place in our arsenal.
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
