import express from 'express';
import { createEquipment, getById, updateById } from '../controllers/equipmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Define routes
router.post('/', protect, createEquipment);
router.get('/:id', getById);
router.put('/:id', updateById)

export default router;
