import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { MatchExperienceRepository } from "../repositories/match-experience.repository";

// Controller object for matchExperience endpoints
export const matchExperienceController = {
  // Create a new matchExperience
  createMatchExperience: async (req: Request, res: Response) => {
    try {
      const matchExperience = await MatchExperienceRepository.create(req.body);
      res.status(200).send(matchExperience);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Get all matchExperiences
  getAll: async (req: Request, res: Response) => {
    try {
      const matchExperiences = await MatchExperienceRepository.find();
      res.status(200).send(matchExperiences);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Get a single matchExperience by id
  getMatchExperienceById: async (req: Request, res: Response) => {
    try {
      const matchExperience = await MatchExperienceRepository.findById(
        req.params.id
      );
      if (!matchExperience) {
        res.status(404).send("MatchExperience not found");
        return;
      }
      res.status(200).send(matchExperience);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Update a matchExperience by id
  updateMatchExperience: async (req: Request, res: Response) => {
    try {
      const matchExperience = await MatchExperienceRepository.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!matchExperience) {
        res.status(404).send("MatchExperience not found");
        return;
      }
      res.status(200).send(matchExperience);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Delete a matchExperience by id
  deleteMatchExperience: async (req: Request, res: Response) => {
    try {
      const matchExperience = await MatchExperienceRepository.findByIdAndDelete(
        req.params.id
      );
      if (!matchExperience) {
        res.status(404).send("MatchExperience not found");
        return;
      }
      res.status(200).send("MatchExperience deleted successfully");
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Add a comment to a matchExperience
  addComment: async (req: Request, res: Response) => {
    try {
      const matchExperienceId = req.params.id;
      const { userId, content } = req.body;

      const comment = {
        _id: uuidv4(),
        matchExperienceId,
        userId,
        content,
        createdAt: new Date(),
      };

      const matchExperience = await MatchExperienceRepository.findByIdAndUpdate(
        matchExperienceId,
        { $push: { comments: comment } },
        { new: true }
      );

      if (!matchExperience) {
        res.status(404).send("MatchExperience not found");
        return;
      }
      res.status(200).send(matchExperience);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Like a matchExperience (adds the userId to the likes array)
  likeMatchExperience: async (req: Request, res: Response) => {
    try {
      const matchExperienceId = req.params.id;
      const { userId } = req.body;

      const matchExperience = await MatchExperienceRepository.findByIdAndUpdate(
        matchExperienceId,
        { $addToSet: { likes: userId } }, // prevents duplicates
        { new: true }
      );
      if (!matchExperience) {
        res.status(404).send("MatchExperience not found");
        return;
      }
      res.status(200).send(matchExperience);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Unlike a matchExperience (removes the userId from the likes array)
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
        res.status(404).send("MatchExperience not found");
        return;
      }
      res.status(200).send(matchExperience);
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
