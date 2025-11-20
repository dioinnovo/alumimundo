# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Alumimundo AI Integration Platform** is a Next.js 16.0.3 application that transforms Costa Rica's premier construction finishes distributor into an AI-powered platform. The platform provides intelligent product specification, predictive inventory management, automated documentation, and omnichannel customer experience for architects, designers, developers, and contractors.

## Company Background

**Alumimundo S.A.** - Costa Rica's leading distributor of high-end construction finishes with 40+ years of experience (established 1985). Exclusive KOHLER distributor and representative for global brands including Schlage, Steelcraft, and Kallista.

**Market Position**: Premium segment leader serving architects, interior designers, developers, contractors, and high-income residential clients across Costa Rica with expansion plans for Central America.

## Development Commands

### Running the Application
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run development server with Turbo
npm run dev:turbo

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Core AI Modules (Based on PRD)

### Module 1: Intelligent Specification & Design Assistant
AI-powered platform enabling architects and designers to discover, specify, and visualize products through natural language and visual interfaces.

**Key Features:**
- Natural language product search (Spanish/English)
- Visual similarity search (upload inspiration images)
- Code compliance validation (Costa Rican building codes)
- 3D visualization of products in project spaces
- Multi-brand catalog integration (KOHLER, Schlage, etc.)

**Target Impact:** 70-80% reduction in specification time (8-15 hours → 2-3 hours)

### Module 2: Predictive Inventory & Supply Chain Intelligence
ML-driven demand forecasting and inventory optimization system.

**Key Features:**
- SKU-level demand forecasting
- Market signal processing (construction permits, economic indicators)
- Supply chain risk monitoring
- Dynamic pricing optimization
- Automated purchase order generation

**Target Impact:** 25-30% reduction in inventory carrying costs, 90%+ service level

### Module 3: Automated Documentation & Compliance System
Generative AI system for creating technical specifications, training materials, and compliance documentation.

**Key Features:**
- Auto-generated spec sheets from product data
- Localized training content creation
- Installation guide customization
- Compliance report automation
- Multi-language support (Spanish/English)

**Target Impact:** 85-90% reduction in documentation time

### Module 4: Computer Vision Quality Assurance
Mobile-based visual inspection system for validating installation quality.

**Key Features:**
- Installation checkpoint photography
- Automated quality checks (alignment, hardware, waterproofing)
- Defect detection pre-installation
- Installer certification validation
- Warranty activation upon validation

**Target Impact:** 40-50% reduction in warranty claims

### Module 5: Omnichannel Customer Experience Platform
Unified AI-powered customer interface across web, mobile, and WhatsApp.

**Key Features:**
- AI showroom assistant
- Conversational commerce
- Visual product search
- Personalized recommendations
- WhatsApp Business integration
- Unified customer profile

**Target Impact:** 200-300% increase in qualified leads

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 16.0.3 with App Router
- **UI**: React 19.2, Tailwind CSS 3.4.17, shadcn/ui components
- **State Management**: React hooks, TanStack Query
- **Animations**: Framer Motion 12.23.14
- **AI/ML Stack**:
  - LangChain 0.3.33 & LangGraph 0.4.9
  - Anthropic Claude (via @langchain/anthropic)
  - OpenAI (via @langchain/openai)
  - Azure OpenAI (via @ai-sdk/azure)
  - Vercel AI SDK 5.0.39
  - ChromaDB for vector embeddings
- **PDF Generation**: @pdfme/generator, jspdf
- **Data Visualization**: Recharts 3.2.0
- **Real-time**: Socket.io 4.8.1
- **Email**: Resend 6.0.3
- **Maps**: Google Maps API (@react-google-maps/api)

