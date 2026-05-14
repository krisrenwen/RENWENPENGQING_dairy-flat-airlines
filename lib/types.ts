export type BookingStatus = "confirmed" | "cancelled";

export type Booking = {
  bookingRef: string;
  passengerName: string;
  email: string;
  status: BookingStatus;
  bookedAt: string;
};

export type Schedule = {
  flightNo: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  aircraft: string;
  capacity: number;
  price: number;
  bookings: Booking[];
};

export type Airport = {
  code: string;
  name: string;
  city: string;
  timezone: string;
};