/*
 * CAZABANDERAS Categories Section
 * Design: Dark section with large category cards showing CTF disciplines
 * Asymmetric grid, hover reveals crimson accent
 */

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Binary, Lock, Search, FileSearch, Shield, Wifi, Eye, Smartphone, Code, Zap, Database, Cpu, Blocks } from "lucide-react";

const categories = [
  {
    icon: Eye,
    name: "OSINT",
    desc: "Open-source intelligence gathering, social engineering research, and digital footprint analysis.",
    count: "6",
    countLabel: "flags",
  },
  {
    icon: Smartphone,
    name: "Mobile",
    desc: "iOS and Android exploitation, reverse engineering mobile apps, and mobile security assessments.",
    count: "3",
    countLabel: "flags",
  },
  {
    icon: Globe,
    name: "Web",
    desc: "SQL injection, XSS, SSRF, IDOR, deserialization, and every vulnerability hiding in web applications.",
    count: "4",
    countLabel: "flags",
  },
  {
    icon: Zap,
    name: "GamePwn",
    desc: "Game hacking, memory manipulation, cheat engine exploitation, and game engine vulnerabilities.",
    count: "1",
    countLabel: "flag",
  },
  {
    icon: Search,
    name: "Reversing",
    desc: "Static and dynamic analysis, VM deobfuscation, firmware reversing, and anti-debug bypass.",
    count: "4",
    countLabel: "flags",
  },
  {
    icon: Cpu,
    name: "AI/ML",
    desc: "Machine learning model attacks, adversarial examples, neural network exploitation.",
    count: "1",
    countLabel: "flag",
  },
  {
    icon: Lock,
    name: "Crypto",
    desc: "RSA, ECC, AES, lattice attacks, hash collisions, and custom cipher analysis.",
    count: "1",
    countLabel: "flag",
  },
  {
    icon: Database,
    name: "Hardware",
    desc: "Hardware hacking, side-channel attacks, fault injection, and embedded system exploitation.",
    count: "2",
    countLabel: "flags",
  },
  {
    icon: Code,
    name: "Coding",
    desc: "Algorithm challenges, programming puzzles, and code analysis for CTF competitions.",
    count: "2",
    countLabel: "flags",
  },
  {
    icon: FileSearch,
    name: "Forensics",
    desc: "Memory dumps, disk images, network captures, and artifact recovery from compromised systems.",
    count: "1",
    countLabel: "flag",
  },
  {
    icon: Blocks,
    name: "Blockchain",
    desc: "Smart contract exploitation, blockchain security, and cryptocurrency vulnerability analysis.",
    count: "1",
    countLabel: "flag",
  },
];

function CategoryCard({ cat, index }: { cat: typeof categories[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = cat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group card-classified p-5 hover:border-[#e63946]/25 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 border border-white/8 text-white/30 group-hover:border-[#e63946]/30 group-hover:text-[#e63946] transition-all duration-300">
          <Icon size={18} />
        </div>
        <div className="text-right">
          <div className="font-display text-2xl text-[#e63946] leading-none">{cat.count}</div>
          <div className="font-mono text-[0.55rem] text-white/25 tracking-widest uppercase">{cat.countLabel}</div>
        </div>
      </div>
      <h4 className="font-display text-lg text-white tracking-wider mb-2 group-hover:text-[#e63946] transition-colors">{cat.name}</h4>
      <p className="font-body text-xs text-white/40 leading-relaxed">{cat.desc}</p>
    </motion.div>
  );
}

export default function CategoriesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 bg-[#111318]">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[2px] bg-[#e63946]" />
            <span className="section-label">Disciplines</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white tracking-wider">
              OUR<br />
              <span className="text-[#e63946]">ARSENAL</span>
            </h2>
            <p className="font-body text-sm text-white/40 max-w-xs leading-relaxed">
              Every category is a weapon. We sharpen them all.
            </p>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.name} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
