import express from 'express';
import { getImageTranslation } from '../controllers/cloudController.js';

const router = express.Router();

// Define routes
router.get('/getImageTranslation', getImageTranslation);

export default router;
