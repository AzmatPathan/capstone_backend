import express from 'express';
import { authUser, getAllUsers, logoutUser, registerUser } from '../controllers/userController.js';

const router = express.Router();

// Define routes
router.route('/').get(getAllUsers);
router.post('/auth', authUser);
router.post('/register', registerUser);
router.post('/logout', logoutUser);

export default router;
