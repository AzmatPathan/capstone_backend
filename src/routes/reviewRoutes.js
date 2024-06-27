import express from 'express';
import {
  addEquipmentWithReview,
  assignReviewToAdmin,
  getAllReviewsController,
  getReviewDetailsController,
  updateReviewStatusController
} from '../controllers/reviewController.js';

const router = express.Router();

/**
 * @typedef EquipmentData
 * @property {integer} equipment_id
 * @property {string} barcode
 * @property {string} created_by
 * @property {string} created_at
 * @property {string} description
 * @property {string} manufacturer
 * @property {string} model_number
 * @property {string} serial_number
 * @property {string} capacity
 * @property {string} date
 * @property {string} speed
 * @property {string} voltage
 * @property {string} additional_details
 */

/**
 * @typedef AddEquipmentResponse
 * @property {boolean} success
 * @property {string} message
 * @property {integer} equipment_id
 */

/**
 * @route POST /api/add-equipment
 * @group Equipment - Operations about equipment
 * @param {EquipmentData.model} equipmentData.body.required - Equipment data
 * @summary Add new equipment and create a review
 * @returns {AddEquipmentResponse.model} 201 - Equipment added and review created successfully
 * @returns {Error}  500 - Error adding equipment and creating review
 */
router.post('/add-equipment', addEquipmentWithReview);

/**
 * @typedef AssignReviewRequest
 * @property {integer} reviewId.required - ID of the review to be assigned
 * @property {integer} adminId.required - ID of the admin to whom the review will be assigned
 */

/**
 * @typedef AssignReviewResponse
 * @property {boolean} success - Indicates whether the review was successfully assigned
 * @property {string} message - Message indicating the result of the assignment
 */

/**
 * @route POST /api/assign-review
 * @group Review - Operations about review
 * @param {AssignReviewRequest.model} request.body.required - Review assignment data
 * @summary Assign a review to an admin
 * @returns {AssignReviewResponse.model} 200 - Review assigned successfully
 * @returns {Error} 500 - Server error
 */
router.post('/assign-review', assignReviewToAdmin);

/**
 * @typedef UpdateReviewStatusRequest
 * @property {integer} adminId.required - ID of the admin updating the review
 * @property {string} status.required - Status of the review (Approved/Rejected)
 */

/**
 * @typedef UpdateReviewStatusResponse
 * @property {boolean} success - Indicates whether the review status was successfully updated
 * @property {string} message - Message indicating the result of the update
 */

/**
 * @route PUT /api/reviews/{id}/status
 * @group Review - Operations about review
 * @param {integer} id.path.required - Review ID
 * @param {UpdateReviewStatusRequest.model} request.body.required - Review status update data
 * @summary Update review status
 * @returns {UpdateReviewStatusResponse.model} 200 - Review status updated successfully
 * @returns {Error} 500 - Server error
 */
router.put('/:id/status', updateReviewStatusController);

/**
 * @typedef ReviewData
 * @property {integer} equipment_id
 * @property {string} barcode
 * @property {string} created_by
 * @property {string} created_at
 * @property {integer} review_id
 * @property {string} reviewed_at
 * @property {string} status
 * @property {string} reviewed_by
 */

/**
 * @typedef GetAllReviewsResponse
 * @property {boolean} success - Indicates whether the operation was successful
 * @property {Array.<ReviewData>} data - Array of review data objects
 */

/**
 * @route GET /api/reviews
 * @group Review - Operations about review
 * @summary Get all reviews
 * @returns {GetAllReviewsResponse.model} 200 - Successful response - array of reviews
 * @returns {Error} 500 - Server error
 */
router.get('/', getAllReviewsController);

/**
 * @typedef ReviewDetails
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
 * @property {string} image_url
 * @property {string} image_description
 * @property {integer} reviewed_by
 * @property {string} reviewed_at
 * @property {string} reviewed_data
 * @property {string} status
 */

/**
 * @typedef GetReviewDetailsResponse
 * @property {boolean} success - Indicates whether the operation was successful
 * @property {ReviewDetails} data - Detailed information about the review
 */

/**
 * @route GET /api/reviews/{id}
 * @group Review - Operations about review
 * @param {integer} id.path.required - Review ID
 * @summary Get review details by ID
 * @returns {GetReviewDetailsResponse.model} 200 - Successful response - detailed review information
 * @returns {Error} 404 - Review not found
 * @returns {Error} 500 - Server error
 */
router.get('/:id', getReviewDetailsController);

export default router;
