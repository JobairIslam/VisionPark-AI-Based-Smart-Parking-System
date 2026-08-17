'use client';

import { Search } from 'lucide-react';
import type { SpotStatus } from '@/lib/types';

export type FilterKey = 'all' | SpotStatus;

const PILLS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All Spots' },
  { key: 'available', label: 'Available' },
  { key: 'occupied', label: 'Occupied' },
  { key: 'reserved', label: 'Reserved' },
];

interface Props {
  active: FilterKey;
  onChange: (k: FilterKey) => void;
  query: string;
  onQuery: (q: string) => void;
}

export default function FilterBar({ active, onChange, query, onQuery }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        {PILLS.map((p) => (
          <button
            key={p.key}
            onClick={() => onChange(p.key)}
            className={`shrink-0 h-9 px-4 rounded-pill text-sm font-medium ps-transition ${
              active === p.key
                ? 'bg-ps-primary text-white'
                : 'bg-ps-card border border-ps-primary/20 text-ps-text-muted hover:text-white hover:border-ps-primary/40'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="relative sm:ml-auto sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ps-text-muted" size={16} />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search spot ID"
          className="ps-input w-full h-9 pl-9 pr-3 text-sm text-white placeholder:text-ps-text-muted"
        />
      </div>
    </div>
  );
}
