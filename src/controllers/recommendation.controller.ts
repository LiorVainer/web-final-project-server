import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { RecommendationRepository } from "../repositories/recommendation.repository";

// Controller object for recommendation endpoints
export const recommendationController = {
  // Create a new recommendation
  createRecommendation: async (req: Request, res: Response) => {
    try {
      const recommendation = await RecommendationRepository.create(req.body);
      res.status(200).send(recommendation);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Get all recommendations
  getAll: async (req: Request, res: Response) => {
    try {
      const recommendations = await RecommendationRepository.find();
      res.status(200).send(recommendations);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Get a single recommendation by id
  getRecommendationById: async (req: Request, res: Response) => {
    try {
      const recommendation = await RecommendationRepository.findById(
        req.params.id
      );
      if (!recommendation) {
        res.status(404).send("Recommendation not found");
        return;
      }
      res.status(200).send(recommendation);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Update a recommendation by id
  updateRecommendation: async (req: Request, res: Response) => {
    try {
      const recommendation = await RecommendationRepository.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!recommendation) {
        res.status(404).send("Recommendation not found");
        return;
      }
      res.status(200).send(recommendation);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Delete a recommendation by id
  deleteRecommendation: async (req: Request, res: Response) => {
    try {
      const recommendation = await RecommendationRepository.findByIdAndDelete(
        req.params.id
      );
      if (!recommendation) {
        res.status(404).send("Recommendation not found");
        return;
      }
      res.status(200).send("Recommendation deleted successfully");
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Add a comment to a recommendation
  addComment: async (req: Request, res: Response) => {
    try {
      const recommendationId = req.params.id;
      const { userId, content } = req.body;

      // Create a new comment subdocument
      const comment = {
        _id: uuidv4(),
        postId: recommendationId,
        userId,
        content,
        createdAt: new Date(),
      };

      const recommendation = await RecommendationRepository.findByIdAndUpdate(
        recommendationId,
        { $push: { comments: comment } },
        { new: true }
      );
      if (!recommendation) {
        res.status(404).send("Recommendation not found");
        return;
      }
      res.status(200).send(recommendation);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Like a recommendation (adds the userId to the likes array)
  likeRecommendation: async (req: Request, res: Response) => {
    try {
      const recommendationId = req.params.id;
      const { userId } = req.body;

      const recommendation = await RecommendationRepository.findByIdAndUpdate(
        recommendationId,
        { $addToSet: { likes: userId } }, // prevents duplicates
        { new: true }
      );
      if (!recommendation) {
        res.status(404).send("Recommendation not found");
        return;
      }
      res.status(200).send(recommendation);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Unlike a recommendation (removes the userId from the likes array)
  unlikeRecommendation: async (req: Request, res: Response) => {
    try {
      const recommendationId = req.params.id;
      const { userId } = req.body;

      const recommendation = await RecommendationRepository.findByIdAndUpdate(
        recommendationId,
        { $pull: { likes: userId } },
        { new: true }
      );
      if (!recommendation) {
        res.status(404).send("Recommendation not found");
        return;
      }
      res.status(200).send(recommendation);
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
