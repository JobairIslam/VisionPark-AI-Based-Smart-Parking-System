export type SpotStatus = 'available' | 'occupied' | 'reserved';

export interface ParkingSpot {
  id: string;
  zone: string;
  status: SpotStatus;
  floor: number;
}

export type BookingStatus = 'active' | 'completed' | 'cancelled';

export interface Booking {
  spotId: string;
  date: string;
  duration: number;
  cost: number;
  status: BookingStatus;
}
