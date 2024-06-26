import express from 'express';
import { exportEquipmentData, getEquipmentDashboard } from '../controllers/equipmentController.js';
import { exportReviewData } from '../controllers/reviewController.js';
import { exportUserData } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
/**
 * @typedef EquipmentDashboard
 * @property {integer} equipment_id
 * @property {string} barcode
 * @property {string} created_by
 * @property {string} created_at
 * @property {integer} reviewed_by
 * @property {string} reviewed_at
 * @property {string} status
 */

/**
 * @route GET /api/dashboard
 * @group Dashboard - Operations about equipment dashboard
 * @returns {Array.<EquipmentDashboard>} 200 - An array of equipment dashboard data
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.get('/', protect, getEquipmentDashboard);


/**
 * @typedef ExportResponse
 * @property {string} message
 */

/**
 * @route GET /api/export/equipment
 * @group Export - Operations about exporting data
 * @summary Export all equipment data to CSV
 * @returns {file} 200 - CSV file containing all equipment data
 * @returns {ExportResponse.model} 500 - Failed to export equipment data as CSV
 * @produces text/csv
 */
router.get('/export/equipment', protect, exportEquipmentData);

/**
 * @route GET /api/export/review
 * @group Export - Operations about exporting data
 * @summary Export all review data to CSV
 * @returns {file} 200 - CSV file containing all review data
 * @returns {ExportResponse.model} 500 - Failed to export review data as CSV
 * @produces text/csv
 */
router.get('/export/review', protect, exportReviewData);

/**
 * @route GET /api/export/user
 * @group Export - Operations about exporting data
 * @summary Export all user data to CSV
 * @returns {file} 200 - CSV file containing all user data
 * @returns {ExportResponse.model} 500 - Failed to export user data as CSV
 * @produces text/csv
 */
router.get('/export/user', protect, exportUserData);


export default router;
