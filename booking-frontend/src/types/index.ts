export interface User {
    id: string;
    email: string;
    name: string;
    googleCalendarConnected: boolean;
  }
  
  export interface Booking {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateBookingDto {
    title: string;
    startTime: string;
    endTime: string;
  }