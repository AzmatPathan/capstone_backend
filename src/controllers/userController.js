import asyncHandler from '../middleware/asyncHandler.js';
import { fetchUser, fetchUsers, createUser } from '../models/userModel.js';
import { matchPassword } from '../utils/bcrypt.js';
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

    res.json({
      _id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
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

export { authUser, getAllUsers, registerUser, logoutUser };

