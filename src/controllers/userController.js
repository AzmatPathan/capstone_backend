import asyncHandler from '../middleware/asyncHandler.js';
import { fetchUser, fetchUsers, lastLoginUser, createUser, deleteUserById, fetchUserById } from '../models/userModel.js';
import { matchPassword } from '../utils/bcrypt.js';
import { exportToCSV } from '../utils/exportToCsv.js';
import generateToken from '../utils/generateToken.js';

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await fetchUsers();
  return res.status(200).json(users);
});

// @desc    Auth user & get token
// @route   POST /api/users/auth
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await fetchUser(email);

  if (user && (await matchPassword(user.password_hash, password))) {
    generateToken(res, user);

    // Update last_login field
    await lastLoginUser(email);

    res.json({
      _id: user.user_id,
      name: user.username,
      email: user.email,
      role: user.role,
      last_login: new Date(),
    });
  } else {
    res.status(401);  
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await fetchUser(email);
  if (existingUser) { 
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await createUser(name, email, password, role);

  // Generate JWT token
  generateToken(res, user);

  res.status(201).json({
    _id: user.id,
    name: user.username,
    email: user.email,
    role: user.role,
  });
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await deleteUserById(id);

  if (result.affectedRows > 0) {
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await fetchUserById(id);  // Ensure this function is defined in userModel.js

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
// @desc    Export all equipment data
// @route   GET /api/dashboard/export/user
// @access  Public
export const exportUserData = async (req, res) => {
  try {
    // Fetch equipment data from your service
    const users = await fetchUsers();

    // Define CSV fields based on your equipment data structure
    const csvFields = [
      { id: 'user_id', title: 'User ID' },
      { id: 'username', title: 'Username' },
      { id: 'email', title: 'Email' },
      { id: 'role', title: 'Role' },
      { id: 'created_at', title: 'Created At' },
      { id: 'last_login', title: 'Last Login' },
      { id: 'is_active', title: 'Is Active' }
    ];

    // Export data to CSV using the utility function
    await exportToCSV(users, csvFields, 'users.csv', res);
  } catch (error) {
    console.error('Error exporting user data:', error);
    res.status(500).json({ message: 'Failed to export user data as CSV' });
  }
};

export { authUser, getAllUsers, registerUser, logoutUser, deleteUser, getUserById };

