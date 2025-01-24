import express from "express";
import * as aiController from "../controllers/ai.controller";
import { authMiddleware } from "../controllers/auth.controller";

const router = express.Router();

router.get("/text", aiController.generateText);
router.get("/text/stream", aiController.streamText);
router.get("/object", aiController.generateObject);
router.get("/object/stream", aiController.generateStreamObject);

export default router;
