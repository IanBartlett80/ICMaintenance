const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check user role
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Middleware to ensure customer can only access their own data
const authorizeCustomer = (req, res, next) => {
  if (req.user.role === 'staff') {
    // Staff can access all customer data
    return next();
  }

  if (req.user.role === 'customer') {
    // Ensure customer can only access their own data
    const requestedCustomerId = parseInt(req.params.customerId || req.query.customerId || req.body.customer_id);
    
    if (requestedCustomerId && requestedCustomerId !== req.user.customerId) {
      return res.status(403).json({ error: 'Access denied to other customer data' });
    }
    
    return next();
  }

  return res.status(403).json({ error: 'Invalid role for this operation' });
};

module.exports = {
  authenticateToken,
  authorizeRole,
  authorizeCustomer,
  JWT_SECRET
};
