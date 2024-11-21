import { IsInt, IsPositive } from 'class-validator';

export class UpdateSeenDto {

  @IsInt()
  @IsPositive()
  conversation_id: number;

  @IsInt()
  @IsPositive()
  message_id: number;
}
