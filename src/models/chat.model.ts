import { z } from 'zod';
import { StringToObjectId, zodDate } from '../utils/zod.utils';

export const ChatMessageSchema = z.object({
    senderId: StringToObjectId,
    content: z.string(),
    createdAt: zodDate,
});

export const CreateChatMessagePayloadSchema = ChatMessageSchema.omit({
    createdAt: true,
});

export const ChatSchema = z.object({
    _id: z.string(),
    matchExperienceId: StringToObjectId,
    matchExperienceCreatorId: StringToObjectId,
    visitorId: StringToObjectId,
    messages: z.array(ChatMessageSchema),
    createdAt: zodDate,
    updatedAt: zodDate,
});

export const JoinRoomPayloadSchema = ChatSchema.pick({
    matchExperienceId: true,
    matchExperienceCreatorId: true,
    visitorId: true,
}).extend({
    loggedInUserId: StringToObjectId,
});

export const SendMessagePayloadSchema = z.object({
    matchExperienceId: ChatSchema.shape.matchExperienceId,
    senderId: ChatMessageSchema.shape.senderId,
    visitorId: ChatSchema.shape.visitorId,
    content: ChatMessageSchema.shape.content,
});

export type CreateChatMessagePayload = z.infer<typeof CreateChatMessagePayloadSchema>;
export type JoinRoomPayload = z.infer<typeof JoinRoomPayloadSchema>;
export type SendMessagePayload = z.infer<typeof SendMessagePayloadSchema>;
export type Chat = z.infer<typeof ChatSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
