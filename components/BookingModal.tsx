'use client';

import { useEffect, useState } from 'react';
import { X, Clock, DollarSign, CheckCircle2, Car } from 'lucide-react';
import axios from 'axios';
import type { ParkingSpot, Vehicle } from '@/lib/types';
import { HOURLY_RATE } from '@/lib/parkingData';
import { mapVehicle } from '@/lib/mappers';

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
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleId, setVehicleId] = useState<number | ''>('');
  const [showNewVehicle, setShowNewVehicle] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [savingVehicle, setSavingVehicle] = useState(false);

  useEffect(() => {
    if (!spot) return;
    setDuration(1);
    setError('');
    setToast(false);
    setShowNewVehicle(false);
    setNewName('');
    setNewNumber('');
    setNow(
      new Date().toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    );

    (async () => {
      try {
        const res = await axios.get('/api/vehicles');
        const list = (res.data.vehicles || []).map(mapVehicle);
        setVehicles(list);
        setVehicleId(list[0]?.id ?? '');
        if (list.length === 0) setShowNewVehicle(true);
      } catch {
        setVehicles([]);
        setShowNewVehicle(true);
      }
    })();
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

  async function createVehicle() {
    if (!newName.trim() || !newNumber.trim()) {
      setError('Enter vehicle name and number');
      return;
    }
    setSavingVehicle(true);
    setError('');
    try {
      const res = await axios.post('/api/vehicles', {
        name: newName.trim(),
        number: newNumber.trim(),
      });
      const created = mapVehicle(res.data.vehicle);
      setVehicles((prev) => [...prev, created]);
      setVehicleId(created.id);
      setShowNewVehicle(false);
      setNewName('');
      setNewNumber('');
    } catch (e: unknown) {
      const msg =
        axios.isAxiosError(e) && e.response?.data?.message
          ? String(e.response.data.message)
          : 'Failed to create vehicle';
      setError(msg);
    } finally {
      setSavingVehicle(false);
    }
  }

  async function confirm() {
    if (!vehicleId) {
      setError('Select or create a vehicle first');
      return;
    }

    setSubmitting(true);
    setError('');

    const entry = new Date();
    const exit = new Date(entry.getTime() + duration * 60 * 60 * 1000);

    try {
      await axios.post(`/api/booking/${spot!.slotId}`, {
        vehicle_id: vehicleId,
        entry_time: entry.toISOString(),
        exit_time: exit.toISOString(),
      });

      onConfirm(spot!, duration, cost);
      setToast(true);
      setTimeout(() => {
        setToast(false);
        onClose();
      }, 1200);
    } catch (e: unknown) {
      const msg =
        axios.isAxiosError(e) && e.response?.data?.message
          ? String(e.response.data.message)
          : 'Booking failed';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
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
          className="w-full sm:max-w-[400px] ps-card ps-glow p-6 sm:p-8 rounded-t-2xl sm:rounded-2xl animate-scale-in max-h-[90vh] overflow-y-auto"
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
              Free
            </span>
          </div>

          <p className="text-ps-text-muted text-xs mb-5">{now}</p>

          <div className="mb-5">
            <p className="text-ps-text-muted text-xs mb-2 flex items-center gap-1.5">
              <Car size={13} /> Vehicle
            </p>
            {vehicles.length > 0 && !showNewVehicle && (
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(Number(e.target.value))}
                className="ps-input w-full h-10 text-sm text-white mb-2"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id} className="bg-ps-card text-white">
                    {v.name} ({v.number})
                  </option>
                ))}
              </select>
            )}
            {showNewVehicle ? (
              <div className="space-y-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Vehicle name"
                  className="ps-input w-full h-10 text-sm text-white placeholder:text-ps-text-muted"
                />
                <input
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  placeholder="Plate number"
                  className="ps-input w-full h-10 text-sm text-white placeholder:text-ps-text-muted"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={savingVehicle}
                    onClick={createVehicle}
                    className="flex-1 h-9 rounded-btn bg-ps-primary text-white text-xs font-semibold hover:bg-ps-primary-hover disabled:opacity-60"
                  >
                    {savingVehicle ? 'Saving…' : 'Save vehicle'}
                  </button>
                  {vehicles.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewVehicle(false)}
                      className="h-9 px-3 rounded-btn border border-white/10 text-ps-text-muted text-xs"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowNewVehicle(true)}
                className="text-ps-primary text-xs font-semibold hover:text-ps-primary-hover"
              >
                + Add another vehicle
              </button>
            )}
          </div>

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

          {error && (
            <p className="text-ps-occupied text-xs mb-3">{error}</p>
          )}

          <button
            onClick={confirm}
            disabled={submitting}
            className="w-full h-12 rounded-btn bg-ps-primary text-white font-semibold text-sm hover:bg-ps-primary-hover hover:ps-glow ps-transition disabled:opacity-60"
          >
            {submitting ? 'Booking…' : 'Confirm Booking'}
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
