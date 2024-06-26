/**
 * @typedef Equipment
 * @property {integer} equipment_id
 * @property {string} barcode
 * @property {string} manufacturer
 * @property {string} model_number
 * @property {string} serial_number
 * @property {string} capacity
 * @property {string} date
 * @property {string} speed
 * @property {string} voltage
 * @property {string} additional_details
 * @property {string} created_at
 * @property {string} created_by
 * @property {integer} reviewed_by
 * @property {string} reviewed_at
 * @property {string} status
 */

/**
 * @typedef EquipmentIdResponse
 * @property {integer} equipmentId - ID of the created equipment
 */

/**
 * @typedef ErrorResponse
 * @property {boolean} success - Indicates whether the request was successful
 * @property {string} message - Error message
 * @property {string} [error] - Optional detailed error message
 */

/**
 * @typedef EquipmentUpdateResponse
 * @property {boolean} success - Indicates whether the equipment was successfully updated
 * @property {Equipment.model} data - Updated equipment data
 */

/**
 * @typedef EquipmentDashboardData
 * @property {integer} equipment_id
 * @property {string} barcode
 * @property {string} created_by
 * @property {string} created_at
 * @property {integer} reviewed_by
 * @property {string} reviewed_at
 * @property {string} status
 */

/**
 * @typedef EquipmentDashboardResponse
 * @property {boolean} success - Indicates whether the operation was successful
 * @property {Array.<EquipmentDashboardData>} data - Array of equipment dashboard data objects
 */

/**
 * @typedef GetReviewDetailsResponse
 * @property {boolean} success - Indicates whether the operation was successful
 * @property {Equipment.model} data - Detailed information about the equipment and review
 */

/**
 * @route POST /api/equipment
 * @group Equipment - Operations about equipment
 * @param {Equipment.model} request.body.required - Equipment object to create
 * @security JWT
 * @returns {EquipmentIdResponse.model} 201 - Equipment added successfully
 * @returns {ErrorResponse.model} 500 - Error adding equipment
 */

/**
 * @route GET /api/equipment/{id}
 * @group Equipment - Operations about equipment
 * @param {integer} id.path.required - Equipment ID
 * @security JWT
 * @returns {Equipment.model} 200 - Successful response - equipment details
 * @returns {ErrorResponse.model} 500 - Failed to fetch equipment
 */

/**
 * @route PUT /api/equipment/{id}
 * @group Equipment - Operations about equipment
 * @param {integer} id.path.required - Equipment ID
 * @param {Equipment.model} request.body.required - Updated equipment data
 * @security JWT
 * @returns {EquipmentUpdateResponse.model} 200 - Equipment updated successfully
 * @returns {ErrorResponse.model} 500 - Failed to update equipment
 */

/**
 * @route DELETE /api/equipment/{equipment_id}
 * @group Equipment - Operations about equipment
 * @param {integer} equipment_id.path.required - Equipment ID to delete
 * @security JWT
 * @returns {ErrorResponse.model} 404 - Equipment not found
 * @returns {ErrorResponse.model} 200 - Equipment deleted successfully
 */

/**
 * @route GET /api/dashboard
 * @group Equipment - Operations about equipment
 * @desc Get equipment dashboard data
 * @security JWT
 * @returns {EquipmentDashboardResponse.model} 200 - Successful response - array of equipment dashboard data
 * @returns {ErrorResponse.model} 500 - Internal server error
 */

/**
 * @route GET /api/equipment/export
 * @group Equipment - Operations about equipment
 * @desc Export all equipment data as CSV
 * @returns {ErrorResponse.model} 500 - Failed to export equipment data as CSV
 */

/**
 * @route GET /api/reviews/:id
 * @group Review - Operations about review
 * @param {integer} id.path.required - Review ID
 * @security JWT
 * @returns {GetReviewDetailsResponse.model} 200 - Successful response - detailed review information
 * @returns {ErrorResponse.model} 404 - Review not found
 * @returns {ErrorResponse.model} 500 - Server error
 */

/**
 * @route GET /api/reviews
 * @group Review - Operations about review
 * @desc Get all reviews
 * @security JWT
 * @returns {GetAllReviewsResponse.model} 200 - Successful response - array of reviews
 * @returns {ErrorResponse.model} 500 - Internal server error
 */

/**
 * @route POST /api/assign-review
 * @group Review - Operations about review
 * @param {AssignReviewRequest.model} request.body.required - Review assignment data
 * @security JWT
 * @returns {AssignReviewResponse.model} 200 - Review assigned successfully
 * @returns {ErrorResponse.model} 500 - Error assigning review
 */

/**
 * @route PUT /api/reviews/:id/status
 * @group Review - Operations about review
 * @param {integer} id.path.required - Review ID
 * @param {UpdateReviewStatusRequest.model} request.body.required - Review status update data
 * @security JWT
 * @returns {UpdateReviewStatusResponse.model} 200 - Review status updated successfully
 * @returns {ErrorResponse.model} 500 - Error updating review status
 */

import express from 'express';
import { createEquipment, deleteEquipment, getById, updateById } from '../controllers/equipmentController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Define routes
router.post('/', protect, createEquipment);
router.get('/:id', protect, getById);
router.put('/:id', protect, updateById)

router.delete('/:equipment_id', protect, admin, deleteEquipment);


export default router;
