import { Router } from "express";
import { recommendationController } from "../controllers/recommendation.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: Recommendation management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - recommendationId
 *         - userId
 *         - content
 *         - createdAt
 *       properties:
 *         recommendationId:
 *           type: string
 *           description: The ID of the recommendation being commented on
 *         userId:
 *           type: string
 *           description: The ID of the user who made the comment
 *         content:
 *           type: string
 *           description: The content of the comment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the comment was created

 *     Recommendation:
 *       type: object
 *       required:
 *         - homeTeam
 *         - awayTeam
 *         - matchDate
 *         - league
 *         - country
 *         - stadium
 *         - title
 *         - description
 *       properties:
 *         homeTeam:
 *           type: string
 *           description: The name of the home team
 *         awayTeam:
 *           type: string
 *           description: The name of the away team
 *         matchDate:
 *           type: string
 *           format: date-time
 *           description: The date and time of the match
 *         league:
 *           type: string
 *           description: The league of the match
 *         country:
 *           type: string
 *           description: The country of the match
 *         stadium:
 *           type: string
 *           description: The stadium where the match will be held
 *         title:
 *           type: string
 *           description: The title of the recommendation
 *         description:
 *           type: string
 *           description: A detailed description of the recommendation
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created the recommendation
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of user IDs who liked the recommendation
 *         comments:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of comment IDs associated with the recommendation
 *         picture:
 *           type: string
 *           description: Optional picture URL for the recommendation
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time when the recommendation was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The time when the recommendation was last updated
 */


/**
 * @swagger
 * /recommendations:
 *   post:
 *     summary: Create a new recommendation
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - homeTeam
 *               - awayTeam
 *               - matchDate
 *               - league
 *               - country
 *               - stadium
 *               - title
 *               - description
 *             properties:
 *               homeTeam:
 *                 type: string
 *               awayTeam:
 *                 type: string
 *               matchDate:
 *                 type: string
 *                 format: date-time
 *               league:
 *                 type: string
 *               country:
 *                 type: string
 *               stadium:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created recommendation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recommendation'
 *       500:
 *         description: Error creating recommendation
 */
router.post("/", recommendationController.createRecommendation);

/**
 * @swagger
 * /recommendations:
 *   get:
 *     summary: Get all recommendations
 *     tags: [Recommendations]
 *     responses:
 *       200:
 *         description: A list of recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recommendation'
 *       500:
 *         description: Error fetching recommendations
 */
router.get("/", recommendationController.getAll);

/**
 * @swagger
 * /recommendations/{id}:
 *   get:
 *     summary: Get a recommendation by ID
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The recommendation ID
 *     responses:
 *       200:
 *         description: The recommendation data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recommendation'
 *       404:
 *         description: Recommendation not found
 *       500:
 *         description: Error fetching recommendation
 */
router.get("/:id", recommendationController.getRecommendationById);

/**
 * @swagger
 * /recommendations/{id}:
 *   put:
 *     summary: Update a recommendation by ID
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The recommendation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               homeTeam:
 *                 type: string
 *               awayTeam:
 *                 type: string
 *               matchDate:
 *                 type: string
 *                 format: date-time
 *               league:
 *                 type: string
 *               country:
 *                 type: string
 *               stadium:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated recommendation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recommendation'
 *       404:
 *         description: Recommendation not found
 *       500:
 *         description: Error updating recommendation
 */
router.put("/:id", recommendationController.updateRecommendation);

/**
 * @swagger
 * /recommendations/{id}:
 *   delete:
 *     summary: Delete a recommendation by ID
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The recommendation ID
 *     responses:
 *       200:
 *         description: The deleted recommendation
 *       404:
 *         description: Recommendation not found
 *       500:
 *         description: Error deleting recommendation
 */
router.delete("/:id", recommendationController.deleteRecommendation);

/**
 * @swagger
 * /recommendations/{id}/comments:
 *   post:
 *     summary: Add a comment to a recommendation
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The recommendation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - content
 *             properties:
 *               userId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated recommendation with the new comment
 *       404:
 *         description: Recommendation not found
 *       500:
 *         description: Error adding comment
 */
router.post("/:id/comments", recommendationController.addComment);

/**
 * @swagger
 * /recommendations/{id}/like:
 *   post:
 *     summary: Like a recommendation
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The recommendation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated recommendation with a new like
 *       404:
 *         description: Recommendation not found
 *       500:
 *         description: Error liking recommendation
 */
router.post("/:id/like", recommendationController.likeRecommendation);

/**
 * @swagger
 * /recommendations/{id}/unlike:
 *   post:
 *     summary: Unlike a recommendation
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The recommendation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated recommendation with the like removed
 *       404:
 *         description: Recommendation not found
 *       500:
 *         description: Error unliking recommendation
 */
router.post("/:id/unlike", recommendationController.unlikeRecommendation);

export default router;
