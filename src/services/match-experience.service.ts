import { PopulatedMatchExperience } from '../models/match-experience.model';
import { MatchExperienceRepository } from '../repositories/match-experience.repository';
import mongoose from 'mongoose';
import {
    lookupComments,
    lookupCommentUsers,
    lookupCreatedByToUser,
    mapUsersToComments,
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
}

export const matchExperienceService = new MatchExperienceService();
