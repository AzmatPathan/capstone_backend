import asyncHandler from '../middleware/asyncHandler.js';
import { addEquipment, getEquipmentById, updateEquipment } from '../models/equipmentModel.js';



export const createEquipment = asyncHandler(async (req, res) => {
  try {
    const equipmentId = await addEquipment(req.body);
    res.status(201).json({ message: 'Equipment added successfully', equipmentId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding equipment' });
  }
});


export const getById = asyncHandler(async (req, res) => {
  const equipmentId = req.params.id;

  try {
    const response = await getEquipmentById(equipmentId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch equipment', error: error.message });
  }
});


export const updateById = asyncHandler(async (req, res) => {
  const equipmentId = req.params.id;
  const updateData = req.body;

  try {
    const result = await updateEquipment(equipmentId, updateData);
    res.json(result);
  } catch (error) {
    console.error('Error updating equipment:', error);
    res.status(500).json({ success: false, message: 'Failed to update equipment' });
  }

});



