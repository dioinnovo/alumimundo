# Alumimundo AI Platform - Dependencies Reference

**Last Updated:** November 24, 2024
**Package Manager:** pnpm 9.15.0
**Node Version:** 20+

---

## 🎯 Overview

This document provides a comprehensive reference for all dependencies used in the Alumimundo AI Platform, their purposes, and why they're essential to the application.

---

## 📦 Core Framework Dependencies

### Next.js & React
| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^16.0.3 | Next.js framework with App Router and Turbopack |
| `react` | ^19.2.0 | React library for UI components |
| `react-dom` | ^19.2.0 | React DOM rendering |
| `react-is` | ^19.1.1 | React type checking utilities |

**Why:** Next.js 16 provides server-side rendering, static generation, and App Router for optimal performance and SEO.

---

## 🤖 AI & LLM Dependencies

### AI SDK & Providers
| Package | Version | Purpose |
|---------|---------|---------|
| `@ai-sdk/azure` | ^2.0.32 | Azure OpenAI integration |
| `@ai-sdk/provider` | ^2.0.0 | AI SDK provider interface |
| `@ai-sdk/provider-utils` | ^3.0.9 | AI SDK utilities |
| `ai` | ^5.0.39 | Vercel AI SDK for streaming responses |

**Why:** Enables Azure OpenAI GPT-4o integration for ALMA Analytics Agent and smart routing.

### LangChain Ecosystem
| Package | Version | Purpose |
|---------|---------|---------|
| `langchain` | ^0.3.33 | Core LangChain framework |
| `@langchain/core` | ^0.3.75 | LangChain core abstractions |
| `@langchain/anthropic` | ^0.3.27 | Anthropic Claude integration |
| `@langchain/openai` | ^0.6.11 | OpenAI integration |
| `@langchain/langgraph` | ^0.4.9 | Agent orchestration graphs |

**Why:** Powers multi-agent orchestration, SQL agents, and complex AI workflows with chain-of-thought reasoning.

### Vector Database
| Package | Version | Purpose |
|---------|---------|---------|
| `@chroma-core/default-embed` | ^0.1.8 | ChromaDB embeddings for RAG |

**Why:** Enables semantic search for product catalog and documentation retrieval.

---

## 🗄️ Database Dependencies

### Prisma ORM
| Package | Version | Purpose |
|---------|---------|---------|
| `@prisma/client` | 6.19.0 | Prisma database client |
| `prisma` | 6.19.0 | Prisma CLI (dev dependency) |

**Why:** Type-safe database access with migrations and schema management.

### PostgreSQL Support
| Package | Version | Purpose |
|---------|---------|---------|
| `pg` | ^8.16.3 | PostgreSQL driver |
| `typeorm` | ^0.3.27 | ORM for SQL agent |
| `reflect-metadata` | ^0.2.2 | TypeORM decorators support |

**Why:** Required for SQL Agent to execute natural language database queries against PostgreSQL.

---

## 🎨 UI Component Libraries

### Radix UI Primitives
| Package | Version | Purpose |
|---------|---------|---------|
| `@radix-ui/react-dialog` | ^1.1.15 | Modal dialogs |
| `@radix-ui/react-popover` | ^1.1.15 | Popovers and tooltips |
| `@radix-ui/react-select` | ^2.2.6 | Dropdown selects |
| `@radix-ui/react-slot` | ^1.2.3 | Component composition |
| `@radix-ui/react-tooltip` | ^1.2.8 | Tooltips |

**Why:** Accessible, unstyled UI primitives that work with Tailwind CSS.

### Animation & Motion
| Package | Version | Purpose |
|---------|---------|---------|
| `framer-motion` | ^12.23.14 | Animation library |

**Why:** Smooth transitions and animations for enhanced UX.

### Styling
| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^3.4.17 | Utility-first CSS framework |
| `tailwindcss-animate` | ^1.0.7 | Animation utilities |
| `tailwind-merge` | ^3.3.1 | Merge Tailwind classes |
| `class-variance-authority` | ^0.7.1 | Component variants |
| `clsx` | ^2.1.1 | Conditional class names |
| `autoprefixer` | ^10.4.21 | CSS vendor prefixes |
| `postcss` | ^8.5.6 | CSS transformations |

