# Dishcover — Product Requirements Document (PRD)

_Last updated: March 2026_

---

## 1. Overview

Dishcover is a dish-first food discovery app that helps users decide what to eat nearby.

Unlike traditional review apps (Google Maps, Yelp) which focus on *places*, Dishcover focuses on *dishes and food experiences*. Reviews are supporting signals, not the primary feature.

**The app helps users:**
- Discover nearby food by dish, not just by location
- Get quick food suggestions to solve decision fatigue
- Explore dishes across hawker centres, cafes, and restaurants
- Answer "what should I eat today?" in seconds

**Primary markets:**
- Students (cheap, nearby, group decisions)
- Office workers (fast lunch decisions, limited time)
- Food explorers (hidden gems, new dishes, tracking experiences)
- Tourists (curated local food discovery)

---

## 2. Problem Statement

People face decision fatigue when choosing food.

**Typical problems:**
- Too many options, not enough signal
- Difficulty discovering hidden food spots
- Inconsistent or unreliable reviews
- Existing apps (Google Maps) focus on places — not on what to order

**Dishcover's differentiator:** Dish-level discovery. We know *what's worth ordering*, not just *where to go*. That dish-level data is our core moat.

---

## 3. Goals

**Primary goals:**
- Help users decide what to eat quickly
- Encourage exploration of local food culture
- Build a high-quality, curated food discovery dataset

**Success metrics:**
- Daily Active Users (DAU)
- Food discovery interactions (dish page views, roulette spins)
- Reviews submitted
- Badge completion rate
- Returning user rate (D7, D30)

---

## 4. Target Users

### Students
- Pain points: cheap food, nearby options, group decision making
- Use case: Open app → see what's popular nearby → walk to stall

### Office Workers
- Pain points: daily lunch decisions, limited time, wants something different
- Use case: Open app → hit Surprise → get a random dish suggestion nearby

### Food Explorers
- Pain points: discovering hidden gems, tracking what they've tried
- Use case: Browse dish categories → try new stalls → earn badges

### Tourists
- Pain points: don't know where to start with local food
- Use case: Open app → see curated city guide → navigate to top hawker picks

---

## 5. Core Product Concept

Dishcover is a **curated food discovery engine**.

**Content model:**
- Platform team seeds and maintains all dish and stall data (not crowd-sourced)
- Initial data sourced via Google Places API + manual curation
- Users contribute reviews, photos, and issue reports only
- High quality over high volume — 500 accurate stalls beats 5,000 noisy ones

**Discovery hierarchy:**
```
Discover a dish (home / roulette / search)
    ↓
Dish page → which stalls serve it?
    ↓
Tap a stall → stall detail (menu, vibe, reviews)
    ↓
Navigate / save / leave a review
```

**Core discovery signals:**
- Rating and review count
- Photos
- Awards and recognition (Michelin, Makan Culture, Hawker Heroes, etc.)
- Tags and cuisine type
- Distance and drive time
- Trending activity

---

## 6. Key Features

### 6.1 Home Screen — What Should I Eat?

Primary discovery entry point.

**Layout:**
```
🔥 Popular dishes     — DishCards sorted by review count
🍴 Hawker            — StallCards filtered by venue type
☕ Cafe              — StallCards filtered by venue type
🍷 Restaurant        — StallCards filtered by venue type
🥘 Buffet            — placeholder until data added
🏢 Food Court        — placeholder until data added
```

Each section header navigates to a filtered search/explore screen.

### 6.2 Surprise (Food Roulette)

Randomised discovery for users who can't decide.

**Flow:**
```
User presses spin
    ↓
App suggests a random dish nearby
    ↓
User can accept (navigate to stall) or spin again
```

**Output example:**
```
Laksa ⭐ 4.6 · $5
328 Katong Laksa · 7 min away
```

### 6.3 Explore (Map View)

Displays nearby stalls and dishes on an interactive map.

- Pins show stall name and top dish
- Filter by venue type or dish category
- Tap pin → stall detail sheet

### 6.4 Dish Page

Each dish has its own dedicated page.

**Sections:**
- Hero photo (parallax)
- Name, rating, price, review count
- Description
- Tags (e.g. Noodles · Spicy · Coconut-based)
- Awards (e.g. 🌟 Michelin Bib Gourmand 2025)
- Reviews (dish-specific, aggregated from stall reviews that tag this dish)
- Where to get it — stall list with opening hours, distance, stall awards

### 6.5 Stall Page

Full stall profile with tabbed content.

**Header:**
- Name, hawker centre, drive time, price range
- Vibe description (curated one-liner)
- Rating pill
- Action buttons: Directions, Website, Hours

**Tabs:**
- **Menu** — list of dishes served with photo, description, rating, price
- **Vibe** — longer AI-generated/curated summary + photo grid
- **Reviews** — user reviews with Taste / Value / Queue ratings + comments

**Actions:**
- Write a review (bottom sheet modal, < 10 seconds)
- Upload photo
- Save stall
- Share

### 6.6 Quick Review System

Reviews must be frictionless.

**Form:**
```
Taste     ⭐⭐⭐⭐⭐
Value     ⭐⭐⭐⭐⭐
Queue     ⭐⭐⭐⭐⭐
Photo     (optional)
Comment   (optional)
```

**Target submission time:** < 10 seconds

**Review model:** Reviews always attach to a stall. Optionally tag a specific dish.

### 6.7 Achievements & Badges

Gamified exploration to drive retention and repeat visits.

