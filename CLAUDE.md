# CLAUDE.md — ATLAS Master Guide Repository

## Project Overview

This repository hosts the **ATLAS Dental Intelligence System** — a static HTML website serving as a comprehensive guide hub for dental design archetypes. It is a curated directory of 19 dental design profiles ("guides"), each categorized by a tier-based rarity system, with a searchable landing page and WhatsApp integration for case consultation.

**Primary language of the interface:** Turkish
**No build system, no dependencies, no frameworks** — pure HTML/CSS/Vanilla JS.

---

## Repository Structure

```
/
├── index.html                          # Primary landing page (ATLAS HUB v2.0)
├── INDEX_ATLAS_HUB_v2.html            # Alternate hub page (same structure)
├── AIDA_Master_Guide_Full.html        # Individual guide: AIDA (LEGENDARY)
├── ANITA_Master_Guide_Full.html       # Individual guide: ANITA (UNCOMMON)
├── EDWIN_Master_Guide_Full.html       # Individual guide: EDWIN (RARE)
├── FEDERICA_Master_Guide_Full.html    # Individual guide: FEDERICA
├── FOBOS_Amalthea_Guide_Full.html    # Individual guide: FOBOS Amalthea
├── FOBOS_Pallada_Guide_Full.html     # Individual guide: FOBOS Pallada
├── GELLER_Master_Guide_Full.html     # Individual guide: GELLER
├── GLT1_Master_Guide_Full.html       # Individual guide: GLT1
├── GRIN_DESIGN_3_Master_Guide_Full.html  # Individual guide: GRIN DESIGN 3
├── HERMES_Master_Guide_Full.html     # Individual guide: HERMES
├── JAN_HAJTO_F6_Guide_Full.html     # Individual guide: JAN HAJTO F6
├── JAN_HAJTO_M5_Guide_Full.html     # Individual guide: JAN HAJTO M5
├── KATIJA_Master_Guide_Full.html    # Individual guide: KATIJA (MYTHIC)
├── PETRA_Master_Guide_Full.html     # Individual guide: PETRA (LEGENDARY, largest at 2.7MB)
├── RAINBOW_Master_Guide_Full.html   # Individual guide: RAINBOW
├── RHEINE_Master_Guide_Full.html    # Individual guide: RHEINE
├── SERAPHIM_Master_Guide_Full.html  # Individual guide: SERAPHIM (PLATINUM)
├── THALIA_Master_Guide_Full.html    # Individual guide: THALIA
└── WORN_Master_Guide_Full.html      # Individual guide: WORN
```

**Total:** 21 HTML files (~39MB total, mostly image/data content embedded in HTML)

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (Grid, Flexbox, CSS Variables, media queries) |
| Scripting | Vanilla JavaScript (ES5/ES6, no libraries) |
| Fonts | Segoe UI (system font) |
| External dependencies | None |
| Build tools | None |
| Package manager | None |
| Testing framework | None |
| CI/CD | None |

---

## Design System

### Color Palette

- **Background:** `#0f0f0f` / `#121212` / `#0a0a0a`
- **Surface:** `#161616` / `#1a1a1a` / `#1f1f1f`
- **Text:** `#e0e0e0` (primary), `#888` (muted), `#666` (subtle)
- **Accent:** `#00E5FF` (cyan — primary interactive color)
- **Border/divider:** `#333` / `#444`

### Tier Badge System

Each guide is assigned a rarity tier with a corresponding color. These colors are used consistently across tier badges, card borders, headings, and buttons:

| Tier | Color | Hex |
|------|-------|-----|
| LEGENDARY | Gold | `#FFD700` |
| MYTHIC | Purple | `#AA00FF` (approximate) |
| EPIC | Orange/Purple | varies |
| RARE | Steel Blue | `#455A64` |
| UNCOMMON | Green | `#00C853` |
| PLATINUM | White/Silver | `#E0E0E0` (approximate) |

### Responsive Breakpoints

- Mobile: `max-width: 768px`
  - Single-column grid layout
  - Reduced font sizes
  - Stacked header elements

---

## Key JavaScript Functions

### `index.html`

