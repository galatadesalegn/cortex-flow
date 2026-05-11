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
import { protect, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Self-service routes
router.use(protect);
router.route('/account/delete').delete(deleteAccount);
router.route('/change-password').put(changePassword);

// User management routes (requires manageAdmins permission)
router.use(checkPermission('manageAdmins'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.route('/:id/permissions')
  .put(updatePermissions);

export default router;
