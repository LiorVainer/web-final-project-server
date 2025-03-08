import {Request, Response} from 'express';
import {ChatRepository} from '../repositories/chat.repository';

/**
 * Fetches chat messages between a visitor and a match experience creator.
 * If no chat exists, a new empty chat document is created.
 */
export const chatController = {
    getChat: async (req: Request, res: Response) => {
        try {
            const { matchExperienceId, visitorId, matchExperienceCreatorId } = req.query;

            if (!matchExperienceId || !visitorId || !matchExperienceCreatorId) {
                res.status(400).json({ error: 'Missing required query parameters' });
                return;
            }

            let chat = await ChatRepository.findOne({
                matchExperienceId,
                visitorId,
                matchExperienceCreatorId,
            })
                .populate('matchExperienceCreatorId', 'username pictureId')
                .populate('visitorId', 'username pictureId');

            if (!chat) {
                chat = new ChatRepository({
                    matchExperienceId,
                    visitorId,
                    matchExperienceCreatorId,
                    messages: [],
                });
                await chat.save();
            }

            const chatResponse = {
                ...chat.toObject(),
                visitor: chat.visitorId,
                matchExperienceCreator: chat.matchExperienceCreatorId,
                visitorId,
                matchExperienceCreatorId,
            };

            res.status(200).json(chatResponse);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching chat' });
        }
    },
};
