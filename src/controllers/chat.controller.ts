import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { chatService } from '../services/chat.service';
import { GetChatQueryParams } from '../models/chat.model';

export const chatController = {
    getChats: async (req: Request<unknown, unknown, unknown, GetChatQueryParams>, res: Response) => {
        try {
            const { matchExperienceId, visitorId, matchExperienceCreatorId } = req.query;

            if (!matchExperienceId || !mongoose.Types.ObjectId.isValid(matchExperienceId)) {
                return res.status(400).json({ error: 'Invalid or missing matchExperienceId' });
            }

            if (visitorId && matchExperienceCreatorId) {
                const chat = await chatService.getChatBetweenUsers(
                    matchExperienceId,
                    visitorId,
                    matchExperienceCreatorId
                );
                return res.status(200).json(chat);
            }

            const chats = await chatService.getChatsForMatchExperience(matchExperienceId);
            return res.status(200).json(chats);
        } catch (error) {
            console.error('Error fetching chats:', error);
            return res.status(500).json({ error: 'Error fetching chats' });
        }
    },
};
