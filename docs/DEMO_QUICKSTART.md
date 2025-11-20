# Alumimundo Design Assistant - Demo Quick Start

**Status**: ✅ Demo-Ready
**Estimated Setup Time**: 5 minutes

---

## Prerequisites

- Node.js 18+ installed
- Git repository cloned
- Terminal access

---

## Quick Start (3 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma db push

# (Optional) View database
npx prisma studio
```

### 3. Run Development Server
```bash
npm run dev
```

Navigate to: http://localhost:3000

---

## Demo Workflow

### Step 1: Navigate to Design Module
1. Open http://localhost:3000
2. Click "Diseño" in sidebar (or go to http://localhost:3000/dashboard/diseno)

### Step 2: Create a Project
1. Click "+ Nuevo Proyecto"
2. Fill in:
   - Name: "Casa Moderna - Escazú"
   - Property Type: Residencial
   - Location: Escazú, San José
   - Budget: Medio (₡50M - ₡100M)
3. Click "Crear Proyecto"

### Step 3: Welcome & Start
1. Read the welcome message
2. Click "Comenzar Especificación"

### Step 4: Select Areas
1. Click on common areas like:
   - ✅ Cocina Principal
   - ✅ Baño Principal
   - ✅ Sala
2. Or create custom area:
   - Type: Baño
   - Name: "Baño Secundario"
3. Click "Continuar"

### Step 5: Design Each Area (Three-Panel Interface) ⭐

**Left Panel - Upload Photos**:
- Drag and drop images OR click to browse
- Upload 2-3 photos of the area
- (Optional) Click ✨ Sparkles icon to "analyze" (mock)

**Middle Panel - Browse Materials**:
- Use search: "grifo", "lavamanos", "fregadero"
- Filter by category and brand
- Click products to select
- Adjust quantities in summary card

**Right Panel - Voice/Text Input**:
- Click 🎤 microphone to record (allows browser permission)
- Or type: "Necesito grifería moderna KOHLER y fregadero de acero inoxidable"
- Click ✉️ Send
- See AI recommendations appear

**AI Recommendations Show**:
- Estimated cost (₡2,500,000)
- Recommended products with confidence scores
- Compliance validation
- Insights (WaterSense, delivery time, etc.)

### Step 6: Navigate Between Areas
1. Click "Siguiente Área" to move to next area
2. Or use navigation breadcrumbs
3. Repeat image upload + material selection for each area

### Step 7: Review All Specifications
1. Click "Revisar Especificaciones" (or navigate to review page)
2. See:
   - Total cost across all areas
   - KPI cards (completion %, AI confidence, compliance)
   - Area-by-area breakdown with products
3. Click "Editar" on any area to go back and modify

### Step 8: Generate Report
1. Click "Generar Reporte PDF"
2. Wait 2 seconds (mock generation)
3. Redirects to report page

### Step 9: Download & Share Report
1. **Preview PDF** in iframe
2. **Download**: Click "Descargar PDF"
3. **Print**: Click "Abrir para Imprimir"
4. **Share**: Click "Enviar por Correo"
   - Enter email address
   - Click "Enviar" (mock - not actually sent yet)

---

## Demo Tips

### For Best Demo Experience

1. **Prepare Images**:
   - Have 2-3 sample room photos ready (kitchen, bathroom, living room)
   - Supported: PNG, JPG, HEIC

2. **Use These Search Terms** (optimized for mock AI):
   - Kitchen: "grifo moderno", "fregadero acero", "KOHLER"
   - Bathroom: "lavamanos doble", "ducha lluvia", "inodoro"
   - Living Room: "piso madera", "cerradura"

3. **Voice Input** (Spanish only):
   - Browser: Chrome/Edge work best
   - Permission: Allow microphone when prompted
   - Speak clearly: "Necesito grifería moderna para cocina"

4. **Expected Results**:
   - AI will recommend 3-8 products per area
   - Total costs: ₡1.5M - ₡5M per area
   - PDF generates in ~2 seconds

---

## Troubleshooting

### Database Issues
```bash
# Reset database
rm prisma/alumimundo.db
npx prisma db push
```

### Voice Not Working
- **Chrome/Edge**: Should work
- **Safari**: May have limitations
- **Firefox**: Use latest version
- **Fallback**: Just type instead of using voice

### PDF Not Generating
- Check browser console for errors
- Ensure jsPDF is installed: `npm install jspdf`

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill
# Or run on different port
npm run dev -- -p 3001
```

