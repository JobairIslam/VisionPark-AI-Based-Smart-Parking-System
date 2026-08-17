'use client';

import { Car } from 'lucide-react';
import type { ParkingSpot } from '@/lib/types';

interface Props {
  spot: ParkingSpot;
  onBook: (spot: ParkingSpot) => void;
}

const STATUS_META = {
  available: {
    label: 'Available',
    badge: 'bg-[rgba(0,217,126,0.15)] text-ps-available',
    car: 'text-ps-available',
    btn: 'bg-ps-available/15 text-ps-available hover:bg-ps-available hover:text-ps-bg hover:ps-green-glow',
    btnLabel: 'Book Now',
    disabled: false,
  },
  occupied: {
    label: 'Occupied',
    badge: 'bg-[rgba(255,77,79,0.15)] text-ps-occupied',
    car: 'text-ps-text-muted',
    btn: 'bg-white/5 text-ps-text-muted cursor-not-allowed',
    btnLabel: 'Occupied',
    disabled: true,
  },
  reserved: {
    label: 'Reserved',
    badge: 'bg-[rgba(255,184,0,0.15)] text-ps-warning',
    car: 'text-ps-warning',
    btn: 'bg-ps-warning/15 text-ps-warning cursor-not-allowed',
    btnLabel: 'Reserved',
    disabled: true,
  },
} as const;

export default function ParkingSpotCard({ spot, onBook }: Props) {
  const meta = STATUS_META[spot.status];
  const isAvailable = spot.status === 'available';

  return (
    <div
      className={`ps-card p-4 ps-transition flex flex-col gap-3 ${
        isAvailable
          ? 'hover:ps-green-glow hover:scale-[1.03] hover:border-ps-available/40'
          : 'opacity-70'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-white font-bold text-sm">{spot.id}</span>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-pill ${meta.badge}`}>
          {meta.label}
        </span>
      </div>

      <div className="flex items-center justify-center py-3">
        <Car
          size={40}
          strokeWidth={1.5}
          className={`${meta.car} ${isAvailable ? 'animate-car-pulse' : ''}`}
        />
      </div>

      <button
        disabled={meta.disabled}
        onClick={() => !meta.disabled && onBook(spot)}
        className={`h-10 rounded-btn text-sm font-semibold ps-transition ${meta.btn}`}
      >
        {meta.btnLabel}
      </button>
    </div>
  );
}
