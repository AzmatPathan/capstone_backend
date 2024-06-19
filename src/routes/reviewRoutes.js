import express from 'express';
import { addEquipmentWithReview, assignReviewToAdmin, updateReviewStatusController, getAllReviewsController } from '../controllers/reviewController.js';

const router = express.Router();

// Route to add equipment and create a review
router.post('/add-equipment', addEquipmentWithReview);

// Route to assign a review to an admin
router.post('/assign-review', assignReviewToAdmin);

// Route to update the review status
router.post('/update-review-status', updateReviewStatusController);

router.get('/', getAllReviewsController);

export default router;
