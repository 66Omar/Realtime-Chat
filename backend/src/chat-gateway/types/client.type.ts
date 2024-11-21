import { Socket } from 'socket.io';
import { Participant } from 'src/chat/models';

export type AuthenticatedClient = Socket & {
  user: { id: number; username: string };
  saved: Record<string, (typeof Participant.$inferSelect)[]>;
};

export type AuthenticatingClient = Socket & {
  user?: { id: number; username: string };
  saved?: Record<string, (typeof Participant.$inferSelect)[]>;
};