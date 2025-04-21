import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Body, 
  Query, 
  UseGuards, 
  Param, 
  Res 
} from '@nestjs/common';
import { Response } from 'express';
import { GoogleCalendarService } from './google-calendar.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../types/prisma';

@Controller('google')
@UseGuards(JwtAuthGuard)
export class GoogleCalendarController {
  constructor(private googleCalendarService: GoogleCalendarService) {}

  @Get('connect')
  async connectGoogleCalendar(@Res() res: Response) {
    const authUrl = this.googleCalendarService.getAuthUrl();
    res.redirect(authUrl);
  }

  @Get('callback')
  async handleGoogleCallback(
    @Query('code') code: string,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    await this.googleCalendarService.handleGoogleCallback(code, user.id);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/calendar-connected`);
  }

  @Get('events')
  async listEvents(
    @GetUser() user: User,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    if (!user.googleCalendarConnected) {
      return { message: 'Google Calendar not connected', events: [] };
    }

    const startDate = start ? new Date(start) : undefined;
    const endDate = end ? new Date(end) : undefined;

    const events = await this.googleCalendarService.listEvents(
      user.googleRefreshToken,
      startDate,
      endDate,
    );

    return { events };
  }

  @Post('events')
  async createEvent(
    @GetUser() user: User,
    @Body() eventData: {
      summary: string;
      description?: string;
      start: string;
      end: string;
    },
  ) {
    if (!user.googleCalendarConnected) {
      return { success: false, message: 'Google Calendar not connected' };
    }

    const event = await this.googleCalendarService.createEvent(
      user.googleRefreshToken,
      {
        summary: eventData.summary,
        description: eventData.description,
        start: new Date(eventData.start),
        end: new Date(eventData.end),
      },
    );

    return { success: true, event };
  }

  @Delete('events/:eventId')
  async deleteEvent(
    @GetUser() user: User,
    @Param('eventId') eventId: string,
  ) {
    if (!user.googleCalendarConnected) {
      return { success: false, message: 'Google Calendar not connected' };
    }

    await this.googleCalendarService.deleteEvent(
      user.googleRefreshToken,
      eventId,
    );

    return { success: true };
  }

  @Get('check-conflicts')
  async checkConflicts(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @GetUser() user: User,
  ) {
    if (!user.googleCalendarConnected) {
      return { hasConflict: false, message: 'Google Calendar not connected' };
    }

    const hasConflict = await this.googleCalendarService.checkConflicts(
      user.googleRefreshToken,
      new Date(startTime),
      new Date(endTime),
    );

    return { hasConflict };
  }
}