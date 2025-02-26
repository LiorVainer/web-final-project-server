import {Router} from "express";
import {recommendationController} from "../controllers/recommendation.controller";

const router = Router();

// Create a new recommendation
router.post("/", recommendationController.createRecommendation);

// Retrieve all recommendations
router.get("/", recommendationController.getAll);

// Retrieve a single recommendation by its ID
router.get("/:id", recommendationController.getRecommendationById);

// Update a recommendation by its ID
router.put("/:id", recommendationController.updateRecommendation);

// Delete a recommendation by its ID
router.delete("/:id", recommendationController.deleteRecommendation);

// Add a comment to a recommendation
router.post("/:id/comments", recommendationController.addComment);

// Like a recommendation (adds the userId to the likes array)
router.post("/:id/like", recommendationController.likeRecommendation);

// Unlike a recommendation (removes the userId from the likes array)
router.post("/:id/unlike", recommendationController.unlikeRecommendation);

export default router;