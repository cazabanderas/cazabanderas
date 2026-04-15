/*
 * CAZABANDERAS Navbar
 * Design: Dark Military Brutalism — monospace nav links, thin red accent line,
 * sticky with blur backdrop on scroll
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Platforms", href: "#platforms" },
  { label: "Achievements", href: "#achievements" },
  { label: "Write-ups", href: "#writeups" },
  { label: "Join Us", href: "#join" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
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
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center gap-3 group"
          >
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663561350743/fQrwPhmvRnJkdAC8zKsvoi/ChatGPTImageApr10,2026,03_19_03PM(2)_231788b9.png"
              alt="Cazabanderas Logo"
              className="h-10 w-auto group-hover:opacity-80 transition-opacity"
            />
            <div>
              <div className="font-display text-white text-xl leading-none tracking-widest">CAZABANDERAS</div>
              <div className="font-mono text-[0.6rem] text-[#e63946]/70 tracking-[0.2em] uppercase">Flag Hunters</div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="nav-link"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <a
            href="#join"
            onClick={(e) => { e.preventDefault(); handleNavClick("#join"); }}
            className="hidden md:flex items-center gap-2 px-4 py-2 border border-[#e63946] text-[#e63946] font-mono text-xs tracking-widest uppercase hover:bg-[#e63946] hover:text-white transition-all duration-200"
          >
            Hunt With Us
          </a>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white/70 hover:text-[#e63946] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
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
            className="fixed inset-0 z-30 bg-[#0d0f14]/98 backdrop-blur-md flex flex-col justify-center items-center gap-8 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="font-display text-4xl text-white/80 hover:text-[#e63946] transition-colors tracking-widest"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#join"
              onClick={(e) => { e.preventDefault(); handleNavClick("#join"); }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.06 }}
              className="mt-4 px-8 py-3 border border-[#e63946] text-[#e63946] font-mono text-sm tracking-widest uppercase hover:bg-[#e63946] hover:text-white transition-all"
            >
              Hunt With Us
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
