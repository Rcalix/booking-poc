import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'src/types/prisma';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: { 
    email: string; 
    name: string; 
    googleId?: string;
    auth0Id?: string;
  }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async connectGoogleCalendar(userId: string, refreshToken: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        googleCalendarConnected: true,
        googleRefreshToken: refreshToken,
      },
    });
  }

  async disconnectGoogleCalendar(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        googleCalendarConnected: false,
        googleRefreshToken: null,
      },
    });
  }
}