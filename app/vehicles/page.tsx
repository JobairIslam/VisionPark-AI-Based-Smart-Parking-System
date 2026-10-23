'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Car, Plus, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mapVehicle } from '@/lib/mappers';
import type { ApiVehicle, Vehicle } from '@/lib/types';

export default function VehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setError('');
    try {
      const res = await axios.get('/api/vehicles');
      const list = ((res.data.vehicles || []) as ApiVehicle[]).map(mapVehicle);
      setVehicles(list);
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        router.push('/login');
        return;
      }
      setError(
        axios.isAxiosError(e) && e.response?.data?.message
          ? String(e.response.data.message)
          : 'Failed to load vehicles'
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function createVehicle(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !number.trim()) {
      setError('Enter a vehicle name and plate number');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await axios.post('/api/vehicles', {
        name: name.trim(),
        number: number.trim(),
      });
      const created = mapVehicle(res.data.vehicle);
      setVehicles((prev) => [...prev, created]);
      setName('');
      setNumber('');
    } catch (e: unknown) {
      setError(
        axios.isAxiosError(e) && e.response?.data?.message
          ? String(e.response.data.message)
          : 'Failed to create vehicle'
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteVehicle(id: number) {
    setDeletingId(id);
    setError('');
    try {
      await axios.delete(`/api/vehicle/${id}`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (e: unknown) {
      setError(
        axios.isAxiosError(e) && e.response?.data?.message
          ? String(e.response.data.message)
          : 'Failed to delete vehicle'
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-ps-bg">
      <Navbar />
      <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <section className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-white font-bold text-[28px] leading-tight">Vehicles</h1>
            <p className="text-ps-text-muted text-sm mt-1">
              Register a vehicle before booking a parking slot
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-pill bg-ps-primary/15 text-ps-primary w-fit">
            {vehicles.length} Registered
          </span>
        </section>

        <form
          onSubmit={createVehicle}
          className="mt-6 ps-card p-5 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end"
        >
          <div>
            <label className="text-ps-text-muted text-[11px] mb-1 block">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Civic"
              className="ps-input w-full h-11 px-3 text-sm text-white placeholder:text-ps-text-muted"
            />
          </div>
          <div>
            <label className="text-ps-text-muted text-[11px] mb-1 block">Plate number</label>
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="e.g. DHA-1234"
              className="ps-input w-full h-11 px-3 text-sm text-white placeholder:text-ps-text-muted"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="h-11 px-5 rounded-btn bg-ps-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-ps-primary-hover disabled:opacity-60"
          >
            <Plus size={16} />
            {saving ? 'Saving…' : 'Add vehicle'}
          </button>
        </form>

        {error && <p className="text-ps-occupied text-sm mt-4">{error}</p>}

        <div className="mt-6">
          {loading ? (
            <p className="text-ps-text-muted text-sm">Loading vehicles…</p>
          ) : vehicles.length === 0 ? (
            <div className="ps-card p-12 flex flex-col items-center text-center">
              <Car className="text-ps-text-muted mb-4" size={40} strokeWidth={1.5} />
              <h3 className="text-white font-semibold text-lg">No vehicles yet</h3>
              <p className="text-ps-text-muted text-sm mt-1">
                Add a vehicle above, then book a free slot from the dashboard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="ps-card p-5 flex items-center gap-4 hover:border-ps-primary/40 ps-transition"
                >
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-ps-primary/15 text-ps-primary flex items-center justify-center">
                    <Car size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{v.name}</p>
                    <p className="text-ps-text-muted text-sm mt-0.5">{v.number}</p>
                  </div>
                  <button
                    type="button"
                    disabled={deletingId === v.id}
                    onClick={() => deleteVehicle(v.id)}
                    className="h-10 px-3 rounded-btn border border-ps-occupied/40 text-ps-occupied text-xs font-semibold flex items-center gap-1.5 hover:bg-ps-occupied/10 disabled:opacity-60"
                  >
                    <Trash2 size={14} />
                    {deletingId === v.id ? 'Removing…' : 'Delete'}
                  </button>
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
