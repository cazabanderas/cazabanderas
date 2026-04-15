/*
 * CAZABANDERAS Footer
 * Design: Minimal dark footer with social links, quick nav, and team motto
 */

import { Github, Twitter, Globe } from "lucide-react";
import { toast } from "sonner";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Platforms", href: "#platforms" },
  { label: "Achievements", href: "#achievements" },
  { label: "Write-ups", href: "#writeups" },
  { label: "Join Us", href: "#join" },
];

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Twitter, label: "Twitter/X", href: "https://twitter.com" },
  { icon: Globe, label: "CTFtime", href: "https://ctftime.org" },
];

export default function Footer() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#090b0f] border-t border-white/5">
      <div className="container py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 border-2 border-[#e63946] flex items-center justify-center">
                <span className="text-[#e63946] font-mono text-xs font-bold">CB</span>
              </div>
              <div>
                <div className="font-display text-white text-xl leading-none tracking-widest">CAZABANDERAS</div>
                <div className="font-mono text-[0.6rem] text-[#e63946]/70 tracking-[0.2em] uppercase">Flag Hunters</div>
              </div>
            </div>
            <p className="font-body text-sm text-white/35 leading-relaxed max-w-xs">
              Elite Latin American CTF team. We hunt together, learn together, and conquer challenges as a united front.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-4 mt-6">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/25 hover:text-[#e63946] transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="font-mono text-[0.65rem] text-[#e63946]/60 tracking-widest uppercase mb-4">Navigation</div>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className="font-body text-sm text-white/35 hover:text-white/70 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platforms */}
          <div>
            <div className="font-mono text-[0.65rem] text-[#e63946]/60 tracking-widest uppercase mb-4">Platforms</div>
            <ul className="space-y-2">
              {[
                { name: "HackTheBox", url: "https://hackthebox.com" },
                { name: "TryHackMe", url: "https://tryhackme.com" },
                { name: "HackingClub", url: "https://hackingclub.com" },
                { name: "CTFtime", url: "https://ctftime.org" },
              ].map((p) => (
                <li key={p.name}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-white/35 hover:text-white/70 transition-colors"
                  >
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <div className="font-mono text-[0.65rem] text-[#e63946]/60 tracking-widest uppercase mb-3">Contact</div>
              <button
                onClick={() => toast("Contact info coming soon!")}
                className="font-body text-sm text-white/35 hover:text-[#e63946] transition-colors"
              >
                contact@cazabanderas.team
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-[0.6rem] text-white/20 tracking-widest">
            © 2024 CAZABANDERAS — ALL FLAGS RESERVED
          </div>
          <div className="font-mono text-[0.6rem] text-[#e63946]/40 tracking-widest italic">
            "We hunt together, learn together, conquer together."
          </div>
        </div>
      </div>
    </footer>
  );
}
