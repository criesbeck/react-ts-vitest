import type { Restroom, FilterOptions, RestroomWithDistance, Location } from '../types';
import { calculateDistance, estimateWalkTime } from './geolocation';

/**
 * Apply filters to restroom list
 */
export function applyFilters(
  restrooms: Restroom[],
  filters: FilterOptions
): Restroom[] {
  return restrooms.filter((restroom) => {
    if (filters.wheelchairAccessible && !restroom.isWheelchairAccessible) {
      return false;
    }
    if (filters.genderNeutral && !restroom.isGenderNeutral) {
      return false;
    }
    if (filters.wildcardFree && restroom.requiresWildcard) {
      return false;
    }
    return true;
  });
}

/**
 * Add distance information to restrooms and sort by distance
 */
export function addDistanceAndSort(
  restrooms: Restroom[],
  userLocation: Location
): RestroomWithDistance[] {
  const restroomsWithDistance: RestroomWithDistance[] = restrooms.map((restroom) => {
    const distance = calculateDistance(userLocation, restroom.location);
    return {
      ...restroom,
      distance,
      estimatedWalkTime: estimateWalkTime(distance),
    };
  });

  return restroomsWithDistance.sort((a, b) => a.distance - b.distance);
}

/**
 * Find nearest restroom matching filters
 */
export function findNearestRestroom(
  restrooms: Restroom[],
  userLocation: Location,
  filters: FilterOptions
): RestroomWithDistance | null {
  const filtered = applyFilters(restrooms, filters);
  const sorted = addDistanceAndSort(filtered, userLocation);
  return sorted[0] || null;
}
