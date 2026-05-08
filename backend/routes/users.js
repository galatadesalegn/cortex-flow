import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  deleteAccount,
  updatePermissions,
  changePassword
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and require admin access
router.use(protect);

// Routes for admin management (super admin only)
router.route('/')
  .get(admin, getUsers)
  .post(admin, createUser);

router.route('/account/delete')
  .delete(deleteAccount);

router.route('/change-password')
  .put(changePassword);

router.route('/:id')
  .get(admin, getUser)
  .put(admin, updateUser)
  .delete(admin, deleteUser);

router.route('/:id/permissions')
  .put(admin, updatePermissions);

export default router;
