import { addEquipmentDataReview, assignReview, getAllReviews, getReviewDetailsById, updateReviewStatus } from '../models/reviewModel.js';
import asyncHandler from '../middleware/asyncHandler.js';


export const addEquipmentWithReview = asyncHandler(async (req, res) => {
    try {
        const equipmentData = req.body;
        const result = await addEquipmentDataReview(equipmentData);

        res.status(201).json({
            success: true,
            message: 'Equipment added and review created successfully.',
            equipment_id: result.equipment_id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding equipment and creating review.',
            error: error.message
        });
    }
});

export const assignReviewToAdmin = asyncHandler(async (req, res) => {
    try {
        const { reviewId, adminId } = req.body;
        const result = await assignReview(reviewId, adminId);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error assigning review.',
            error: error.message
        });
    }
});
/**
 * Controller to update review status.
 * @route PUT /api/reviews/:id/status
 * @access Private (Assumed to be authenticated)
 */
export const updateReviewStatusController = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { adminId, status } = req.body;

    try {
        const result = await updateReviewStatus(reviewId, adminId, status);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error updating review status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating review status.',
            error: error.message
        });
    }
});


// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private
export const getAllReviewsController = asyncHandler(async (req, res) => {
    try {
        const reviews = await getAllReviews();
        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


// @desc    Get review details by review ID
// @route   GET /api/reviews/:id
// @access  Private
export const getReviewDetailsController = asyncHandler(async (req, res) => {
    const reviewId = req.params.id;

    try {
        const reviewDetails = await getReviewDetailsById(reviewId);

        if (!reviewDetails) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.status(200).json({ success: true, data: reviewDetails });
    } catch (error) {
        console.error('Error fetching review details:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});