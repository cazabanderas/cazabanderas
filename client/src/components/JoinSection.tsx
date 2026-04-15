/*
 * CAZABANDERAS Join Section
 * Design: Full-width dark section with application form aesthetic,
 * requirements checklist, and prominent CTA
 */

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { CheckCircle, ChevronRight, Send } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const FLAG_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663561350743/fQrwPhmvRnJkdAC8zKsvoi/cazabanderas-flag-YbDzazFjmoW5saUm2YHhyG.webp";

const requirements = [
  "Passion for cybersecurity and ethical hacking",
  "Active participation in CTF competitions",
  "Willingness to learn and share knowledge",
  "Proficiency in at least one CTF category",
  "Collaborative mindset — the pack hunts together",
  "Basic English or Spanish communication skills",
];

const categories = [
  "Web Exploitation",
  "Binary Exploitation",
  "Reverse Engineering",
  "Cryptography",
  "Forensics & OSINT",
  "Malware Analysis",
  "Network Security",
  "Steganography",
];

export default function JoinSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [handle, setHandle] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) {
      toast.error(t('join.form.errors.handleRequired'));
      return;
    }
    setSubmitted(true);
    toast.success(t('join.form.success.title'), {
      description: t('join.form.success.description'),
    });
  };

  return (
    <section id="join" className="relative py-24 bg-[#0d0f14]">
      {/* Top diagonal */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-[#111318]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 0)" }} />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Info */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-[2px] bg-[#e63946]" />
              <span className="section-label">{t('join.label')}</span>
            </div>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white tracking-wider mb-6">
              {t('join.title')}<br />
              <span className="text-[#e63946]">{t('join.subtitle')}</span>
            </h2>
            <p className="font-body text-base text-white/55 leading-relaxed mb-8">
              {t('join.description')}
            </p>

            {/* Flag image */}
            <div className="relative mb-8 overflow-hidden">
              <img
                src={FLAG_IMG}
                alt="Digital CTF flag"
                className="w-full max-w-xs aspect-square object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14] to-transparent max-w-xs" />
            </div>

            {/* Requirements */}
            <div>
              <h3 className="font-display text-xl text-white tracking-wider mb-4">{t('join.whatWeLookFor')}</h3>
              <ul className="space-y-3">
                {requirements.map((req) => (
                  <li key={req} className="flex items-start gap-3">
                    <CheckCircle size={14} className="text-[#e63946] mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-white/55">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="card-classified p-8">
              {/* Form header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div>
                  <div className="font-mono text-[0.6rem] text-[#e63946]/60 tracking-widest uppercase mb-1">{t('join.form.title')}</div>
                  <div className="font-display text-2xl text-white tracking-wider">{t('join.form.subtitle')}</div>
                </div>
                <div className="font-mono text-[0.6rem] text-white/15 tracking-widest">FORM-001</div>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 border-2 border-[#e63946] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} className="text-[#e63946]" />
                  </div>
                  <h3 className="font-display text-2xl text-white tracking-wider mb-2">{t('join.form.success.received')}</h3>
                  <p className="font-body text-sm text-white/45">{t('join.form.success.followUp')}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Handle */}
                  <div>
                    <label className="font-mono text-[0.65rem] text-white/40 tracking-widest uppercase block mb-2">
                      {t('join.form.handle')}
                    </label>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder={t('join.form.handlePlaceholder')}
                      className="w-full bg-[#0d0f14] border border-white/10 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#e63946]/50 transition-colors"
                    />
                  </div>

                  {/* Specialty */}
                  <div>
                    <label className="font-mono text-[0.65rem] text-white/40 tracking-widest uppercase block mb-2">
                      {t('join.form.specialty')}
                    </label>
                    <select
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full bg-[#0d0f14] border border-white/10 px-4 py-3 font-mono text-sm text-white/70 focus:outline-none focus:border-[#e63946]/50 transition-colors appearance-none"
                    >
                      <option value="" className="bg-[#0d0f14]">{t('join.form.selectSpecialty')}</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-[#0d0f14]">{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* HTB/THM profile */}
                  <div>
                    <label className="font-mono text-[0.65rem] text-white/40 tracking-widest uppercase block mb-2">
                      {t('join.form.profileUrl')}
                    </label>
                    <input
                      type="url"
                      placeholder={t('join.form.profileUrlPlaceholder')}
                      className="w-full bg-[#0d0f14] border border-white/10 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#e63946]/50 transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="font-mono text-[0.65rem] text-white/40 tracking-widest uppercase block mb-2">
                      {t('join.form.about')}
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder={t('join.form.aboutPlaceholder')}
                      className="w-full bg-[#0d0f14] border border-white/10 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#e63946]/50 transition-colors resize-none"
                    />
                  </div>

                  {/* Discord */}
                  <div>
                    <label className="font-mono text-[0.65rem] text-white/40 tracking-widest uppercase block mb-2">
                      {t('join.form.discord')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('join.form.discordPlaceholder')}
                      className="w-full bg-[#0d0f14] border border-white/10 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#e63946]/50 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 py-4 bg-[#e63946] text-white font-mono text-sm tracking-widest uppercase hover:bg-[#c1121f] transition-all duration-200 glow-crimson group"
                  >
                    {t('join.form.submit')}
                    <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="font-mono text-[0.6rem] text-white/20 text-center tracking-widest">
                    {t('join.form.reviewTime')}
                  </p>
                </form>
              )}
            </div>

            {/* Discord CTA */}
            <div className="mt-5 p-4 border border-white/5 flex items-center justify-between">
              <div>
                <div className="font-mono text-[0.6rem] text-white/30 tracking-widest uppercase mb-1">{t('join.preferDirect')}</div>
                <div className="font-body text-sm text-white/55">{t('join.joinDiscord')}</div>
              </div>
              <button
                onClick={() => toast(t('join.discordComingSoon'))}
                className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white/40 font-mono text-xs tracking-widest uppercase hover:border-[#e63946]/40 hover:text-[#e63946] transition-all"
              >
                Discord <ChevronRight size={12} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
