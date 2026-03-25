import type {
  Badge,
  DishListing,
  DishType,
  Dish,
  HawkerCenter,
  Location,
  Photo,
  Review,
  Stall,
  User,
  Visit,
} from '@/types';

// ─── Hawker Centers ──────────────────────────────────────────────────────────

export const hawkerCenters: HawkerCenter[] = [
  { id: 'hc-1', name: 'Maxwell Food Centre' },
  { id: 'hc-2', name: 'Old Airport Road Food Centre' },
  { id: 'hc-3', name: 'Tiong Bahru Market' },
];

// ─── Locations ───────────────────────────────────────────────────────────────

export const locations: Location[] = [
  { id: 'loc-1', latitude: 1.2804, longitude: 103.8443 },
  { id: 'loc-2', latitude: 1.3072, longitude: 103.8834 },
  { id: 'loc-3', latitude: 1.2868, longitude: 103.8335 },
];

// ─── Dishes ──────────────────────────────────────────────────────────────────

export const dishes: Dish[] = [
  {
    id: 'd-1',
    name: 'Laksa',
    description: 'Rich, spicy coconut milk broth with thick rice noodles, prawns, and cockles.',
    rating: 4.6,
    reviewCount: 320,
    price: '$5',
    photoUri: null,
    tags: ['noodles', 'spicy', 'coconut', 'seafood'],
    awards: [
      { name: 'Makan Culture Winner', year: 2025, icon: '🏆' },
    ],
    stallIds: ['stall-2'],
  },
  {
    id: 'd-2',
    name: 'Chicken Rice',
    description: 'Tender poached chicken served over fragrant ginger-garlic rice with chilli sauce.',
    rating: 4.7,
    reviewCount: 120,
    price: '$4',
    photoUri: null,
    tags: ['rice', 'chicken', 'local favourite'],
    awards: [
      { name: 'Michelin Bib Gourmand', year: 2025, icon: '🌟' },
    ],
    stallIds: ['stall-1'],
  },
  {
    id: 'd-3',
    name: 'Chicken Soup',
    description: 'Clear, soothing broth with soft chicken pieces and light seasoning.',
    rating: 4.5,
    reviewCount: 80,
    price: '$3.50',
    photoUri: null,
    tags: ['soup', 'chicken', 'light'],
    stallIds: ['stall-1'],
  },
  {
    id: 'd-4',
    name: 'Char Kway Teow',
    description: 'Wok-fried flat rice noodles with cockles, Chinese sausage, and smoky wok hei.',
    rating: 4.4,
    reviewCount: 200,
    price: '$5.50',
    photoUri: null,
    tags: ['noodles', 'wok hei', 'seafood', 'smoky'],
    awards: [
      { name: 'Hawker Heroes', year: 2024, icon: '🦸' },
    ],
    stallIds: ['stall-3'],
  },
  {
    id: 'd-5',
    name: 'Hainanese Curry Rice',
    description: 'Braised pork, cabbage, and curried vegetables ladled over steamed white rice.',
    rating: 4.3,
    reviewCount: 95,
    price: '$6',
    photoUri: null,
    tags: ['rice', 'curry', 'pork', 'hearty'],
    stallIds: ['stall-4'],
  },
  {
    id: 'd-6',
    name: 'Bao (Steamed Bun)',
    description: 'Fluffy steamed buns filled with BBQ pork or lotus paste.',
    rating: 4.5,
    reviewCount: 140,
    price: '$1.20',
    photoUri: null,
    tags: ['dim sum', 'pork', 'steamed', 'snack'],
    stallIds: ['stall-4'],
  },
  {
    id: 'd-7',
    name: 'Chicken Rice',
    description: 'Roasted chicken with fragrant rice and a richer, caramelized skin finish.',
    rating: 4.5,
    reviewCount: 210,
    price: '$4.50',
    photoUri: null,
    tags: ['rice', 'chicken', 'roasted'],
    stallIds: ['stall-3'],
  },
  {
    id: 'd-8',
    name: 'Laksa',
    description: 'Peppery laksa broth with clams and fishcake, less coconut-heavy style.',
    rating: 4.4,
    reviewCount: 175,
    price: '$4.80',
    photoUri: null,
    tags: ['noodles', 'spicy', 'seafood'],
    stallIds: ['stall-4'],
  },
  {
    id: 'd-9',
    name: 'Char Kway Teow',
    description: 'Sweeter style char kway teow with extra lup cheong and crunchy bean sprouts.',
    rating: 4.2,
    reviewCount: 130,
    price: '$5',
    photoUri: null,
    tags: ['noodles', 'wok hei', 'smoky'],
    stallIds: ['stall-2'],
  },
];

