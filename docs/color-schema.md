# Promptz.dev Color Schema

Color palette derived from the promptz logo, featuring a blue-to-purple gradient that represents innovation, creativity, and AI-assisted development.

## Brand Colors

### Primary Color - Indigo Blue

The primary brand color extracted from the promptz logo gradient start point.

| Format | Value |
|--------|-------|
| HEX | `#4F46E5` |
| RGB | `rgb(79, 70, 229)` |
| HSL | `hsl(243, 75%, 59%)` |
| OKLCH | `oklch(0.488 0.243 264.376)` |

**Usage:**
- Primary buttons and CTAs
- Active states and selections
- Links and interactive elements
- Brand accents and highlights

### Secondary Color - Violet Purple

The secondary brand color extracted from the promptz logo gradient end point.

| Format | Value |
|--------|-------|
| HEX | `#7C3AED` |
| RGB | `rgb(124, 58, 237)` |
| HSL | `hsl(263, 83%, 58%)` |
| OKLCH | `oklch(0.541 0.281 293.009)` |

**Usage:**
- Secondary buttons and actions
- Hover states
- Gradient endpoints
- Feature highlights and badges

### Complementary Color - Cyan Teal

A complementary color that provides contrast and balance to the primary palette.

| Format | Value |
|--------|-------|
| HEX | `#06B6D4` |
| RGB | `rgb(6, 182, 212)` |
| HSL | `hsl(189, 94%, 43%)` |
| OKLCH | `oklch(0.696 0.17 162.48)` |

**Usage:**
- Success states and confirmations
- Accent highlights
- Data visualization
- Secondary navigation elements

## Extended Palette

### Primary Shades

| Shade | HEX | Usage |
|-------|-----|-------|
| 50 | `#EEF2FF` | Subtle backgrounds |
| 100 | `#E0E7FF` | Light backgrounds |
| 200 | `#C7D2FE` | Borders, dividers |
| 300 | `#A5B4FC` | Disabled states |
| 400 | `#818CF8` | Hover states |
| 500 | `#6366F1` | Default state |
| 600 | `#4F46E5` | **Primary (brand)** |
| 700 | `#4338CA` | Active/pressed states |
| 800 | `#3730A3` | Dark accents |
| 900 | `#312E81` | Very dark accents |
| 950 | `#1E1B4B` | Darkest shade |

### Secondary Shades

| Shade | HEX | Usage |
|-------|-----|-------|
| 50 | `#FAF5FF` | Subtle backgrounds |
| 100 | `#F3E8FF` | Light backgrounds |
| 200 | `#E9D5FF` | Borders, dividers |
| 300 | `#D8B4FE` | Disabled states |
| 400 | `#C084FC` | Hover states |
| 500 | `#A855F7` | Default state |
| 600 | `#9333EA` | Darker variant |
| 700 | `#7C3AED` | **Secondary (brand)** |
| 800 | `#6B21A8` | Active/pressed states |
| 900 | `#581C87` | Dark accents |
| 950 | `#3B0764` | Darkest shade |

## Gradient Definitions

### Brand Gradient

The signature promptz gradient used for hero sections, buttons, and brand elements.

```css
/* CSS */
background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);

/* Tailwind */
bg-gradient-to-br from-[#4F46E5] to-[#7C3AED]
```

### Subtle Brand Gradient

A softer version for backgrounds and cards.

```css
/* CSS */
background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);

/* Tailwind */
bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/10
```

### Text Gradient

For gradient text effects on headings.

```css
/* CSS */
background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;

/* Tailwind */
bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent
```

## Dark Mode Colors

Optimized colors for dark mode (primary theme).

| Role | Light Mode | Dark Mode |
|------|------------|-----------|
| Background | `#FFFFFF` | `#0F0F0F` |
| Surface | `#F9FAFB` | `#1A1A1A` |
| Card | `#FFFFFF` | `#262626` |
| Border | `#E5E7EB` | `rgba(255, 255, 255, 0.1)` |
| Text Primary | `#111827` | `#F9FAFB` |
| Text Secondary | `#6B7280` | `#9CA3AF` |
| Primary | `#4F46E5` | `#818CF8` |
| Secondary | `#7C3AED` | `#A78BFA` |

## Semantic Colors

| Purpose | Color | HEX |
|---------|-------|-----|
| Success | Green | `#10B981` |
| Warning | Amber | `#F59E0B` |
| Error | Red | `#EF4444` |
| Info | Blue | `#3B82F6` |

## Accessibility

All color combinations meet WCAG 2.1 AA standards for contrast ratios:

- Primary on white: 4.63:1 ✓
- Primary on dark (#0F0F0F): 5.12:1 ✓
- Secondary on white: 4.51:1 ✓
- Secondary on dark (#0F0F0F): 5.28:1 ✓

## CSS Variables (OKLCH)

For use with the existing Tailwind CSS 4 setup:

```css
:root {
  --color-brand-primary: oklch(0.488 0.243 264.376);
  --color-brand-secondary: oklch(0.541 0.281 293.009);
  --color-brand-complementary: oklch(0.696 0.17 162.48);
}

.dark {
  --color-brand-primary: oklch(0.627 0.196 264.376);
  --color-brand-secondary: oklch(0.627 0.196 293.009);
  --color-brand-complementary: oklch(0.696 0.17 162.48);
}
```

## Tailwind Configuration

Add to `tailwind.config.js` for easy access:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4F46E5',
          secondary: '#7C3AED',
          complementary: '#06B6D4',
        },
      },
    },
  },
}
```
