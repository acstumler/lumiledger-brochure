# LumiLedger Brochure — Navigation Guide

## Quick Start

1. **Start at the main page**: `index.html` serves as the entry point
2. **Navigate using the grid**: The "Explore Further" section provides links to all pages
3. **Click the logo**: On any page, click the LumiLedger logo to return home

## Page Structure

```
Main Page (index.html)
├── Hero
├── Why LumiLedger Exists
├── Our Thesis (with link to thesis.html)
└── Explore Further (navigation grid)
    ├── The Thesis →
    ├── Product Architecture →
    ├── User Behavior & Adoption →
    ├── AI Accuracy & Compliance →
    ├── Marketing Strategy →
    ├── For Accounting Professionals →
    └── For Investors & Partners →
```

## URL Structure

Once deployed, pages will be accessible at:
- `/` — Main splash page
- `/thesis.html` — The full thesis
- `/product-architecture.html` — Technical architecture
- `/user-behavior.html` — User behavior analysis
- `/ai-accuracy.html` — AI and compliance
- `/marketing-strategy.html` — Go-to-market approach
- `/for-accountants.html` — For accounting professionals
- `/for-investors.html` — For investors and partners

## Features on Every Page

✅ **Header**: Logo (clickable, returns to home) + "Book a Demo" button
✅ **Background**: Animated swoosh pattern
✅ **Content**: Consistent card-based layout
✅ **Footer**: Contact info, logo, "Book a Demo", and "Back to top" button

## Viewing Locally

To view the site locally:

1. Open a terminal in the `lumiledger_brochure` folder
2. Run a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Or using Node.js (if http-server is installed)
   npx http-server -p 8000
   ```
3. Open browser to `http://localhost:8000`

## Deployment

The site is ready for deployment to:
- Vercel (configuration file included: `vercel.json`)
- Netlify
- GitHub Pages
- Any static hosting service

No build process required — pure HTML/CSS/JS.

## Content Philosophy

Every page follows these principles:
- **Calm, professional tone** — No hype or buzzwords
- **Short paragraphs** — 2-4 lines max for readability
- **Clear boundaries** — Honest about what LumiLedger does and doesn't do
- **Consistent voice** — Feels like one cohesive document
- **Whitepaper aesthetic** — Not a landing page

## For Developers

### File Organization
- All HTML files in root of `lumiledger_brochure/`
- Single CSS file: `styles.css`
- Single JS file: `main.js`
- Assets in `assets/` folder

### Making Changes
1. Edit HTML files directly
2. Update `styles.css` for styling changes
3. All pages share the same CSS — changes affect all pages
4. Maintain consistency when adding new sections

### Adding New Pages
1. Copy the structure from any existing content page
2. Update the header subtitle
3. Add content following the existing card pattern
4. Add link to new page in `index.html` navigation grid

---

**Need Help?**
Contact: alanson.stumler@lumiledger.com

