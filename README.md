# Alumimundo AI Integration Platform

![Alumimundo Logo](public/images/alumimundo_logo.png)

> Transforming Costa Rica's premier construction finishes distributor with AI-powered specification, inventory intelligence, and omnichannel customer experience.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

## 🏢 About Alumimundo

**Alumimundo S.A.** has been Costa Rica's leading distributor of high-end construction finishes for over **40 years** (established 1985). As the exclusive **KOHLER distributor** and representative for premier global brands including Schlage, Steelcraft, and Kallista, Alumimundo serves architects, designers, developers, and contractors across Costa Rica with plans for Central American expansion.

### Our Mission
Transform from a traditional hardware distributor into Central America's first AI-powered construction finishes platform, revolutionizing how professionals specify, purchase, and install premium building materials.

## 🚀 Platform Overview

The Alumimundo AI Integration Platform is a comprehensive suite of AI-powered tools that streamline every aspect of the construction materials lifecycle—from initial specification through installation and maintenance.

### Core AI Modules

#### 1. 🎨 Intelligent Specification & Design Assistant
AI-powered platform enabling architects and designers to discover, specify, and visualize products through natural language and visual interfaces.

**Key Features:**
- Natural language product search (Spanish/English)
- Visual similarity search (upload inspiration images)
- Code compliance validation (Costa Rican building codes)
- 3D visualization of products in project spaces
- Multi-brand catalog integration

**Impact:** 70-80% reduction in specification time (8-15 hours → 2-3 hours)

#### 2. 📦 Predictive Inventory & Supply Chain Intelligence
ML-driven demand forecasting and inventory optimization system.

**Key Features:**
- SKU-level demand forecasting
- Market signal processing (construction permits, economic indicators)
- Supply chain risk monitoring
- Dynamic pricing optimization
- Automated purchase order generation

**Impact:** 25-30% reduction in inventory carrying costs, 90%+ service level

#### 3. 📄 Automated Documentation & Compliance System
Generative AI system for creating technical specifications, training materials, and compliance documentation.

**Key Features:**
- Auto-generated spec sheets from product data
- Localized training content creation
- Installation guide customization
- Compliance report automation
- Multi-language support (Spanish/English)

**Impact:** 85-90% reduction in documentation time

#### 4. 📸 Computer Vision Quality Assurance
Mobile-based visual inspection system for validating installation quality.

**Key Features:**
- Installation checkpoint photography
- Automated quality checks (alignment, hardware, waterproofing)
- Defect detection pre-installation
- Installer certification validation
- Warranty activation upon validation

**Impact:** 40-50% reduction in warranty claims

#### 5. 🌐 Omnichannel Customer Experience Platform
Unified AI-powered customer interface across web, mobile, and WhatsApp.

**Key Features:**
- AI showroom assistant
- Conversational commerce
- Visual product search
- Personalized recommendations
- WhatsApp Business integration
- Unified customer profile

**Impact:** 200-300% increase in qualified leads

## 🛠️ Technology Stack

### Core Framework
- **Next.js 16.0.3** - React framework with App Router
- **React 19.2** - UI library
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 3.4.17** - Utility-first styling

### AI/ML Stack
- **LangChain 0.3.33** & **LangGraph 0.4.9** - AI orchestration
- **Anthropic Claude** - Advanced reasoning and analysis
- **OpenAI GPT-4** - Natural language processing
- **Azure OpenAI** - Enterprise AI services
- **Vercel AI SDK 5.0.39** - AI integration framework
- **ChromaDB** - Vector database for embeddings

### UI & Components
- **shadcn/ui** - Accessible component library
- **Radix UI** - Headless UI primitives
- **Framer Motion 12.23.14** - Smooth animations
- **Lucide React** - Beautiful icons

### Data & Backend
- **Prisma ORM** - Type-safe database access
- **SQLite** - Embedded database (development)
- **Socket.io 4.8.1** - Real-time communication
- **TanStack Query 5.87.4** - Data fetching and caching

