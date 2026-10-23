'use client';

import { MapPin } from 'lucide-react';
import type { ParkingSpot } from '@/lib/types';
import type { FilterKey } from './FilterBar';
import ParkingSpotCard from './ParkingSpotCard';

interface Props {
  spots: ParkingSpot[];
  filter: FilterKey;
  query: string;
  onBook: (spot: ParkingSpot) => void;
}

export default function ParkingGrid({ spots, filter, query, onBook }: Props) {
  const filtered = spots.filter((s) => {
    if (filter !== 'all' && s.status !== filter) return false;
    if (query && !s.id.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const zones = Array.from(new Set(filtered.map((s) => s.zone))).sort();

  return (
    <section>
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="text-ps-primary" size={18} />
        <h2 className="text-white font-bold text-lg">Parking Lot</h2>
      </div>
      <p className="text-ps-text-muted text-sm mb-4">
        Select a free spot to book it. Numbers come from the parking API.
      </p>

      {filtered.length === 0 ? (
        <div className="ps-card p-10 text-center text-ps-text-muted text-sm">
          No spots match your filter.
        </div>
      ) : (
        <div className="space-y-8">
          {zones.map((zone) => {
            const zoneSpots = filtered.filter((s) => s.zone === zone);
            return (
              <div key={zone}>
                <h3 className="text-white font-semibold text-sm mb-3">
                  Zone {zone}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                  {zoneSpots.map((spot, i) => (
                    <div
                      key={spot.slotId}
                      className="animate-fade-in"
                      style={{ animationDelay: `${Math.min(i * 30, 600)}ms` }}
                    >
                      <ParkingSpotCard spot={spot} onBook={onBook} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
