// backend/src/routes/upload.ts
import express from 'express';
import { uploadAndProcess } from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.post('/', authenticate, upload.single('image'), uploadAndProcess);

export default router;