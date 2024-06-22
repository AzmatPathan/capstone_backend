import express from 'express';
import { getAllUsers, authUser, registerUser, logoutUser, deleteUser } from '../controllers/userController.js';
import { admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @typedef User
 * @property {integer} user_id
 * @property {string} username
 * @property {string} email
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} last_login
 * @property {string} role
 */

/**
 * @route GET /api/users
 * @group User - Operations about user
 * @returns {Array.<User>} 200 - A list of users
 * @returns {Error}  404 - Not Found
 * @returns {Error}  500 - Server Error
 */
router.route('/').get(getAllUsers);

/**
 * @route POST /api/users/auth
 * @group User - Operations about user
 * @returns {object} 200 - Authenticated user
 * @returns {Error}  404 - Not Found
 * @returns {Error}  500 - Server Error
 */
router.post('/auth', authUser);

/**
 * @route POST /api/users/register
 * @group User - Operations about user
 * @returns {object} 201 - Registered user
 * @returns {Error}  409 - Conflict
 * @returns {Error}  500 - Server Error
 */
router.post('/register', registerUser);

/**
 * @route POST /api/users/logout
 * @group User - Operations about user
 * @returns {object} 200 - User logged out
 * @returns {Error}  404 - Not Found
 * @returns {Error}  500 - Server Error
 */
router.post('/logout', logoutUser);

/**
 * @route DELETE /api/users/{id}
 * @group User - Operations about user
 * @param {integer} id.path.required - user ID
 * @returns {object} 200 - User deleted
 * @returns {Error}  404 - Not Found
 * @returns {Error}  500 - Server Error
 */
router.delete('/:id', admin, deleteUser);

export default router;
