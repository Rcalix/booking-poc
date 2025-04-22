
import api from './api';
import { Booking, CreateBookingDto } from '../types';

export const getBookings = async (): Promise<Booking[]> => {
  const response = await api.get('/bookings');
  return response.data;
};

export const getBooking = async (id: string): Promise<Booking> => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

export const createBooking = async (booking: CreateBookingDto): Promise<Booking> => {
  const response = await api.post('/bookings', booking);
  return response.data;
};

export const deleteBooking = async (id: string): Promise<void> => {
  console.log('Deleting booking with ID:', id);
  await api.delete(`/bookings/${id}`);
};

export const checkGoogleCalendarConflicts = async (startTime: string, endTime: string): Promise<{ hasConflict: boolean, message?: string }> => {
  const response = await api.get('/google/check-conflicts', {
    params: { startTime, endTime },
  });
  return response.data;
};

export const connectGoogleCalendar = (): void => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/google/connect`;
};