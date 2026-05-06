# DESIGN.md — ddrscott.site

A plain-text design system document that AI agents read to generate consistent UI.
Personal tech blog ("Why, Scott, WHY?!?") built on MkDocs Material. Light theme. Minimal customization over Material Design defaults.

---

## 1. Visual Theme & Atmosphere

**Mood:** A clean, approachable tech blog. Material Design foundations with blue-grey professionalism and orange warmth. The design stays out of the way — content is king. No custom CSS overrides; this is Material theme defaults with a curated color scheme.

**Design philosophy:**
- Content-first — the theme serves the writing, not the other way around
- Material Design standards throughout (Roboto, 8px grid, elevation shadows)
- Blue-grey primary (corporate but not cold) + orange accent (warmth, clickability)
- No custom CSS — all styling through MkDocs Material theme configuration
- Supports Mermaid diagrams, syntax highlighting, admonitions, and emoji

---

## 2. Color Palette & Roles

### Primary (Blue Grey — Material Design)
| Shade | Hex | Role |
|-------|-----|------|
| 50 | `#eceff1` | Lightest tint |
| 100 | `#cfd8dc` | Light background |
| 200 | `#b0bec5` | Subtle surfaces |
| 300 | `#90a4ae` | Secondary text |
| 400 | `#78909c` | Medium emphasis |
| 500 | `#607d8b` | **Primary — navigation, header** |
| 600 | `#546e7a` | Hover states |
| 700 | `#455a64` | Active states |
| 800 | `#37474f` | Dark surfaces |
| 900 | `#263238` | Darkest shade |

### Accent (Orange — Material Design)
| Shade | Hex | Role |
|-------|-----|------|
| 50 | `#fff3e0` | Lightest tint |
| 200 | `#ffcc80` | Light accent |
| 500 | `#ff9800` | **Accent — interactive elements, links** |
| 700 | `#f57c00` | Hover accent |
| 900 | `#e65100` | Darkest accent |

### Neutral
| Color | Value | Role |
|-------|-------|------|
| Background | `#ffffff` | Page background |
| Text | `rgba(0, 0, 0, 0.87)` | Primary text (87% black) |
| Code BG | `#f5f5f5` | Code block background |
| Code Text | `#37474f` | Code text color |
| Border | `#e0e0e0` | Table borders, dividers |

### CSS Custom Properties
```css
--md-primary-fg-color: white;
--md-primary-bg-color: #607d8b;
--md-accent-fg-color: white;
--md-accent-bg-color: #ff9800;
--md-default-bg-color: white;
--md-default-fg-color: rgba(0, 0, 0, 0.87);
--md-code-bg-color: #f5f5f5;
--md-code-fg-color: #37474f;
```

---

## 3. Typography Rules

### Font Families
```
Body:  'Roboto', Helvetica, Arial, sans-serif
Code:  'Roboto Mono', 'Courier New', monospace
Icons: Material Design Icons, FontAwesome Brands
Emoji: Twemoji
```

### Type Scale
| Level | Size | Weight | Line Height | Use |
|-------|------|--------|-------------|-----|
| H1 | 2rem (32px) | 300 | 1.2 | Page titles |
| H2 | 1.5rem (24px) | 300 | 1.2 | Sections |
| H3 | 1.25rem (20px) | 400 | 1.2 | Subsections |
| H4 | 1.125rem (18px) | 400 | 1.2 | Minor headers |
| H5 | 1rem (16px) | 400 | 1.2 | Small headers |
| H6 | 0.875rem (14px) | 400 | 1.2 | Smallest headers |
| Body | 0.875rem (14px) | 400 | 1.6 | Paragraphs |
| Code | 0.85em | 400 | 1.4 | Code blocks, inline code |

### Font Weights
| Weight | Use |
|--------|-----|
| 300 | H1, H2 (light) |
| 400 | Body, most text |
| 500 | Medium emphasis |
| 700 | Bold, strong emphasis |

---

## 4. Component Stylings

