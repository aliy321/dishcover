import type { Dish, HawkerCenter, Location, Stall } from '@/types';

export const hawkerCenters: HawkerCenter[] = [
  { id: 'hc-1', name: 'Maxwell Food Centre' },
  { id: 'hc-2', name: 'Old Airport Road Food Centre' },
  { id: 'hc-3', name: 'Tiong Bahru Market' },
];

export const locations: Location[] = [
  { id: 'loc-1', latitude: 1.2804, longitude: 103.8443 },
  { id: 'loc-2', latitude: 1.3072, longitude: 103.8834 },
  { id: 'loc-3', latitude: 1.2868, longitude: 103.8335 },
];

export const stalls: Stall[] = [
  { id: 'stall-1', name: 'Tian Tian Hainanese Chicken Rice', hawkerCenterId: 'hc-1', locationId: 'loc-1' },
  { id: 'stall-2', name: '328 Katong Laksa', hawkerCenterId: 'hc-1', locationId: 'loc-1' },
  { id: 'stall-3', name: 'Lao Fu Zi Fried Kway Teow', hawkerCenterId: 'hc-2', locationId: 'loc-2' },
  { id: 'stall-4', name: 'Tiong Bahru Pau', hawkerCenterId: 'hc-3', locationId: 'loc-3' },
];

export const dishes: Dish[] = [
  { id: 'd-1', name: 'Laksa', rating: 4.6, reviewCount: 320, price: '$5', photoUri: null },
  { id: 'd-2', name: 'Chicken Rice', rating: 4.7, reviewCount: 120, price: '$4', photoUri: null },
  { id: 'd-3', name: 'Chicken Soup', rating: 4.5, reviewCount: 80, price: '$3.50', photoUri: null },
  { id: 'd-4', name: 'Char Kway Teow', rating: 4.4, reviewCount: 200, price: '$5.50', photoUri: null },
  { id: 'd-5', name: 'Hainanese Curry Rice', rating: 4.3, reviewCount: 95, price: '$6', photoUri: null },
];
