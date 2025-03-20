import {Server} from 'socket.io';
import {SocketService} from "./services/socket.service";

/* istanbul ignore file */
/**
 * Initializes the Socket.IO server and defines event listeners.
 */
export const initializeSocket = (io: Server) => {
    const socketService = new SocketService(io);
    socketService.initialize();
};
