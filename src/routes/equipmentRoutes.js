import express from 'express';
import { createEquipment, getById, updateById, deleteEquipment, getEquipmentDashboard } from '../controllers/equipmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Define routes
router.post('/', protect, createEquipment);
router.get('/:id', getById);
router.put('/:id', updateById)

router.delete('/:equipment_id', protect, admin, deleteEquipment);


export default router;
