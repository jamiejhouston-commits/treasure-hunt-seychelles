const db = require('../database/connection');
const { logger } = require('../utils/logger');

// API Key authentication middleware (supports X-API-Key or Authorization: Bearer <key>)
const authenticateApiKey = async (req, res, next) => {
  try {
    let apiKey = req.header('X-API-Key');
    if (!apiKey) {
      const authHeader = req.header('Authorization') || req.header('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        apiKey = authHeader.substring('Bearer '.length).trim();
      }
    }
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    // Check if API key exists in admin_users table
    const admin = await db('admin_users')
      .where('api_key', apiKey)
      .where('active', true)
      .first();

    if (!admin) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Add admin info to request
    req.admin = {
      id: admin.id,
      username: admin.username,
      role: admin.role,
      permissions: admin.permissions
    };

    next();
    
  } catch (error) {
    logger.error('API key authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Role-based access control
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRoles = Array.isArray(req.admin.role) ? req.admin.role : [req.admin.role];
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: requiredRoles,
        current: userRoles
      });
    }

    next();
  };
};

// Permission-based access control
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const permissions = req.admin.permissions || [];
    
    if (!permissions.includes(permission) && !permissions.includes('*')) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: permission
      });
    }

    next();
  };
};

module.exports = {
  authenticateApiKey,
  requireRole,
  requirePermission
};