### Navigation Header
- Height: 64px (desktop), 56px (mobile)
- Background: `--md-primary-bg-color` (#607d8b)
- Text: white
- Full-width, sticky

### Buttons
- Height: 36px
- Padding: 8px 16px
- Min-width: 64px
- Text: UPPERCASE
- Default bg: #f5f5f5
- Primary bg: #607d8b
- Accent bg: #ff9800
- Border-radius: 2px
- Interaction: Material ripple effect

### Cards
- Background: white
- Padding: 16px
- Border-radius: 2px
- Box-shadow: `0 2px 1px -1px rgba(0,0,0,0.2)` (elevation 1)

### Code Blocks
- Background: #f5f5f5
- Font: Roboto Mono
- Padding: 16px
- Border-radius: 2px
- Line-height: 1.4

### Tables
- Border-collapse: collapse
- Cell padding: 12px
- Row hover: #f5f5f5
- Border: 1px solid #e0e0e0

### Text Inputs
- Height: 40px
- Padding: 12px 16px
- Focus: 2px bottom border in primary color

---

## 5. Layout Principles

### Spacing (8px Grid)
| Size | Value | Use |
|------|-------|-----|
| XS | 4px | Tight spacing |
| SM | 8px | Base unit |
| MD | 16px | Standard padding, margins |
| LG | 24px | Content padding |
| XL | 32px | Section spacing |
| XXL | 64px | Large section breaks |

### Content Structure
- Gutter: 16px left/right
- Content padding: 24px
- Header height: 64px (desktop), 56px (mobile)
- Footer height: 64px

---

## 6. Depth & Elevation

### Material Design Shadow System
| Level | Shadow | Use |
|-------|--------|-----|
| 0 | none | Flat elements |
| 1 | `0 2px 1px -1px rgba(0,0,0,0.2)` | Cards, resting |
| 2 | `0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14)` | Raised |
| 4 | `0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14)` | Floating |

### Border Radius
- Standard: 2px (Material default)
- Circular: 50% (FABs, avatars)

---

## 7. Do's and Don'ts

### Do
- Follow Material Design conventions
- Use Roboto for text, Roboto Mono for code
- Use the blue-grey/orange color scheme
- Use elevation (shadows) for surface hierarchy
- Use admonitions for callouts (note, tip, warning, danger)
- Use Mermaid for diagrams
- Keep content as the primary focus

### Don't
- Add custom CSS overrides — work within Material theme config
- Use colors outside the blue-grey + orange palette
- Override the MkDocs navigation structure
- Use border-radius larger than 2px (Material standard)
- Add decorative elements — the blog is about the writing
- Use custom fonts — stick with Roboto family

---

## 8. Responsive Behavior

### Breakpoints (Material Design)
| Name | Width | Key changes |
|------|-------|-------------|
| XS | 0-575px | Single column, compact nav |
| SM | 576-767px | Slightly wider |
| MD | 768-1023px | Sidebar appears |
| LG | 1024-1279px | Full sidebar + content |
| XL | 1280px+ | Maximum width reached |

### Mobile Adaptations
- Header: 56px (from 64px)
- Navigation: hamburger menu replaces sidebar
- Content fills full width
- Tables: horizontal scroll
- Code blocks: horizontal scroll with reduced padding

---

## 9. Agent Prompt Guide

### Quick Color Reference
```
Blue-Grey:   #607d8b (primary — header, nav)
Orange:      #ff9800 (accent — links, interactive)
Background:  #ffffff (white)
Text:        rgba(0,0,0,0.87) (charcoal)
Code BG:     #f5f5f5 (light gray)
Code Text:   #37474f (dark blue-grey)
Border:      #e0e0e0 (light gray)
```

### Ready-to-Use Prompts

**"Add a new blog post page"**
> MkDocs Material theme. Roboto font, 14px body, line-height 1.6. Blue-grey #607d8b header. Orange #ff9800 for links. White background. Code blocks in Roboto Mono on #f5f5f5. Use admonitions for callouts, Mermaid for diagrams. Keep it clean and content-focused.

**"Build a custom component within MkDocs"**
> Material Design standards: 2px border-radius, 8px grid spacing, elevation shadows for depth. Blue-grey primary, orange accent. Roboto and Roboto Mono fonts. Buttons are uppercase, 36px height, ripple effect. Cards: white bg, elevation 1 shadow, 16px padding.

**"Style a data visualization or diagram"**
> Use Mermaid syntax for diagrams. For custom charts: blue-grey (#607d8b) for primary data, orange (#ff9800) for highlights/accents. White background, #f5f5f5 for chart area. Roboto Mono for labels and data values. 12px padding in cells.

---

## MkDocs Configuration

```yaml
theme:
  name: material
  palette:
    primary: blue grey
    accent: orange
  font:
    text: Roboto
    code: Roboto Mono

markdown_extensions:
  - admonition
  - pymdownx.emoji (twemoji)
  - pymdownx.highlight
  - pymdownx.superfences (mermaid)
  - tables
  - footnotes
```
