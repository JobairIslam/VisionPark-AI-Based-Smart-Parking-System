'use client';

import { useMemo, useState } from 'react';
import {
  Calendar,
  Clock,
  Download,
  History as HistoryIcon,
  CalendarX,
  Timer,
  DollarSign,
  Hash,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { BookingStatus } from '@/lib/types';

interface HistoryRecord {
  spotId: string;
  zone: string;
  date: string;
  time: string;
  duration: number;
  cost: number;
  status: BookingStatus;
}

function buildHistory(): HistoryRecord[] {
  const zones = ['A', 'B'];
  const records: HistoryRecord[] = [];
  // Deterministic spread across last 30 days
  const offsets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15, 17, 19, 21, 23, 26, 29];
  const times = ['08:15', '09:30', '10:45', '11:20', '13:00', '14:10', '15:35', '16:50', '18:05', '19:30'];
  for (let i = 0; i < 20; i++) {
    const dayOffset = offsets[i];
    const d = new Date(2026, 5, 5);
    d.setDate(d.getDate() - dayOffset);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const zone = zones[i % 2];
    const spotNum = ((i * 7) % 20) + 1;
    const duration = (i % 4) + 1;
    const status: BookingStatus = i % 5 === 4 ? 'cancelled' : 'completed';
    records.push({
      spotId: `${zone}-${String(spotNum).padStart(2, '0')}`,
      zone,
      date: dateStr,
      time: times[i % times.length],
      duration,
      cost: duration * 2.5,
      status,
    });
  }
  return records;
}

const ALL_HISTORY: HistoryRecord[] = buildHistory();
const PAGE_SIZE = 6;

const STATUS_STYLE: Record<BookingStatus, string> = {
  active: 'bg-[rgba(0,217,126,0.15)] text-ps-available',
  completed: 'bg-white/10 text-ps-text-muted',
  cancelled: 'bg-[rgba(255,77,79,0.15)] text-ps-occupied',
};

