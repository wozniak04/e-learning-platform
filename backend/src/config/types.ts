import { Server as SocketServer } from "socket.io";

export interface UserPayload {
  login: string;
  email: string;
  sub: string;
  jti: string;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user: UserPayload;
      io: SocketServer;
    }
  }
}
