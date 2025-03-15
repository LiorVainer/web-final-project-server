import { PopulatedMatchExperience } from '../models/match-experience.model';
import { MatchExperienceRepository } from '../repositories/match-experience.repository';
import mongoose from 'mongoose';
import {
    lookupComments,
    lookupCommentUsers,
    lookupCreatedByToUser,
    mapUsersToComments,
    projectCommentIds,
    projectCommentUsersFields,
    projectUserFields,
    sortComments,
    unwindUser,
} from '../queries/match-experience.query';

// Service function
class MatchExperienceService {
    getMatchExperienceById = async (id: string) => {
        try {
            const result = await MatchExperienceRepository.aggregate<PopulatedMatchExperience>([
                { $match: { _id: new mongoose.Types.ObjectId(id) } },
                lookupCreatedByToUser,
                unwindUser,
                projectUserFields,
                lookupComments,
                sortComments,
                lookupCommentUsers,
                mapUsersToComments,
                projectCommentUsersFields,
            ]);

            return result.at(0) || null;
        } catch (error) {
            console.error(`Error fetching matchExperience with ID ${id}:`, error);
            throw error;
        }
    };

    getAllMatchExperiences = async (page: number, limit: number) => {
        try {
            const totalExperiences = await MatchExperienceRepository.countDocuments();
    
            const experiences = await MatchExperienceRepository.aggregate([
                lookupCreatedByToUser,
                unwindUser,
                projectUserFields,
                lookupComments,
                sortComments,
                lookupCommentUsers,
                mapUsersToComments,
                projectCommentUsersFields,
                { $sort: { createdAt: -1 } }, 
                { $skip: (page - 1) * limit }, // Pagination
                { $limit: limit },
            ]);
    
            return {
                experiences,
                totalPages: Math.ceil(totalExperiences / limit),
            };
        } catch (error) {
            console.error('Error fetching match experiences:', error);
            throw error;
        }
    };

    getAllByCreatedById = async (createdById: string) => {
        try {
            return await MatchExperienceRepository.aggregate([
                { $match: { createdBy: new mongoose.Types.ObjectId(createdById) } },
                lookupCreatedByToUser,
                unwindUser,
                projectUserFields,
                lookupComments,
                projectCommentIds,
            ]);
        } catch (error) {
            console.error(`Error fetching match experiences created by user ${createdById}:`, error);
            throw error;
        }
    };

}

export const matchExperienceService = new MatchExperienceService();
