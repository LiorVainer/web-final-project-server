import { Server, Socket } from 'socket.io';
import { ChatRepository } from './repositories/chat.repository';
import {
    JoinRoomPayload,
    JoinRoomPayloadSchema,
    SendMessagePayload,
    SendMessagePayloadSchema,
} from './models/chat.model';

export const initializeSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('joinRoom', (joinRoomPayload: JoinRoomPayload) => {
            const parsed = JoinRoomPayloadSchema.safeParse(joinRoomPayload);

            if (!parsed.success) {
                console.error('Invalid joinRoom payload:', parsed.error.format());
                return;
            }

            const { matchExperienceId, visitorId, matchExperienceCreatorId } = parsed.data;
            const privateRoom = `match-${matchExperienceId}-${visitorId}-${matchExperienceCreatorId}`;
            socket.join(privateRoom);
            console.log(`User ${visitorId} joined room ${privateRoom}`);
        });

        socket.on('sendMessage', async (data: SendMessagePayload) => {
            // Validate incoming payload
            const parsed = SendMessagePayloadSchema.safeParse(data);
            if (!parsed.success) {
                console.error('Invalid sendMessage payload:', parsed.error.format());
                return;
            }

            const { matchExperienceId, senderId, receiverId, content } = parsed.data;

            try {
                let chat = await ChatRepository.findOne({
                    matchExperienceId,
                    visitorId: senderId,
                    matchExperienceCreatorId: receiverId,
                });

                if (!chat) {
                    chat = new ChatRepository({
                        matchExperienceId,
                        visitorId: senderId,
                        matchExperienceCreatorId: receiverId,
                        messages: [],
                    });
                }

                // Create new message
                const newMessage = { senderId, content, createdAt: new Date() };
                chat.messages.push(newMessage);
                chat.updatedAt = new Date();
                await chat.save();

                // Send message to the private chat room
                const privateRoom = `match-${matchExperienceId}-${senderId}-${receiverId}`;
                io.to(privateRoom).emit('receiveMessage', newMessage);
            } catch (error) {
                console.error('Error storing message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
