export interface Dish {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  price: string;
  photoUri?: string | null;
}

export interface Stall {
  id: string;
  name: string;
  hawkerCenterId: string;
  locationId: string;
}

export interface HawkerCenter {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  latitude: number;
  longitude: number;
}
