"use client";

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Booking, CreateBookingDto } from '../types';
import * as bookingService from '../services/bookings';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';

export default function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings');
      toast.error('Could not load bookings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (data: CreateBookingDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const newBooking = await bookingService.createBooking(data);
      setBookings(prev => [...prev, newBooking]);
      
      toast.success('Booking created successfully');
      return newBooking;
    } catch (err) {
      setError('Failed to create booking');
      toast.error('Could not create booking');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteBooking = useCallback(async (id: string) => {
    try {
      
      await bookingService.deleteBooking(id);
      setBookings(prev => prev.filter(booking => booking.id !== id));
      toast.success('Booking cancelled successfully');
    } catch (err) {
      setError('Failed to delete booking');
      toast.error('Could not cancel booking');
    }
  }, []);

  const connectGoogleCalendar = useCallback(() => {
    try {
      bookingService.connectGoogleCalendar();
    } catch (err) {
      setError('Failed to connect to Google Calendar');
      toast.error('Could not connect to Google Calendar');
    }
  }, []);

  return {
    bookings,
    isLoading,
    error,
    fetchBookings,
    createBooking,
    deleteBooking,
    connectGoogleCalendar
  };
}