**Why:** Tailwind provides consistent, responsive styling without inline styles (aligned with code standards).

### Icons
| Package | Version | Purpose |
|---------|---------|---------|
| `lucide-react` | ^0.543.0 | Icon library |

**Why:** Comprehensive icon set for UI elements.

---

## 📊 Data Visualization

| Package | Version | Purpose |
|---------|---------|---------|
| `recharts` | ^3.2.0 | Charts and graphs |

**Why:** Interactive charts for analytics dashboard and KPI visualization.

---

## 📄 Document Generation

### PDF Libraries
| Package | Version | Purpose |
|---------|---------|---------|
| `@pdfme/common` | ^5.4.8 | PDF generator core |
| `@pdfme/generator` | ^5.4.8 | PDF creation |
| `@pdfme/schemas` | ^5.4.8 | PDF schemas |
| `jspdf` | ^3.0.3 | PDF generation |
| `pdf-parse` | ^2.4.5 | PDF parsing |
| `pdfjs-dist` | ^5.4.149 | PDF.js distribution |

**Why:** Automated specification document generation, budget PDFs, and report creation.

### Image Processing
| Package | Version | Purpose |
|---------|---------|---------|
| `sharp` | ^0.34.5 | Image optimization |
| `html2canvas` | ^1.4.1 | HTML to canvas conversion |

**Why:** Product image optimization and screenshot generation for reports.

---

## 🗺️ Maps & Location

| Package | Version | Purpose |
|---------|---------|---------|
| `@react-google-maps/api` | ^2.20.7 | Google Maps integration |

**Why:** Project location mapping and installer routing.

---

## 📧 Email & Communications

| Package | Version | Purpose |
|---------|---------|---------|
| `resend` | ^6.0.3 | Email service |
| `@react-email/components` | ^0.5.3 | Email templates |
| `@react-email/render` | ^1.2.3 | Email rendering |

**Why:** Transactional emails for specifications, reports, and notifications.

---

## ☁️ Cloud Services

| Package | Version | Purpose |
|---------|---------|---------|
| `@google-cloud/storage` | ^7.17.1 | Google Cloud Storage |

**Why:** Product image storage and CAD file hosting.

---

## 📡 Real-time & WebSockets

| Package | Version | Purpose |
|---------|---------|---------|
| `socket.io` | ^4.8.1 | WebSocket server |
| `socket.io-client` | ^4.8.1 | WebSocket client |
| `eventemitter3` | ^5.0.1 | Event emitter |

**Why:** Real-time AI assistant streaming and live collaboration features.

---

## 📝 Forms & Validation

| Package | Version | Purpose |
|---------|---------|---------|
| `react-hook-form` | ^7.62.0 | Form management |
| `@hookform/resolvers` | ^5.2.1 | Form validators |
| `zod` | ^4.1.11 | Schema validation |

**Why:** Type-safe form validation for specifications and project creation.

---

## 🔍 State Management & Data Fetching

| Package | Version | Purpose |
|---------|---------|---------|
| `@tanstack/react-query` | ^5.87.4 | Server state management |

**Why:** Efficient data fetching, caching, and synchronization.

---

## 🎭 UI Enhancements

| Package | Version | Purpose |
|---------|---------|---------|
| `next-themes` | ^0.4.6 | Theme management |
| `swiper` | ^12.0.1 | Touch sliders |
| `react-markdown` | ^10.1.0 | Markdown rendering |
| `remark-gfm` | ^4.0.1 | GitHub Flavored Markdown |

**Why:** Enhanced UI features including dark mode, product galleries, and formatted content.

---

## 🔧 Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| `lodash` | ^4.17.21 | Utility functions |
| `uuid` | ^13.0.0 | UUID generation |
| `qrcode` | ^1.5.4 | QR code generation |
| `glob` | ^11.0.3 | File pattern matching |
| `multer` | ^2.0.2 | File upload handling |

