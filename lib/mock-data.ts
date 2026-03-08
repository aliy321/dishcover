import type {
  Badge,
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
    stallIds: ['stall-4'],
  },
];

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
    vibeDescription: 'Legendary chicken rice with queues that move surprisingly fast.',
    vibeSummary:
      'Diners rave about the silky smooth chicken and fragrant rice. The chilli sauce is consistently praised as the best in Singapore. Expect a short queue on weekday mornings.',
    openStatus: 'open',
    closingTime: '8:00 PM',
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
    vibeDescription: 'The laksa that tourists and locals both swear by.',
    vibeSummary:
      'The thick coconut broth and plump prawns are the stars here. Many note that the short noodles (pre-cut so you can eat with a spoon) are a distinctive touch. Can get crowded at lunch.',
    openStatus: 'open',
    closingTime: '9:00 PM',
    driveTimeMinutes: 7,
    dishIds: ['d-1'],
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
    vibeDescription: 'Old-school wok magic with serious smoky flavour.',
    vibeSummary:
      'The wok hei here is real — regulars say you can smell it from the other end of the hawker centre. The cockles are always fresh and generous. Arrive early as they sell out.',
    openStatus: 'closed',
    closingTime: '3:00 PM',
    driveTimeMinutes: 12,
    dishIds: ['d-4'],
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
    vibeDescription: 'Pillowy soft baos that have been a neighbourhood staple for decades.',
    vibeSummary:
      'The BBQ pork bao is the crowd favourite — soft, fluffy, and not too sweet. The curry rice combo next door pairs perfectly. A great breakfast stop before the morning crowd hits.',
    openStatus: 'open',
    closingTime: '12:00 PM',
    driveTimeMinutes: 9,
    dishIds: ['d-5', 'd-6'],
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
