import { Server, Socket } from 'socket.io';
import { ChatRepository } from '../repositories/chat.repository';
import {
    JoinRoomPayload,
    JoinRoomPayloadSchema,
    SendMessagePayload,
    SendMessagePayloadSchema,
} from '../models/chat.model';
import { matchExperienceService } from './match-experience.service';
import { ROOM_PREFIX, SOCKET_EVENTS } from '../constants/socket.const';
import mongoose from 'mongoose';

export class SocketService {
    private io: Server;
    private activeUsers: Map<mongoose.Types.ObjectId, string>; // Maps userId to socketId

    constructor(io: Server) {
        this.io = io;
        this.activeUsers = new Map();
    }

    /**
     * Generates a unique room identifier for a match experience chat.
     */
    private getRoomName(
        matchExperienceId: mongoose.Types.ObjectId,
        creatorId: mongoose.Types.ObjectId,
        visitorId: mongoose.Types.ObjectId
    ): string {
        return `${ROOM_PREFIX}-${matchExperienceId.toString()}-${creatorId.toString()}-${visitorId.toString()}`;
    }

    /**
     * Handles user joining a room.
     */
    private handleJoinRoom(socket: Socket, payload: JoinRoomPayload) {
        const parsed = JoinRoomPayloadSchema.safeParse(payload);

        if (!parsed.success) {
            console.error('Invalid joinRoom payload:', parsed.error.format());
            return;
        }

        const { matchExperienceId, visitorId, matchExperienceCreatorId, loggedInUserId } = parsed.data;
        const privateRoom = this.getRoomName(matchExperienceId, matchExperienceCreatorId, visitorId);

        socket.join(privateRoom);
        this.activeUsers.set(visitorId, socket.id);

        console.log(`User ${visitorId} joined room ${privateRoom}`);

        // Notify the room that this user is online
        this.io.to(privateRoom).emit(SOCKET_EVENTS.USER_CONNECTED, {
            userId: loggedInUserId,
            status: 'online',
        });
    }

    /**
     * Handles sending messages between users in a match experience chat.
     */
    private async handleSendMessage(socket: Socket, data: SendMessagePayload) {
        const parsed = SendMessagePayloadSchema.safeParse(data);
        if (!parsed.success) {
            console.error('Invalid sendMessage payload:', parsed.error.format());
            return;
        }

        const { matchExperienceId, senderId, content } = parsed.data;

        try {
            let chat = await ChatRepository.findOne({
                matchExperienceId,
                $or: [{ visitorId: senderId }, { matchExperienceCreatorId: senderId }],
            });

            if (!chat) {
                const matchExperience = await matchExperienceService.getMatchExperienceById(
                    matchExperienceId.toString()
                );

                if (senderId.toString() === matchExperience?.createdBy._id.toString()) {
                    console.error('Creator cannot be the one to send the first message');
                    return;
                }

                chat = new ChatRepository({
                    matchExperienceId,
                    visitorId: senderId,
                    matchExperienceCreatorId: matchExperience?.createdBy._id,
                    messages: [],
                });
            }

            // Create new message
            const newMessage = { senderId, content, createdAt: new Date() };
            chat.messages.push(newMessage);
            chat.updatedAt = new Date();
            await chat.save();

            // Send message to the private chat room
            const privateRoom = this.getRoomName(matchExperienceId, chat.matchExperienceCreatorId, chat.visitorId);
            console.log(`Sending message to room ${privateRoom}`);
            this.io.to(privateRoom).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, newMessage);
        } catch (error) {
            console.error('Error storing message:', error);
        }
    }

    /**
     * Handles user disconnection.
     */
    private handleDisconnect(socket: Socket) {
        const userId = [...this.activeUsers.entries()].find(([_, id]) => id === socket.id)?.[0];

        if (userId) {
            this.activeUsers.delete(userId);
            console.log(`User ${userId} disconnected`);

            // Notify all rooms that this user went offline
            this.io.emit(SOCKET_EVENTS.USER_DISCONNECTED, {
                userId,
                status: 'offline',
            });
        }
    }

    /**
     * Initializes Socket.IO server and sets up event listeners.
     */
    public initialize() {
        this.io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
            console.log(`User connected: ${socket.id}`);

            socket.on(SOCKET_EVENTS.JOIN_ROOM, (payload) => this.handleJoinRoom(socket, payload));
            socket.on(SOCKET_EVENTS.SEND_MESSAGE, (data) => this.handleSendMessage(socket, data));
            socket.on(SOCKET_EVENTS.DISCONNECT, () => this.handleDisconnect(socket));
        });
    }
}
