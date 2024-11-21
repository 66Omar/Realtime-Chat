import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  Param,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ChatService } from './chat.service';
import { GenericQueryDto } from 'src/common/dto/offset-query.dto';
import { CursorQueryDto } from 'src/common/dto/cursor-query.dto';
import { AuthenticatedRequest } from 'src/common/types/request.type';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/')
  getConversations(
    @Req() req: AuthenticatedRequest,
    @Query() queries: GenericQueryDto,
  ) {
    return this.chatService.getActiveConversations(req.user.id, queries);
  }

  @Post('/')
  startConversation(@Req() req: AuthenticatedRequest, @Body() body) {
    return this.chatService.startConversation(req.user.id, body.user_id);
  }

  @Get('/:conversation_id/')
  getMessages(
    @Req() req: AuthenticatedRequest,
    @Param('conversation_id') conversation_id: string,
    @Query() queries: CursorQueryDto,
  ) {
    return this.chatService.getMessages(req.user.id, +conversation_id, queries);
  }
}
