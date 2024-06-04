import express from 'express';
import { authUser, getAllUsers, logoutUser, registerUser, deleteUser } from '../controllers/userController.js';
import { admin } from '../middleware/authMiddleware.js';
const router = express.Router();

// Define routes
router.route('/').get(getAllUsers);
router.post('/auth', authUser);
router.post('/register', registerUser);
router.post('/logout', logoutUser);
router.delete('/:id', admin, deleteUser);

export default router;
