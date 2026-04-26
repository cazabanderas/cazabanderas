/*
 * CAZABANDERAS Navbar
 * Design: Dark Military Brutalism — monospace nav links, thin red accent line,
 * sticky with blur backdrop on scroll
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

// Removed - using translated navLinks below instead

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navLinks = [
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.team'), href: '#team' },
    { label: t('nav.platforms'), href: '#platforms' },
    { label: t('nav.achievements'), href: '#achievements' },
    { label: t('nav.writeups'), href: '#writeups' },
    { label: t('nav.joinUs'), href: '#join' },
  ];

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 40);
      // Update active section based on scroll position
      const sections = ['#about', '#team', '#platforms', '#achievements', '#writeups', '#join'];
      for (const section of sections) {
        const el = document.querySelector(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Persistent red left edge line */}
      <div className="fixed left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#e63946] via-[#e63946]/40 to-transparent z-50 pointer-events-none" />

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#0d0f14]/95 backdrop-blur-md border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="container h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center gap-2 md:gap-3 group flex-shrink-0"
          >
            <img
              src="/favicon.png"
              alt="Cazabanderas Logo"
              className="h-8 md:h-10 w-auto group-hover:opacity-80 transition-opacity"
            />
            <div className="hidden sm:block">
              <div className="font-display text-white text-sm md:text-xl leading-none tracking-widest">CAZABANDERAS</div>
              <div className="font-mono text-[0.5rem] md:text-[0.6rem] text-[#e63946]/70 tracking-[0.2em] uppercase">Flag Hunters</div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-8 flex-1 justify-center mx-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className={`nav-link text-xs xl:text-sm transition-colors ${
                  activeSection === link.href
                    ? 'text-[#e63946] border-b-2 border-[#e63946]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 flex-shrink-0">
            <LanguageSwitcher />
            <a
              href="/recruitment"
              className="px-2 xl:px-3 py-1 xl:py-2 text-[#e63946] font-mono text-[0.65rem] xl:text-xs tracking-widest uppercase hover:text-white transition-colors whitespace-nowrap"
            >
              Recruitment
            </a>
            <a
              href="/team-login"
              className="px-2 xl:px-3 py-1 xl:py-2 text-[#e63946] font-mono text-[0.65rem] xl:text-xs tracking-widest uppercase hover:text-white transition-colors whitespace-nowrap"
            >
              {t('nav.teamLogin')}
            </a>
            <a
              href="#join"
              onClick={(e) => { e.preventDefault(); handleNavClick("#join"); }}
              className="px-2 xl:px-3 py-1 xl:py-2 border border-[#e63946] text-[#e63946] font-mono text-[0.65rem] xl:text-xs tracking-widest uppercase hover:bg-[#e63946] hover:text-white transition-all duration-200 whitespace-nowrap"
            >
              {t('nav.huntWithUs')}
            </a>
          </div>

          {/* Tablet/Mobile toggle */}
          <button
            className="lg:hidden text-white/70 hover:text-[#e63946] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-30 bg-[#0d0f14]/98 backdrop-blur-md flex flex-col justify-center items-center gap-6 lg:hidden px-4"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="font-display text-2xl sm:text-4xl text-white/80 hover:text-[#e63946] transition-colors tracking-widest"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.div className="flex gap-2 sm:gap-4 mt-6 w-full sm:w-auto flex-col sm:flex-row justify-center">
            <motion.a
              href="/recruitment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.06 }}
              className="px-6 py-2 text-[#e63946] font-mono text-xs tracking-widest uppercase hover:text-white transition-colors text-center"
            >
              Recruitment
            </motion.a>
            <motion.a
              href="/team-login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (navLinks.length + 1) * 0.06 }}
              className="px-6 py-2 text-[#e63946] font-mono text-xs tracking-widest uppercase hover:text-white transition-colors text-center"
            >
              {t('nav.teamLogin')}
            </motion.a>
            <motion.a
              href="#join"
              onClick={(e) => { e.preventDefault(); handleNavClick("#join"); }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (navLinks.length + 2) * 0.06 }}
              className="px-6 py-2 border border-[#e63946] text-[#e63946] font-mono text-xs tracking-widest uppercase hover:bg-[#e63946] hover:text-white transition-all text-center"
            >
              {t('nav.huntWithUs')}
            </motion.a>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
