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
import { PipelineStage } from "mongoose";

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

    getAllMatchExperiences = async (page: number, limit: number, sortBy: string = "date") => {
        try {
            const totalExperiences = await MatchExperienceRepository.countDocuments();
    
            let sortQuery: Record<string, 1 | -1> = { createdAt: -1 }; // ✅ Fix type to only allow 1 or -1
    
            if (sortBy === "likes") {
                sortQuery = { likesCount: -1 }; // ✅ TypeScript now recognizes likesCount properly
            }
    
            const experiences = await MatchExperienceRepository.aggregate<PipelineStage[]>([
                lookupCreatedByToUser,
                unwindUser,
                projectUserFields,
                lookupComments,
                sortComments,
                lookupCommentUsers,
                mapUsersToComments,
                projectCommentUsersFields,
                { $addFields: { likesCount: { $size: "$likes" } } }, // ✅ Compute likesCount before sorting
                { $sort: sortQuery }, // ✅ No more TypeScript error!
                { $skip: (page - 1) * limit },
                { $limit: limit },
            ]);
    
            return {
                experiences,
                totalPages: Math.ceil(totalExperiences / limit),
            };
        } catch (error) {
            console.error("Error fetching match experiences:", error);
            throw error;
        }
    };
    

    getAllMatchExperiencesByUserId = async (userId: string, page: number, limit: number, sortBy: string = "date") => {
        try {
            const totalExperiences = await MatchExperienceRepository.countDocuments({ createdBy: userId });

            let sortQuery: Record<string, 1 | -1> = { createdAt: -1 }; // Default: Newest first

            if (sortBy === "likes") {
                sortQuery = { likesCount: -1 }; // Sort by most liked
            }

            const experiences = await MatchExperienceRepository.aggregate<PipelineStage[]>([
                { $match: { createdBy: new mongoose.Types.ObjectId(userId) } }, // ✅ Filter by user ID
                lookupCreatedByToUser,
                unwindUser,
                projectUserFields,
                lookupComments,
                sortComments,
                lookupCommentUsers,
                mapUsersToComments,
                projectCommentUsersFields,
                { $addFields: { likesCount: { $size: "$likes" } } }, // ✅ Compute likes count
                { $sort: sortQuery },
                { $skip: (page - 1) * limit },
                { $limit: limit },
            ]);

            return {
                experiences,
                totalPages: Math.ceil(totalExperiences / limit),
            };
        } catch (error) {
            console.error(`Error fetching match experiences for user ${userId}:`, error);
            throw error;
        }
    };

}

export const matchExperienceService = new MatchExperienceService();