// ─── Dish Types + Listings (grouped food model) ─────────────────────────────

function slugifyDishName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const dishTypes: DishType[] = Array.from(
  dishes.reduce((acc, dish) => {
    const slug = slugifyDishName(dish.name);
    if (!acc.has(slug)) {
      acc.set(slug, {
        id: `dt-${slug}`,
        slug,
        name: dish.name,
        aliases: dish.tags,
        heroPhotoUri: dish.photoUri,
      });
    }
    return acc;
  }, new Map<string, DishType>()).values(),
);

export const dishListings: DishListing[] = dishes.flatMap((dish) =>
  dish.stallIds.map((stallId, index) => ({
    id: `dl-${dish.id}-${index + 1}`,
    dishTypeId: `dt-${slugifyDishName(dish.name)}`,
    dishId: dish.id,
    stallId,
    name: dish.name,
    rating: dish.rating,
    reviewCount: dish.reviewCount,
    price: dish.price,
    photoUri: dish.photoUri,
  })),
);

// ─── Stalls ──────────────────────────────────────────────────────────────────

export const stalls: Stall[] = [
  {
    id: 'stall-1',
    name: 'Tian Tian Hainanese Chicken Rice',
    hawkerCenterId: 'hc-1',
    locationId: 'loc-1',
    address: '1 Kadayanallur St, #01-10, Singapore 069184',
    rating: 4.7,
    reviewCount: 120,
    priceRange: '$',
    photoUris: [],
    venueType: 'hawker',
    vibeDescription: 'Legendary chicken rice with queues that move surprisingly fast.',
    vibeSummary:
      'Diners rave about the silky smooth chicken and fragrant rice. The chilli sauce is consistently praised as the best in Singapore. Expect a short queue on weekday mornings.',
    openStatus: 'open',
    openingTime: '10:00 AM',
    closingTime: '8:00 PM',
    awards: [
      { name: 'Michelin Bib Gourmand', year: 2025, icon: '🌟' },
      { name: 'Makan Culture Winner', year: 2025, icon: '🏆' },
    ],
    driveTimeMinutes: 7,
    dishIds: ['d-2', 'd-3'],
  },
  {
    id: 'stall-2',
    name: '328 Katong Laksa',
    hawkerCenterId: 'hc-1',
    locationId: 'loc-1',
    address: '1 Kadayanallur St, #01-14, Singapore 069184',
    rating: 4.6,
    reviewCount: 320,
    priceRange: '$',
    photoUris: [],
    venueType: 'hawker',
    vibeDescription: 'The laksa that tourists and locals both swear by.',
    vibeSummary:
      'The thick coconut broth and plump prawns are the stars here. Many note that the short noodles (pre-cut so you can eat with a spoon) are a distinctive touch. Can get crowded at lunch.',
    openStatus: 'open',
    openingTime: '9:00 AM',
    closingTime: '9:00 PM',
    awards: [
      { name: 'Makan Culture Winner', year: 2025, icon: '🏆' },
    ],
    driveTimeMinutes: 7,
    dishIds: ['d-1', 'd-9'],
  },
  {
    id: 'stall-3',
    name: 'Lao Fu Zi Fried Kway Teow',
    hawkerCenterId: 'hc-2',
    locationId: 'loc-2',
    address: '51 Old Airport Rd, #01-12, Singapore 390051',
    rating: 4.4,
    reviewCount: 200,
    priceRange: '$',
    photoUris: [],
    venueType: 'hawker',
    vibeDescription: 'Old-school wok magic with serious smoky flavour.',
    vibeSummary:
      'The wok hei here is real — regulars say you can smell it from the other end of the hawker centre. The cockles are always fresh and generous. Arrive early as they sell out.',
    openStatus: 'closed',
    openingTime: '8:00 AM',
    closingTime: '3:00 PM',
    awards: [
      { name: 'Hawker Heroes', year: 2024, icon: '🦸' },
      { name: 'SingTel Hawker Heroes', year: 2023, icon: '🦸' },
    ],
    driveTimeMinutes: 12,
    dishIds: ['d-4', 'd-7'],
  },
  {
    id: 'stall-4',
    name: 'Tiong Bahru Pau',
    hawkerCenterId: 'hc-3',
    locationId: 'loc-3',
    address: '30 Seng Poh Rd, #02-01, Singapore 168898',
    rating: 4.5,
    reviewCount: 140,
    priceRange: '$',
    photoUris: [],
    venueType: 'hawker',
    vibeDescription: 'Pillowy soft baos that have been a neighbourhood staple for decades.',
    vibeSummary:
      'The BBQ pork bao is the crowd favourite — soft, fluffy, and not too sweet. The curry rice combo next door pairs perfectly. A great breakfast stop before the morning crowd hits.',
    openStatus: 'open',
    openingTime: '7:00 AM',
    closingTime: '12:00 PM',
    driveTimeMinutes: 9,
    dishIds: ['d-5', 'd-6', 'd-8'],
  },
  {
    id: 'stall-5',
    name: 'Common Man Coffee Roasters',
    hawkerCenterId: 'hc-1',
    locationId: 'loc-1',
    address: '22 Martin Rd, Singapore 239058',
    rating: 4.5,
    reviewCount: 210,
    priceRange: '$$',
    photoUris: [],
    venueType: 'cafe',
    vibeDescription: 'Specialty coffee and all-day brunch in a cosy warehouse space.',
    vibeSummary:
      'The flat whites are exceptional and the avocado toast is a crowd favourite. Comes alive on weekends — arrive early or expect a wait. Great spot for a slow morning.',
    openStatus: 'open',
    openingTime: '8:00 AM',
    closingTime: '5:00 PM',
    awards: [
      { name: 'Get Fed Top Cafes', year: 2024, icon: '☕' },
    ],
    driveTimeMinutes: 10,
    dishIds: [],
  },
  {
    id: 'stall-6',
    name: 'Fleur de Sel',
    hawkerCenterId: 'hc-3',
    locationId: 'loc-3',
    address: '8 Dempsey Rd, Singapore 249672',
    rating: 4.6,
    reviewCount: 95,
    priceRange: '$$$',
    photoUris: [],
    venueType: 'restaurant',
    vibeDescription: 'French bistro fare with a relaxed Dempsey Hill atmosphere.',
    vibeSummary:
      'The steak frites and crème brûlée are must-orders. Service is warm and unhurried — ideal for a long dinner. Booking ahead on weekends is strongly advised.',
    openStatus: 'open',
    openingTime: '12:00 PM',
    closingTime: '10:00 PM',
    driveTimeMinutes: 15,
    dishIds: [],
  },
];

