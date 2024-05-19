import express from 'express';
import { createEquipment, getById, updateById } from '../controllers/equipmentController.js';

const router = express.Router();

// Define routes
router.post('/', createEquipment);
router.get('/:id', getById);
router.put('/:id', updateById)

export default router;
