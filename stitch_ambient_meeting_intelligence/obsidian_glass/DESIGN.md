# Design System Strategy: The Ethereal Observer

## 1. Overview & Creative North Star
This design system is built upon the "Creative North Star" of **The Ethereal Observer**. In the context of an AI Meeting Intelligence System, the UI must feel like a silent, sophisticated partner—present but never intrusive. 

We are moving away from the "boxy" nature of standard SaaS dashboards. To achieve a high-end editorial feel, we utilize **intentional asymmetry** and **tonal depth**. The layout should feel like a series of layered glass sheets floating in a deep, atmospheric void. We prioritize "passive-first" UX, where information is whispered through typography and color rather than shouted through heavy borders and loud alerts.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the deep obsidian of the `surface` (#0e0e10), punctuated by the "electric intelligence" of our Blue-to-Purple gradients.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to define sections or containers. Visual boundaries must be achieved through:
1.  **Tonal Shifts:** Placing a `surface-container-low` element against a `surface` background.
2.  **Negative Space:** Using the spacing scale to create distinct groupings.
3.  **Soft Transitions:** Subtle background gradients that define an area's edge without a hard stroke.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack. The deeper the information, the darker the container; the more "active" or "modal" the information, the higher and lighter the container.
*   **Base Layer:** `surface` (#0e0e10) - The infinite canvas.
*   **Sectioning:** `surface-container-low` (#131315) - Large layout blocks.
*   **Content Cards:** `surface-container` (#19191c) - The primary home for data.
*   **Interactive/Hover:** `surface-container-high` (#1f1f22) - Feedback for user engagement.

### The Glass & Gradient Rule
Main CTAs and high-intelligence AI insights should utilize the signature gradient: **#4F46E5 (Blue) to #7C3AED (Purple)**. For floating panels (Command Palettes, Tooltips), use Glassmorphism:
*   **Background:** `surface-variant` at 60% opacity.
*   **Effect:** `backdrop-filter: blur(20px)`.
*   **Result:** This allows the "soul" of the underlying data to bleed through, creating a sense of integration.

---

## 3. Typography: Editorial Clarity
We use **Inter** exclusively. It is a workhorse that, when scaled correctly, feels like a premium typeface.

*   **Display (lg/md):** Reserved for "Momentum" states—meeting summaries or high-level AI conclusions. Use tight letter-spacing (-0.02em) to give it an authoritative, editorial feel.
*   **Headline (sm/md):** Used for section headers. Ensure `on-surface` color is used for maximum contrast.
*   **Body (md):** The primary reading weight. Use `on-surface-variant` for secondary body text to reduce visual noise.
*   **Labels (sm/md):** All-caps with increased letter-spacing (+0.05em) for metadata and timestamps, acting as a "tag" rather than prose.

---

## 4. Elevation & Depth
Depth in this system is a result of light and physics, not CSS properties.

### The Layering Principle
Do not use shadows for static layout elements. Instead, stack your surface tiers. A `surface-container-highest` card sitting on a `surface-container-low` background creates a natural "lift" that feels modern and architectural.

### Ambient Shadows
For elements that truly float (Modals, Context Menus), use **Ambient Shadows**:
*   **Blur:** 40px to 60px.
*   **Opacity:** 4% - 8%.
*   **Color:** Tint the shadow with `primary-dim` (#645efb) rather than pure black to simulate the glow of the screen.

### The "Ghost Border" Fallback
If an element lacks contrast (e.g., a dark image on a dark background), use a **Ghost Border**:
*   **Stroke:** 1px.
*   **Color:** `outline-variant` at 15% opacity.
*   **Requirement:** It must be barely perceptible—a suggestion of an edge, not a definition of one.

---

## 5. Components

### Buttons
*   **Primary:** Blue-to-Purple gradient background with `on-primary-fixed` (Black) text for maximum "pop." 12px (`md`) or 16px (`lg`) rounded corners.
*   **Secondary:** `surface-container-highest` with a `Ghost Border`. No background color shift on hover, only a slight increase in border opacity.
*   **Tertiary:** Ghost button (text only) using `primary` (#a7a5ff) color.

### Input Fields & Search (Raycast Style)
*   **Style:** No background fill when inactive. A simple `Ghost Border` that transitions to a `primary` glow on focus.
*   **Interaction:** Focus state should trigger a subtle `backdrop-blur` on the input container to "isolate" the typing experience.

### Cards & Lists (Passive Intelligence)
*   **No Dividers:** Prohibit the use of 1px lines between list items. Use 8px of vertical padding and a `surface-container-high` background on hover to indicate selection.
*   **AI Insights:** Use `secondary-container` (#6001d1) for "AI-generated" cards to subtly distinguish them from human-generated data.

### Progress & Real-time Data
*   **The Pulse:** For real-time meeting transcription, use a "soft pulse" animation on a `primary` dot rather than a standard loading spinner.

---

## 6. Do’s and Don'ts

### Do
*   **Do** use asymmetrical layouts. A wide left column for transcripts and a narrow, floating right-hand "Glass" panel for AI insights.
*   **Do** use `body-sm` for "meta" information (timestamps, speaker names) in `on-surface-variant`.
*   **Do** prioritize the "Z-axis." Think about which elements are closest to the user and make them the "glassiest."

### Don’t
*   **Don’t** use pure white (#FFFFFF). Use `on-surface` (#f9f5f8) to avoid eye strain in dark mode.
*   **Don’t** use standard "Drop Shadows." If it looks like a 2010 Photoshop effect, it is wrong.
*   **Don’t** use more than one gradient on a single screen. The gradient is a signature; overusing it dilutes its "premium" status.
*   **Don’t** use sharp 90-degree corners. Everything must feel approachable and organic (12px-24px radius).