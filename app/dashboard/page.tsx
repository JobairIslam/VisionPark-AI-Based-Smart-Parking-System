'use client';

import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import StatsBar from '@/components/StatsBar';
import FilterBar, { type FilterKey } from '@/components/FilterBar';
import ParkingGrid from '@/components/ParkingGrid';
import BookingModal from '@/components/BookingModal';
import RecentActivity from '@/components/RecentActivity';
import Footer from '@/components/Footer';
import { parkingSpots } from '@/lib/parkingData';
import type { Booking, ParkingSpot } from '@/lib/types';

export default function DashboardPage() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [query, setQuery] = useState('');
  const [modalSpot, setModalSpot] = useState<ParkingSpot | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [spots, setSpots] = useState<ParkingSpot[]>(parkingSpots);

  const activeBooking = useMemo(
    () => bookings.find((b) => b.status === 'active') ?? null,
    [bookings]
  );

  function handleConfirm(spot: ParkingSpot, duration: number, cost: number) {
    setSpots((prev) =>
      prev.map((s) =>
        s.id === spot.id ? { ...s, status: 'reserved' as const } : s
      )
    );
    const booking: Booking = {
      spotId: spot.id,
      date: new Date().toLocaleDateString(),
      duration,
      cost,
      status: 'active',
    };
    setBookings((prev) => [booking, ...prev]);
  }

  return (
    <div className="min-h-screen bg-ps-bg">
      <Navbar />

      <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        {/* Hero */}
        <section
          className="relative overflow-hidden rounded-card mt-4 px-6 py-8 sm:py-10"
          style={{
            background:
              'linear-gradient(180deg, #1A1A2E 0%, #0F0F1A 100%)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, rgba(108,99,255,0.18), transparent 60%)',
            }}
          />
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-white font-bold text-2xl sm:text-[26px]">
                Real-Time Parking Overview
              </h1>
              <p className="text-ps-text-muted text-[13px] mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-ps-primary" /> AI-monitored
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-ps-available" /> Live Updates
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-ps-warning" /> Instant Booking
                </span>
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 ps-card px-3.5 py-2" style={{ borderRadius: '50px' }}>
              <span className="w-2 h-2 rounded-full bg-ps-available animate-pulse-dot" />
              <span className="text-ps-available text-xs font-semibold">System Active</span>
            </div>
          </div>
        </section>

        <div className="mt-6 space-y-8">
          <StatsBar spots={spots} activeBooking={activeBooking} />

          <FilterBar
            active={filter}
            onChange={setFilter}
            query={query}
            onQuery={setQuery}
          />

          <ParkingGrid
            spots={spots}
            filter={filter}
            query={query}
            onBook={(s) => setModalSpot(s)}
          />

          <RecentActivity bookings={bookings} />
        </div>
      </main>

      <Footer />

      <BookingModal
        spot={modalSpot}
        onClose={() => setModalSpot(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