---

## Current Limitations (Mock Data)

### ✅ Fully Functional
- Complete UI workflow
- Database CRUD operations
- Form validation
- Navigation
- PDF generation

### 🔄 Using Mock/Rule-Based Logic
- **AI Recommendations**: Rule-based keyword matching (not LLM)
  - Looks for keywords: "grifo", "moderno", "KOHLER", etc.
  - Scores products based on matches
  - Returns top 8 recommendations

- **Image Analysis**: Returns hardcoded mock results
  - Detected Items: ["Lavamanos", "Grifo", "Espejo"]
  - Style: "Moderno"
  - Colors: ["Blanco", "Cromado"]

- **Project Data**: Hardcoded sample data in review/report pages
  - Replace with real database queries for production

### 🚧 Not Yet Implemented
- Azure OpenAI integration (ready for integration)
- Cloud image storage (currently base64 in memory)
- Email sending (UI ready, backend needed)
- Real user authentication

---

## Environment Variables (Optional)

Create `.env.local` for future AI integration:

```env
# Database
DATABASE_URL="file:./prisma/alumimundo.db"

# Future AI Integration (not used yet)
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=your_endpoint_here
OPENAI_API_KEY=your_key_here

# Future Email Integration (not used yet)
RESEND_API_KEY=your_key_here
```

---

## Demo Script (5-Minute Presentation)

### Minute 1: Introduction
"Alumimundo's AI Design Assistant transforms how architects and designers specify construction products - reducing specification time from 8-15 hours to just 2-3 hours."

### Minute 2: Create Project
"Let's create a new residential project in Escazú. Notice how we capture property type and budget upfront."

### Minute 3: Three-Panel Interface (CORE DEMO)
"This is where the magic happens - three intelligent panels working together:
- **Left**: Upload photos of the space
- **Middle**: Browse our complete KOHLER and Schlage catalog
- **Right**: Speak or type your requirements in natural language"

### Minute 4: AI Recommendations
"Watch how the AI analyzes your photos, voice input, and selected materials to:
- Recommend complementary products
- Calculate accurate cost estimates
- Validate compliance with Costa Rican building codes
- Provide insights on water efficiency and delivery times"

### Minute 5: Professional Report
"Within seconds, generate a professional PDF specification document with:
- Executive summary
- Area-by-area breakdown
- Product details and pricing
- Compliance validation
- Ready to share with clients"

**Closing**: "This is Module 1 of our 5-module AI transformation platform. Next: Predictive Inventory, Automated Documentation, Quality Assurance, and Omnichannel Customer Experience."

---

## Next Steps After Demo

### For Development
1. Integrate Azure OpenAI API ([docs/SPECIFICATION_PAGE_IMPLEMENTATION.md](./SPECIFICATION_PAGE_IMPLEMENTATION.md))
2. Add cloud image storage (GCS/S3)
3. Implement RAG with ChromaDB
4. Create database seed script

### For Production
1. User authentication
2. PostgreSQL database
3. Deploy to Vercel
4. Email integration (Resend)
5. WhatsApp Business API

---

## Support & Documentation

- **Implementation Details**: [DESIGN_WORKFLOW_IMPLEMENTATION.md](./DESIGN_WORKFLOW_IMPLEMENTATION.md)
- **Full PRD**: [prd_alumimundo.md](./prd_alumimundo.md)
- **Design System**: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- **API Documentation**: See implementation doc above

---

**Questions?** Review the documentation or check code comments for detailed explanations.

**Ready to Demo!** 🚀

*Last Updated: November 17, 2024*
