import { Controller, Get, Req, Res, UseGuards, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorator/get-user.decorator';
import { User } from '../types/prisma';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Get('login')
  @UseGuards(AuthGuard('auth0'))
  login() {
    this.logger.debug('Iniciando flujo de login con Auth0');
  }

  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  async callback(@Req() req, @Res() res: Response) {
    try {
      this.logger.debug('Recibida callback de Auth0');
      
      // Verificar que req.user existe
      if (!req.user) {
        this.logger.error('No se recibió información de usuario en la callback de Auth0');
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}?error=auth_failed`);
      }
      
      this.logger.debug('Usuario recibido en callback:');
      this.logger.debug(JSON.stringify(req.user, null, 2));
      
      // req.user contiene los datos del usuario autenticado por Auth0
      const { accessToken, user } = await this.authService.handleAuth0Callback(req.user);
      
      // Establecer JWT en una cookie
      res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600000, // 1 hora
      });

      // Redirigir al usuario a la página deseada después del login
      this.logger.debug('Autenticación exitosa, redirigiendo al cliente');
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard`);
    } catch (error) {
      this.logger.error('Error en callback de Auth0:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}?error=auth_callback_failed`);
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: User, @Req() req: Request) {
    try {
      this.logger.debug('Solicitud a /me para obtener perfil del usuario');
      
      if (!user) {
        this.logger.warn('No se encontró usuario autenticado en la solicitud a /me');
        throw new UnauthorizedException('No autenticado');
      }
      
      this.logger.debug(`Usuario autenticado: ${user.email}`);
      
      const safeUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        googleCalendarConnected: user.googleCalendarConnected
      };
      
      return {
        isAuthenticated: true,
        user: safeUser
      };
    } catch (error) {
      this.logger.error('Error al obtener perfil de usuario:', error);
      throw error;
    }
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    this.logger.debug('Cerrando sesión de usuario');
    res.clearCookie('jwt');
    
    // Construir URL de logout de Auth0
    const returnTo = encodeURIComponent(process.env.CLIENT_URL || 'http://localhost:3000');
    const logoutURL = `https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${returnTo}`;
    
    res.redirect(logoutURL);
  }
}