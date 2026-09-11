import { Request } from 'express';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  department: string;
  roles: string[];
}
export interface AuthenticatedRequest extends Request { user: SessionUser; }