```javascript
filterCards()
// Real-time search filter; compares input against hidden text span in each card.
// Uses toLocaleUpperCase('tr-TR') for correct Turkish character handling (İ/I, Ş, Ğ, etc.)

sendAtlasOrder()
// Reads form fields and constructs a WhatsApp message URL.
// Opens wa.me link in new tab for WhatsApp case consultation.
// Phone number placeholder: 905XXXXXXXXX

window.onload = function()
// Auto-focuses the #search input on page load.
```

### Individual guide pages

```javascript
setMain(src)
// Updates the main display image from a thumbnail click.
// Directly sets document.getElementById('mainImg').src.
```

---

## File Naming Conventions

- Guide files: `[NAME]_Master_Guide_Full.html` or `[NAME]_Guide_Full.html`
- Names are all-caps English identifiers (e.g., `PETRA`, `SERAPHIM`, `JAN_HAJTO_F6`)
- Index page: `index.html` (primary), `INDEX_ATLAS_HUB_v2.html` (secondary)

---

## Card Structure (index.html)

Each guide card in the grid follows this HTML pattern:

```html
<div class="card" onclick="window.open('GUIDE_NAME.html', '_blank')" style="border-top-color: #COLOR;">
    <div class="card-header">
        <span class="tier-badge" style="color:#COLOR; background:rgba(...); border-color:#COLOR">TIER</span>
    </div>
    <h2 style="color:#COLOR">GUIDE NAME</h2>
    <div class="tags-container">
        <span class="tag-label">Etiketler:</span> Tag1, Tag2, Tag3...
    </div>
    <button style="background:rgba(...); color:#COLOR; border:1px solid #COLOR;">İNCELE</button>
    <!-- Hidden search text: -->
    <span style="display:none;">GUIDE NAME Tag1 Tag2 TIER</span>
</div>
```

The hidden `<span>` is what `filterCards()` searches against — it must contain name, all tags, and tier.

---

## Guide Page Structure

Each guide HTML file is self-contained with embedded CSS and follows this general layout:

1. **Header** — Guide name, tier badge, subtitle
2. **Main layout** — Two-column grid (main image + sidebar specs)
3. **Image gallery** — Thumbnail strip with `setMain()` click handler
4. **Specifications section** — Detailed design attributes, ratings, metadata
5. **Tier/rarity info** — Description of the design's tier classification

All styling is inline or in a `<style>` tag within the same file.

---

## Development Conventions

### When adding a new guide

1. Create `GUIDENAME_Master_Guide_Full.html` following the existing guide page structure.
2. Add a new `.card` div to `index.html` (and `INDEX_ATLAS_HUB_v2.html` if keeping them in sync) with:
   - Correct tier color
   - All relevant Turkish tags
   - A hidden `<span>` for search indexing
3. Match the tier badge color exactly to the tier table above.

### When editing styles

- All CSS lives inside `<style>` tags within each HTML file — no external stylesheets.
- Use CSS variables only if the file already uses them (`--tier-color`, `--tier-bg`).
- Maintain the dark theme; do not introduce light backgrounds without explicit instruction.
- Keep the cyan accent (`#00E5FF`) for interactive/focus states on shared components.

### Turkish language support

- Always use `toLocaleUpperCase('tr-TR')` when doing string comparisons involving Turkish text, to avoid `i/İ` mismatch.
- Tags in card `<span>` elements and `tags-container` are in Turkish.

### WhatsApp integration

- The phone number in `sendAtlasOrder()` is intentionally masked (`905XXXXXXXXX`). Do not hardcode a real number unless explicitly instructed.

---

## Git Workflow

- **Primary branch:** `master`
- **Active feature/documentation branches:** `claude/add-claude-documentation-Afr1r`
- Commits have been simple upload-based with messages like "Add files via upload".
- There is no CI/CD pipeline — all deployment is manual.

---

## What This Project Is NOT

- Not a web app with a backend
- Not an npm/Node.js project
- Not a React/Vue/Angular application
- Not using any CSS preprocessors (Sass, Less)
- Not using any templating engines
- Not using TypeScript

Keep solutions minimal and consistent with the existing pure-HTML approach. Do not introduce build tooling, package managers, or JavaScript frameworks unless explicitly requested.
