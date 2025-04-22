"use client";

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import * as calendarService from '../services/calendar';

export default function useCalendar() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (startDate?: Date, endDate?: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await calendarService.listEvents(startDate, endDate);
      setEvents(data);
      return data;
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch calendar events');
      toast.error('Could not load calendar events');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (event: {
    summary: string;
    description?: string;
    start: Date;
    end: Date;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await calendarService.createEvent(event);
      toast.success('Event created successfully');
      return result;
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event');
      toast.error('Could not create calendar event');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteEvent = useCallback(async (eventId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await calendarService.deleteEvent(eventId);
      toast.success('Event deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
      toast.error('Could not delete calendar event');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectCalendar = useCallback(() => {
    try {
      calendarService.connectGoogleCalendar();
    } catch (err) {
      console.error('Error connecting to calendar:', err);
      setError('Failed to connect to Google Calendar');
      toast.error('Could not connect to Google Calendar');
    }
  }, []);

  const checkConflicts = useCallback(async (startTime: Date, endTime: Date) => {
    try {
      const { hasConflict } = await calendarService.checkCalendarConflicts(
        startTime,
        endTime
      );
      return hasConflict;
    } catch (err) {
      console.error('Error checking conflicts:', err);
      toast.error('Could not check calendar conflicts');
      return false;
    }
  }, []);

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    createEvent,
    deleteEvent,
    connectCalendar,
    checkConflicts
  };
}