// ─── Users ───────────────────────────────────────────────────────────────────

export const users: User[] = [
  { id: 'u-1', displayName: 'Ali', avatarUri: null, reviewCount: 12, photoCount: 8 },
  { id: 'u-2', displayName: 'Mei Lin', avatarUri: null, reviewCount: 34, photoCount: 21 },
  { id: 'u-3', displayName: 'Raj', avatarUri: null, reviewCount: 7, photoCount: 3 },
];

/** The current "logged-in" guest user for MVP (no auth yet) */
export const CURRENT_USER_ID = 'u-1';

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const reviews: Review[] = [
  {
    id: 'r-1',
    userId: 'u-2',
    stallId: 'stall-1',
    dishId: 'd-2',
    tasteRating: 5,
    valueRating: 5,
    queueRating: 3,
    comment: 'Best chicken rice in Singapore, no contest. The skin is perfectly silky.',
    photoUris: [],
    createdAt: '2026-02-14T08:30:00Z',
  },
  {
    id: 'r-2',
    userId: 'u-3',
    stallId: 'stall-1',
    dishId: 'd-2',
    tasteRating: 4,
    valueRating: 5,
    queueRating: 4,
    comment: 'Solid. A little bland for my taste but the chilli makes up for it.',
    photoUris: [],
    createdAt: '2026-01-22T12:15:00Z',
  },
  {
    id: 'r-3',
    userId: 'u-1',
    stallId: 'stall-2',
    dishId: 'd-1',
    tasteRating: 5,
    valueRating: 4,
    queueRating: 3,
    comment: 'Rich broth, generous prawns. Eating with a spoon is the move.',
    photoUris: [],
    createdAt: '2026-03-01T11:00:00Z',
  },
  {
    id: 'r-4',
    userId: 'u-2',
    stallId: 'stall-3',
    dishId: 'd-4',
    tasteRating: 5,
    valueRating: 4,
    queueRating: 2,
    comment: 'The wok hei is unreal. Worth the early wake-up.',
    photoUris: [],
    createdAt: '2026-02-28T09:45:00Z',
  },
  // ─── Extra Laksa (d-1) reviews for lazy-load testing ───
  { id: 'r-5', userId: 'u-2', stallId: 'stall-2', dishId: 'd-1', tasteRating: 5, valueRating: 5, queueRating: 4, comment: 'Coconut broth is so rich. Best laksa in Katong area.', photoUris: [], createdAt: '2026-02-20T12:00:00Z' },
  { id: 'r-6', userId: 'u-3', stallId: 'stall-2', dishId: 'd-1', tasteRating: 4, valueRating: 4, queueRating: 3, comment: 'Good portion size. Queue moves fast at 11am.', photoUris: [], createdAt: '2026-02-18T11:30:00Z' },
  { id: 'r-7', userId: 'u-1', stallId: 'stall-2', dishId: 'd-1', tasteRating: 5, valueRating: 4, queueRating: 2, comment: 'Short noodles are genius — no splatter. Will come back.', photoUris: [], createdAt: '2026-02-15T09:15:00Z' },
  { id: 'r-8', userId: 'u-2', stallId: 'stall-2', dishId: 'd-1', tasteRating: 4, valueRating: 5, queueRating: 5, comment: 'Value for money. The sambal elevates everything.', photoUris: [], createdAt: '2026-02-12T13:45:00Z' },
  { id: 'r-9', userId: 'u-3', stallId: 'stall-2', dishId: 'd-1', tasteRating: 5, valueRating: 4, queueRating: 3, comment: 'Prawns were fresh. Broth had the right amount of spice.', photoUris: [], createdAt: '2026-02-10T10:00:00Z' },
  { id: 'r-10', userId: 'u-1', stallId: 'stall-2', dishId: 'd-1', tasteRating: 4, valueRating: 4, queueRating: 4, comment: 'Solid laksa. A bit crowded on weekends.', photoUris: [], createdAt: '2026-02-08T14:20:00Z' },
  { id: 'r-11', userId: 'u-2', stallId: 'stall-2', dishId: 'd-1', tasteRating: 5, valueRating: 5, queueRating: 3, comment: 'Tourist-friendly but locals love it too. No compromise on taste.', photoUris: [], createdAt: '2026-02-05T11:00:00Z' },
  { id: 'r-12', userId: 'u-3', stallId: 'stall-2', dishId: 'd-1', tasteRating: 4, valueRating: 4, queueRating: 2, comment: 'Wok hei from the broth? Maybe not, but the flavour is there.', photoUris: [], createdAt: '2026-02-03T12:30:00Z' },
  { id: 'r-13', userId: 'u-1', stallId: 'stall-2', dishId: 'd-1', tasteRating: 5, valueRating: 4, queueRating: 4, comment: 'Third time here. Consistency is key — always good.', photoUris: [], createdAt: '2026-01-30T09:45:00Z' },
  { id: 'r-14', userId: 'u-2', stallId: 'stall-2', dishId: 'd-1', tasteRating: 4, valueRating: 5, queueRating: 5, comment: 'Cheap and cheerful. Perfect lunch spot.', photoUris: [], createdAt: '2026-01-28T13:00:00Z' },
  { id: 'r-15', userId: 'u-3', stallId: 'stall-2', dishId: 'd-1', tasteRating: 5, valueRating: 4, queueRating: 3, comment: 'The cockles are optional but I always add them. Worth it.', photoUris: [], createdAt: '2026-01-25T10:15:00Z' },
  { id: 'r-16', userId: 'u-1', stallId: 'stall-2', dishId: 'd-1', tasteRating: 4, valueRating: 4, queueRating: 3, comment: 'Not too heavy. Good for a quick lunch.', photoUris: [], createdAt: '2026-01-22T11:30:00Z' },
  { id: 'r-17', userId: 'u-2', stallId: 'stall-2', dishId: 'd-1', tasteRating: 5, valueRating: 5, queueRating: 4, comment: 'Brought my overseas friends here. They were blown away.', photoUris: [], createdAt: '2026-01-20T12:00:00Z' },
  { id: 'r-18', userId: 'u-3', stallId: 'stall-2', dishId: 'd-1', tasteRating: 4, valueRating: 4, queueRating: 2, comment: 'Can get spicy if you ask. Default is mild-medium.', photoUris: [], createdAt: '2026-01-18T14:00:00Z' },
  { id: 'r-19', userId: 'u-1', stallId: 'stall-2', dishId: 'd-1', tasteRating: 5, valueRating: 4, queueRating: 3, comment: 'Laksa for breakfast? Yes. This is the one.', photoUris: [], createdAt: '2026-01-15T08:45:00Z' },
  { id: 'r-20', userId: 'u-2', stallId: 'stall-2', dishId: 'd-1', tasteRating: 4, valueRating: 5, queueRating: 5, comment: 'Consistent quality. Never had a bad bowl.', photoUris: [], createdAt: '2026-01-12T11:00:00Z' },
  { id: 'r-21', userId: 'u-3', stallId: 'stall-2', dishId: 'd-1', tasteRating: 5, valueRating: 4, queueRating: 4, comment: 'The tau pok soaks up the broth perfectly. Must try.', photoUris: [], createdAt: '2026-01-10T13:20:00Z' },
  { id: 'r-22', userId: 'u-1', stallId: 'stall-2', dishId: 'd-1', tasteRating: 4, valueRating: 4, queueRating: 3, comment: 'Good for takeaway too. Broth stays hot in the container.', photoUris: [], createdAt: '2026-01-08T10:30:00Z' },
  { id: 'r-23', userId: 'u-2', stallId: 'stall-2', dishId: 'd-1', tasteRating: 5, valueRating: 5, queueRating: 3, comment: 'Legendary status deserved. Will queue again anytime.', photoUris: [], createdAt: '2026-01-05T12:00:00Z' },
];

