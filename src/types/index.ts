// Core data types for FlushRush

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Restroom {
  id: string;
  name: string;
  buildingName: string;
  floor: string;
  location: Location;
  isWheelchairAccessible: boolean;
  isGenderNeutral: boolean;
  requiresWildcard: boolean;
  photoUrls?: string[];
  accessibilityNotes?: string;
  status: 'open' | 'closed' | 'cleaning' | 'blocked';
  lastUpdated: Date;
}

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  isGuest: boolean;
  preferences: UserPreferences;
}

export interface UserPreferences {
  alwaysPrioritizeWheelchair: boolean;
  preferGenderNeutral: boolean;
  avoidWildcardRequired: boolean;
}

export interface Review {
  id: string;
  restroomId: string;
  userId: string;
  userName: string;
  rating: 'up' | 'down';
  comment?: string;
  createdAt: Date;
  flags: number;
}

export interface FilterOptions {
  wheelchairAccessible: boolean;
  genderNeutral: boolean;
  wildcardFree: boolean;
  sortByDistance: boolean;
}

export interface RestroomWithDistance extends Restroom {
  distance: number; // in meters
  estimatedWalkTime: number; // in minutes
}

export interface Issue {
  id: string;
  restroomId: string;
  description: string;
  isResolved: boolean;
  createdAt: Date;
}
