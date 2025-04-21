import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
  } from '@nestjs/common';
  import { BookingService } from './booking.service';
  import { CreateBookingDto } from './dto/create-booking.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { GetUser } from '../auth/decorator/get-user.decorator';
  import { User } from '@prisma/client';
  
  @Controller('bookings')
  @UseGuards(JwtAuthGuard)
  export class BookingController {
    constructor(private bookingService: BookingService) {}
  
    @Get()
    async getAllBookings(@GetUser() user: User) {
      return this.bookingService.getAllBookings(user.id);
    }
  
    @Get(':id')
    async getBookingById(@Param('id') id: string, @GetUser() user: User) {
      return this.bookingService.getBookingById(id, user.id);
    }
  
    @Post()
    async createBooking(@Body() dto: CreateBookingDto, @GetUser() user: User) {
      return this.bookingService.createBooking(user.id, dto);
    }
  
    @Delete(':id')
    async cancelBooking(@Param('id') id: string, @GetUser() user: User) {
      await this.bookingService.cancelBooking(id, user.id);
      return { message: 'Booking cancelled successfully' };
    }
  }