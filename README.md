# Konika Jewellery — Digital Experience Concept

**Independent UX/UI, ecommerce strategy and web-development concept.**  
This is **not** the official Konika Jewellery website and is **not** affiliated with the brand.

A complete luxury jewellery digital ecosystem demonstrating:

- Ecommerce web development (React, Vite, TypeScript, Tailwind)
- Premium UI/UX and product merchandising
- Jewellery discovery & personalisation (rule-based finder, AI-ready)
- Conversion-focused product & cart flows
- Content strategy (Stories, Campaign, Content Studio)
- Purchase plans (based on publicly available scheme info)
- Internal analytics & content calendar (mock data)

## Quick start

```bash
cd konika-digital-experience
npm install
npm run dev
```

Open the URL shown by Vite (typically `http://localhost:5173`).

## Routes

| Path | Experience |
|------|------------|
| `/` | Homepage |
| `/jewellery` | Collection + filters |
| `/collections/:collection` | Collection template |
| `/bridal` `/bestsellers` `/new-arrivals` | Curated lists |
| `/product/:id` | Product detail + price breakdown |
| `/cart` `/wishlist` | Commerce |
| `/jewellery-finder` | 5-step recommendation |
| `/purchase-plans` | Verified plan cards + calculator |
| `/stories` `/stories/:slug` | Editorial hub |
| `/campaigns/the-stories-we-wear` | Campaign landing |
| `/admin/content` | Content Studio |
| `/admin/calendar` | Content calendar |
| `/admin/analytics` | Demo performance dashboard |
| `/case-study` | Portfolio write-up |

## Design system

- Warm Ivory `#F7F3EC` · Deep Charcoal `#171717` · Champagne Gold `#B89A62` · Soft Beige `#E8DED0`
- Serif: Cormorant Garamond · Sans: Inter
- Mobile-first, sticky header, product sticky bar on PDP

## Data

- 32 mock products with realistic fields
- Cart / wishlist / leads / recent searches in `localStorage`
- Analytics numbers are **demo only**

## Disclaimer

Product prices, ratings and most catalogue details are mock/demo.  
Purchase plan structure references publicly available Konika scheme information; benefits and calculator are labelled illustrative where appropriate.

## Saru AI Customer Support

Floating **Chat with Saru** / **Call Saru** widget on every page.

### Customer features
- Natural chat with conversation memory
- Voice input (Web Speech API) + TTS replies
- Product catalogue lookup (real demo prices)
- Order status for demo IDs: `KJ10245`, `KJ10246`, `KJ10247`
- Shipping, returns, care, store, purchase-plan knowledge
- Human handoff on complaints / low confidence / explicit request
- Never requests passwords, OTPs, or card data

### Automation
- Every conversation auto-saved (transcript, AI summary, sentiment, priority, result)
- Escalations trigger immediate admin email (logged in demo)
- Daily Excel-compatible report at **7:00 PM IST** (configurable)
- Multi-sheet report: All / Resolved / Escalated / Unresolved / Customers / Analytics

### Admin
| Route | Purpose |
|-------|---------|
| `/admin/saru` | Reports, transcripts, filters, email log, settings |
| `/admin/saru/knowledge` | Edit FAQs & policies without code changes |

### Architecture
```
Website → SaruWidget → processMessage (agent)
                         ↓
              Knowledge + Products + Orders
                         ↓
              conversationStore (DB layer)
                         ↓
         excelReport + emailService + scheduler
```

Production: replace localStorage store and emailService with server APIs; plug an LLM into `agent.ts` while keeping the same tool functions.
