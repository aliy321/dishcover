// ─── Award ───────────────────────────────────────────────────────────────────

export interface Award {
  name: string;
  year?: number;
  /** Emoji or short label used as icon, e.g. "🌟" */
  icon?: string;
}

// ─── Dish ────────────────────────────────────────────────────────────────────

export interface Dish {
  id: string;
  name: string;
  description?: string;
  rating: number;
  reviewCount: number;
  /** Display price, e.g. "$4" or "$4–$6" */
  price: string;
  photoUri?: string | null;
  /** Cuisine/characteristic tags, e.g. ["noodles", "spicy", "seafood"] */
  tags?: string[];
  /** Notable awards won by this dish */
  awards?: Award[];
  /** Stall IDs that serve this dish (a dish can appear at multiple stalls) */
  stallIds: string[];
}

// ─── Dish Type + Listing ────────────────────────────────────────────────────

/** Canonical dish category, e.g. "Chicken Rice" */
export interface DishType {
  id: string;
  slug: string;
  name: string;
  aliases?: string[];
  heroPhotoUri?: string | null;
}

/** Stall-specific dish entry belonging to a DishType */
export interface DishListing {
  id: string;
  dishTypeId: string;
  dishId: string;
  stallId: string;
  name: string;
  rating: number;
  reviewCount: number;
  price: string;
  photoUri?: string | null;
}

// ─── Stall ───────────────────────────────────────────────────────────────────

export type PriceRange = '$' | '$$' | '$$$';
export type OpenStatus = 'open' | 'closed';
export type VenueType = 'hawker' | 'cafe' | 'buffet' | 'restaurant' | 'food-court';

export interface Stall {
  id: string;
  name: string;
  hawkerCenterId: string;
  locationId: string;
  address?: string;
  rating: number;
  reviewCount: number;
  priceRange: PriceRange;
  /** Hero + gallery images for the stall detail carousel */
  photoUris: string[];
  /** Short curated or AI-generated vibe sentence shown on the card and Vibe tab */
  vibeDescription: string;
  /** Longer "what people are saying" summary shown in the Vibe tab */
  vibeSummary?: string;
  venueType: VenueType;
  openStatus: OpenStatus;
  /** Human-readable opening time, e.g. "8:00 AM" */
  openingTime?: string;
  /** Human-readable closing time, e.g. "10:00 PM" */
  closingTime?: string;
  /** Notable awards won by this stall */
  awards?: Award[];
  /** Approximate drive time in minutes from a reference point */
  driveTimeMinutes?: number;
  /** Ordered list of dish IDs that make up this stall's menu */
  dishIds: string[];
}

// ─── Hawker Center ───────────────────────────────────────────────────────────

export interface HawkerCenter {
  id: string;
  name: string;
}

// ─── Location ────────────────────────────────────────────────────────────────

export interface Location {
  id: string;
  latitude: number;
  longitude: number;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  displayName: string;
  avatarUri?: string | null;
  reviewCount: number;
  photoCount: number;
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  userId: string;
  stallId: string;
  /** Optional: the specific dish being reviewed at this stall */
  dishId?: string;
  /** 1–5 star ratings for the three quick-review dimensions */
  tasteRating: number;
  valueRating: number;
  queueRating: number;
  comment?: string;
  photoUris?: string[];
  createdAt: string; // ISO 8601
}

// ─── Photo ───────────────────────────────────────────────────────────────────

export interface Photo {
  id: string;
  userId: string;
  stallId: string;
  dishId?: string;
  uri: string;
  createdAt: string;
}

// ─── Badge ───────────────────────────────────────────────────────────────────

export type BadgeCategory = 'dish' | 'stall' | 'review' | 'roulette' | 'explorer';

export interface Badge {
  id: string;
  name: string;
  description: string;
  /** SF Symbol or emoji used as icon */
  icon: string;
  category: BadgeCategory;
  /** How many qualifying actions are required to earn this badge */
  requiredCount: number;
}

// ─── Visit ───────────────────────────────────────────────────────────────────

export interface Visit {
  id: string;
  userId: string;
  stallId: string;
  createdAt: string;
}