**Examples:**
- Laksa Hunter — try laksa at 5 different stalls
- Hawker Explorer — visit 10 different hawker centres
- Roulette Adventurer — accept 5 Surprise suggestions
- Critic — submit 10 reviews
- Chicken Rice Connoisseur — try chicken rice at 3 different stalls

Users track progress on their profile page.

### 6.8 User Profile

```
[Avatar]  Ali
          Reviews: 12  ·  Photos: 8

Badges
  🍜 Laksa Hunter (3/5)
  🗺️ Hawker Explorer (2/10)
```

---

## 7. Venue Categories

```
Hawker       — traditional hawker centre stalls
Cafe         — specialty coffee and brunch spots
Restaurant   — sit-down dining
Buffet       — buffet format dining
Food Court   — modern air-conditioned food courts
```

---

## 8. Awards System

Awards add trust signals and surface quality stalls/dishes.

Supported award bodies:
- Michelin Bib Gourmand
- Makan Culture
- Hawker Heroes / SingTel Hawker Heroes
- Get Fed
- Custom Dishcover editorial picks

Awards live on both `Dish` and `Stall` entities.

---

## 9. Data Sources

**Platform-curated (Dishcover team):**
- Stall information (name, address, hours, menu, vibe, awards)
- Dish descriptions, tags, awards
- Sourced initially via Google Places API + manual research

**User-generated:**
- Reviews (Taste / Value / Queue + optional photo + optional comment)
- Photos uploaded to stall or dish pages
- Issue reports (wrong hours, stall closed down, etc.)

**Not user-generated in MVP:**
- New stall or dish creation
- Editing of platform-curated content

---

## 10. Database Structure

**Core entities:**
```
Users
Locations
HawkerCenters  (generalises to any food area globally)
Stalls
Dishes
Reviews
Photos
Badges
Visits
Awards         (embedded on Stall and Dish)
```

**Relationships:**
```
Location
  └── HawkerCenter
        └── Stall
              ├── Dishes (menu)
              ├── Reviews
              └── Awards
Dish
  ├── Stalls (where it's served)
  ├── Reviews (tagged dish reviews)
  └── Awards
```

**Key fields added vs. initial spec:**
- `Stall.venueType` — hawker / cafe / restaurant / buffet / food-court
- `Stall.openingTime` — human-readable, e.g. "8:00 AM"
- `Stall.awards` — array of Award objects
- `Dish.tags` — cuisine/characteristic tags
- `Dish.awards` — array of Award objects

---

## 11. Navigation Structure

Built with Expo Router (file-based routing).

**Main tabs:**
```
Dishcover   — home discovery feed          (fork.knife)
Explore     — map view                     (map / map.fill)
Surprise    — food roulette                (dice / dice.fill)
Search      — search dishes and stalls     (magnifyingglass)
```

**Modal/stack routes:**
```
/dish/[id]    — dish detail page
/stall/[id]   — stall detail page
/review/new   — review submission (bottom sheet)
/profile      — user profile
/achievements — badges and progress
```

---

## 12. Technology Stack

**Frontend:**
- Expo (React Native)
- TypeScript
- Expo Router (file-based navigation)
- React Native Reanimated (animations, shared transitions)
- Expo Image (optimised image loading, SF Symbols support)
- Expo Vector Icons (Ionicons)
- React Native Safe Area Context

**Maps:**
- React Native Maps

**Backend (future):**
- Supabase (auth, database, storage) or Firebase

---

## 13. Monetisation

See `docs/monetisation.md` for full detail.

**Summary:**
1. **Business Claim** — stall owners pay to manage their listing ($99/year or tiered monthly)
2. **Featured Placement** — pay to appear at the top of category sections / roulette
3. **City Guide Partnerships** — curated collections sold to tourism boards, hotels, airlines
4. **Dish-Level Data** — anonymised trend reports sold to F&B brands (long-term)

---

## 14. Geographic Scope

**Phase 1 — Singapore**
- Team curates all data
- Focus: hawker centres, cafes, restaurants

**Phase 2 — Southeast Asia**
- Local city editors per market (KL, Jakarta, Bangkok)
- Timeout Magazine model — local expertise per city

**Phase 3 — Global**
- Hybrid: platform seeds via Google Places API, community fills gaps
- App architecture unchanged — only data ingestion changes per market

---

## 15. MVP Scope

**Must include:**
- Home discovery feed (popular dishes + per-category stall sections)
- Dish pages (info, tags, awards, reviews, where to get it)
- Stall pages (menu, vibe, reviews tabs)
- Quick review system (bottom sheet, < 10 seconds)
- Surprise / Food Roulette
- Explore / Map view
- Search (dishes + stalls)
- Achievements and badges
- User profile

**Not included in MVP:**
- User authentication (guest mode only for now)
- User-created stall/dish submissions
- Push notifications
- Social features (following, sharing feeds)
- Ads
- Advanced analytics dashboard
- Business claim merchant portal (design now, build later)

---

## 16. Success Metrics

- Daily Active Users
- Reviews submitted per week
- Roulette / Surprise usage rate
- Dish discovery interactions (dish page views)
- Badge completion rate
- D7 and D30 user retention

---

## 17. Long-Term Vision

Dishcover becomes the definitive platform for discovering local food experiences globally — starting with Southeast Asia's hawker culture and expanding to street food worldwide.

**Future features:**
- Personalised recommendations (based on past visits and ratings)
- Food trends dashboard (what's rising in your city)
- Group food decisions (share a shortlist, vote together)
- Food exploration challenges (time-limited discovery events)
- Stall owner merchant portal (claim, manage, respond)
- Tourist city guides (curated collections, partnerships)