### Additional Services
- **Recharts 3.2.0** - Data visualization
- **@pdfme/generator** - PDF report generation
- **Resend 6.0.3** - Transactional email
- **Google Maps API** - Location services

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **npm** or **pnpm** (recommended)
- API keys for AI services (OpenAI, Anthropic, Azure)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/alumimundo-ai-platform.git
cd alumimundo-ai-platform
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Application Configuration
NEXT_PUBLIC_APP_NAME="Alumimundo AI Platform"
NEXT_PUBLIC_WHATSAPP_NUMBER="+506XXXXXXXX"
NEXT_PUBLIC_SUPPORT_EMAIL="soporte@alumimundo.com"

# AI Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
AZURE_OPENAI_API_KEY=your_azure_api_key_here
AZURE_OPENAI_ENDPOINT=your_azure_endpoint_here

# Database
DATABASE_URL="file:./alumimundo.db"

# Optional Services
CHROMA_SERVER_URL=http://localhost:8000
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
RESEND_API_KEY=your_resend_api_key
```

### 4. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 6. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
alumimundo/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (marketing)/          # Public marketing pages
│   │   │   ├── landing/          # Hero, features, stats
│   │   │   ├── pricing/          # Service tiers
│   │   │   └── demo/             # Interactive demo
│   │   ├── admin/                # Admin dashboard
│   │   ├── dashboard/            # Protected user dashboard
│   │   │   ├── specification/    # Product specification
│   │   │   ├── projects/         # Project management
│   │   │   ├── inventory/        # Inventory intelligence
│   │   │   ├── documentation/    # Auto-generated docs
│   │   │   ├── quality/          # Quality assurance
│   │   │   ├── assistant/        # AI assistant
│   │   │   └── reports/          # Analytics
│   │   ├── api/                  # API routes
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── Sidebar.tsx           # Navigation
│   │   └── MobileBottomNav.tsx   # Mobile nav
│   └── contexts/                 # React contexts
├── public/
│   └── images/                   # Assets, logos
├── docs/                         # Documentation
│   ├── prd_alumimundo.md         # Product Requirements
│   ├── alumimundo_ai_research_part1.md
│   └── DESIGN_SYSTEM.md          # Branding guide
├── prisma/
│   └── schema.prisma             # Database schema
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── CLAUDE.md                     # AI assistant context
└── README.md                     # This file
```

## 🎯 Target Users

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

## 📊 Business Impact & KPIs

### Operational Efficiency
- **Specification time**: 70-80% reduction (8-15 hours → 2-3 hours)
- **Inventory turnover**: 5-6x annually (from 3-4x)
- **Documentation time**: 85-90% reduction (2-4 hours → 15-30 minutes)
- **Installation success**: 90-95% first-time success rate

### Customer Experience
- **Response time**: <1 hour (24/7 AI assistance)
- **Project win rate**: 55-65% (from 40-45%)
- **NPS**: 70-80 (from 45-55)
- **Retention**: 90% architect/designer retention

### Business Growth
- **Revenue per employee**: $400K (from ~$250K - 60% increase)
- **Geographic reach**: 5+ countries (from Costa Rica only)
- **Projects capacity**: 100-150 simultaneous (from 30-40)
- **Digital revenue**: 30-35% (from <5%)

## 🎨 Design System

### Brand Colors

```css
/* Primary Brand Colors */
--alumimundo-navy: #082B61;      /* Deep Navy Blue */
--alumimundo-teal: #276770;      /* Teal Accent */
--alumimundo-charcoal: #3C3C3B;  /* Charcoal */
--alumimundo-dark: #1D1D1F;      /* Dark Gray */

/* Secondary Colors */
--alumimundo-gray: #A5A6A7;      /* Medium Gray */
--alumimundo-light: #F1F1F3;     /* Light Gray */
--alumimundo-slate: #69727D;     /* Slate */

/* Accent Colors */
--alumimundo-magenta: #CC3366;   /* Highlight/CTA */
--alumimundo-whatsapp: #25D366;  /* WhatsApp Green */
```

### Typography
- **Font Family**: Fivo Sans (with system fallbacks)
- **Headings**: Semi-bold (600), 1.1 line-height
- **Body**: Regular (400), 16px, 1.5 line-height
- **Buttons**: Medium (500), 15px, pill-shaped

See [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) for complete branding guidelines.

## 🔌 API Routes

### Specifications
- `POST /api/specifications/generate` - AI-powered spec generation
- `GET /api/specifications/search` - RAG product search

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `PATCH /api/projects/:id` - Update project

