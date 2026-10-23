export type SpotStatus = 'available' | 'occupied';

export interface ParkingSpot {
  /** Display id from slot name, e.g. A-01 */
  id: string;
  /** Numeric Laravel slot primary key */
  slotId: number;
  zone: string;
  status: SpotStatus;
  floor: number;
}

export type BookingStatus = 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: number;
  spotId: string;
  slotId: number;
  zone: string;
  date: string;
  time: string;
  duration: number;
  cost: number;
  status: BookingStatus;
  vehicleName?: string;
  vehicleNumber?: string;
  entryTime: string;
  exitTime: string | null;
}

export interface Vehicle {
  id: number;
  name: string;
  number: string;
  user_id?: number;
}

/** Raw shapes from Laravel API */
export interface ApiSlot {
  id: number;
  name: string;
  coordinates: unknown;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiVehicle {
  id: number;
  user_id: number;
  name: string;
  number: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiBooking {
  id: number;
  vehicle_id: number;
  slot_id: number;
  entry_time: string;
  exit_time: string | null;
  created_at?: string;
  updated_at?: string;
  vehicle?: ApiVehicle;
  slot?: ApiSlot;
}
