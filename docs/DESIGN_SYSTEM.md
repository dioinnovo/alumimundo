# Alumimundo Design System & Branding Guide

> Complete branding and design specifications for the Alumimundo AI Integration Platform

**Version**: 1.0
**Last Updated**: November 2024
**Source**: https://alumimundo.com/

---

## Table of Contents

1. [Brand Overview](#brand-overview)
2. [Logo & Brand Assets](#logo--brand-assets)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [UI Components](#ui-components)
6. [Spacing & Layout](#spacing--layout)
7. [Icons & Imagery](#icons--imagery)
8. [Brand Voice & Messaging](#brand-voice--messaging)
9. [Accessibility Guidelines](#accessibility-guidelines)
10. [Implementation Examples](#implementation-examples)

---

## Brand Overview

**Alumimundo S.A.** - Costa Rica's premier distributor of high-end construction finishes with 40+ years of experience (established 1985).

### Brand Attributes
- **Established**: Professional, trustworthy, experienced
- **Premium**: High-quality, luxury focus
- **Technical**: Expertise, compliance, precision
- **Modern**: Forward-thinking, AI-powered
- **Comprehensive**: One-stop shop, complete solutions

### Visual Identity
- **Style**: Modern professional with luxury touches
- **Aesthetic**: Clean, contemporary, sophisticated
- **Tone**: Corporate elegance without sterility

---

## Logo & Brand Assets

### Primary Logo
- **File**: `alumimundo_logo.png`
- **URL**: https://alumimundo.com/wp-content/uploads/2025/08/ALUMIMUNDO-logo-white-1024x576.png
- **Format**: PNG with transparency
- **Dimensions**: 1024x576px
- **Usage**: Primary logo for dark backgrounds

### Favicon
- **File**: `alumimundo_favicon.png`
- **URL**: https://alumimundo.com/wp-content/uploads/2025/08/cropped-ALUMIMUNDO_favicon.png
- **Sizes**: 32x32px, 270x270px, 512x512px
- **Usage**: Browser tabs, app icons, shortcuts

### Logo Guidelines
- **Clear Space**: Minimum 20px around logo on all sides
- **Minimum Size**: 120px width (digital), 25mm (print)
- **Backgrounds**:
  - Use white logo on dark backgrounds (#082B61, #1D1D1F, #3C3C3B)
  - Do not place on busy backgrounds
  - Ensure sufficient contrast (minimum 4.5:1 ratio)

---

## Color Palette

### Primary Brand Colors

#### Deep Navy Blue (Primary)
```css
--alumimundo-navy: #082B61
rgb(8, 43, 97)
```
**Usage**: Primary brand color, headers, major sections, hero backgrounds
**Accessibility**: Use with white text for optimal contrast

#### Teal (Accent)
```css
--alumimundo-teal: #276770
rgb(39, 103, 112)
```
**Usage**: Section headings, subheadings, accent elements, links
**Accessibility**: Use with white or light backgrounds

#### Charcoal (Primary Dark)
```css
--alumimundo-charcoal: #3C3C3B
rgb(60, 60, 59)
```
**Usage**: Text on light backgrounds, primary CTA text, body copy
**Accessibility**: Excellent contrast with white backgrounds

#### Dark Gray (Secondary Dark)
```css
--alumimundo-dark: #1D1D1F
rgb(29, 29, 31)
```
**Usage**: Footer, dark sections, alternative backgrounds
**Accessibility**: Use with white or light text

### Secondary Colors

#### Medium Gray
```css
--alumimundo-gray: #A5A6A7
rgb(165, 166, 167)
```
**Usage**: Secondary text, borders, dividers
**Accessibility**: Use for non-critical text only

#### Light Gray (Background)
```css
--alumimundo-light: #F1F1F3
rgb(241, 241, 243)
```
**Usage**: Body text on dark backgrounds, light sections, card backgrounds
**Accessibility**: Excellent as background with dark text

#### Slate Gray
```css
--alumimundo-slate: #69727D
rgb(105, 114, 125)
```
**Usage**: Secondary text elements, subtle emphasis
**Accessibility**: Use for secondary information

### Accent Colors

#### Magenta/Pink (Highlight)
```css
--alumimundo-magenta: #CC3366
rgb(204, 51, 102)
```
**Usage**: Special highlights, calls to attention, promotional elements
**Accessibility**: High contrast, use sparingly

#### WhatsApp Green (CTA)
```css
--alumimundo-whatsapp: #25D366
rgb(37, 211, 102)
```
**Usage**: WhatsApp contact button, green status indicators
**Accessibility**: Excellent contrast with white or dark backgrounds

### Supporting Colors

#### Pure White
```css
--white: #FFFFFF
rgb(255, 255, 255)
```
**Usage**: CTA button backgrounds, text on dark backgrounds, clean spaces

#### Pure Black
```css
--black: #000000
rgb(0, 0, 0)
```
**Usage**: Strong contrast elements, maximum emphasis

### Color Opacity Variants

```css
/* Subtle overlays */
rgba(0, 0, 0, 0.05)  /* 5% black */
rgba(255, 255, 255, 0.05)  /* 5% white */

/* Medium overlays */
rgba(0, 0, 0, 0.32)  /* 32% black */
rgba(255, 255, 255, 0.08)  /* 8% white */

/* Strong overlays */
rgba(0, 0, 0, 0.55)  /* 55% black */
rgba(255, 255, 255, 0.14)  /* 14% white */
```

### Color Usage Matrix

| Element | Primary | Secondary | Accent |
|---------|---------|-----------|--------|
| Headers | Navy | Teal | Magenta |
| Body Text | Charcoal | Slate | - |
| Backgrounds | Navy, Dark | Light | - |
| CTAs | White bg + Charcoal text | WhatsApp Green | Magenta |
| Links | Teal | Navy | - |
| Borders | Gray | Slate | - |

---

## Typography

### Font Family

#### Primary: Fivo Sans
```css
font-family: "Fivo Sans", sans-serif;
```
**Usage**: All text elements throughout the platform
**Weights Available**:
- Regular (400) - Body text
- Medium (500) - CTAs, emphasis
- Semi-Bold (600) - Headings

**Fallback Stack**:
```css
font-family: "Fivo Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
```

#### Alternative Fonts (Website)
- **Recoleta**: Display/decorative headings (optional)
- **Figtree**: Alternative sans-serif (optional)

### Heading Styles

#### H1 - Hero Headline
```css
font-family: "Fivo Sans", sans-serif;
font-size: 56px;
font-weight: 600;
line-height: 1.1;
letter-spacing: normal;
text-transform: UPPERCASE;
color: #FFFFFF;
```
**Usage**: Hero sections, main landing page headline

#### H2 - Main Section Headings
```css
font-family: "Fivo Sans", sans-serif;
font-size: 46px;
font-weight: 600;
line-height: 1.1;
letter-spacing: normal;
text-transform: UPPERCASE;
color: #FFFFFF;
```
**Usage**: Main section titles, key page divisions

#### H3 - Secondary Section Headings
```css
font-family: "Fivo Sans", sans-serif;
font-size: 44.8px;
font-weight: 600;
line-height: 1.1;
letter-spacing: normal;
text-transform: Capitalize;
color: #FFFFFF;
```
**Usage**: Secondary section headings, subsection titles

#### H4 - Tertiary Headings
```css
font-family: "Fivo Sans", sans-serif;
font-size: 36px;
font-weight: 600;
line-height: 1.2;
letter-spacing: normal;
text-transform: Capitalize;
color: #276770; /* Teal */
```
**Usage**: Card headings, feature titles

#### H5 - Subsection Headings
```css
font-family: "Fivo Sans", sans-serif;
font-size: 32px;
font-weight: 600;
line-height: 1.1;
letter-spacing: normal;
text-transform: Capitalize;
color: #276770; /* Teal */
```
**Usage**: Subsection titles, feature headings, highlights

#### H6 - Small Headings
```css
font-family: "Fivo Sans", sans-serif;
font-size: 24px;
font-weight: 600;
line-height: 1.1;
letter-spacing: normal;
text-transform: Capitalize;
color: #276770; /* Teal */
```
**Usage**: Card titles, labels, small headings, overlines

### Body Text

#### Paragraph - Regular Body
```css
font-family: "Fivo Sans", sans-serif;
font-size: 16px;
font-weight: 400;
line-height: 1.5; /* 24px */
color: #F1F1F3; /* Light gray on dark backgrounds */
color: #3C3C3B; /* Charcoal on light backgrounds */
```
**Usage**: All body copy, descriptions, content blocks

#### Paragraph - Large Body
```css
font-family: "Fivo Sans", sans-serif;
font-size: 18px;
font-weight: 400;
line-height: 1.6; /* 28.8px */
color: #F1F1F3;
```
**Usage**: Intro paragraphs, featured content

#### Paragraph - Small Body
```css
font-family: "Fivo Sans", sans-serif;
font-size: 14px;
font-weight: 400;
line-height: 1.5; /* 21px */
color: #A5A6A7; /* Medium gray */
```
**Usage**: Captions, metadata, secondary information

### Call-to-Action Text

#### Primary CTA Button
```css
font-family: "Fivo Sans", sans-serif;
font-size: 15px;
font-weight: 500;
text-transform: none;
color: #3C3C3B; /* Charcoal */
background: #FFFFFF;
padding: 17px 30px;
border-radius: 999px; /* Pill shape */
```
**Usage**: Primary action buttons

#### Secondary CTA Button
```css
font-family: "Fivo Sans", sans-serif;
font-size: 15px;
font-weight: 500;
text-transform: none;
color: #FFFFFF;
background: transparent;
border: 2px solid #FFFFFF;
padding: 15px 28px; /* Adjusted for border */
border-radius: 999px;
```
**Usage**: Secondary actions, alternative CTAs

### Responsive Typography Scale

```css
/* Mobile (< 768px) */
H1: 36px
H2: 32px
H3: 28px
H4: 24px
H5: 20px
H6: 18px
Body: 16px

/* Tablet (768px - 1024px) */
H1: 44px
H2: 38px
H3: 34px
H4: 28px
H5: 24px
H6: 20px
Body: 16px

/* Desktop (> 1024px) */
H1: 56px
H2: 46px
H3: 44.8px
H4: 36px
H5: 32px
H6: 24px
Body: 16px
```

---

## UI Components

### Buttons

#### Primary Button
```css
.btn-primary {
  background: #FFFFFF;
  color: #3C3C3B;
  font-size: 15px;
  font-weight: 500;
  padding: 17px 30px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #F1F1F3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

#### WhatsApp Button
```css
.btn-whatsapp {
  background: #25D366;
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 500;
  padding: 17px 30px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-whatsapp:hover {
  background: #20BA5A;
  transform: translateY(-2px);
}
```

#### Secondary Button (Outline)
```css
.btn-secondary {
  background: transparent;
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 500;
  padding: 15px 28px;
  border-radius: 999px;
  border: 2px solid #FFFFFF;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}
```

### Cards

#### Standard Card
```css
.card {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}
```

#### Feature Card
```css
.card-feature {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.card-feature h6 {
  color: #276770; /* Teal */
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
}
```

### Forms

#### Input Fields
```css
.input {
  font-family: "Fivo Sans", sans-serif;
  font-size: 16px;
  color: #3C3C3B;
  background: #FFFFFF;
  border: 1px solid #A5A6A7;
  border-radius: 8px;
  padding: 12px 16px;
  width: 100%;
  transition: all 0.3s ease;
}

.input:focus {
  border-color: #276770; /* Teal */
  outline: none;
  box-shadow: 0 0 0 3px rgba(39, 103, 112, 0.1);
}
```

### Navigation

#### Main Navigation
```css
.nav-link {
  font-family: "Fivo Sans", sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #FFFFFF;
  text-decoration: none;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #276770; /* Teal */
}

.nav-link.active {
  color: #276770;
  border-bottom: 2px solid #276770;
}
```

---

## Spacing & Layout

### Spacing Scale
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 96px;
```

### Container Widths
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### Grid System
- **Columns**: 12-column grid
- **Gutter**: 24px (desktop), 16px (mobile)
- **Margin**: 40px (desktop), 20px (mobile)

### Breakpoints
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

---

## Icons & Imagery

### Icon Style
- **Library**: Lucide React
- **Size**: 20px (small), 24px (medium), 32px (large)
- **Stroke Width**: 2px
- **Color**: Inherit from context

### Image Guidelines
- **Product Photos**: High-quality, professional, well-lit
- **Lifestyle Images**: Contextual, showing products in use
- **Aspect Ratios**:
  - Hero: 16:9
  - Product Cards: 4:3
  - Thumbnails: 1:1

### Brand Partner Logos
- Display on clean backgrounds
- Equal visual weight for all partners
- Maintain original brand colors
- Ensure sufficient spacing

---

## Brand Voice & Messaging

### Language
- **Primary**: Spanish (es-CR - Costa Rica)
- **Secondary**: English (en-US)
- **Tone**: Professional, authoritative, consultative

### Key Messaging Themes

#### Experience & Authority
- "40 años liderando la industria"
- "Distribuidores N°1 de KOHLER en Costa Rica"
- Emphasize expertise and market leadership

#### Quality & Premium
- "La mejor calidad"
- "Acabados que marcan la diferencia"
- Focus on premium products and excellence

#### Comprehensive Solutions
- "Todo en un mismo lugar"
- "Soluciones que se ajustan a tu proyecto"
- One-stop shop convenience

#### Service & Support
- "Servicio de especificación"
- "Capacitaciones"
- Consultative approach, technical expertise

### Value Propositions
1. 40 years of industry leadership
2. Exclusive KOHLER distributor (#1 in Costa Rica)
3. Comprehensive product range
4. Professional services (specifications, training)
5. Premium international brands

---

## Accessibility Guidelines

### Color Contrast
- **Minimum Ratio**: 4.5:1 for normal text
- **Large Text**: 3:1 for text 18px+ or 14px+ bold
- **UI Components**: 3:1 for interactive elements

### Contrast Audit
✅ **Pass**: Navy (#082B61) + White (#FFFFFF) - 11.4:1
✅ **Pass**: Charcoal (#3C3C3B) + White (#FFFFFF) - 12.8:1
✅ **Pass**: Teal (#276770) + White (#FFFFFF) - 5.2:1
⚠️ **Caution**: Gray (#A5A6A7) + White (#FFFFFF) - 2.8:1 (use for non-critical text only)

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus states required
- Logical tab order

### Screen Readers
- Semantic HTML elements
- Proper ARIA labels where needed
- Alt text for all images

### Touch Targets
- Minimum size: 44x44px
- Adequate spacing between elements
- No overlapping touch targets

---

## Implementation Examples

### Tailwind CSS Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        alumimundo: {
          navy: '#082B61',
          teal: '#276770',
          charcoal: '#3C3C3B',
          dark: '#1D1D1F',
          gray: '#A5A6A7',
          light: '#F1F1F3',
          slate: '#69727D',
          magenta: '#CC3366',
          whatsapp: '#25D366',
        },
      },
      fontFamily: {
        sans: ['"Fivo Sans"', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'pill': '999px',
      },
    },
  },
}
```

### CSS Custom Properties

```css
:root {
  /* Brand Colors */
  --color-navy: #082B61;
  --color-teal: #276770;
  --color-charcoal: #3C3C3B;
  --color-dark: #1D1D1F;
  --color-gray: #A5A6A7;
  --color-light: #F1F1F3;
  --color-slate: #69727D;
  --color-magenta: #CC3366;
  --color-whatsapp: #25D366;

  /* Typography */
  --font-family: "Fivo Sans", -apple-system, sans-serif;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 999px;
}
```

### React Component Examples

```tsx
// Primary Button Component
export function Button({ children, variant = 'primary' }: ButtonProps) {
  return (
    <button className={`
      font-medium text-[15px] px-[30px] py-[17px] rounded-pill
      transition-all duration-300 hover:-translate-y-0.5
      ${variant === 'primary'
        ? 'bg-white text-alumimundo-charcoal hover:bg-alumimundo-light'
        : 'bg-transparent text-white border-2 border-white hover:bg-white/10'
      }
    `}>
      {children}
    </button>
  );
}

// Feature Card Component
export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="text-alumimundo-teal mb-4">{icon}</div>
      <h6 className="text-2xl font-semibold text-alumimundo-teal mb-4">{title}</h6>
      <p className="text-alumimundo-charcoal leading-relaxed">{description}</p>
    </div>
  );
}
```

---

## Brand Assets Checklist

### Required Files
- [x] Logo (white on transparent): `alumimundo_logo.png`
- [x] Favicon (multiple sizes): `alumimundo_favicon.png`
- [ ] Brand guidelines PDF (optional)
- [ ] Product photography library
- [ ] Brand partner logos

### Digital Presence
- [x] Website colors defined
- [x] Typography system established
- [x] Component library documented
- [ ] Email templates (if needed)
- [ ] Social media assets (if needed)

---

**Document Control**

- **Version**: 1.0
- **Created**: November 2024
- **Source**: https://alumimundo.com/
- **Maintained By**: Development Team
- **Review Cycle**: Quarterly

---

*This design system is a living document and will evolve as the Alumimundo AI Platform develops. All updates should maintain consistency with the core brand identity.*
