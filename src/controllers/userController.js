import asyncHandler from '../middleware/asyncHandler.js';
import fetchUsers from '../models/userModel.js';

// @desc    Get all users
// @route   GET /api/users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await fetchUsers();
    return res.status(200).json(users);
});

export default getAllUsers;
