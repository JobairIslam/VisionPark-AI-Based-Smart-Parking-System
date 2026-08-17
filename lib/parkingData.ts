import type { ParkingSpot, SpotStatus } from './types';

// Deterministic distribution: 16 available, 20 occupied, 4 reserved
const STATUS_SEQUENCE: SpotStatus[] = [
  'available', 'occupied', 'available', 'occupied', 'available',
  'occupied', 'available', 'occupied', 'available', 'occupied',
  'available', 'occupied', 'available', 'occupied', 'available',
  'occupied', 'available', 'occupied', 'available', 'occupied',
  'occupied', 'available', 'occupied', 'available', 'occupied',
  'occupied', 'available', 'occupied', 'occupied', 'occupied',
  'occupied', 'reserved', 'occupied', 'occupied', 'reserved',
  'occupied', 'occupied', 'reserved', 'occupied', 'reserved',
];

function buildSpots(): ParkingSpot[] {
  const spots: ParkingSpot[] = [];
  const zones = ['A', 'B'];
  for (let z = 0; z < zones.length; z++) {
    const zone = zones[z];
    for (let i = 1; i <= 20; i++) {
      const idx = z * 20 + (i - 1);
      spots.push({
        id: `${zone}-${String(i).padStart(2, '0')}`,
        zone,
        status: STATUS_SEQUENCE[idx],
        floor: z + 1,
      });
    }
  }
  return spots;
}

export const parkingSpots: ParkingSpot[] = buildSpots();

export const HOURLY_RATE = 2.5;
