import asyncHandler from '../middleware/asyncHandler.js';
import { addEquipment, getEquipmentById, updateEquipment, getEquipmentDashboardData } from '../models/equipmentModel.js';



export const createEquipment = asyncHandler(async (req, res) => {
  try {
    const equipmentId = await addEquipment(req);
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

export const deleteEquipment = asyncHandler(async (req, res) => {
  const { equipment_id } = req.params;

  try {
    const result = await deleteEquipmentById(equipment_id);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Equipment not found' });
      return;
    }

    res.status(200).json({ message: 'Equipment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting equipment' });
  }
});


// @desc    Get equipment dashboard data
// @route   GET /api/equipment/dashboard
// @access  Private
export const getEquipmentDashboard = asyncHandler(async (req, res) => {
  try {
    const equipmentDashboardData = await getEquipmentDashboardData();
    
    res.status(200).json({ success: true, data: equipmentDashboardData });
  } catch (error) {
    console.error('Error fetching equipment dashboard data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


