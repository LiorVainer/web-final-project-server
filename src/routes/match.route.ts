import { Router } from "express";
import { matchController } from "../controllers/match.controller";

const router = Router();

// Create a new match
router.post("/", matchController.createMatch);

// Retrieve all matches
router.get("/", matchController.getAll);

export default router;
