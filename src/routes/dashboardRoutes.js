import express from 'express';
import { exportEquipmentData, getEquipmentDashboard } from '../controllers/equipmentController.js';

const router = express.Router();

router.get('/', getEquipmentDashboard);
router.get('/export/equipment', exportEquipmentData);

export default router;
