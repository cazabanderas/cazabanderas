/*
 * CAZABANDERAS Footer
 * Design: Minimal dark footer with social links, quick nav, and team motto
 */

import { Github, Twitter, Globe } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Twitter, label: "Twitter/X", href: "https://twitter.com" },
  { icon: Globe, label: "CTFtime", href: "https://ctftime.org" },
];

export default function Footer() {
  const { t } = useTranslation();
  const navLinks = [
    { label: t('footer.about'), href: '#about' },
    { label: t('footer.team'), href: '#team' },
    { label: t('footer.platforms'), href: '#platforms' },
    { label: t('footer.achievements'), href: '#achievements' },
    { label: t('footer.writeups'), href: '#writeups' },
    { label: t('footer.joinUs'), href: '#join' },
  ];
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
                <div className="font-mono text-[0.6rem] text-[#e63946]/70 tracking-[0.2em] uppercase">{t('footer.flagHunters')}</div>
              </div>
            </div>
            <p className="font-body text-sm text-white/35 leading-relaxed max-w-xs">
              {t('footer.description')}
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
              <div className="font-mono text-[0.65rem] text-[#e63946]/60 tracking-widest uppercase mb-3">{t('footer.contact')}</div>
              <button
                onClick={() => toast(t('footer.contact') + " coming soon!")}
                 className="font-body text-sm text-white/35 hover:text-white/70 transition-colors"
              >
                {t('footer.contact')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-[0.6rem] text-white/20 tracking-widest">
            {t('footer.copyright')}
          </div>
          <div className="font-mono text-[0.6rem] text-[#e63946]/40 tracking-widest italic">
            "{t('footer.motto')}"
          </div>
        </div>
      </div>
    </footer>
  );
}
