import asyncHandler from '../middleware/asyncHandler.js';
import pool from '../config/db.js';

export const insertUserEquipment = asyncHandler(async (userId, equipmentId) => {
    try {
      await pool.query('INSERT INTO User_Equipment (user_id, equipment_id) VALUES (?, ?)', [userId, equipmentId]);
      console.log(`User ${userId} associated with equipment ${equipmentId}`);
    } catch (error) {
      console.error('Error inserting user-equipment association:', error);
      throw error;
    }
  });
  