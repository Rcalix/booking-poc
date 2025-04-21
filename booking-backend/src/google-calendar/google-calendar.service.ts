import { Injectable, Logger } from '@nestjs/common';
import { calendar_v3, google } from 'googleapis';
import { UserService } from '../user/user.service';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);

  constructor(private userService: UserService) {}

  private getOAuthClient() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    this.logger.debug(`Creating OAuth client with: 
      Client ID: ${clientId ? clientId.substring(0, 5) + '...' : 'undefined'} 
      Redirect URI: ${redirectUri || 'undefined'}`);

    return new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri,
    );
  }

  getAuthUrl() {
    const oauth2Client = this.getOAuthClient();
    
    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', 
      include_granted_scopes: true,
    });

    this.logger.debug(`Generated auth URL: ${authUrl}`);
    
    return authUrl;
  }

  async handleGoogleCallback(code: string, userId: string) {
    try {
      this.logger.debug(`Handling callback for user ${userId} with code length: ${code.length}`);
      
      const oauth2Client = this.getOAuthClient();
      
      this.logger.debug('Getting tokens from Google');
      const { tokens } = await oauth2Client.getToken(code);
      
      this.logger.debug(`Received tokens from Google. Access token length: ${tokens.access_token ? tokens.access_token.length : 0}`);
      this.logger.debug(`Refresh token present: ${tokens.refresh_token ? 'Yes' : 'No'}`);
      
      if (!tokens.refresh_token) {
        this.logger.warn('No refresh token received from Google. This may happen if the user has already granted access.');
      }
      
      // Store the refresh token
      await this.userService.connectGoogleCalendar(userId, tokens.refresh_token);
      
      return { success: true };
    } catch (error) {
      this.logger.error('Error handling Google callback:', error);
      throw error;
    }
  }

  async getCalendarClient(refreshToken: string) {
    try {
      const oauth2Client = this.getOAuthClient();
      oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      return google.calendar({ version: 'v3', auth: oauth2Client });
    } catch (error) {
      this.logger.error('Error creating calendar client:', error);
      throw error;
    }
  }

  async listEvents(refreshToken: string, timeMin?: Date, timeMax?: Date) {
    try {
      this.logger.debug('Getting calendar client');
      const calendar = await this.getCalendarClient(refreshToken);
      
      this.logger.debug(`Listing events from ${timeMin?.toISOString() || 'now'} to ${timeMax?.toISOString() || 'undefined'}`);
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin ? timeMin.toISOString() : new Date().toISOString(),
        timeMax: timeMax ? timeMax.toISOString() : undefined,
        singleEvents: true,
        orderBy: 'startTime',
      });

      this.logger.debug(`Found ${response.data.items.length} events`);
      return response.data.items;
    } catch (error) {
      this.logger.error('Error listing Google Calendar events:', error);
      throw error;
    }
  }
  
  async checkConflicts(refreshToken: string, startTime: Date, endTime: Date): Promise<boolean> {
    try {
      this.logger.debug(`Checking conflicts from ${startTime.toISOString()} to ${endTime.toISOString()}`);
      const oauth2Client = this.getOAuthClient();
      oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        singleEvents: true,
      });

      const hasConflicts = response.data.items.length > 0;
      this.logger.debug(`Conflicts found: ${hasConflicts}`);
      return hasConflicts;
    } catch (error) {
      this.logger.error('Error checking Google Calendar:', error);
      return false;
    }
  }

  async createEvent(refreshToken: string, event: {
    summary: string;
    description?: string;
    start: Date;
    end: Date;
  }) {
    try {
      this.logger.debug(`Creating event: ${event.summary}`);
      const calendar = await this.getCalendarClient(refreshToken);
      
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: event.summary,
          description: event.description,
          start: {
            dateTime: event.start.toISOString(),
            timeZone: 'UTC',
          },
          end: {
            dateTime: event.end.toISOString(),
            timeZone: 'UTC',
          },
        },
      });

      this.logger.debug(`Event created with ID: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error creating Google Calendar event:', error);
      throw error;
    }
  }

  async deleteEvent(refreshToken: string, eventId: string) {
    try {
      this.logger.debug(`Deleting event with ID: ${eventId}`);
      const calendar = await this.getCalendarClient(refreshToken);
      
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });

      this.logger.debug('Event deleted successfully');
      return { success: true };
    } catch (error) {
      this.logger.error('Error deleting Google Calendar event:', error);
      throw error;
    }
  }
}