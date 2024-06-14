import express from 'express';
import { getEquipmentDashboard } from '../controllers/equipmentController.js';

const router = express.Router();

router.get('/', getEquipmentDashboard);

export default router;