### Inventory
- `GET /api/inventory/forecast` - Demand forecasting
- `GET /api/inventory/recommendations` - Reorder suggestions

### Documentation
- `POST /api/documentation/generate` - Auto-generate docs

### Quality
- `POST /api/quality/analyze` - CV quality validation

### WhatsApp
- `POST /api/whatsapp/webhook` - WhatsApp Business webhook

### Products
- `GET /api/products/search` - Product catalog search
- `POST /api/products/similarity` - Visual similarity search

## 🗄️ Database Schema

### Core Models
- **Project**: Project management and tracking
- **Specification**: Product specifications per project
- **Product**: Complete product catalog (10,000+ SKUs)
- **Document**: Generated documents and reports
- **QualityCheck**: Installation validation records
- **Activity**: Audit trail and activity log
- **User**: User management with roles

See [prisma/schema.prisma](prisma/schema.prisma) for complete schema.

## 🌍 Language & Localization

- **Primary Language**: Spanish (es-CR)
- **Secondary Language**: English (en-US)
- **Default Locale**: Costa Rica
- **AI Assistant**: Bilingual (Spanish/English)

## 🚧 Implementation Roadmap

### Phase 1: Foundation (Months 1-4) 🚀
- [x] Platform architecture and branding
- [x] Data infrastructure setup
- [ ] Basic RAG system for product search
- [ ] Automated spec sheet generator
- [ ] CRM integration

### Phase 2: Core Features (Months 5-9) 📋
- [ ] Full specification assistant
- [ ] Predictive inventory system
- [ ] Computer vision quality control pilot
- [ ] ERP/CRM integration

### Phase 3: Scale & Integration (Months 10-15) 🌐
- [ ] Omnichannel customer platform
- [ ] WhatsApp Business integration
- [ ] Multi-language support
- [ ] Regional expansion pilots

### Phase 4: Optimization (Months 16-24) 🎯
- [ ] Multi-agent orchestration
- [ ] Predictive project analytics
- [ ] Partner API ecosystem
- [ ] Central American rollout

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Check code coverage
npm run test:coverage
```

## 📦 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   vercel
   ```

2. **Configure Environment Variables**
   - Add all environment variables from `.env.local` in Vercel dashboard

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Docker

```bash
# Build image
docker build -t alumimundo-ai-platform .

# Run container
docker run -p 3000:3000 alumimundo-ai-platform
```

### PM2 Process Manager

```bash
# Install PM2 globally
npm install -g pm2

# Build for production
npm run build

# Start with PM2
pm2 start npm --name "alumimundo-ai" -- start

# Setup auto-restart on boot
pm2 startup
pm2 save
```

## 📚 Documentation

- **Product Requirements**: [docs/prd_alumimundo.md](docs/prd_alumimundo.md)
- **Research Analysis**: [docs/alumimundo_ai_research_part1.md](docs/alumimundo_ai_research_part1.md)
- **Design System**: [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)
- **AI Assistant Context**: [CLAUDE.md](CLAUDE.md)

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Application Won't Start
```bash
# Check Node.js version
node --version  # Must be 20+

# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Reset database
rm -f prisma/alumimundo.db
npx prisma migrate dev --name fresh_start
```

### Port Issues
```bash
# Find process using port 3000
sudo lsof -ti:3000

# Kill process
sudo kill -9 $(sudo lsof -ti:3000)

# Or use different port
PORT=3001 npm run dev
```

## 📄 License

This project is proprietary and confidential. © 2024 Alumimundo S.A. All rights reserved.

## 📞 Support & Contact

- **Website**: [alumimundo.com](https://alumimundo.com/)
- **Email**: soporte@alumimundo.com
- **WhatsApp**: +506 XXXX-XXXX (configured in environment)
- **Location**: San José & Guanacaste, Costa Rica

## 🙏 Acknowledgments

- **KOHLER** - Exclusive partnership and product excellence
- **Schlage, Steelcraft, Kallista** - Premium brand partnerships
- **Anthropic & OpenAI** - AI technology providers
- **Vercel** - Deployment and hosting platform

---

**Built with ❤️ for the future of construction specification in Central America**

*Last Updated: November 2024 - Transformation from Stellar Intelligence Platform to Alumimundo AI Platform*
