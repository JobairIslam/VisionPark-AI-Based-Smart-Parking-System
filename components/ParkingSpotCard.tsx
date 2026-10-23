'use client';

import { Car, X } from 'lucide-react';
import type { Booking, ParkingSpot } from '@/lib/types';

interface Props {
  spot: ParkingSpot;
  onBook: (spot: ParkingSpot) => void;
  onCancel?: (booking: Booking) => void;
  cancelling?: boolean;
  userBookings?: Booking[];
}

const STATUS_META = {
  available: {
    label: 'Free',
    badge: 'bg-[rgba(0,217,126,0.15)] text-ps-available',
    car: 'text-ps-available',
    btn: 'bg-ps-available/15 text-ps-available hover:bg-ps-available hover:text-ps-bg hover:ps-green-glow',
    btnLabel: 'Book Now',
    disabled: false,
  },
  occupied: {
    label: 'Booked',
    badge: 'bg-[rgba(255,77,79,0.15)] text-ps-occupied',
    car: 'text-ps-text-muted',
    btn: 'bg-white/5 text-ps-text-muted cursor-not-allowed',
    btnLabel: 'Booked',
    disabled: true,
  },
} as const;

export default function ParkingSpotCard({
  spot,
  onBook,
  onCancel,
  cancelling,
  userBookings,
}: Props) {
  const meta = STATUS_META[spot.status];
  const isAvailable = spot.status === 'available';
  const userBooking = userBookings?.find((b) => b.slotId === spot.slotId && b.status === 'active') ?? null;
  const isUsersBooking = !!userBooking;

  return (
    <div
      className={`ps-card p-4 ps-transition flex flex-col gap-3 ${
        isAvailable
          ? 'hover:ps-green-glow hover:scale-[1.03] hover:border-ps-available/40'
          : isUsersBooking
            ? ''
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

      {isUsersBooking && userBooking ? (
        <button
          type="button"
          onClick={() => onCancel?.(userBooking)}
          disabled={cancelling}
          className="h-10 rounded-btn text-sm font-semibold ps-transition inline-flex items-center justify-center gap-1.5 bg-red-600 text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={16} />
          {cancelling ? 'Cancelling…' : 'Cancel'}
        </button>
      ) : (
        <button
          disabled={meta.disabled}
          onClick={() => !meta.disabled && onBook(spot)}
          className={`h-10 rounded-btn text-sm font-semibold ps-transition ${meta.btn}`}
        >
          {meta.btnLabel}
        </button>
      )}
    </div>
  );
}
