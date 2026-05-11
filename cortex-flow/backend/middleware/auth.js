import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user details with permissions
      const user = await User.findById(decoded.id);
      if (!user || user.status !== 'active') {
        return res.status(401).json({ message: 'User not found or inactive' });
      }

      req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.getPermissions()
      };

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check for roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role ${req.user?.role || 'unknown'} is not authorized to access this resource`
      });
    }
    next();
  };
};

// Middleware to check for specific permissions
export const checkPermission = (permission) => {
  return (req, res, next) => {
    // Super-admins bypass all permission checks
    if (req.user.role === 'super_admin') return next();

    // Viewers can only do GET requests
    if (req.user.role === 'viewer' && req.method !== 'GET') {
      return res.status(403).json({ message: 'Viewers are not allowed to modify content' });
    }

    // Check if user has the specific permission required for this resource
    if (req.user.permissions && req.user.permissions[permission]) {
      // If user is editor, we check if it's a modification request
      if (req.user.role === 'editor' || req.user.role === 'admin' || req.user.role === 'super_admin') {
        return next();
      }
    }

    // Default: Check if it's a GET request for viewer/editor with permission
    if (req.method === 'GET' && req.user.permissions[permission]) {
      return next();
    }

    res.status(403).json({ message: `Insufficient permissions: ${permission} access required` });
  };
};

// Legacy support for admin middleware
export const admin = authorize('admin', 'super_admin');

