import express from 'express';
import { exportEquipmentData, getEquipmentDashboard } from '../controllers/equipmentController.js';
import { exportReviewData } from '../controllers/reviewController.js';
import { exportUserData } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getEquipmentDashboard);
router.get('/export/equipment', exportEquipmentData);
router.get('/export/review', exportReviewData);
router.get('/export/user', exportUserData);

export default router;
