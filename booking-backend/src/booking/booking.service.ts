import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Booking } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private googleCalendarService: GoogleCalendarService,
  ) {}

  async getAllBookings(userId: string): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { userId },
      orderBy: { startTime: 'asc' },
    });
  }

  async getBookingById(id: string, userId: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking || booking.userId !== userId) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async createBooking(userId: string, dto: CreateBookingDto): Promise<Booking> {
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    if (startTime < new Date()) {
      throw new BadRequestException('Cannot book time slots in the past');
    }

    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        OR: [
          {
            startTime: { lte: endTime },
            endTime: { gt: startTime },
          },
          {
            startTime: { lt: endTime },
            endTime: { gte: startTime },
          },
        ],
      },
    });
    console.log('Conflicting booking:', conflictingBooking);
    if (conflictingBooking) {
      throw new BadRequestException('This time slot conflicts with an existing booking');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

      const hasGoogleConflict = await this.googleCalendarService.checkConflicts(
        user.googleRefreshToken,
        startTime,
        endTime,
      );
      console.log(user, )
      if (hasGoogleConflict) {
        throw new BadRequestException('This time slot conflicts with your Google Calendar');
      }
    

    const booking = await this.prisma.booking.create({
      data: {
        title: dto.title,
        startTime,
        endTime,
        userId,
      },
    });

      
      try {
        const googleEvent = await this.googleCalendarService.createEvent(
          user.googleRefreshToken,
          {
            summary: dto.title,
            description: `Booking ID: ${booking.id}`,
            start: startTime,
            end: endTime,
          }
        );
        await this.prisma.booking.update({
          where: { id: booking.id },
          data: { googleEventId: googleEvent.id }
        });
      } catch (error) {
        
        console.error('Failed to create Google Calendar event:', error);
      }
  
    return booking;
    
  }

  async cancelBooking(id: string, userId: string): Promise<void> {
    // Primero, obtener la reserva para verificar permisos y obtener detalles
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });
  
    if (!booking || booking.userId !== userId) {
      throw new NotFoundException('Booking not found');
    }
  
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });
  
    if (user.googleCalendarConnected && user.googleRefreshToken) {
      try {
        const events = await this.googleCalendarService.listEvents(
          user.googleRefreshToken, 
          booking.startTime,
          booking.endTime
        );
        const matchingEvent = events.find(event => 
          event.description && event.description.includes(`Booking ID: ${booking.id}`)
        );
        
        if (matchingEvent && matchingEvent.id) {
          await this.googleCalendarService.deleteEvent(
            user.googleRefreshToken,
            matchingEvent.id
          );
        }
      } catch (error) {
        console.error('Failed to delete Google Calendar event:', error);
        // No  la eliminación de la reserva local si falla la eliminación de Google Calendar
      }
    }
  
    await this.prisma.booking.delete({
      where: { id },
    });
  }
}