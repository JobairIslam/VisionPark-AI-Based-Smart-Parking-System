import { HOURLY_RATE } from '@/lib/parkingData';
import type {
  ApiBooking,
  ApiSlot,
  Booking,
  BookingStatus,
  ParkingSpot,
  SpotStatus,
  Vehicle,
  ApiVehicle,
} from '@/lib/types';

export function parseZoneAndFloor(name: string): { zone: string; floor: number } {
  const zone = (name.split('-')[0] || 'A').toUpperCase();
  const floor = zone === 'B' ? 2 : 1;
  return { zone, floor };
}

function normalizeSpotStatus(status: string): SpotStatus {
  const s = status?.toLowerCase();
  return s === 'available' || s === 'open' || s === 'free' ? 'available' : 'occupied';
}

export function mapSlotToSpot(slot: ApiSlot): ParkingSpot {
  const { zone, floor } = parseZoneAndFloor(slot.name);
  return {
    id: slot.name,
    slotId: slot.id,
    zone,
    status: normalizeSpotStatus(slot.status),
    floor,
  };
}

export function mapVehicle(v: ApiVehicle): Vehicle {
  return {
    id: v.id,
    name: v.name,
    number: v.number,
    user_id: v.user_id,
  };
}

function hoursBetween(entry: string, exit: string | null): number {
  const start = new Date(entry).getTime();
  const end = exit ? new Date(exit).getTime() : Date.now();
  if (Number.isNaN(start)) return 1;
  const hours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
  return hours;
}

function bookingStatus(exitTime: string | null): BookingStatus {
  if (!exitTime) return 'active';
  // Planned exit still in the future → active session
  return new Date(exitTime).getTime() > Date.now() ? 'active' : 'completed';
}

export function mapBooking(b: ApiBooking): Booking {
  const spotName = b.slot?.name ?? `Slot-${b.slot_id}`;
  const { zone } = parseZoneAndFloor(spotName);
  const entry = new Date(b.entry_time);
  const duration = hoursBetween(b.entry_time, b.exit_time);

  return {
    id: b.id,
    spotId: spotName,
    slotId: b.slot_id,
    zone,
    date: entry.toLocaleDateString(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    time: entry.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    duration,
    cost: duration * HOURLY_RATE,
    status: bookingStatus(b.exit_time),
    vehicleName: b.vehicle?.name,
    vehicleNumber: b.vehicle?.number,
    entryTime: b.entry_time,
    exitTime: b.exit_time,
  };
}
