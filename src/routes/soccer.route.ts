import { Router } from "express";
import { soccerController } from "../controllers/soccer.controller";

const router = Router();

router.get("/countries", soccerController.getCountries);

router.get("/leagues", soccerController.getLeagues);

router.get("/venues", soccerController.getVenues);

router.get("/teams", soccerController.getTeams);

export default router;
