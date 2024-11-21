import { Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as Socket;
    if (exception instanceof UnauthorizedException) {
      client.emit('exception', exception?.getResponse());
      client.disconnect();
    }
    client.emit('exception', exception?.response);
  }
}
