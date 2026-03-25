import express from 'express';
import {
  getCurrentUser,
  updateProfile,
  getUsers,
  updateUserRole
} from '../controllers/auth.controller.js';
import {
  authenticateUser,
  authorizeAdmin
} from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected routes
router.get('/me', authenticateUser, getCurrentUser);
router.put('/profile', authenticateUser, updateProfile);

// Admin only routes
router.get('/users', authenticateUser, authorizeAdmin, getUsers);
router.put('/users/:userId/role', authenticateUser, authorizeAdmin, updateUserRole);

export default router;