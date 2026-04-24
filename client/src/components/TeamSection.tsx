/*
 * CAZABANDERAS Team Section
 * Design: Classified-file card aesthetic, topographic map background,
 * member cards with role tags and specialty skills
 */

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

const TEAM_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663561350743/fQrwPhmvRnJkdAC8zKsvoi/cazabanderas-team-bg-HtgtkDcHWMZkC2GhmNm8f4.webp";

// Fallback members if no profiles exist
const FALLBACK_MEMBERS = [
  {
    id: 1,
    displayName: "0xViper",
    title: "Team Lead",
    specialty: "Web Exploitation",
    bio: "Founding member and team strategist. Specializes in web app vulnerabilities and CTF coordination.",
    ranking: 1,
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 2,
    displayName: "Phantasm",
    title: "Reverse Engineer",
    specialty: "Reverse Engineering",
    bio: "Tears apart binaries with surgical precision. If it compiles, it can be reversed.",
    ranking: 2,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 3,
    displayName: "CryptoWolf",
    title: "Cryptographer",
    specialty: "Cryptography",
    bio: "Numbers are a language. CryptoWolf speaks it fluently and breaks what others call unbreakable.",
    ranking: 3,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 4,
    displayName: "BinShadow",
    title: "Pwn Specialist",
    specialty: "Binary Exploitation",
    bio: "Lives in the stack. Finds buffer overflows in places others don't even look.",
    ranking: 4,
    avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 5,
    displayName: "ShadowNinja",
    title: "OSINT Specialist",
    specialty: "OSINT & Forensics",
    bio: "Finds what's hidden. No stone left unturned, no lead too cold.",
    ranking: 5,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
];

export default function TeamSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  // Fetch HTB team members from database
  const { data: htbMembers = [], isLoading: isLoadingHTB } = trpc.htb.getAllTeamMembers.useQuery();
  
  // Fetch hunters profiles from database
  const { data: profiles = [], isLoading } = trpc.admin.listHuntersProfiles.useQuery();
  
  // Use HTB members if available, otherwise use profiles, otherwise use fallback
  const members = htbMembers.length > 0 ? htbMembers : (profiles.length > 0 ? profiles : FALLBACK_MEMBERS);
  const isLoading_state = isLoading || isLoadingHTB;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="team"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{
        backgroundImage: `url(${TEAM_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0f14]/80 via-[#0d0f14]/90 to-[#0d0f14]/95" />

      <div className="relative z-10 container max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 text-[#e63946] font-mono text-xs tracking-[0.2em] uppercase">
              <div className="w-8 h-px bg-[#e63946]" />
              {t('team.label')}
              <div className="w-8 h-px bg-[#e63946]" />
            </div>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-4 tracking-wider">
            {t('team.title')}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            {t('team.subtitle')}
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading_state && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#e63946]" />
            <p className="ml-3 text-white/60">Loading team...</p>
          </div>
        )}

        {/* Team Grid */}
        {!isLoading_state && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {members.map((member: any) => (
              <motion.div
                key={member.id}
                variants={cardVariants}
                className="group relative"
              >
                {/* Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#e63946]/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Card Border */}
                <div className="relative border border-white/10 rounded-lg p-6 bg-[#111318]/50 backdrop-blur-sm hover:border-[#e63946]/50 transition-all duration-300 overflow-hidden">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e63946] via-[#e63946]/50 to-transparent" />

                  {/* Avatar */}
                  <div className="mb-4 flex items-center gap-4">
                    {(member.avatarUrl || member.profilePictureUrl) && (
                      <img
                        src={member.avatarUrl || member.profilePictureUrl}
                        alt={member.displayName}
                        className="w-16 h-16 rounded-lg object-cover border border-[#e63946]/30 group-hover:border-[#e63946] transition-colors"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-bold text-white tracking-wider">
                        {member.displayName}
                      </h3>
                      {member.title && (
                        <p className="text-[#e63946] font-mono text-xs tracking-widest uppercase">
                          {member.title}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Specialty Badge */}
                  {member.specialty && (
                    <div className="mb-3 inline-block">
                      <span className="px-3 py-1 bg-[#e63946]/10 border border-[#e63946]/30 text-[#e63946] font-mono text-xs rounded tracking-widest uppercase">
                        {member.specialty}
                      </span>
                    </div>
                  )}

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-white/70 text-sm leading-relaxed mb-4">
                      {member.bio}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-white/50 font-mono">
                    {member.flagsCount > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-[#e63946]">●</span>
                        <span>{member.flagsCount} Flags</span>
                      </div>
                    )}
                    {member.ranking && (
                      <div className="flex items-center gap-1">
                        <span className="text-[#e63946]">●</span>
                        <span>Rank #{member.ranking}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="mt-4 flex gap-2">
                    {member.htbProfile && (
                      <a
                        href={member.htbProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 border border-white/10 text-white/60 hover:text-[#e63946] hover:border-[#e63946] rounded transition-colors"
                      >
                        HTB
                      </a>
                    )}
                    {member.thmProfile && (
                      <a
                        href={member.thmProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 border border-white/10 text-white/60 hover:text-[#e63946] hover:border-[#e63946] rounded transition-colors"
                      >
                        THM
                      </a>
                    )}
                    {member.githubProfile && (
                      <a
                        href={member.githubProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 border border-white/10 text-white/60 hover:text-[#e63946] hover:border-[#e63946] rounded transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