// ─── Photos ──────────────────────────────────────────────────────────────────

export const photos: Photo[] = [];

// ─── Badges ──────────────────────────────────────────────────────────────────

export const badges: Badge[] = [
  {
    id: 'b-1',
    name: 'Laksa Hunter',
    description: 'Try laksa at 5 different stalls.',
    icon: '🍜',
    category: 'dish',
    requiredCount: 5,
  },
  {
    id: 'b-2',
    name: 'Hawker Explorer',
    description: 'Visit 10 different hawker centres.',
    icon: '🗺️',
    category: 'explorer',
    requiredCount: 10,
  },
  {
    id: 'b-3',
    name: 'Roulette Adventurer',
    description: 'Use the food roulette 5 times.',
    icon: '🎰',
    category: 'roulette',
    requiredCount: 5,
  },
  {
    id: 'b-4',
    name: 'Critic',
    description: 'Submit 10 reviews.',
    icon: '✍️',
    category: 'review',
    requiredCount: 10,
  },
  {
    id: 'b-5',
    name: 'Chicken Rice Connoisseur',
    description: 'Try chicken rice at 3 different stalls.',
    icon: '🍚',
    category: 'dish',
    requiredCount: 3,
  },
];

// ─── Visits ──────────────────────────────────────────────────────────────────

