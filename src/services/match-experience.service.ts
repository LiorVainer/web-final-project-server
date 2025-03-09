import { PopulatedMatchExperience } from '../models/match-experience.model';
import { MatchExperienceRepository } from '../repositories/match-experience.repository';
import mongoose from 'mongoose';

class MatchExperienceService {
    getMatchExperienceById = async (id: string) => {
        try {
            const result = await MatchExperienceRepository.aggregate<PopulatedMatchExperience>([
                { $match: { _id: new mongoose.Types.ObjectId(id) } },

                // Lookup to populate createdBy (User who created the match experience)
                {
                    $lookup: {
                        from: 'users',
                        localField: 'createdBy',
                        foreignField: '_id',
                        as: 'createdBy',
                        pipeline: [
                            {
                                $project: {
                                    password: 0, // Remove password
                                    refreshTokens: 0, // Remove refreshTokens
                                },
                            },
                        ],
                    },
                },
                { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } }, // Handle missing createdBy

                // Lookup to populate comments
                {
                    $lookup: {
                        from: 'comments',
                        localField: '_id',
                        foreignField: 'matchExperienceId',
                        as: 'comments',
                        pipeline: [
                            { $sort: { createdAt: -1 } }, // Sort comments (newest to oldest)

                            // Lookup to populate user inside comments
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'userId',
                                    foreignField: '_id',
                                    as: 'user',
                                    pipeline: [
                                        {
                                            $project: {
                                                password: 0, // Remove password
                                                refreshTokens: 0, // Remove refreshTokens
                                            },
                                        },
                                    ],
                                },
                            },
                            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }, // Handle missing user
                        ],
                    },
                },
            ]);

            return result.at(0) || null; // Ensure consistent return type
        } catch (error) {
            console.error(`Error fetching matchExperience with ID ${id}:`, error);
            throw error;
        }
    };
}

export const matchExperienceService = new MatchExperienceService();
