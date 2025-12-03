import type { Restroom } from '../types';

// Sample Northwestern University restroom data for development
export const sampleRestrooms: Restroom[] = [
  {
    id: '1',
    name: 'First Floor Restroom',
    buildingName: 'Technological Institute',
    floor: '1st Floor',
    location: {
      latitude: 42.057849751535045,
      longitude: -87.6758684427529,
    },
    isWheelchairAccessible: true,
    isGenderNeutral: false,
    requiresWildcard: false,
    accessibilityNotes: 'Wide entrance, grab bars available',
    status: 'open',
    lastUpdated: new Date(),
    photoUrls: [],
  },
  {
    id: '2',
    name: 'Main Level Gender Neutral',
    buildingName: 'Norris University Center',
    floor: 'Ground Floor',
    location: {
      latitude: 42.0538565198848,
      longitude: -87.67286112088877
    },
    isWheelchairAccessible: true,
    isGenderNeutral: true,
    requiresWildcard: false,
    accessibilityNotes: 'Single-stall, accessible fixtures',
    status: 'open',
    lastUpdated: new Date(),
    photoUrls: [],
  },
  {
    id: '3',
    name: 'Library 2nd Floor',
    buildingName: 'Main Library',
    floor: '2nd Floor',
    location: {
      latitude: 42.053437095890374, 
      longitude: -87.6741069441599
    },
    isWheelchairAccessible: true,
    isGenderNeutral: false,
    requiresWildcard: true,
    accessibilityNotes: 'Accessible, requires wildcard after 10pm',
    status: 'open',
    lastUpdated: new Date(),
    photoUrls: [],
  },
  {
    id: '4',
    name: 'Basement Restroom',
    buildingName: 'Kresge Centennial Hall',
    floor: 'Basement',
    location: {
      latitude: 42.05201366755738, 
      longitude: -87.67508484415995
    },
    isWheelchairAccessible: false,
    isGenderNeutral: false,
    requiresWildcard: false,
    status: 'open',
    lastUpdated: new Date(),
    photoUrls: [],
  },
  {
    id: '5',
    name: 'Gender Neutral 3rd Floor',
    buildingName: 'Mudd Library',
    floor: '3rd Floor',
    location: {
      latitude:42.05840729057804, 
      longitude: -87.6743465481133
    },
    isWheelchairAccessible: true,
    isGenderNeutral: true,
    requiresWildcard: false,
    accessibilityNotes: 'Single-occupancy, fully accessible',
    status: 'open',
    lastUpdated: new Date(),
    photoUrls: [],
  },
  {
    id: '6',
    name: 'West Wing Ground Floor',
    buildingName: 'Blomquist Recreation Center',
    floor: 'Ground Floor',
    location: {
      latitude: 42.05464061881015, 
      longitude: -87.6780409404497
    },
    isWheelchairAccessible: true,
    isGenderNeutral: true,
    requiresWildcard: false,
    accessibilityNotes: 'Locker room accessible restrooms',
    status: 'open',
    lastUpdated: new Date(),
    photoUrls: [],
  },
  {
    id: '7',
    name: 'Second Floor East',
    buildingName: 'Frances Searle Building',
    floor: '2nd Floor',
    location: {
      latitude: 42.0586482730594, 
      longitude: -87.67355831887622
    },
    isWheelchairAccessible: true,
    isGenderNeutral: false,
    requiresWildcard: false,
    status: 'open',
    lastUpdated: new Date(),
    photoUrls: [],
  },
];
