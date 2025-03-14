import express from 'express';
import { fileController } from '../controllers/file.controller';
import { upload } from '../middlewares/file.middleware';

const router = express.Router();

router.post('/', upload.single('file'), fileController.handleUpload);
router.delete('/:url', fileController.deleteFile);

export default router;
