'use client';

import { useEffect, useState } from 'react';
import { X, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import type { ParkingSpot } from '@/lib/types';
import { HOURLY_RATE } from '@/lib/parkingData';

interface Props {
  spot: ParkingSpot | null;
  onClose: () => void;
  onConfirm: (spot: ParkingSpot, duration: number, cost: number) => void;
}

const DURATIONS = [1, 2, 3, 4];

export default function BookingModal({ spot, onClose, onConfirm }: Props) {
  const [duration, setDuration] = useState(1);
  const [now, setNow] = useState<string>('');
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (spot) {
      setDuration(1);
      setNow(
        new Date().toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      );
    }
  }, [spot]);

  useEffect(() => {
    if (!spot) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [spot, onClose]);

  if (!spot) return null;

  const cost = duration * HOURLY_RATE;

  function confirm() {
    onConfirm(spot!, duration, cost);
    setToast(true);
    setTimeout(() => {
      setToast(false);
      onClose();
    }, 1500);
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-[400px] ps-card ps-glow p-6 sm:p-8 rounded-t-2xl sm:rounded-2xl animate-scale-in"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-bold text-lg">
              Book Spot {spot.id}
            </h3>
            <button
              onClick={onClose}
              className="text-ps-text-muted hover:text-white ps-transition"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-pill bg-ps-primary/15 text-ps-primary">
              {spot.id}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-pill bg-[rgba(0,217,126,0.15)] text-ps-available">
              Available
            </span>
          </div>

          <p className="text-ps-text-muted text-xs mb-5">{now}</p>

          <div className="mb-5">
            <p className="text-ps-text-muted text-xs mb-2 flex items-center gap-1.5">
              <Clock size={13} /> Duration
            </p>
            <div className="grid grid-cols-4 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`h-10 rounded-btn text-sm font-semibold ps-transition ${
                    duration === d
                      ? 'bg-ps-primary text-white'
                      : 'bg-ps-card-2 border border-white/10 text-ps-text-muted hover:text-white hover:border-ps-primary/40'
                  }`}
                >
                  {d}h
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between ps-card p-3 mb-5" style={{ borderRadius: '10px' }}>
            <span className="text-ps-text-muted text-sm flex items-center gap-1.5">
              <DollarSign size={14} /> Estimated Cost
            </span>
            <span className="text-white font-bold text-lg">
              ${cost.toFixed(2)}
            </span>
          </div>

          <button
            onClick={confirm}
            className="w-full h-12 rounded-btn bg-ps-primary text-white font-semibold text-sm hover:bg-ps-primary-hover hover:ps-glow ps-transition"
          >
            Confirm Booking
          </button>
          <button
            onClick={onClose}
            className="w-full h-10 mt-2 text-ps-text-muted text-sm hover:text-white ps-transition"
          >
            Cancel
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed top-20 right-4 z-[70] animate-slide-in-right">
          <div className="flex items-center gap-3 ps-card px-4 py-3" style={{ borderColor: 'rgba(0,217,126,0.4)' }}>
            <CheckCircle2 className="text-ps-available" size={20} />
            <div>
              <p className="text-white text-sm font-semibold">Booking confirmed</p>
              <p className="text-ps-text-muted text-xs">
                Spot {spot.id} booked successfully!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
