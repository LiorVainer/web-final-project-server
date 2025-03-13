import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';

const router = Router();

router.get('/generate-text', aiController.generateText);

export default router;
