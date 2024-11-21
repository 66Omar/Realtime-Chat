import { AuthenticatingClient } from 'src/chat-gateway/types/client.type';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

export type SocketAuthMiddlewareType = {
  (client: AuthenticatingClient, next: (err?: Error) => void);
};

export const SocketAuthMiddleware = (
  authService: AuthService,
): SocketAuthMiddlewareType => {
  return (client, next) => {
    try {
      const authorization = client.handshake.headers.authorization;
      const payload = authService.authenticateUser(authorization);
      client.user = payload;
      next();
    } catch (error: any) {
      next(new UnauthorizedException('unauthorized_connection'));
    }
  };
};
