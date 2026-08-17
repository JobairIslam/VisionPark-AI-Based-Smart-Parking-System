'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, CalendarX, CircleParking } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Booking, BookingStatus } from '@/lib/types';

interface SampleBooking extends Booking {
  zone: string;
  time: string;
}

const SAMPLE_BOOKINGS: SampleBooking[] = [
  { spotId: 'A-04', zone: 'A', date: 'Jul 05, 2026', time: '14:30', duration: 2, cost: 5.0, status: 'active' },
  { spotId: 'B-12', zone: 'B', date: 'Jul 05, 2026', time: '09:15', duration: 3, cost: 7.5, status: 'active' },
  { spotId: 'A-11', zone: 'A', date: 'Jul 03, 2026', time: '11:00', duration: 1, cost: 2.5, status: 'completed' },
  { spotId: 'B-07', zone: 'B', date: 'Jul 02, 2026', time: '16:45', duration: 4, cost: 10.0, status: 'completed' },
  { spotId: 'A-19', zone: 'A', date: 'Jun 30, 2026', time: '08:20', duration: 2, cost: 5.0, status: 'completed' },
  { spotId: 'B-03', zone: 'B', date: 'Jun 28, 2026', time: '13:10', duration: 3, cost: 7.5, status: 'completed' },
  { spotId: 'A-08', zone: 'A', date: 'Jun 25, 2026', time: '10:00', duration: 1, cost: 2.5, status: 'cancelled' },
  { spotId: 'B-15', zone: 'B', date: 'Jun 22, 2026', time: '18:30', duration: 2, cost: 5.0, status: 'cancelled' },
];

type Tab = 'all' | BookingStatus;

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const STATUS_STYLE: Record<BookingStatus, string> = {
  active: 'bg-[rgba(0,217,126,0.15)] text-ps-available',
  completed: 'bg-white/10 text-ps-text-muted',
  cancelled: 'bg-[rgba(255,77,79,0.15)] text-ps-occupied',
};

const STATUS_ORDER: Record<BookingStatus, number> = { active: 0, completed: 1, cancelled: 2 };

const EMPTY_SUBTITLE: Record<Tab, string> = {
  all: 'You haven’t made any bookings yet.',
  active: 'You have no active bookings.',
  completed: 'You have no completed bookings.',
  cancelled: 'You have no cancelled bookings.',
};

export default function MyBookingsPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [bookings, setBookings] = useState<SampleBooking[]>(SAMPLE_BOOKINGS);

  const filtered = useMemo(() => {
    const list = tab === 'all' ? bookings : bookings.filter((b) => b.status === tab);
    return [...list].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  }, [bookings, tab]);

  const total = bookings.length;
  const activeCount = bookings.filter((b) => b.status === 'active').length;
  const totalSpent = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.cost, 0);

  function cancelBooking(spotId: string) {
    setBookings((prev) =>
      prev.map((b) => (b.spotId === spotId ? { ...b, status: 'cancelled' as const } : b))
    );
  }

  return (
    <div className="min-h-screen bg-ps-bg">
      <Navbar />
      <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        {/* Header */}
        <section className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-white font-bold text-[28px] leading-tight">My Bookings</h1>
            <p className="text-ps-text-muted text-sm mt-1">
              Manage and track all your parking reservations
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-pill bg-ps-primary/15 text-ps-primary">
              {total} Total
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-pill bg-[rgba(0,217,126,0.15)] text-ps-available">
              {activeCount} Active
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-pill bg-[rgba(255,184,0,0.15)] text-ps-warning">
              ${totalSpent.toFixed(2)} Spent
            </span>
          </div>
        </section>

        {/* Filter tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 h-9 px-4 rounded-pill text-sm font-medium ps-transition ${
                tab === t.key
                  ? 'bg-ps-primary text-white'
                  : 'bg-ps-card border border-ps-primary/20 text-ps-text-muted hover:text-white hover:border-ps-primary/40'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        <div className="mt-6">
          {filtered.length === 0 ? (
            <div className="ps-card p-12 flex flex-col items-center text-center animate-fade-in">
              <CalendarX className="text-ps-text-muted mb-4" size={40} strokeWidth={1.5} />
              <h3 className="text-white font-semibold text-lg">No bookings found</h3>
              <p className="text-ps-text-muted text-sm mt-1 mb-5">{EMPTY_SUBTITLE[tab]}</p>
              {tab === 'all' && (
                <Link
                  href="/dashboard"
                  className="h-11 px-5 rounded-btn bg-ps-primary text-white text-sm font-semibold flex items-center hover:bg-ps-primary-hover hover:ps-glow ps-transition"
                >
                  Find a Spot
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map((b, i) => (
                <div
                  key={`${b.spotId}-${i}`}
                  className="ps-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-in hover:border-ps-primary/40 hover:ps-glow ps-transition"
                  style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                >
                  {/* Spot badge */}
                  <div className="w-14 h-14 shrink-0 rounded-xl bg-ps-primary text-white font-bold text-base flex items-center justify-center">
                    {b.spotId}
                  </div>

                  {/* Middle */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-base">
                      {b.spotId} <span className="text-ps-text-muted font-normal text-sm">· Zone {b.zone}</span>
                    </p>
                    <p className="text-ps-text-muted text-xs mt-1.5 flex items-center gap-1.5">
                      <Calendar size={13} /> {b.date} · {b.time}
                    </p>
                    <p className="text-ps-text-muted text-xs mt-1 flex items-center gap-1.5">
                      <Clock size={13} /> {b.duration} hour{b.duration > 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Right */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-2">
                    <p className="text-white font-bold text-lg">${b.cost.toFixed(2)}</p>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-pill ${STATUS_STYLE[b.status]}`}>
                      {b.status[0].toUpperCase() + b.status.slice(1)}
                    </span>
                    <div className="mt-1">
                      {b.status === 'active' && (
                        <button
                          onClick={() => cancelBooking(b.spotId)}
                          className="h-9 px-3 rounded-btn border border-ps-occupied/50 text-ps-occupied text-xs font-semibold hover:bg-ps-occupied/10 ps-transition"
                        >
                          Cancel Booking
                        </button>
                      )}
                      {b.status === 'completed' && (
                        <Link
                          href="/dashboard"
                          className="h-9 px-3 rounded-btn border border-ps-primary/50 text-ps-primary text-xs font-semibold hover:bg-ps-primary/10 ps-transition inline-flex items-center"
                        >
                          Book Again
                        </Link>
                      )}
                      {b.status === 'cancelled' && (
                        <button
                          disabled
                          className="h-9 px-3 rounded-btn bg-white/5 text-ps-text-muted text-xs font-semibold cursor-not-allowed"
                        >
                          Cancelled
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
