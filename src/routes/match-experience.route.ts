import { Router } from 'express';
import { matchExperienceController } from '../controllers/match-experience.controller';
import { authMiddleware } from '../middlewares/auth.middlware';

const router = Router();

router.use(authMiddleware);

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
router.post('/', matchExperienceController.createMatchExperience);

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
router.get('/', matchExperienceController.getAll);

router.get('/better-description', matchExperienceController.betterDescription);

/**
 * @swagger
 * /match-experiences/user/{userId}:
 *   get:
 *     summary: Get all match experiences created by a specific user
 *     tags: [MatchExperiences]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose match experiences are being retrieved
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: The page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: The number of items per page (default is 5)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, likes]
 *         required: false
 *         description: Sorting criteria (default is "date", alternative is "likes")
 *     responses:
 *       200:
 *         description: A paginated list of match experiences created by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 experiences:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MatchExperience'
 *                 totalPages:
 *                   type: integer
 *       404:
 *         description: No match experiences found for the given user ID
 *       500:
 *         description: Error fetching match experiences
 */
router.get("/user/:userId", matchExperienceController.getAllByUserId);

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
router.get('/:id', matchExperienceController.getMatchExperienceById);

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
router.put('/:id', matchExperienceController.updateMatchExperience);

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
router.delete('/:id', matchExperienceController.deleteMatchExperience);

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
router.post('/:id/comments', matchExperienceController.addComment);

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
router.post('/:id/like', matchExperienceController.likeMatchExperience);

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
router.post('/:id/unlike', matchExperienceController.unlikeMatchExperience);

export default router;
