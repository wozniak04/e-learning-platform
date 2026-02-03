import { Server as SocketServer, ServerOptions } from "socket.io";
import { Server as HTTPServer } from "http";
import { getCorsOptions } from "./cors";

export const setupSocket = (httpServer: HTTPServer): SocketServer => {
  const io = new SocketServer(httpServer, {
    cors: getCorsOptions() as ServerOptions["cors"],
  });

  return io;
};
