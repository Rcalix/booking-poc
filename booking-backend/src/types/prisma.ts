import { Prisma, PrismaClient } from '@prisma/client';

export type User = Awaited<ReturnType<PrismaClient['user']['findUnique']>>;
export type Booking = Awaited<ReturnType<PrismaClient['booking']['findUnique']>>;

export interface UserDto {
  id: string;
  email: string;
  name: string;
  googleCalendarConnected: boolean;
}

export interface BookingDto {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  userId: string;
}