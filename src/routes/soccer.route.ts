import { Router } from 'express';
import { soccerController } from '../controllers/soccer.controller';
import { authMiddleware } from '../middlewares/auth.middlware';

const router = Router();

router.use(authMiddleware);

router.get('/countries', soccerController.getCountries);

router.get('/leagues', soccerController.getLeagues);

router.get('/venues', soccerController.getVenues);

router.get('/teams', soccerController.getTeams);

export default router;
