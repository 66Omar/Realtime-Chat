import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthenticatingClient } from 'src/chat-gateway/types/client.type';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    if (context.getType() !== 'ws') {
      return true;
    }
    const client: AuthenticatingClient = context.switchToWs().getClient();
    const payload = this.authService.authenticateUser(
      client.handshake.headers.authorization,
    );
    client.user = payload;
    return true;
  }
}
