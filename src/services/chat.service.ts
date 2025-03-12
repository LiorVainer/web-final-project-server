import { ChatRepository } from '../repositories/chat.repository';

class ChatService {
    async getChatBetweenUsers(matchExperienceId: string, visitorId: string, matchExperienceCreatorId: string) {
        try {
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

            return {
                ...chat.toObject(),
                visitor: chat.visitorId,
                matchExperienceCreator: chat.matchExperienceCreatorId,
                visitorId,
                matchExperienceCreatorId,
            };
        } catch (error) {
            console.error('Error fetching chat:', error);
            throw new Error('Error fetching chat');
        }
    }

    /**
     * Fetch all chats for a given match experience.
     * Sorts by last updated time.
     */
    async getChatsForMatchExperience(matchExperienceId: string) {
        try {
            const chats = await ChatRepository.find({ matchExperienceId })
                .populate('matchExperienceCreatorId', 'username pictureId')
                .populate('visitorId', 'username pictureId')
                .sort({ updatedAt: -1 });

            return chats.map((chat) => ({
                ...chat.toObject(),
                visitor: chat.visitorId,
                matchExperienceCreator: chat.matchExperienceCreatorId,
                visitorId: chat.visitorId._id,
                matchExperienceCreatorId: chat.matchExperienceCreatorId._id,
            }));
        } catch (error) {
            console.error('Error fetching chats:', error);
            throw new Error('Error fetching chats for match experience');
        }
    }
}

export const chatService = new ChatService();
