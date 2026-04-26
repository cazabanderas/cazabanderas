/*
 * CAZABANDERAS Write-ups Section
 * Design: Blog-card grid with interactive filters, sorting, search, and read-time estimation
 * Features: Filter by difficulty, category, read-time; sort by date/title; real-time search
 */

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { ArrowRight, Clock, Tag, ChevronDown, Search, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { SkeletonCard, SkeletonGrid } from "./Skeleton";

const difficultyColors: Record<string, string> = {
  Medium: "#f4a261",
  Hard: "#e63946",
  Expert: "#9b2335",
};

const difficulties = ["All", "Medium", "Hard", "Expert"];
const categories = [
  "All",
  "Web Exploitation",
  "Binary Exploitation",
  "Reverse Engineering",
  "Cryptography",
  "OSINT & Forensics",
  "Malware Analysis",
];

const sortOptions = [
  { label: "Trending", value: "trending" },
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Title A-Z", value: "title-asc" },
  { label: "Title Z-A", value: "title-desc" },
];

const readTimeCategories = [
  { label: "All", value: "all" },
  { label: "Quick Reads (≤10 min)", value: "quick" },
  { label: "Deep Dives (20+ min)", value: "deep" },
];

// Helper function to categorize read time
function getReadTimeCategory(minutes: number): "quick" | "deep" | "medium" {
  if (minutes <= 10) return "quick";
  if (minutes >= 20) return "deep";
  return "medium";
}

function WritupCard({ item, index }: { item: any; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const readTimeCategory = getReadTimeCategory(item.readTime);

  const handleClick = () => {
    toast("Write-up details", {
      description: `"${item.title}" by ${item.author}`,
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
          {item.tags.map((tag: string) => (
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
              <span className="font-mono text-[0.6rem]">{item.readTime} min</span>
            </div>
            {readTimeCategory === "quick" && (
              <>
                <span className="text-white/15">·</span>
                <span className="font-mono text-[0.6rem] text-[#f4a261]">QUICK READ</span>
              </>
            )}
            {readTimeCategory === "deep" && (
              <>
                <span className="text-white/15">·</span>
                <span className="font-mono text-[0.6rem] text-[#e63946]">DEEP DIVE</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.6rem] text-white/20">
              {item.views} views
            </span>
            <span className="text-white/15">·</span>
            <span className="font-mono text-[0.6rem] text-white/20">
              {new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FilterButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 font-mono text-[0.65rem] tracking-widest uppercase transition-all duration-200 border ${
        isActive
          ? "border-[#e63946] text-[#e63946] bg-[#e63946]/5"
          : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
      }`}
    >
      {label}
    </button>
  );
}

export default function WriteupsSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Fetch public write-ups from database
  const { data: publicWriteups = [], isLoading } = trpc.writeups.getPublic.useQuery();

  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedReadTime, setSelectedReadTime] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Transform database write-ups to component format
  const transformedWriteups = useMemo(() => {
    return publicWriteups.map((wu: any) => ({
      title: wu.title,
      category: wu.category || "Uncategorized",
      difficulty: wu.difficulty || "Medium",
      platform: wu.platform || "Unknown",
      author: wu.teamMember?.displayName || "Anonymous",
      readTime: Math.ceil((wu.content?.length || 0) / 200), // Estimate: 200 chars per minute
      excerpt: wu.content?.substring(0, 150).replace(/<[^>]*>/g, '') + "..." || "No description",
      tags: [wu.platform, wu.difficulty].filter(Boolean),
      date: new Date(wu.createdAt).toISOString().split('T')[0],
      views: wu.viewCount || 0,
    }));
  }, [publicWriteups]);

  // Filter and sort writeups
  const filteredWriteups = useMemo(() => {
    let filtered = transformedWriteups.filter((item) => {
      const diffMatch = selectedDifficulty === "All" || item.difficulty === selectedDifficulty;
      const catMatch = selectedCategory === "All" || item.category === selectedCategory;
      
      // Read time filter
      let readTimeMatch = true;
      if (selectedReadTime === "quick") {
        readTimeMatch = item.readTime <= 10;
      } else if (selectedReadTime === "deep") {
        readTimeMatch = item.readTime >= 20;
      }

      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const searchMatch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchLower) ||
        item.excerpt.toLowerCase().includes(searchLower) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        item.category.toLowerCase().includes(searchLower);

      return diffMatch && catMatch && readTimeMatch && searchMatch;
    });

    // Sort
    if (sortBy === "trending") {
      filtered.sort((a, b) => b.views - a.views);
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === "title-asc") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "title-desc") {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    return filtered;
  }, [selectedDifficulty, selectedCategory, selectedReadTime, sortBy, searchQuery, transformedWriteups]);

  const resetFilters = () => {
    setSelectedDifficulty("All");
    setSelectedCategory("All");
    setSelectedReadTime("all");
    setSortBy("newest");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedDifficulty !== "All" ||
    selectedCategory !== "All" ||
    selectedReadTime !== "all" ||
    searchQuery !== "";

  return (
    <section id="writeups" className="relative py-24 bg-[#111318]">
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[2px] bg-[#e63946]" />
            <span className="section-label">{t('writeups.label')}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white tracking-wider">
              {t('writeups.title')}<br />
              <span className="text-[#e63946]">{t('writeups.subtitle')}</span>
            </h2>
            <p className="font-body text-sm text-white/40 max-w-xs leading-relaxed">
              {t('writeups.description')}
            </p>
          </div>
        </motion.div>

        {/* Loading skeleton */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <SkeletonGrid count={6} />
          </motion.div>
        )}

        {/* Empty state */}
        {transformedWriteups.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-center py-16"
          >
            <p className="text-white/40 font-body text-sm">{t('writeups.noWriteups')}</p>
          </motion.div>
        )}

        {/* Search bar - only show if writeups exist and not loading */}
        {transformedWriteups.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" size={16} />
              <input
                type="text"
                placeholder="Search by title, tags, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d0f14] border border-white/10 pl-10 pr-4 py-3 font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#e63946]/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Filters - only show if writeups exist and not loading */}
        {transformedWriteups.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            {/* Difficulty filter */}
            <div>
              <p className="text-xs text-white/40 font-mono tracking-widest uppercase mb-3">Difficulty</p>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((diff) => (
                  <FilterButton
                    key={diff}
                    label={diff}
                    isActive={selectedDifficulty === diff}
                    onClick={() => setSelectedDifficulty(diff)}
                  />
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div>
              <p className="text-xs text-white/40 font-mono tracking-widest uppercase mb-3">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <FilterButton
                    key={cat}
                    label={cat}
                    isActive={selectedCategory === cat}
                    onClick={() => setSelectedCategory(cat)}
                  />
                ))}
              </div>
            </div>

            {/* Read time filter */}
            <div>
              <p className="text-xs text-white/40 font-mono tracking-widest uppercase mb-3">Read Time</p>
              <div className="flex flex-wrap gap-2">
                {readTimeCategories.map((rt) => (
                  <FilterButton
                    key={rt.value}
                    label={rt.label}
                    isActive={selectedReadTime === rt.value}
                    onClick={() => setSelectedReadTime(rt.value)}
                  />
                ))}
              </div>
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-2 px-3 py-2 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors font-mono text-xs tracking-widest uppercase"
                >
                  Sort: {sortOptions.find((o) => o.value === sortBy)?.label}
                  <ChevronDown size={12} />
                </button>
                <AnimatePresence>
                  {showSortMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 left-0 bg-[#0d0f14] border border-white/10 z-50 min-w-max"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortMenu(false);
                          }}
                          className={`block w-full text-left px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors ${
                            sortBy === option.value
                              ? "bg-[#e63946]/10 text-[#e63946]"
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#e63946] hover:text-[#e63946]/60 transition-colors font-mono tracking-widest uppercase"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Results count */}
            <div className="text-xs text-white/40 font-mono">
              Showing {filteredWriteups.length} of {transformedWriteups.length} write-ups
            </div>
          </motion.div>
        )}

        {/* Write-ups grid */}
        {transformedWriteups.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredWriteups.map((writeup, index) => (
                <WritupCard key={`${writeup.title}-${writeup.date}`} item={writeup} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* No results state */}
        {transformedWriteups.length > 0 && filteredWriteups.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16"
          >
            <p className="text-white/40 font-body text-sm mb-4">No write-ups match your filters</p>
            <button
              onClick={resetFilters}
              className="text-xs text-[#e63946] hover:text-[#e63946]/60 transition-colors font-mono tracking-widest uppercase"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
