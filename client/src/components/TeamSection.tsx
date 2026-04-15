/*
 * CAZABANDERAS Team Section
 * Design: Classified-file card aesthetic, topographic map background,
 * member cards with role tags and specialty skills
 */

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const TEAM_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663561350743/fQrwPhmvRnJkdAC8zKsvoi/cazabanderas-team-bg-HtgtkDcHWMZkC2GhmNm8f4.webp";

const members = [
  {
    handle: "0xViper",
    role: "Team Lead",
    specialty: "Web Exploitation",
    skills: ["SQLi", "XSS", "SSRF", "OAuth"],
    bio: "Founding member and team strategist. Specializes in web app vulnerabilities and CTF coordination.",
    rank: "#01",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
  },
  {
    handle: "Phantasm",
    role: "Reverse Engineer",
    specialty: "Reverse Engineering",
    skills: ["Ghidra", "IDA Pro", "x86", "ARM"],
    bio: "Tears apart binaries with surgical precision. If it compiles, it can be reversed.",
    rank: "#02",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    handle: "CryptoWolf",
    role: "Cryptographer",
    specialty: "Cryptography",
    skills: ["RSA", "ECC", "AES", "Hash"],
    bio: "Numbers are a language. CryptoWolf speaks it fluently and breaks what others call unbreakable.",
    rank: "#03",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    handle: "BinShadow",
    role: "Pwn Specialist",
    specialty: "Binary Exploitation",
    skills: ["ROP", "Heap", "Stack", "Kernel"],
    bio: "Lives in the stack. Finds buffer overflows in places others don't even look.",
    rank: "#04",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&crop=face",
  },
  {
    handle: "NetHunter",
    role: "Network Analyst",
    specialty: "Forensics & OSINT",
    skills: ["Wireshark", "OSINT", "Forensics", "PCAP"],
    bio: "Leaves no packet unexamined. Master of network forensics and open-source intelligence.",
    rank: "#05",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
  {
    handle: "MalDev",
    role: "Malware Analyst",
    specialty: "Malware & RE",
    skills: ["Sandbox", "YARA", "PE", "Shellcode"],
    bio: "Dissects malware samples for breakfast. Understands adversary techniques from the inside out.",
    rank: "#06",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
];

function MemberCard({ member, index }: { member: typeof members[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      className="card-classified group hover:border-[#e63946]/30 transition-all duration-300 overflow-hidden"
    >
      {/* Top bar with rank */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <span className="font-mono text-[0.6rem] text-[#e63946]/60 tracking-widest">OPERATIVE</span>
        <span className="font-mono text-[0.6rem] text-white/20 tracking-widest">{member.rank}</span>
      </div>

      <div className="p-5">
        {/* Avatar + handle */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 overflow-hidden border border-white/10 group-hover:border-[#e63946]/40 transition-colors">
              <img
                src={member.avatar}
                alt={member.handle}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            {/* Corner accent */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-[#e63946]" />
          </div>
          <div>
            <div className="font-display text-xl text-white tracking-wider leading-none">{member.handle}</div>
            <div className="font-mono text-[0.65rem] text-[#e63946] tracking-widest uppercase mt-1">{member.role}</div>
          </div>
        </div>

        {/* Bio */}
        <p className="font-body text-xs text-white/45 leading-relaxed mb-4">{member.bio}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {member.skills.map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="team"
      className="relative py-24"
      style={{
        backgroundImage: `url(${TEAM_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0d0f14]/90" />

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
            <span className="section-label">Operatives</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white tracking-wider">
              MEET THE<br />
              <span className="text-[#e63946]">HUNTERS</span>
            </h2>
            <p className="font-body text-sm text-white/40 max-w-xs leading-relaxed">
              Each operative brings a unique skill set to the pack. Together, no flag is out of reach.
            </p>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((member, i) => (
            <MemberCard key={member.handle} member={member} index={i} />
          ))}
        </div>

        {/* Join CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="font-mono text-xs text-white/30 tracking-widest uppercase mb-4">
            + More hunters in the shadows
          </p>
          <a
            href="#join"
            onClick={(e) => { e.preventDefault(); document.querySelector("#join")?.scrollIntoView({ behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-white/50 font-mono text-xs tracking-widest uppercase hover:border-[#e63946]/50 hover:text-[#e63946] transition-all duration-200"
          >
            Become an Operative
          </a>
        </motion.div>
      </div>
    </section>
  );
}