export const visits: Visit[] = [
  { id: 'v-1', userId: 'u-1', stallId: 'stall-1', createdAt: '2026-02-10T12:00:00Z' },
  { id: 'v-2', userId: 'u-1', stallId: 'stall-2', createdAt: '2026-03-01T11:00:00Z' },
];

// ─── Lookup helpers ──────────────────────────────────────────────────────────

export function getStallById(id: string): Stall | undefined {
  return stalls.find((s) => s.id === id);
}

export function getDishById(id: string): Dish | undefined {
  return dishes.find((d) => d.id === id);
}

export function getDishTypeBySlug(slug: string): DishType | undefined {
  return dishTypes.find((dt) => dt.slug === slug);
}

export function getListingsForDishType(dishTypeId: string): DishListing[] {
  return dishListings
    .filter((listing) => listing.dishTypeId === dishTypeId)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
}

export function getDishTypeSlugForDishId(dishId: string): string | undefined {
  const dish = getDishById(dishId);
  if (!dish) return undefined;
  return slugifyDishName(dish.name);
}

export function getDishTypeSlugForQuery(query: string): string | undefined {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return undefined;

  const exact = dishTypes.find(
    (dt) =>
      dt.slug === normalized ||
      dt.name.toLowerCase() === normalized ||
      dt.aliases?.some((alias) => alias.toLowerCase() === normalized),
  );
  if (exact) return exact.slug;

  const partial = dishTypes.find(
    (dt) =>
      dt.slug.includes(normalized) ||
      normalized.includes(dt.slug) ||
      dt.name.toLowerCase().includes(normalized) ||
      normalized.includes(dt.name.toLowerCase()),
  );
  return partial?.slug;
}

export function getHawkerCenterById(id: string): HawkerCenter | undefined {
  return hawkerCenters.find((hc) => hc.id === id);
}

export function getLocationById(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}

export function getReviewsForStall(stallId: string): Review[] {
  return reviews.filter((r) => r.stallId === stallId);
}

export function getDishesForStall(stallId: string): Dish[] {
  const stall = getStallById(stallId);
  if (!stall) return [];
  return stall.dishIds.map((id) => getDishById(id)).filter((d): d is Dish => d !== undefined);
}

export function getStallsForDish(dishId: string): Stall[] {
  return stalls.filter((s) => s.dishIds.includes(dishId));
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}
