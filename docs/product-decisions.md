# Dishcover — Product Decisions & Thinking

A running log of product direction decisions made during development.
Add to this as new decisions are made.

---

## Content Model — Who Owns the Data?

**Decision: Platform-curated, not crowd-sourced (for now)**

Dishcover team researches, verifies, and adds all stalls and dishes.
Users only contribute reviews, photos, and flags.

**Rationale:**
- Hawker landscape in Singapore is finite and stable (~1,000–2,000 stalls)
- Quality matters more than volume for a discovery app
- Stall owners are often elderly and unlikely to manage their own listings
- Eliminates the duplicate problem entirely at MVP stage
- Produces a clean, trustworthy dataset from day one

**Future:** Add "suggest a stall" flow with search-before-create + moderation
queue once the platform has enough scale to manage it.

**User contributions (allowed):**
- Quick reviews (Taste / Value / Queue ratings + optional comment + photo)
- Photo uploads on stall or dish pages
- "Report an issue" flag (wrong hours, stall permanently closed, etc.)

**User contributions (not allowed in MVP):**
- Creating new dishes or stalls
- Editing descriptions or official data

---

## Duplicate Prevention Strategy

Not needed in Phase 1 (platform-curated). For Phase 2+ when user submissions open:

1. **Search-before-create** — force users to search before adding. Only show "Add new" if nothing matches.
2. **Fuzzy matching** — auto-detect likely duplicates on submission ("Did you mean this one?")
3. **Moderation queue** — new submissions go pending until reviewed by admin
4. **Community flagging** — users can flag duplicates, admins merge

---

## Review Model

**Decision: Reviews always attach to a Stall, optionally tag a Dish**

```
Review
├── stallId (required)
├── dishId  (optional — which dish did they have?)
├── tasteRating   (1–5)
├── valueRating   (1–5)
├── queueRating   (1–5)
├── comment       (optional)
└── photos        (optional)
```

**Why:** You visit a stall, not a dish. The stall is the real-world anchor.
Dish-level signals are aggregated from stall reviews that tag a dish.

**Target submission time:** < 10 seconds (per PRD)

**Entry point:** Stall detail page → "Write a review" (not from dish page)

---

## Discovery Model — Dish First, Not Place First

**Decision: Dish is the primary discovery unit**

This is Dishcover's core differentiator from Google Maps (which is place-first).

```
User journey:
  Discover a dish (home feed / roulette / search)
      ↓
  Dish page → which stalls serve it?
      ↓
  Tap a stall → stall detail (menu, vibe, reviews)
      ↓
  Navigate / save / leave a review
```

Users discover through food, then find where to get it.
Google Maps makes you find the place first, then see what they serve.

---

## Home Screen Sections

**Decision: Per-category sections replace a generic "nearby" feed**

Instead of one generic "Nearby" list, the home screen shows:
1. **Popular dishes** — DishCards sorted by review count (cross-category)
2. **Hawker** — StallCards filtered by venueType === 'hawker'
3. **Cafe** — StallCards filtered by venueType === 'cafe'
4. **Restaurant** — StallCards filtered by venueType === 'restaurant'
5. **Buffet** — placeholder ("Nothing here yet") until data added
6. **Food Court** — placeholder until data added

Each section header taps through to a filtered search/explore screen.
Empty sections show a placeholder rather than being hidden (so users see the category exists).

---

## Geographic Scope

**Decision: Start Singapore, design for global**

- **Phase 1:** Singapore only, team-curated data
- **Phase 2:** Southeast Asia (KL, Jakarta, Bangkok) via local city editors
- **Phase 3:** Global, hybrid curation model

The app architecture and data model work globally from day one.
"HawkerCenter" generalises to any food court / hawker area concept.
Only data ingestion changes per market, not the app.

**Positioning:** Dishcover is a street food / local food discovery app.
Not a full restaurant directory (that's Google Maps / Yelp's territory).
The street food / hawker angle gives strong cultural identity and differentiation.

---

## Venue Categories

```
hawker       sf:fork.knife          #B85C00
cafe         sf:cup.and.saucer.fill #1A7A6E
restaurant   sf:wineglass.fill      #5B2D8E
buffet       sf:tray.full.fill      #C0392B
food-court   sf:building.2.fill     #1A5276
```

---

## UI Decisions

### Card Components

**Decision: Generic `Card` shell with `children` for overlay content**

All content cards (DishCard, StallCard, CategoryCard) share the same
visual shell: 200×280px portrait card, full-bleed image/color, gradient
overlay, white text at bottom.

Each card type passes its own children for the overlay metadata.

```
Card (shell — card.tsx)
├── DishCard  → price badge + name + rating
└── StallCard → name + hawker centre + distance + rating
```

### Tab Names

```
Home      → Dishcover  (fork.knife icon)
Map       → Explore    (map icon)
Roulette  → Surprise   (dice icon)
Search    → Search     (magnifyingglass icon)
```

### Open/Closed Status

**Decision: Removed from all cards and stall lists**

`openStatus` is hardcoded mock data — not computed from real time.
Showing it would be misleading. Removed until real operating hours logic is built.
Opening/closing times are shown as text on detail pages instead.

---

## Awards System

Awards can belong to both Dish and Stall.

```ts
interface Award {
  name: string    // "Michelin Bib Gourmand"
  year?: number   // 2025
  icon?: string   // "🌟"
}
```

**Seeded awards (mock data):**
- Tian Tian → Michelin Bib Gourmand 2025, Makan Culture Winner 2025
- 328 Katong Laksa → Makan Culture Winner 2025
- Lao Fu Zi → Hawker Heroes 2024, SingTel Hawker Heroes 2023
- Common Man Coffee → Get Fed Top Cafes 2024
- Chicken Rice dish → Michelin Bib Gourmand 2025
- Laksa dish → Makan Culture Winner 2025
- Char Kway Teow dish → Hawker Heroes 2024
