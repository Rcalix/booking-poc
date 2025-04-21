import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  private readonly logger = new Logger(Auth0Strategy.name);

  constructor() {
    super({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL,
      scope: 'openid email profile',
      state: false,
      passReqToCallback: true
    });
  }

  async validate(request, accessToken, refreshToken, extraParams, profile) {
    try {
      this.logger.debug('Auth0 Profile:');
      this.logger.debug(JSON.stringify(profile, null, 2));
      this.logger.debug('Extra Params:');
      this.logger.debug(JSON.stringify(extraParams, null, 2));

      if (extraParams && extraParams.id && extraParams.emails && extraParams.emails.length > 0) {
        const user = {
          sub: extraParams.id,
          email: extraParams.emails[0].value,
          name: extraParams.displayName || `${extraParams.name?.givenName || ''} ${extraParams.name?.familyName || ''}`.trim(),
          provider: extraParams.provider || 'auth0'
        };
        
        this.logger.debug('Usuario extraído de extraParams:');
        this.logger.debug(JSON.stringify(user, null, 2));
        
        return user;
      }
      
      if (extraParams && extraParams._json && extraParams._json.sub) {
        const user = {
          sub: extraParams._json.sub || extraParams.id || extraParams.user_id,
          email: extraParams._json.email,
          name: extraParams._json.name || extraParams.displayName,
          provider: extraParams._json.sub.includes('google') ? 'google' : 'auth0'
        };
        
        this.logger.debug('Usuario extraído de extraParams._json:');
        this.logger.debug(JSON.stringify(user, null, 2));
        
        return user;
      }
      
      if (profile && profile.id) {
        const user = {
          sub: profile.id,
          email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
          name: profile.displayName || '',
          provider: profile.provider || 'auth0'
        };
        
        this.logger.debug('Usuario extraído de profile:');
        this.logger.debug(JSON.stringify(user, null, 2));
        
        return user;
      }

      const sub = extraParams?.id || extraParams?.user_id || 
                 extraParams?._json?.sub || profile?.id || null;
      
      const email = extraParams?.emails?.[0]?.value || extraParams?._json?.email || 
                   profile?.emails?.[0]?.value || '';
      
      const name = extraParams?.displayName || extraParams?._json?.name || 
                  profile?.displayName || '';

      const user = {
        sub,
        email,
        name,
        provider: sub && sub.includes('google') ? 'google' : 'auth0'
      };
      
      this.logger.debug('Usuario extraído mediante fallback:');
      this.logger.debug(JSON.stringify(user, null, 2));
      
      return user;
    } catch (error) {
      this.logger.error('Error en Auth0Strategy.validate:', error);
      throw error;
    }
  }
}