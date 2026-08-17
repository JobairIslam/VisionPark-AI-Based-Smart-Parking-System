'use client';

import { History, CarFront } from 'lucide-react';
import type { Booking } from '@/lib/types';

interface Props {
  bookings: Booking[];
}

const STATUS_STYLE: Record<Booking['status'], string> = {
  active: 'bg-[rgba(0,217,126,0.15)] text-ps-available',
  completed: 'bg-white/10 text-ps-text-muted',
  cancelled: 'bg-[rgba(255,77,79,0.15)] text-ps-occupied',
};

export default function RecentActivity({ bookings }: Props) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <History className="text-ps-primary" size={18} />
        <h2 className="text-white font-bold text-lg">Recent Activity</h2>
      </div>

      {bookings.length === 0 ? (
        <div className="ps-card p-10 flex flex-col items-center text-center">
          <CarFront className="text-ps-text-muted mb-3" size={32} strokeWidth={1.5} />
          <p className="text-ps-text-muted text-sm">
            No bookings yet. Reserve a spot above.
          </p>
        </div>
      ) : (
        <div className="ps-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-ps-text-muted text-xs uppercase tracking-wide border-b border-white/5">
                  <th className="text-left font-medium px-4 py-3">Spot</th>
                  <th className="text-left font-medium px-4 py-3">Date</th>
                  <th className="text-left font-medium px-4 py-3">Duration</th>
                  <th className="text-left font-medium px-4 py-3">Cost</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] ps-transition"
                  >
                    <td className="px-4 py-3 text-white font-semibold">{b.spotId}</td>
                    <td className="px-4 py-3 text-ps-text-muted">{b.date}</td>
                    <td className="px-4 py-3 text-ps-text-muted">{b.duration}h</td>
                    <td className="px-4 py-3 text-ps-text-muted">${b.cost.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-pill ${STATUS_STYLE[b.status]}`}>
                        {b.status[0].toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
