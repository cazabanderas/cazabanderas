# Cazabanderas — Design Brainstorm

## Three Design Approaches

<response>
<text>
### Approach A — "Tactical Terminal"
**Design Movement:** Brutalist Hacker / Terminal Noir
**Core Principles:**
1. Raw, command-line aesthetic — monospace type everywhere, scanlines, blinking cursors
2. Extreme contrast: near-black backgrounds with acid-green or phosphor-amber text
3. Information density: data tables, hex codes, and ASCII art as decorative elements
4. Asymmetric, off-grid layouts that feel "leaked" rather than designed

**Color Philosophy:** Deep black (#0a0a0a) base, phosphor green (#00ff41) as primary accent, amber (#ffb800) for warnings/highlights. Colors evoke old CRT monitors — nostalgic yet menacing.

**Layout Paradigm:** Left-heavy asymmetric columns. Content blocks appear as terminal windows with fake titlebars. Sections separated by ASCII dividers.

**Signature Elements:**
- Animated typing cursor in headings
- Fake terminal prompts (e.g., `root@cazabanderas:~$`) before section titles
- Glitch/scanline overlay on hero image

**Interaction Philosophy:** Hover states reveal "decoded" text. Buttons look like CLI commands. Scrolling triggers typewriter animations.

**Animation:** Typewriter text reveals, glitch flicker on hover, scanline sweep on page load.

**Typography System:** `JetBrains Mono` for all text. Size hierarchy via weight and color, not font family switching.
</text>
<probability>0.07</probability>
</response>

<response>
<text>
### Approach B — "Predator Pack" *(SELECTED)*
**Design Movement:** Dark Military Brutalism + Latin Futurism
**Core Principles:**
1. Power through restraint — deep navy/obsidian backgrounds, surgical use of a single fiery accent
2. Asymmetric editorial layouts: large type collides with imagery, not centered grids
3. Latin identity woven in — subtle flag-hunt iconography, bold Spanish/English typographic tension
4. Motion as aggression — elements snap into place, not float gently

**Color Philosophy:** Obsidian `#0d0f14` base. Electric crimson `#e63946` as the sole accent — evoking danger, urgency, and Latin passion. Muted steel `#8892a4` for secondary text. Thin white lines for structure. The palette feels like a classified military briefing.

**Layout Paradigm:** Full-bleed sections with hard diagonal cuts. Hero is split: 60% dark atmospheric imagery, 40% large stacked type. Members grid uses overlapping cards at slight rotations. Stats section uses a horizontal ticker-tape layout.

**Signature Elements:**
- Diagonal slash dividers between sections (CSS clip-path)
- Team member cards with a "classified file" aesthetic — corner tabs, subtle grid paper texture
- A persistent thin red line running down the left edge of the viewport

**Interaction Philosophy:** Hover reveals feel like "unlocking" — borders animate in, text sharpens. CTAs pulse with a heartbeat-like glow.

**Animation:** Framer Motion entrance animations with staggered children. Parallax on hero. Hover: border-draw effect on cards.

**Typography System:** `Bebas Neue` for display headings (condensed, aggressive), `DM Sans` for body (clean, readable). Tight tracking on headings, generous line-height on body.
</text>
<probability>0.09</probability>
</response>

<response>
<text>
### Approach C — "Neon Labyrinth"
**Design Movement:** Cyberpunk Maximalism / Vaporwave Hacker
**Core Principles:**
1. Layered depth — multiple translucent panels, glowing borders, neon gradients
2. Grid-as-structure: visible grid lines as decorative elements (like graph paper)
3. Color overload controlled by strict hierarchy: one neon per semantic meaning
4. Dense information panels that reward exploration

**Color Philosophy:** Near-black base, electric cyan (#00f5ff), hot magenta (#ff006e), and acid yellow (#f7ff00) as a triadic neon palette. Gradients between cyan and magenta for backgrounds. Feels like a hacker's second monitor at 3am.

**Layout Paradigm:** Card-heavy masonry grid. Overlapping z-layers with glassmorphism panels. Sticky sidebar navigation on desktop.

**Signature Elements:**
- Glowing neon border animations on cards
- Hexagonal grid pattern as section backgrounds
- Floating particle system in hero

**Interaction Philosophy:** Everything glows on hover. Parallax depth layers. Cursor leaves a neon trail.

**Animation:** Particle systems, continuous glow pulses, scroll-triggered neon flicker.

**Typography System:** `Orbitron` for headings (futuristic), `Space Mono` for code/data, `Nunito` for body.
</text>
<probability>0.06</probability>
</response>

---

## Selected Approach: **B — "Predator Pack"**

Dark Military Brutalism + Latin Futurism. Obsidian base, electric crimson accent, Bebas Neue + DM Sans typography, diagonal slash dividers, classified-file card aesthetic.
