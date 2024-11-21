import {
  Injectable,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { Participant } from 'src/chat/models';
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { SocketAuthMiddleware } from 'src/auth/middleware/ws-auth.middleware';
import { AuthenticatedClient } from './types/client.type';
import { WsExceptionFilter } from 'src/exceptions/ws.exception';
import { AuthService } from 'src/auth/auth.service';
import { CreateMessageDto } from 'src/chat/dto/create-message.dto';
import { UpdateSeenDto } from 'src/chat/dto/update-seen.dto';

@WebSocketGateway({ cors: ['http://localhost:5173', 'http://localhost:5175'] })
@Injectable()
@UseGuards(WsAuthGuard)
@UseFilters(new WsExceptionFilter())
@UsePipes(new ValidationPipe())
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  afterInit(server: Server) {
    server.use(SocketAuthMiddleware(this.authService));
  }

  handleConnection(client: AuthenticatedClient) {
    console.log(`${client.user.username} connected!`);
    client.saved = {};
    client.join(client.user.id.toString());
  }

  handleDisconnect(client: AuthenticatedClient) {
    if (client.user) console.log(`${client.user.username} disconnected!`);
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() message: CreateMessageDto,
    @ConnectedSocket() client: AuthenticatedClient,
  ) {
    let participants: (typeof Participant.$inferSelect)[];

    if (!client.saved[message.conversation_id]) {
      participants = await this.chatService.getParticipantsByConversation(
        message.conversation_id,
      );
      client.saved[message.conversation_id] = participants;
    } else {
      participants = client.saved[message.conversation_id];
    }

    const current_participant = participants.filter(
      (participant) => participant.user_id === client.user.id,
    )[0];

    const createdMessage = await this.chatService.createMessage({
      content: message.content,
      participant_id: current_participant.id,
      conversation_id: message.conversation_id,
    });

    participants.map((participant) => {
      this.server.to(`${participant.user_id}`).emit('message', {
        ...createdMessage,
        participant: current_participant,
      });
    });
  }

  @SubscribeMessage('update_seen')
  async updateSeen(
    @MessageBody() updateSeen: UpdateSeenDto,
    @ConnectedSocket() client: AuthenticatedClient,
  ) {
    await this.chatService.updateSeen(client.user.id, updateSeen);
  }
}
