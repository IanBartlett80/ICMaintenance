const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

// Register new user
exports.register = async (req, res) => {
  try {
    const { email, password, role, first_name, last_name, phone, organization_name, organization_type, address } = req.body;

    // Validate required fields
    if (!email || !password || !role || !first_name || !last_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user
    const userResult = await db.run(
      'INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [email, password_hash, role, first_name, last_name, phone || null]
    );

    const userId = userResult.id;

    // If customer, create customer record
    if (role === 'customer') {
      await db.run(
        `INSERT INTO customers (user_id, organization_name, organization_type, address_line1, address_line2, city, state, postal_code)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          organization_name || null,
          organization_type || 'residential',
          address?.line1 || null,
          address?.line2 || null,
          address?.city || null,
          address?.state || null,
          address?.postal_code || null
        ]
      );
    }

    res.status(201).json({
      message: 'User registered successfully',
      userId: userId
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Get user
    const user = await db.get(
      `SELECT u.*, c.id as customer_id, c.organization_name, t.id as trade_id, t.company_name
       FROM users u
       LEFT JOIN customers c ON u.id = c.user_id
       LEFT JOIN trade_specialists t ON u.id = t.user_id
       WHERE u.email = ? AND u.is_active = 1`,
      [email]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        customerId: user.customer_id || null,
        tradeId: user.trade_id || null
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        customerId: user.customer_id || null,
        tradeId: user.trade_id || null,
        organization_name: user.organization_name || user.company_name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await db.get(
      `SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.phone, u.created_at,
              c.id as customer_id, c.organization_name, c.organization_type,
              c.address_line1, c.address_line2, c.city, c.state, c.postal_code,
              t.id as trade_id, t.company_name, t.abn, t.rating, t.total_jobs_completed
       FROM users u
       LEFT JOIN customers c ON u.id = c.user_id
       LEFT JOIN trade_specialists t ON u.id = t.user_id
       WHERE u.id = ?`,
      [req.user.userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove sensitive data
    delete user.password_hash;

    res.json(user);

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, phone, organization_name, address } = req.body;
    const userId = req.user.userId;

    // Update user table
    await db.run(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [first_name, last_name, phone, userId]
    );

    // Update customer table if customer
    if (req.user.role === 'customer' && req.user.customerId) {
      await db.run(
        `UPDATE customers SET 
         organization_name = ?,
         address_line1 = ?,
         address_line2 = ?,
         city = ?,
         state = ?,
         postal_code = ?,
         updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          organization_name,
          address?.line1,
          address?.line2,
          address?.city,
          address?.state,
          address?.postal_code,
          req.user.customerId
        ]
      );
    }

    res.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Current and new password required' });
    }

    // Get user
    const user = await db.get('SELECT password_hash FROM users WHERE id = ?', [req.user.userId]);

    // Verify current password
    const validPassword = await bcrypt.compare(current_password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(new_password, 10);

    // Update password
    await db.run('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newPasswordHash, req.user.userId]);

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};