### Project Structure
```
alumimundo/
├── src/
│   ├── app/
│   │   ├── (marketing)/        # Public pages
│   │   │   ├── landing/        # Hero, features, stats
│   │   │   ├── pricing/        # Service tiers (if applicable)
│   │   │   └── demo/           # Interactive specification demo
│   │   ├── admin/              # Admin dashboard
│   │   ├── dashboard/          # Protected dashboard
│   │   │   ├── specification/  # Product specification workflows
│   │   │   ├── projects/       # Project management
│   │   │   ├── inventory/      # Inventory intelligence
│   │   │   ├── documentation/  # Auto-generated docs
│   │   │   ├── quality/        # Quality assurance
│   │   │   ├── assistant/      # AI assistant interface
│   │   │   └── reports/        # Analytics & reports
│   │   ├── api/                # API routes
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # shadcn/ui base components
│   │   ├── Sidebar.tsx         # Main navigation
│   │   └── MobileBottomNav.tsx # Mobile navigation
│   └── contexts/               # React contexts
├── public/
│   └── images/                 # Brand assets, logos
├── docs/                       # Documentation
│   ├── prd_alumimundo.md       # Full PRD
│   ├── alumimundo_ai_research_part1.md
│   └── DESIGN_SYSTEM.md        # Branding guide
└── prisma/
    └── schema.prisma           # Database schema
```

## Target Users

### Primary Users
- **Architects & Interior Designers**: 500+ active specifiers in Costa Rica
- **Developers & Contractors**: 200+ commercial and residential project managers
- **Alumimundo Technical Advisors**: 15-20 internal staff members
- **Installation Partners**: 100+ certified installers

### Secondary Users
- **End Customers**: High-income homeowners and property managers
- **Operations Team**: Inventory, purchasing, and logistics staff
- **Training Department**: Certification and education coordinators
- **Customer Service**: Support representatives

## Key Features & Workflows

### 1. Product Specification Workflow
Multi-step wizard for project specification:
1. Project details (type, location, architect, developer)
2. Room/area selection and requirements
3. AI-powered product recommendations
4. Code compliance validation
5. Specification document generation

### 2. Inventory Dashboard
Real-time inventory intelligence:
- Stock levels by SKU
- Demand forecasts with confidence intervals
- Reorder recommendations
- Supply chain risk alerts
- Pricing optimization suggestions

### 3. AI Assistant
Conversational interface for:
- Product discovery ("¿Qué lavamanos KOHLER recomiendas para un hotel?")
- Technical specifications
- Installation guidance
- Code compliance questions
- Order status and availability

### 4. Quality Assurance Validation
Mobile-first workflow:
- Photo upload at installation checkpoints
- CV-based quality analysis
- Pass/fail validation
- Installer feedback
- Warranty activation

## Environment Variables

Key environment variables in `.env.local`:

### Application
```env
NEXT_PUBLIC_APP_NAME="Alumimundo AI Platform"
NEXT_PUBLIC_WHATSAPP_NUMBER="+506XXXXXXXX"
NEXT_PUBLIC_SUPPORT_EMAIL="soporte@alumimundo.com"
```

### AI Configuration
```env
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_ENDPOINT=
```

### Database
```env
DATABASE_URL="file:./alumimundo.db"
```

### Optional Services
```env
CHROMA_SERVER_URL=
GOOGLE_MAPS_API_KEY=
RESEND_API_KEY=
```

## Design System

### Brand Colors (Alumimundo)
- **Primary Navy**: #082B61 (`alumimundo-navy`)
- **Accent Teal**: #276770 (`alumimundo-teal`)
- **Charcoal**: #3C3C3B (`alumimundo-charcoal`)
- **Dark Gray**: #1D1D1F (`alumimundo-dark`)
- **Medium Gray**: #A5A6A7 (`alumimundo-gray`)
- **Light Gray**: #F1F1F3 (`alumimundo-light`)
- **Slate**: #69727D (`alumimundo-slate`)
- **Magenta**: #CC3366 (`alumimundo-magenta`)
- **WhatsApp Green**: #25D366 (`alumimundo-whatsapp`)

### Typography
- **Font Family**: Fivo Sans (with system fallbacks)
- **Headings**: Semi-bold (600), various sizes with 1.1 line-height
- **Body**: Regular (400), 16px with 1.5 line-height
- **CTA Buttons**: Medium (500), 15px, pill-shaped (border-radius: 999px)

### Components
- Using shadcn/ui with Radix UI primitives
- Framer Motion for smooth transitions
- Responsive design with mobile-first approach
- Dark mode support (optional)

## Database Schema (Prisma)

### Core Models
- **Project**: Project management (residential, commercial, institutional)
- **Specification**: Product specifications per project
- **Product**: Product catalog (SKUs, brands, categories)
- **Document**: Generated documents (specs, guides, reports)
- **QualityCheck**: CV-based installation validations
- **Activity**: Audit trail and activity log
- **User**: User management with roles (admin, technical_advisor, architect, installer)

