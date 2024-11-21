import { Request } from 'express';

export class AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
  };
}
