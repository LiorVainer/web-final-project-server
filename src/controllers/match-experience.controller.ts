import { Request, Response } from 'express';
import { MatchExperienceRepository } from '../repositories/match-experience.repository';
import { CommentRepository } from '../repositories/comment.repository';
import mongoose from 'mongoose';
import { CreateCommentDTO } from '../models/comment.model';
import { matchExperienceService } from '../services/match-experience.service';
import { AIService } from '../services/ai.service';
import { formatObject } from '../utils/formatObject.utils';

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
            const matchExperiences = await MatchExperienceRepository.find();
            res.status(200).send(matchExperiences);
        } catch (err) {
            res.status(500).send(err);
        }
    },

    getMatchExperienceById: async (req: Request, res: Response) => {
        try {
            const matchExpId = req.params.id;
            const result = await matchExperienceService.getMatchExperienceById(matchExpId);

            if (!result) {
                return res.status(404).send('MatchExperience not found');
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

    betterDescription: async (req: Request, res: Response): Promise<Response> => {
        try {
            const prompt = `Generate a short, engaging match experience description based on these details. 
            Capture the emotions, key moments, and atmosphere in a concise way. 
            Only return the description itself—do not include introductions, explanations, or extra text. 
            Match details: ${formatObject(req.query)}`;
            const response = await AIService.generateText(prompt);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error fetching response from AI:', error);
            return res.status(500).json({ error: 'Error fetching response from AI' });
        }
    },
};
