import api from './api';

export const connectGoogleCalendar = (): void => {
  try {
    
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/api/google/connect`;
  } catch (error) {
    console.error('Error connecting to Google Calendar:', error);
    throw error;
  }
};

export const listEvents = async (startDate?: Date, endDate?: Date) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate.toISOString());
    if (endDate) params.append('end', endDate.toISOString());
    
    const response = await api.get(`/api/google/events?${params.toString()}`);
    return response.data.events;
  } catch (error) {
    console.error('Error listing calendar events:', error);
    throw error;
  }
};

export const createEvent = async (event: {
  summary: string;
  description?: string;
  start: Date;
  end: Date;
}) => {
  try {
    const response = await api.post('/api/google/events', {
      summary: event.summary,
      description: event.description,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const response = await api.delete(`/api/google/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw error;
  }
};

export const checkCalendarConflicts = async (startTime: Date, endTime: Date) => {
  try {
    const response = await api.get('/api/google/check-conflicts', {
      params: {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error checking calendar conflicts:', error);
    throw error;
  }
};