See `prisma/schema.prisma` for complete schema.

## Language & Localization

- **Primary Language**: Spanish (es-CR)
- **Secondary Language**: English (en-US)
- **Default Locale**: Costa Rica (`es_CR`)
- User interface primarily in Spanish
- AI assistant bilingual (Spanish/English)

## Business Metrics & KPIs

### Operational Efficiency
- Specification time: Target 2-3 hours (from 8-15 hours)
- Inventory turnover: Target 5-6x annually (from 3-4x)
- Documentation time: Target 15-30 minutes (from 2-4 hours)
- First-time installation success: Target 90-95%

### Customer Experience
- Response time: Target <1 hour (24/7 AI assistance)
- Project win rate: Target 55-65% (from 40-45%)
- Customer satisfaction (NPS): Target 70-80 (from 45-55)
- Architect/Designer retention: Target 90%

### Business Growth
- Revenue per employee: Target $400K (from ~$250K)
- Geographic reach: Target 5+ countries (from Costa Rica only)
- Projects handled simultaneously: Target 100-150 (from 30-40)
- Digital channel revenue: Target 30-35% (from <5%)

## API Routes

### Specifications
- `/api/specifications/generate` - AI-powered spec generation
- `/api/specifications/search` - RAG product search

### Projects
- `/api/projects/*` - Project CRUD operations

### Inventory
- `/api/inventory/forecast` - Predictive analytics

### Documentation
- `/api/documentation/generate` - Auto-generate technical docs

### Quality
- `/api/quality/analyze` - CV quality validation

### WhatsApp
- `/api/whatsapp/webhook` - WhatsApp Business integration

### Products
- `/api/products/search` - Product catalog search
- `/api/products/similarity` - Visual similarity search

### AI Assistant
- `/api/assistant/*` - Conversational AI endpoints
- `/api/chat/*` - Chat interface

## Implementation Phases

### Phase 1: Foundation (Months 1-4)
- Data infrastructure and standardization
- Basic RAG system for product search
- Automated spec sheet generator (Quick Win)
- Integration with existing CRM

### Phase 2: Core Features (Months 5-9)
- Full specification assistant
- Predictive inventory system
- Computer vision quality control pilot
- ERP/CRM integration

### Phase 3: Scale & Integration (Months 10-15)
- Omnichannel customer platform
- WhatsApp Business integration
- Multi-language support
- Regional expansion pilots (Guatemala, El Salvador)

### Phase 4: Optimization & Leadership (Months 16-24)
- Multi-agent orchestration
- Predictive project analytics
- API ecosystem for partners
- Full Central American rollout

## Development Guidelines

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Server components by default in App Router
- Client components only when needed (use 'use client')

### AI Integration Best Practices
- System prompts contextualized for Alumimundo domain
- RAG for product knowledge retrieval
- Human-in-the-loop for critical decisions
- Audit trail for all AI-generated recommendations

### Data Handling
- Costa Rican data privacy compliance
- Building code database embedded in AI
- Product catalog standardization
- Multi-brand compatibility

### Responsive Design
- Mobile-first approach (many users on-site)
- Touch-friendly interfaces for installers
- Progressive enhancement
- Offline capabilities for quality checks

## Testing Strategy

- Unit tests for utilities and helpers
- Integration tests for API routes
- E2E tests for critical user flows
- Visual regression testing for branding
- Performance testing for AI response times

## Deployment

### Vercel Configuration
- Auto-deploy from main branch
- Environment variables configured
- Custom domain (if applicable)
- Edge functions for AI endpoints

### Monitoring
- Vercel Analytics for performance
- Error tracking
- AI model usage monitoring
- User behavior analytics

## Documentation References

- **Full PRD**: `docs/prd_alumimundo.md`
- **Research Analysis**: `docs/alumimundo_ai_research_part1.md`
- **Design System**: `docs/DESIGN_SYSTEM.md`

## Support & Contact

- **Technical Support**: soporte@alumimundo.com
- **WhatsApp**: Configured in environment variables
- **Company Website**: https://alumimundo.com/

---

*Last Updated: November 2024 - Transformation from Stellar Intelligence Platform to Alumimundo AI Platform*
