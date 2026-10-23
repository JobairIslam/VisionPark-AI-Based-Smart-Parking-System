'use client';

import { useEffect, useState } from 'react';
import { CircleCheck, CircleX, CalendarClock } from 'lucide-react';
import type { ParkingSpot, Booking } from '@/lib/types';

interface Props {
  spots: ParkingSpot[];
  activeBooking: Booking | null;
}

function useCountUp(target: number, duration = 800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function CountdownTimer({ until }: { until: string | null }) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const tick = () => {
      if (!until) {
        setRemaining(0);
        return;
      }
      const ms = new Date(until).getTime() - Date.now();
      setRemaining(Math.max(0, Math.floor(ms / 1000)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [until]);
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  return (
    <span className="font-mono text-ps-primary text-lg font-semibold">
      {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  );
}

export default function StatsBar({ spots, activeBooking }: Props) {
  const available = spots.filter((s) => s.status === 'available').length;
  const occupied = spots.filter((s) => s.status === 'occupied').length;
  const total = spots.length;

  const availCount = useCountUp(available);
  const occCount = useCountUp(occupied);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="ps-card p-5 animate-fade-in" style={{ animationDelay: '60ms' }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-ps-text-muted text-xs uppercase tracking-wide">Free</p>
            <p className="text-ps-available text-3xl font-bold mt-1">{availCount}</p>
          </div>
          <CircleCheck className="text-ps-available" size={22} />
        </div>
        <div className="mt-4 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-ps-available ps-transition-all"
            style={{ width: `${total ? (available / total) * 100 : 0}%` }}
          />
        </div>
        <p className="text-ps-text-muted text-[11px] mt-2">
          {total ? Math.round((available / total) * 100) : 0}% of {total} spots free
        </p>
      </div>

      <div className="ps-card p-5 animate-fade-in" style={{ animationDelay: '120ms' }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-ps-text-muted text-xs uppercase tracking-wide">Booked</p>
            <p className="text-ps-occupied text-3xl font-bold mt-1">{occCount}</p>
          </div>
          <CircleX className="text-ps-occupied" size={22} />
        </div>
        <div className="mt-4 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-ps-occupied ps-transition-all"
            style={{ width: `${total ? (occupied / total) * 100 : 0}%` }}
          />
        </div>
        <p className="text-ps-text-muted text-[11px] mt-2">
          {total ? Math.round((occupied / total) * 100) : 0}% of {total} spots taken
        </p>
      </div>

      <div className="ps-card p-5 animate-fade-in" style={{ animationDelay: '180ms' }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-ps-text-muted text-xs uppercase tracking-wide">Active Booking</p>
            {activeBooking ? (
              <p className="text-ps-primary text-xl font-bold mt-1">{activeBooking.spotId}</p>
            ) : (
              <p className="text-ps-text-muted text-base mt-2">No Active Booking</p>
            )}
          </div>
          <CalendarClock className="text-ps-primary" size={22} />
        </div>
        <div className="mt-4">
          {activeBooking ? (
            <div className="flex items-center gap-2">
              <span className="text-ps-text-muted text-xs">Time left</span>
              <CountdownTimer until={activeBooking.exitTime} />
            </div>
          ) : (
            <p className="text-ps-text-muted text-[11px]">Reserve a spot to begin a session</p>
          )}
        </div>
      </div>
    </div>
  );
}
