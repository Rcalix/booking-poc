import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private invalidatedTokens: Set<string> = new Set();

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async handleAuth0Callback(auth0User: any) {
    this.logger.debug('Datos recibidos de Auth0:');
    this.logger.debug(JSON.stringify(auth0User, null, 2));
    
    const email = auth0User.email || '';
    const sub = auth0User.sub || '';
    const name = auth0User.name || (email ? email.split('@')[0] : 'Usuario');
    
    if (!email) {
      throw new UnauthorizedException('Información de autenticación incompleta: falta correo electrónico');
    }
    
    if (!sub) {
      throw new UnauthorizedException('Información de autenticación incompleta: falta identificador de usuario');
    }
    
    const isGoogleAuth = sub.includes('google');
    const authProvider = isGoogleAuth ? 'google' : 'auth0';
    
    
    let user = await this.userService.findByEmail(email);
    
    if (!user) {
      const userData: any = {
        email,
        name,
      };
      
      if (isGoogleAuth) {
        userData.googleId = sub;
      } else {
        userData.auth0Id = sub;
      }
      
      this.logger.debug('Creando nuevo usuario:');
      this.logger.debug(JSON.stringify(userData, null, 2));
      
      user = await this.userService.create(userData);
    } else {
      const updateData: any = {};
      
      if (isGoogleAuth && !user.googleId) {
        updateData.googleId = sub;
      } else if (!isGoogleAuth && !user.auth0Id) {
        updateData.auth0Id = sub;
      }
      
      if (!user.name && name) {
        updateData.name = name;
      }
      
      if (Object.keys(updateData).length > 0) {
        this.logger.debug(`Actualizando usuario ${user.id}:`);
        this.logger.debug(JSON.stringify(updateData, null, 2));
        
        user = await this.userService.update(user.id, updateData);
      }
    }
    
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    
    return { accessToken, user };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      this.logger.error('Error verificando token JWT:', error.message);
      throw new UnauthorizedException('Token inválido');
    }
  }
  
  async invalidateToken(userId: string): Promise<void> {
    this.invalidatedTokens.add(userId);
    setTimeout(() => this.invalidatedTokens.delete(userId), 3600000);
  }
  
  isTokenInvalid(userId: string): boolean {
    return this.invalidatedTokens.has(userId);
  }
}