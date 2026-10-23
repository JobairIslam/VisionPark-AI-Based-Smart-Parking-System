'use client';

import { LayoutGrid } from 'lucide-react';
import type { Booking, ParkingSpot } from '@/lib/types';
import type { FilterKey } from './FilterBar';
import ParkingSpotCard from './ParkingSpotCard';

interface Props {
  spots: ParkingSpot[];
  filter: FilterKey;
  query: string;
  onBook: (spot: ParkingSpot) => void;
  onCancel?: (booking: Booking) => void;
  cancelling?: boolean;
  userBookings?: Booking[];
}

export default function ParkingGrid({
  spots,
  filter,
  query,
  onBook,
  onCancel,
  cancelling,
  userBookings,
}: Props) {
  const filtered = spots
    .filter((s) => {
      if (filter !== 'all' && s.status !== filter) return false;
      if (query && !s.id.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => a.slotId - b.slotId);

  return (
    <section>
      <div className="flex items-center gap-2 mb-1">
        <LayoutGrid className="text-ps-primary" size={18} />
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map((spot, i) => (
            <div
              key={spot.slotId}
              className="animate-fade-in"
              style={{ animationDelay: `${Math.min(i * 30, 600)}ms` }}
            >
              <ParkingSpotCard
                spot={spot}
                onBook={onBook}
                onCancel={onCancel}
                cancelling={cancelling}
                userBookings={userBookings}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