export default function HistoryPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [applied, setApplied] = useState<{ from: string; to: string }>({ from: '', to: '' });
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(false);

  const filtered = useMemo(() => {
    return ALL_HISTORY.filter((r) => {
      if (!applied.from && !applied.to) return true;
      const rec = new Date(r.date);
      if (applied.from) {
        const f = new Date(applied.from);
        if (rec < f) return false;
      }
      if (applied.to) {
        const t = new Date(applied.to);
        t.setHours(23, 59, 59, 999);
        if (rec > t) return false;
      }
      return true;
    });
  }, [applied]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const totalSessions = filtered.length;
  const totalHours = filtered.reduce((s, r) => s + r.duration, 0);
  const totalSpent = filtered
    .filter((r) => r.status !== 'cancelled')
    .reduce((s, r) => s + r.cost, 0);

  function applyFilter() {
    setApplied({ from, to });
    setPage(1);
  }

  function clearFilter() {
    setFrom('');
    setTo('');
    setApplied({ from: '', to: '' });
    setPage(1);
  }

  function exportCsv() {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  const maxHours = Math.max(...ALL_HISTORY.map((r) => r.duration), 1);

  return (
    <div className="min-h-screen bg-ps-bg">
      <Navbar />
      <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        {/* Header */}
        <section className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-white font-bold text-[28px] leading-tight">Parking History</h1>
            <p className="text-ps-text-muted text-sm mt-1">
              A complete log of all your past parking sessions
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col">
              <label className="text-ps-text-muted text-[11px] mb-1">From</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="ps-input h-10 px-3 text-sm text-white"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-ps-text-muted text-[11px] mb-1">To</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="ps-input h-10 px-3 text-sm text-white"
              />
            </div>
            <button
              onClick={applyFilter}
              className="h-10 px-4 rounded-btn bg-ps-primary text-white text-sm font-semibold hover:bg-ps-primary-hover hover:ps-glow ps-transition"
            >
              Filter
            </button>
          </div>
        </section>

        {/* Summary cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="ps-card p-5 animate-fade-in" style={{ animationDelay: '60ms' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-ps-text-muted text-xs uppercase tracking-wide">Total Sessions</p>
                <p className="text-ps-primary text-3xl font-bold mt-1">{totalSessions}</p>
              </div>
              <Hash className="text-ps-primary" size={22} />
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-ps-primary" style={{ width: `${(totalSessions / ALL_HISTORY.length) * 100}%` }} />
            </div>
          </div>
          <div className="ps-card p-5 animate-fade-in" style={{ animationDelay: '120ms' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-ps-text-muted text-xs uppercase tracking-wide">Total Hours</p>
                <p className="text-ps-available text-3xl font-bold mt-1">{totalHours}</p>
              </div>
              <Timer className="text-ps-available" size={22} />
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-ps-available" style={{ width: `${(totalHours / (ALL_HISTORY.length * 4)) * 100}%` }} />
            </div>
          </div>
          <div className="ps-card p-5 animate-fade-in" style={{ animationDelay: '180ms' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-ps-text-muted text-xs uppercase tracking-wide">Total Spent</p>
                <p className="text-ps-warning text-3xl font-bold mt-1">${totalSpent.toFixed(2)}</p>
              </div>
              <DollarSign className="text-ps-warning" size={22} />
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-ps-warning" style={{ width: `${(totalSpent / (ALL_HISTORY.length * 4 * 2.5)) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Table section */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HistoryIcon className="text-ps-primary" size={18} />
              <h2 className="text-white font-bold text-lg">Session Log</h2>
            </div>
            <button
              onClick={exportCsv}
              className="h-10 px-4 rounded-btn border border-ps-primary/50 text-ps-primary text-sm font-semibold flex items-center gap-2 hover:bg-ps-primary/10 ps-transition"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>

          {pageItems.length === 0 ? (
            <div className="ps-card p-12 flex flex-col items-center text-center animate-fade-in">
              <CalendarX className="text-ps-text-muted mb-4" size={40} strokeWidth={1.5} />
              <h3 className="text-white font-semibold text-lg">No history found for the selected dates</h3>
              <p className="text-ps-text-muted text-sm mt-1 mb-5">Try a different date range or clear the filter.</p>
              <button
                onClick={clearFilter}
                className="h-11 px-5 rounded-btn bg-ps-primary text-white text-sm font-semibold hover:bg-ps-primary-hover hover:ps-glow ps-transition"
              >
                Clear Filter
              </button>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block ps-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-ps-text-muted text-[11px] uppercase tracking-wide" style={{ backgroundColor: '#12122A' }}>
                        <th className="text-left font-medium px-4 py-3">Spot ID</th>
                        <th className="text-left font-medium px-4 py-3">Zone</th>
                        <th className="text-left font-medium px-4 py-3">Date &amp; Time</th>
                        <th className="text-left font-medium px-4 py-3">Duration</th>
                        <th className="text-left font-medium px-4 py-3">Cost</th>
                        <th className="text-left font-medium px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((r, i) => (
                        <tr
                          key={`${r.spotId}-${i}`}
                          className="border-b border-ps-primary/10 last:border-0 hover:bg-white/[0.03] ps-transition relative"
                          style={{ backgroundColor: i % 2 === 0 ? '#1A1A2E' : '#16162A' }}
                        >
                          <td className="px-4 py-3">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-pill bg-ps-primary/15 text-ps-primary">
                              {r.spotId}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-ps-text-muted">Zone {r.zone}</td>
                          <td className="px-4 py-3 text-white">{r.date} · {r.time}</td>
                          <td className="px-4 py-3 text-ps-text-muted">{r.duration}h</td>
                          <td className="px-4 py-3 text-white font-semibold">${r.cost.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-pill ${STATUS_STYLE[r.status]}`}>
                              {r.status[0].toUpperCase() + r.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile card list */}
              <div className="md:hidden flex flex-col gap-3">
                {pageItems.map((r, i) => (
                  <div
                    key={`${r.spotId}-${i}`}
                    className="ps-card p-4 animate-fade-in"
                    style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-pill bg-ps-primary/15 text-ps-primary">
                        {r.spotId}
                      </span>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-pill ${STATUS_STYLE[r.status]}`}>
                        {r.status[0].toUpperCase() + r.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <p className="text-ps-text-muted flex items-center gap-1.5">
                        <Calendar size={13} /> {r.date}
                      </p>
                      <p className="text-ps-text-muted flex items-center gap-1.5">
                        <Clock size={13} /> {r.time}
                      </p>
                      <p className="text-ps-text-muted flex items-center gap-1.5">
                        <Timer size={13} /> {r.duration}h
                      </p>
                      <p className="text-white font-semibold">${r.cost.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-ps-text-muted text-xs">
                  Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length} results
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="h-9 px-3 rounded-btn border border-white/10 text-ps-text-muted text-sm hover:text-white hover:border-ps-primary/40 ps-transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`h-9 w-9 rounded-btn text-sm font-medium ps-transition ${
                        safePage === i + 1
                          ? 'bg-ps-primary text-white'
                          : 'border border-white/10 text-ps-text-muted hover:text-white hover:border-ps-primary/40'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="h-9 px-3 rounded-btn border border-white/10 text-ps-text-muted text-sm hover:text-white hover:border-ps-primary/40 ps-transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />

      {toast && (
        <div className="fixed top-20 right-4 z-[70] animate-slide-in-right">
          <div className="flex items-center gap-3 ps-card px-4 py-3" style={{ borderColor: 'rgba(108,99,255,0.4)' }}>
            <Download className="text-ps-primary" size={20} />
            <div>
              <p className="text-white text-sm font-semibold">Export coming soon!</p>
              <p className="text-ps-text-muted text-xs">CSV export is on the way.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
