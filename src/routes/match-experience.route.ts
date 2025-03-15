import { Router } from "express";
import { matchExperienceController } from "../controllers/match-experience.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: MatchExperiences
 *   description: MatchExperience management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - matchExperienceId
 *         - userId
 *         - content
 *         - createdAt
 *       properties:
 *         matchExperienceId:
 *           type: string
 *           description: The ID of the matchExperience being commented on
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

 *     MatchExperience:
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
 *           description: The title of the matchExperience
 *         description:
 *           type: string
 *           description: A detailed description of the matchExperience
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created the matchExperience
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of user IDs who liked the matchExperience
 *         comments:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of comment IDs associated with the matchExperience
 *         picture:
 *           type: string
 *           description: Optional picture URL for the matchExperience
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time when the matchExperience was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The time when the matchExperience was last updated
 */

/**
 * @swagger
 * /match-experiences:
 *   post:
 *     summary: Create a new matchExperience
 *     tags: [MatchExperiences]
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
 *         description: The created matchExperience
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MatchExperience'
 *       500:
 *         description: Error creating matchExperience
 */
router.post("/", matchExperienceController.createMatchExperience);

/**
 * @swagger
 * /match-experiences:
 *   get:
 *     summary: Get all matchExperiences
 *     tags: [MatchExperiences]
 *     responses:
 *       200:
 *         description: A list of matchExperiences
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MatchExperience'
 *       500:
 *         description: Error fetching matchExperiences
 */
router.get("/", matchExperienceController.getAll);

router.get('/better-description', matchExperienceController.betterDescription);

/**
 * @swagger
 * /match-experiences/{id}:
 *   get:
 *     summary: Get a matchExperience by ID
 *     tags: [MatchExperiences]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The matchExperience ID
 *     responses:
 *       200:
 *         description: The matchExperience data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MatchExperience'
 *       404:
 *         description: MatchExperience not found
 *       500:
 *         description: Error fetching matchExperience
 */
router.get("/:id", matchExperienceController.getMatchExperienceById);

/**
 * @swagger
 * /match-experiences/{id}:
 *   put:
 *     summary: Update a matchExperience by ID
 *     tags: [MatchExperiences]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The matchExperience ID
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
 *         description: The updated matchExperience
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MatchExperience'
 *       404:
 *         description: MatchExperience not found
 *       500:
 *         description: Error updating matchExperience
 */
router.put("/:id", matchExperienceController.updateMatchExperience);

/**
 * @swagger
 * /match-experiences/{id}:
 *   delete:
 *     summary: Delete a matchExperience by ID
 *     tags: [MatchExperiences]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The matchExperience ID
 *     responses:
 *       200:
 *         description: The deleted matchExperience
 *       404:
 *         description: MatchExperience not found
 *       500:
 *         description: Error deleting matchExperience
 */
router.delete("/:id", matchExperienceController.deleteMatchExperience);

/**
 * @swagger
 * /match-experiences/{id}/comments:
 *   post:
 *     summary: Add a comment to a matchExperience
 *     tags: [MatchExperiences]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The matchExperience ID
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
 *         description: The updated matchExperience with the new comment
 *       404:
 *         description: MatchExperience not found
 *       500:
 *         description: Error adding comment
 */
router.post("/:id/comments", matchExperienceController.addComment);

/**
 * @swagger
 * /match-experiences/{id}/like:
 *   post:
 *     summary: Like a matchExperience
 *     tags: [MatchExperiences]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The matchExperience ID
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
 *         description: The updated matchExperience with a new like
 *       404:
 *         description: MatchExperience not found
 *       500:
 *         description: Error liking matchExperience
 */
router.post("/:id/like", matchExperienceController.likeMatchExperience);

/**
 * @swagger
 * /match-experiences/{id}/unlike:
 *   post:
 *     summary: Unlike a matchExperience
 *     tags: [MatchExperiences]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The matchExperience ID
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
 *         description: The updated matchExperience with the like removed
 *       404:
 *         description: MatchExperience not found
 *       500:
 *         description: Error unliking matchExperience
 */
router.post("/:id/unlike", matchExperienceController.unlikeMatchExperience);

export default router;