**Why:** Common utilities for data manipulation, unique IDs, and file operations.

---

## 📊 Analytics & Monitoring

| Package | Version | Purpose |
|---------|---------|---------|
| `@vercel/speed-insights` | ^1.2.0 | Performance monitoring |

**Why:** Track application performance and user experience metrics.

---

## 🧪 Development Dependencies

### TypeScript & Types
| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5 | TypeScript compiler |
| `@types/node` | ^20 | Node.js types |
| `@types/react` | ^18.3.12 | React types |
| `@types/react-dom` | ^18.3.1 | React DOM types |
| `@types/lodash` | ^4.17.20 | Lodash types |
| `@types/multer` | ^2.0.0 | Multer types |
| `@types/qrcode` | ^1.5.6 | QRCode types |

**Why:** Type safety throughout the codebase.

### Linting & Code Quality
| Package | Version | Purpose |
|---------|---------|---------|
| `eslint` | ^9.39.1 | Code linting |
| `eslint-config-next` | ^16.0.3 | Next.js ESLint config |

**Why:** Enforce code quality standards and catch errors early.

### Build & Development Tools
| Package | Version | Purpose |
|---------|---------|---------|
| `tsx` | ^4.20.6 | TypeScript execution |
| `puppeteer` | ^24.22.0 | Headless browser automation |

**Why:** Script execution and automated testing/scraping.

---

## 🔄 Automatic Setup

### Postinstall Script
```json
"postinstall": "prisma generate"
```

**Purpose:** Automatically generates Prisma client after `pnpm install`
**Benefits:**
- Ensures @prisma/client types are always available
- Prevents "Module has no exported member" errors
- Improves developer onboarding experience
- Works in both local development and CI/CD

---

## 📋 Dependency Management Best Practices

### Version Strategy
- **Exact versions** for critical dependencies (Prisma: `6.19.0`)
- **Caret ranges** (`^`) for most dependencies - allows minor/patch updates
- **Package manager**: pnpm 9.15.0 for fast, efficient installs

### CI/CD Requirements
1. ✅ pnpm 9+ required (lockfile version 9.0)
2. ✅ Node.js 20+ required
3. ✅ Prisma client must be generated before build
4. ✅ Environment variables must be configured

### Peer Dependency Warnings
Some packages have peer dependency mismatches (form-render, zod-to-json-schema) but these are non-critical and don't affect production builds.

---

## 🔍 Dependency Verification

### Check for Issues
```bash
# Check for peer dependency warnings
pnpm install

# Verify Prisma client generation
pnpm prisma generate

# Test production build
pnpm build

# Check for outdated dependencies
pnpm outdated
```

### Update Dependencies
```bash
# Update all dependencies (respecting semver)
pnpm update

# Update specific package
pnpm update <package-name>

# Interactive update
pnpm update -i
```

---

## 🚨 Critical Dependencies

These dependencies are **essential** and must not be removed:

1. **Prisma** (`@prisma/client`, `prisma`) - Database ORM
2. **PostgreSQL** (`pg`, `typeorm`, `reflect-metadata`) - SQL Agent functionality
3. **LangChain** (`langchain`, `@langchain/*`) - AI agent orchestration
4. **Azure OpenAI** (`@ai-sdk/azure`) - LLM integration
5. **Next.js** (`next`) - Application framework
6. **React** (`react`, `react-dom`) - UI library

---

## 📚 Additional Resources

- [Package.json](../package.json) - Full dependency list
- [.env.example](../.env.example) - Required environment variables
- [Prisma Schema](../prisma/schema.prisma) - Database schema
- [GitHub Workflows](../.github/workflows/ci.yml) - CI/CD configuration

---

## 🤝 Contributing

When adding new dependencies:
1. Use `pnpm add <package>` (not npm or yarn)
2. Document the purpose in this file
3. Update `.env.example` if environment variables are needed
4. Ensure it works in CI/CD (test with `pnpm build`)
5. Check for peer dependency warnings

---

**Maintained by:** Alumimundo Development Team
**Support:** soporte@alumimundo.com
