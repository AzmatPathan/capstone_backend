import asyncHandler from '../middleware/asyncHandler.js';
import { addEquipment, getEquipmentById, updateEquipment, getEquipmentDashboardData } from '../models/equipmentModel.js';
import { exportToCSV } from '../utils/exportToCsv.js';

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
// @route   GET /api/dashboard
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

// @desc    Export all equipment data
// @route   GET /api/equipment/export
// @access  Public
export const exportEquipmentData = async (req, res) => {
  try {
    // Fetch equipment data from your service
    const equipments = await getEquipmentDashboardData();

    // Define CSV fields based on your equipment data structure
    const csvFields = [
      { id: 'equipment_id', title: 'Equipment ID' },
      { id: 'barcode', title: 'Barcode' },
      { id: 'created_by', title: 'Created By' },
      { id: 'created_at', title: 'Created At' },
      { id: 'reviewed_by', title: 'Reviewed By' },
      { id: 'reviewed_at', title: 'Reviewed At' },
      { id: 'status', title: 'Status' },
    ];

    // Export data to CSV using the utility function
    await exportToCSV(equipments, csvFields, 'equipments.csv', res);
  } catch (error) {
    console.error('Error exporting equipment data:', error);
    res.status(500).json({ message: 'Failed to export equipment data as CSV' });
  }
};