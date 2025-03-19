import express from 'express';
import { fileController } from '../controllers/file.controller';
import { upload } from '../middlewares/file.middleware';
import { authMiddleware } from '../middlewares/auth.middlware';

const router = express.Router();

router.post('/', upload.single('file'), fileController.handleUpload);
router.delete('/:url', authMiddleware, fileController.deleteFile);

export default router;
