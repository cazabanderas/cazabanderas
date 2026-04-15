/*
 * CAZABANDERAS Skills Ticker
 * Design: Horizontal scrolling ticker strip with CTF skill categories
 * Separates Hero from About with a crimson accent band
 */

const skills = [
  "Web Exploitation",
  "Binary Exploitation",
  "Reverse Engineering",
  "Cryptography",
  "Forensics",
  "OSINT",
  "Malware Analysis",
  "Network Security",
  "Steganography",
  "Pwn",
  "Misc",
  "Cloud Security",
];

export default function SkillsTicker() {
  const doubled = [...skills, ...skills];

  return (
    <div className="relative overflow-hidden bg-[#e63946] py-3 border-y border-[#c1121f]">
      <div className="ticker-track">
        {doubled.map((skill, i) => (
          <span key={i} className="flex items-center gap-4 px-6">
            <span className="font-mono text-xs text-white/90 tracking-widest uppercase whitespace-nowrap">
              {skill}
            </span>
            <span className="text-white/40 text-xs">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
