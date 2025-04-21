import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const logger = new Logger('GetUserDecorator');
    const request = ctx.switchToHttp().getRequest();
    
    if (!request.user) {
      logger.warn('No se encontró usuario en la request');
    } else {
      logger.debug(`Usuario encontrado: ${request.user.email}`);
    }
    
    return request.user;
  },
);