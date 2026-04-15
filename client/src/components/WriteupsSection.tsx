/*
 * CAZABANDERAS Write-ups Section
 * Design: Blog-card grid with category tags, difficulty indicators, dark editorial style
 */

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { toast } from "sonner";

const writeups = [
  {
    title: "Breaking JWT Authentication with Algorithm Confusion",
    category: "Web Exploitation",
    difficulty: "Hard",
    platform: "HackTheBox",
    author: "0xViper",
    readTime: "12 min",
    excerpt: "A deep dive into JWT algorithm confusion attacks — how RS256 can be downgraded to HS256 to forge arbitrary tokens.",
    tags: ["JWT", "Auth Bypass", "Web"],
    date: "Mar 2024",
  },
  {
    title: "Reversing a Custom VM Obfuscation Layer",
    category: "Reverse Engineering",
    difficulty: "Hard",
    platform: "CTF Finals",
    author: "Phantasm",
    readTime: "18 min",
    excerpt: "Walkthrough of a challenge featuring a custom virtual machine with a proprietary instruction set. We decompile the VM and recover the flag.",
    tags: ["VM", "x86", "Ghidra"],
    date: "Feb 2024",
  },
  {
    title: "Lattice-Based Cryptography: Breaking LWE",
    category: "Cryptography",
    difficulty: "Expert",
    platform: "HackingClub",
    author: "CryptoWolf",
    readTime: "22 min",
    excerpt: "Exploiting a weak parameter selection in a Learning With Errors implementation to recover the private key.",
    tags: ["LWE", "Lattice", "SageMath"],
    date: "Jan 2024",
  },
  {
    title: "Heap Exploitation: House of Orange",
    category: "Binary Exploitation",
    difficulty: "Expert",
    platform: "picoCTF",
    author: "BinShadow",
    readTime: "25 min",
    excerpt: "Step-by-step exploitation of a heap overflow using the House of Orange technique to achieve arbitrary code execution.",
    tags: ["Heap", "ROP", "glibc"],
    date: "Dec 2023",
  },
  {
    title: "OSINT: Tracing a Digital Footprint",
    category: "OSINT & Forensics",
    difficulty: "Medium",
    platform: "TryHackMe",
    author: "NetHunter",
    readTime: "10 min",
    excerpt: "Using open-source intelligence tools to reconstruct an attacker's identity from scattered digital breadcrumbs.",
    tags: ["OSINT", "Maltego", "Recon"],
    date: "Nov 2023",
  },
  {
    title: "Unpacking a Multi-Stage Dropper",
    category: "Malware Analysis",
    difficulty: "Hard",
    platform: "HackTheBox",
    author: "MalDev",
    readTime: "16 min",
    excerpt: "Analyzing a real-world multi-stage malware dropper — from initial deobfuscation through payload extraction.",
    tags: ["Malware", "YARA", "PE"],
    date: "Oct 2023",
  },
];

const difficultyColors: Record<string, string> = {
  Medium: "#f4a261",
  Hard: "#e63946",
  Expert: "#9b2335",
};

function WritupCard({ item, index }: { item: typeof writeups[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const handleClick = () => {
    toast("Write-up coming soon!", {
      description: `"${item.title}" will be published shortly.`,
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.1 }}
      className="card-classified group hover:border-white/10 transition-all duration-300 flex flex-col cursor-pointer"
      onClick={handleClick}
    >
      {/* Category bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <span className="font-mono text-[0.6rem] text-white/30 tracking-widest uppercase">{item.category}</span>
        <span
          className="font-mono text-[0.6rem] tracking-widest uppercase"
          style={{ color: difficultyColors[item.difficulty] || "#e63946" }}
        >
          {item.difficulty}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Platform badge */}
        <div className="flex items-center gap-2 mb-3">
          <Tag size={10} className="text-[#e63946]/60" />
          <span className="font-mono text-[0.6rem] text-[#e63946]/60 tracking-widest uppercase">{item.platform}</span>
        </div>

        {/* Title */}
        <h4 className="font-display text-lg text-white tracking-wider leading-tight mb-3 group-hover:text-[#e63946] transition-colors">
          {item.title}
        </h4>

        {/* Excerpt */}
        <p className="font-body text-xs text-white/40 leading-relaxed mb-4 flex-1">{item.excerpt}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.tags.map((tag) => (
            <span key={tag} className="skill-tag">{tag}</span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.6rem] text-white/25 tracking-widest">{item.author}</span>
            <span className="text-white/15">·</span>
            <div className="flex items-center gap-1 text-white/25">
              <Clock size={9} />
              <span className="font-mono text-[0.6rem]">{item.readTime}</span>
            </div>
          </div>
          <span className="font-mono text-[0.6rem] text-white/20">{item.date}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function WriteupsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="writeups" className="relative py-24 bg-[#111318]">
      <div className="container relative z-10">
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
            <span className="section-label">Knowledge Base</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white tracking-wider">
              WRITE-UPS &<br />
              <span className="text-[#e63946]">WALKTHROUGHS</span>
            </h2>
            <p className="font-body text-sm text-white/40 max-w-xs leading-relaxed">
              We share our knowledge. Every solved challenge is a lesson for the whole pack.
            </p>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {writeups.map((item, i) => (
            <WritupCard key={item.title} item={item} index={i} />
          ))}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex justify-center"
        >
          <button
            onClick={() => toast("Full write-ups archive coming soon!")}
            className="group flex items-center gap-3 px-6 py-3 border border-white/10 text-white/40 font-mono text-xs tracking-widest uppercase hover:border-[#e63946]/40 hover:text-[#e63946] transition-all duration-200"
          >
            View All Write-ups
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
