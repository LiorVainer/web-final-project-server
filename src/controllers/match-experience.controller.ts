import { Request, Response } from 'express';
import { MatchExperienceRepository } from '../repositories/match-experience.repository';
import { CommentRepository } from '../repositories/comment.repository';
import mongoose from 'mongoose';
import { CreateCommentDTO } from '../models/comment.model';
import { matchExperienceService } from '../services/match-experience.service';

export const matchExperienceController = {
    createMatchExperience: async (req: Request, res: Response) => {
        try {
            const matchExperience = await MatchExperienceRepository.create(req.body);
            res.status(200).send(matchExperience);
        } catch (err) {
            res.status(500).send(err);
        }
    },

    getAll: async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const sortBy = (req.query.sortBy as string) || "date"; // Default sorting: date
    
            const result = await matchExperienceService.getAllMatchExperiences(page, limit, sortBy);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ error: "Error fetching matchExperiences", details: err });
        }
    },

    getMatchExperienceById: async (req: Request, res: Response) => {
        try {
            const matchExpId = req.params.id;
            const result = await matchExperienceService.getMatchExperienceById(matchExpId);

            if (!result) {
                res.status(404).send('MatchExperience not found');
                return
            }
            res.status(200).send(result);
        } catch (err) {
            res.status(500).send(err);
        }
    },

    updateMatchExperience: async (req: Request, res: Response) => {
        try {
            const matchExperience = await MatchExperienceRepository.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            if (!matchExperience) {
                res.status(404).send('MatchExperience not found');
                return;
            }
            res.status(200).send(matchExperience);
        } catch (err) {
            res.status(500).send(err);
        }
    },

    deleteMatchExperience: async (req: Request, res: Response) => {
        try {
            const matchExperience = await MatchExperienceRepository.findByIdAndDelete(req.params.id);
            if (!matchExperience) {
                res.status(404).send('MatchExperience not found');
                return;
            }
            res.status(200).send('MatchExperience deleted successfully');
        } catch (err) {
            res.status(500).send(err);
        }
    },

    addComment: async (req: Request, res: Response) => {
        try {
            const matchExperienceId = req.params.id;
            const { userId, content } = req.body;

            const matchExperience = await MatchExperienceRepository.findById(matchExperienceId);
            if (!matchExperience) {
                res.status(404).send('MatchExperience not found');
            }

            const newComment: CreateCommentDTO = {
                matchExperienceId: new mongoose.Types.ObjectId(matchExperienceId),
                userId,
                content,
            };

            const message = await CommentRepository.create(newComment);

            res.status(200).send(message.id);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    likeMatchExperience: async (req: Request, res: Response) => {
        try {
            const matchExperienceId = req.params.id;
            const { userId } = req.body;

            const matchExperience = await MatchExperienceRepository.findByIdAndUpdate(
                matchExperienceId,
                { $addToSet: { likes: userId } },
                { new: true }
            );
            if (!matchExperience) {
                res.status(404).send('MatchExperience not found');
                return;
            }
            res.status(200).send({ ok: true });
        } catch (err) {
            res.status(500).send(err);
        }
    },

    unlikeMatchExperience: async (req: Request, res: Response) => {
        try {
            const matchExperienceId = req.params.id;
            const { userId } = req.body;

            const matchExperience = await MatchExperienceRepository.findByIdAndUpdate(
                matchExperienceId,
                { $pull: { likes: userId } },
                { new: true }
            );
            if (!matchExperience) {
                res.status(404).send('MatchExperience not found');
                return;
            }
            res.status(200).send({ ok: true });
        } catch (err) {
            res.status(500).send(err);
        }
    },
};
