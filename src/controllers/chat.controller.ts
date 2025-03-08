import {Request, Response} from 'express';
import mongoose from 'mongoose';
import {chatService} from '../services/chat.service';

/**
 * Handles fetching either:
 * - A specific chat between a visitor and creator (`getChatBetweenUsers`).
 * - All chats for a match experience (`getChatsForMatchExperience`).
 */
export const chatController = {
    getChats: async (req: Request, res: Response) => {
        try {
            const { matchExperienceId, visitorId, matchExperienceCreatorId } = req.query;

            if (!matchExperienceId || !mongoose.Types.ObjectId.isValid(matchExperienceId as string)) {
                return res.status(400).json({ error: 'Invalid or missing matchExperienceId' });
            }

            if (visitorId && matchExperienceCreatorId) {
                const chat = await chatService.getChatBetweenUsers(
                    matchExperienceId as string,
                    visitorId as string,
                    matchExperienceCreatorId as string
                );
                return res.status(200).json(chat);
            }

            const chats = await chatService.getChatsForMatchExperience(matchExperienceId as string);
            return res.status(200).json(chats);
        } catch (error) {
            console.error('Error fetching chats:', error);
            return res.status(500).json({ error: 'Error fetching chats' });
        }
    },
};
