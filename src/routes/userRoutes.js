import express from 'express';
import getAllUsers from '../controllers/userController.js';

const router = express.Router();

// Define routes
router.route('/').get(getAllUsers)

export default router;
