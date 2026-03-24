# Design System Document

## 1. Overview & Creative North Star
This design system is built to transform complex education consultancy workflows into a high-end, editorial experience. In a field dominated by cluttered spreadsheets and legacy software, we aim for a "Creative North Star" titled **The Academic Atelier**. 

The Academic Atelier moves beyond the "standard SaaS dashboard" by treating data with the reverence of a high-end publication. We achieve this through a deliberate rejection of "boxiness." Instead of containing information within rigid lines, we use expansive white space, intentional asymmetry in the sidebar-to-content ratio, and sophisticated tonal layering. The experience should feel like a premium, tailored service—clean, professional, and intellectually organized.

---

## 2. Colors
Our palette is rooted in institutional trust (`primary: #0058bf`) but elevated by a sophisticated spectrum of grays that provide depth without visual noise.

- **Primary & Actions:** Use `primary` for high-impact actions. Use a subtle gradient transition from `primary` to `primary_container` for hero buttons to add "soul" and a sense of depth that flat fills lack.
- **The "No-Line" Rule:** Designers are strictly prohibited from using 1px solid borders to section off the UI. Boundaries must be defined through background color shifts. For example, a sidebar using `surface_container_low` should sit adjacent to a main content area using `surface` or `surface_container_lowest`. 
- **Surface Hierarchy & Nesting:** Treat the UI as physical layers. 
    - **Base:** `surface` (Background)
    - **Sidebar/Nav:** `surface_container_low`
    - **Main Content Cards:** `surface_container_lowest` (White)
    - **Hover States/Sub-elements:** `surface_container_high`
- **The Glass & Gradient Rule:** For floating menus, tooltips, or elevated overlays, use Glassmorphism. Apply a semi-transparent `surface_container_lowest` with a `backdrop-blur` effect. This allows the sophisticated color shifts of the underlying layers to bleed through, softening the interface.

---

## 3. Typography
We use a dual-font strategy to balance authority with modern readability.

- **Display & Headlines (Manrope):** Chosen for its geometric precision and modern "editorial" feel. Use `display-sm` to `headline-lg` for dashboard titles to command attention.
- **Body & UI Labels (Inter):** The workhorse font. `body-md` (0.875rem) is the standard for data-heavy tables, while `label-sm` is reserved for metadata and secondary headers.
- **Hierarchy of Trust:** By using `manrope` for titles and `inter` for data, we create a visual distinction between the "Brand Voice" and the "User's Data," making the interface feel like a professional tool rather than a generic template.

---

## 4. Elevation & Depth
In this system, depth is a function of light and layering, not structural scaffolding.

- **The Layering Principle:** Avoid shadows for static containers. Achieve hierarchy by stacking: Place a `surface_container_lowest` card atop a `surface_container_low` background. The subtle 2-3% contrast shift is enough for the human eye to perceive depth.
- **Ambient Shadows:** Only use shadows for "active" floating elements (modals, dropdowns). Shadows must be "Ambient": 
    - **Blur:** 24px - 40px
    - **Opacity:** 4%-6% 
    - **Color:** Use a tinted version of `on_surface` rather than pure black to keep the light feeling natural.
- **The "Ghost Border" Fallback:** If accessibility requirements demand a border (e.g., input fields), use `outline_variant` at **20% opacity**. Never use 100% opaque borders.
- **Glassmorphism:** Use for persistent floating elements (like a "Help" fab or a "Total Credits" card). This creates a "Frosted Glass" effect that prevents the UI from feeling "pasted on."

---

## 5. Components

### Sidebar Navigation
The sidebar is the anchor of the consultancy experience. It uses `surface_container_low` as its base.
- **Active State:** Use a `primary_fixed` background with `on_primary_fixed_variant` text.
- **Shape:** Apply `md` (0.375rem) rounding to the hover/active states to mirror the professional but approachable aesthetic.

### Data Tables (The Core)
Education consultancy requires high density. 
- **Styling:** Forbid horizontal and vertical divider lines. Use a `surface_container_low` background for the table header row.
- **Spacing:** Use `spacing.3` for vertical cell padding to maintain "breathing room" despite high data volume.
- **Row Hover:** Shift background to `surface_container_high` on hover to provide a clear focus indicator without borders.

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`). `xl` (0.75rem) horizontal padding.
- **Secondary:** Transparent background with `on_secondary_container` text. Use the "Ghost Border" (20% `outline_variant`) for definition.

### Input Fields
- **Base:** `surface_container_lowest`.
- **Border:** 20% opacity `outline_variant`. On focus, transition the border to 100% `primary` with a 2px "glow" (ambient shadow).

---

## 6. Do's and Don'ts

### Do
- **Do** use `spacing.8` (2rem) or higher for margins between major sections to emphasize the editorial look.
- **Do** use "surface-on-surface" nesting to define information clusters.
- **Do** use high-contrast typography (Weight: Bold for `headline-sm`) to guide the user's eye through dense consultancy forms.
- **Do** ensure all interactive icons have a `primary` color hit on hover to signal agency.

### Don't
- **Don't** use 1px solid `#cccccc` or any high-contrast gray borders.
- **Don't** use "Drop Shadows" with small blur radii (e.g., 2px or 4px); it looks dated and "cheap."
- **Don't** use dividers to separate list items; use white space (`spacing.2`) or subtle tonal shifts instead.
- **Don't** use pure black (`#000000`) for text; use `on_surface` (`#191c1d`) to maintain the "soft-modern" aesthetic.