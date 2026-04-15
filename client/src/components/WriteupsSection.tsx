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

const writeups: Array<{
  title: string;
  category: string;
  difficulty: string;
  platform: string;
  author: string;
  readTime: number;
  excerpt: string;
  tags: string[];
  date: string;
  views: number;
}> = [];

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

function WritupCard({ item, index }: { item: typeof writeups[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const readTimeCategory = getReadTimeCategory(item.readTime);

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

  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedReadTime, setSelectedReadTime] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort writeups
  const filteredWriteups = useMemo(() => {
    let filtered = writeups.filter((item) => {
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
  }, [selectedDifficulty, selectedCategory, selectedReadTime, sortBy, searchQuery]);

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

        {/* Search bar - only show if writeups exist */}
        {writeups.length > 0 && (
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Filters & Sort - only show if writeups exist */}
        {writeups.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            {/* Difficulty filter */}
            <div>
              <div className="font-mono text-[0.65rem] text-white/40 tracking-widest uppercase mb-2">Difficulty</div>
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
              <div className="font-mono text-[0.65rem] text-white/40 tracking-widest uppercase mb-2">Category</div>
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
              <div className="font-mono text-[0.65rem] text-white/40 tracking-widest uppercase mb-2">Read Time</div>
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

            {/* Sort & Reset */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-3 py-1.5 border border-white/10 text-white/40 font-mono text-[0.65rem] tracking-widest uppercase hover:border-white/20 hover:text-white/60 transition-all duration-200"
              >
                Sort: {sortOptions.find((opt) => opt.value === sortBy)?.label}
                <ChevronDown size={12} className={`transition-transform ${showSortMenu ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 z-50 bg-[#0d0f14] border border-white/10 shadow-lg"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 font-mono text-[0.65rem] tracking-widest uppercase transition-colors ${
                          sortBy === opt.value
                            ? "bg-[#e63946]/10 text-[#e63946]"
                            : "text-white/40 hover:bg-white/5 hover:text-white/60"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reset button */}
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={resetFilters}
                className="px-3 py-1.5 border border-white/10 text-white/30 font-mono text-[0.65rem] tracking-widest uppercase hover:border-[#e63946]/40 hover:text-[#e63946] transition-all duration-200"
              >
                {t('writeups.resetAll')}
              </motion.button>
            )}

            {/* Result count */}
            <div className="ml-auto font-mono text-[0.65rem] text-white/25 tracking-widest">
              {filteredWriteups.length} {filteredWriteups.length === 1 ? "RESULT" : "RESULTS"}
            </div>
            </div>
          </motion.div>
        )}

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          {filteredWriteups.length > 0 ? (
            <motion.div
              key="writeups-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredWriteups.map((item, i) => (
                <WritupCard key={item.title} item={item} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="font-mono text-[0.65rem] text-white/30 tracking-widest uppercase mb-2">{t('writeups.noWriteupsFound')}</div>
              <p className="font-body text-sm text-white/25 mb-4">{t('writeups.adjustFilters')}</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-[#e63946]/40 text-[#e63946] font-mono text-[0.65rem] tracking-widest uppercase hover:bg-[#e63946]/5 transition-all duration-200"
              >
                {t('writeups.resetAllFilters')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex justify-center"
        >
          <button
            onClick={() => toast(t('writeups.archiveComingSoon'))}
            className="group flex items-center gap-3 px-6 py-3 border border-white/10 text-white/40 font-mono text-xs tracking-widest uppercase hover:border-[#e63946]/40 hover:text-[#e63946] transition-all duration-200"
          >
            {t('writeups.viewAll')}
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
