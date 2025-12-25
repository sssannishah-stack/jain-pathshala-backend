// src/middleware/adminMiddleware.js
const { USER_ROLES } = require('../utils/constants');

// Check if user is admin
const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (req.user.role !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Check if user is owner or admin
const isOwnerOrAdmin = (userIdField = 'userId') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      const resourceUserId = req.params[userIdField] || req.body[userIdField];
      
      if (req.user.role === USER_ROLES.ADMIN || req.user.uid === resourceUserId) {
        return next();
      }
      
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    } catch (error) {
      console.error('Owner/Admin middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  };
};

module.exports = {
  isAdmin,
  isOwnerOrAdmin
};
