import type { Destination } from "@/types/destination";
import type { TourImage } from "@/types/tour";

const photos = (id: string): TourImage[] =>
  [1, 2, 3].map((n) => ({
    id: `${id}-img${n}`,
    url: `https://picsum.photos/seed/dest-${id}-${n}/1200/800`,
    caption: n === 1 ? "Cover photo" : "",
  }));

/** Mock "database". The destination service mutates this array in place. */
export const destinations: Destination[] = [
  {
    id: "d1",
    name: "Siem Reap",
    region: "Siem Reap Province",
    description:
      "Gateway to the Angkor temples, with lively markets, apsara dance shows and countryside villages nearby.",
    highlights: ["Angkor Archaeological Park", "Tonle Sap floating villages", "Pub Street and night markets"],
    bestSeason: "November to March",
    latitude: 13.3671,
    longitude: 103.8448,
    images: photos("d1"),
    published: true,
    featured: true,
    createdAt: "2026-02-10T09:00:00.000Z",
    updatedAt: "2026-10-20T09:00:00.000Z",
  },
  {
    id: "d2",
    name: "Phnom Penh",
    region: "Phnom Penh",
    description: "The riverside capital, where the Royal Palace, museums and street food sit beside the Mekong.",
    highlights: ["Royal Palace and Silver Pagoda", "National Museum", "Riverside promenade"],
    bestSeason: "November to February",
    latitude: 11.5564,
    longitude: 104.9282,
    images: photos("d2"),
    published: true,
    featured: false,
    createdAt: "2026-02-12T09:00:00.000Z",
    updatedAt: "2026-09-14T09:00:00.000Z",
  },
  {
    id: "d3",
    name: "Sihanoukville",
    region: "Preah Sihanouk Province",
    description: "A coastal hub for beaches and the islands of the Gulf of Thailand.",
    highlights: ["Otres and Serendipity beaches", "Island boat trips", "Seafood by the sea"],
    bestSeason: "November to April",
    latitude: 10.6093,
    longitude: 103.5296,
    images: photos("d3"),
    published: true,
    featured: false,
    createdAt: "2026-02-15T09:00:00.000Z",
    updatedAt: "2026-08-02T09:00:00.000Z",
  },
  {
    id: "d4",
    name: "Kampot",
    region: "Kampot Province",
    description: "A relaxed riverside town known for pepper farms, old French buildings and Bokor Mountain.",
    highlights: ["Pepper plantations", "Sunset river cruises", "Bokor Hill Station"],
    bestSeason: "November to May",
    latitude: 10.6104,
    longitude: 104.1815,
    images: photos("d4"),
    published: true,
    featured: true,
    createdAt: "2026-03-01T09:00:00.000Z",
    updatedAt: "2026-09-30T09:00:00.000Z",
  },
  {
    id: "d5",
    name: "Battambang",
    region: "Battambang Province",
    description: "Cambodia's rice bowl, with colonial architecture, the bamboo train and the bat caves.",
    highlights: ["Bamboo train", "Phnom Sampov bat caves", "Colonial old town"],
    bestSeason: "November to March",
    latitude: 13.0957,
    longitude: 103.2022,
    images: photos("d5"),
    published: true,
    featured: false,
    createdAt: "2026-03-05T09:00:00.000Z",
    updatedAt: "2026-07-18T09:00:00.000Z",
  },
  {
    id: "d6",
    name: "Kep",
    region: "Kep Province",
    description: "A quiet seaside town famous for its crab market and nearby Rabbit Island.",
    highlights: ["Crab market", "Rabbit Island", "Kep National Park"],
    bestSeason: "November to April",
    latitude: 10.4829,
    longitude: 104.3167,
    images: [],
    published: false,
    featured: false,
    createdAt: "2026-10-02T09:00:00.000Z",
    updatedAt: "2026-10-02T09:00:00.000Z",
  },
];

/**
 * Live list of destination names, used by the tour form and filters.
 * The destination service keeps it in sync, so those files need no changes.
 * Phase 10 replaces this with a query to the real API.
 */
export const destinationNames: string[] = destinations.map((d) => d.name);

export function syncDestinationNames() {
  destinationNames.splice(0, destinationNames.length, ...destinations.map((d) => d.name));
}