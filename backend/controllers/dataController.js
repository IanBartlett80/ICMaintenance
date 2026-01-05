const db = require('../config/database');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await db.all(
      'SELECT * FROM categories WHERE is_active = 1 ORDER BY name ASC'
    );
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
};

// Create category (staff only)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name required' });
    }

    const result = await db.run(
      'INSERT INTO categories (name, description, icon, created_by) VALUES (?, ?, ?, ?)',
      [name, description || null, icon || null, req.user.userId]
    );

    res.status(201).json({
      message: 'Category created successfully',
      categoryId: result.id
    });

  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Category already exists' });
    }
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Update category (staff only)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, is_active } = req.body;

    await db.run(
      'UPDATE categories SET name = ?, description = ?, icon = ?, is_active = ? WHERE id = ?',
      [name, description, icon, is_active !== undefined ? is_active : 1, id]
    );

    res.json({ message: 'Category updated successfully' });

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Get priority levels
exports.getPriorities = async (req, res) => {
  try {
    const priorities = await db.all(
      'SELECT * FROM priority_levels ORDER BY sort_order ASC'
    );
    res.json(priorities);
  } catch (error) {
    console.error('Get priorities error:', error);
    res.status(500).json({ error: 'Failed to get priorities' });
  }
};

// Get job statuses
exports.getStatuses = async (req, res) => {
  try {
    const statuses = await db.all(
      'SELECT * FROM job_statuses ORDER BY sort_order ASC'
    );
    res.json(statuses);
  } catch (error) {
    console.error('Get statuses error:', error);
    res.status(500).json({ error: 'Failed to get statuses' });
  }
};

// Get trade specialists
exports.getTradeSpecialists = async (req, res) => {
  try {
    const { category_id } = req.query;

    let query = `
      SELECT t.*, 
             u.email, u.phone, u.first_name, u.last_name
      FROM trade_specialists t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.is_active = 1
    `;

    const params = [];

    if (category_id) {
      query += ` AND EXISTS (
        SELECT 1 FROM trade_categories tc 
        WHERE tc.trade_id = t.id AND tc.category_id = ?
      )`;
      params.push(category_id);
    }

    query += ' ORDER BY t.rating DESC, t.company_name ASC';

    const trades = await db.all(query, params);

    // Get categories for each trade
    for (const trade of trades) {
      trade.categories = await db.all(
        `SELECT c.id, c.name 
         FROM categories c
         JOIN trade_categories tc ON c.id = tc.category_id
         WHERE tc.trade_id = ?`,
        [trade.id]
      );
    }

    res.json(trades);

  } catch (error) {
    console.error('Get trade specialists error:', error);
    res.status(500).json({ error: 'Failed to get trade specialists' });
  }
};

// Get single trade specialist
exports.getTradeSpecialistById = async (req, res) => {
  try {
    const { id } = req.params;

    const trade = await db.get(
      `SELECT t.*, 
              u.email, u.phone, u.first_name, u.last_name
       FROM trade_specialists t
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [id]
    );

    if (!trade) {
      return res.status(404).json({ error: 'Trade specialist not found' });
    }

    // Get categories
    trade.categories = await db.all(
      `SELECT c.id, c.name 
       FROM categories c
       JOIN trade_categories tc ON c.id = tc.category_id
       WHERE tc.trade_id = ?`,
      [id]
    );

    // Get completed jobs count
    const jobStats = await db.get(
      `SELECT COUNT(*) as completed_jobs 
       FROM jobs 
       WHERE assigned_trade_id = ? AND status_id = (SELECT id FROM job_statuses WHERE name = 'Completed')`,
      [id]
    );

    trade.completed_jobs = jobStats.completed_jobs;

    res.json(trade);

  } catch (error) {
    console.error('Get trade specialist error:', error);
    res.status(500).json({ error: 'Failed to get trade specialist' });
  }
};

// Create trade specialist (staff only)
exports.createTradeSpecialist = async (req, res) => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      phone,
      company_name,
      abn,
      license_number,
      address,
      service_areas,
      categories
    } = req.body;

    // Create user account
    const bcrypt = require('bcryptjs');
    const password_hash = await bcrypt.hash(password, 10);

    const userResult = await db.run(
      'INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [email, password_hash, 'trade', first_name, last_name, phone]
    );

    const userId = userResult.id;

    // Create trade specialist record
    const tradeResult = await db.run(
      `INSERT INTO trade_specialists (
        user_id, company_name, abn, license_number,
        address_line1, address_line2, city, state, postal_code, service_areas
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        company_name,
        abn || null,
        license_number || null,
        address?.line1 || null,
        address?.line2 || null,
        address?.city || null,
        address?.state || null,
        address?.postal_code || null,
        service_areas || null
      ]
    );

    const tradeId = tradeResult.id;

    // Add categories
    if (categories && Array.isArray(categories)) {
      for (const categoryId of categories) {
        await db.run(
          'INSERT INTO trade_categories (trade_id, category_id) VALUES (?, ?)',
          [tradeId, categoryId]
        );
      }
    }

    res.status(201).json({
      message: 'Trade specialist created successfully',
      tradeId,
      userId
    });

  } catch (error) {
    console.error('Create trade specialist error:', error);
    res.status(500).json({ error: 'Failed to create trade specialist' });
  }
};

// Update trade specialist
exports.updateTradeSpecialist = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company_name,
      abn,
      license_number,
      address,
      service_areas,
      is_verified,
      is_active,
      categories
    } = req.body;

    // Staff can update any trade, trade users can update their own
    if (req.user.role === 'trade' && req.user.tradeId !== parseInt(id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.run(
      `UPDATE trade_specialists SET 
       company_name = ?,
       abn = ?,
       license_number = ?,
       address_line1 = ?,
       address_line2 = ?,
       city = ?,
       state = ?,
       postal_code = ?,
       service_areas = ?,
       is_verified = ?,
       is_active = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        company_name,
        abn,
        license_number,
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        service_areas,
        is_verified !== undefined ? is_verified : 0,
        is_active !== undefined ? is_active : 1,
        id
      ]
    );

    // Update categories if provided and user is staff
    if (categories && Array.isArray(categories) && req.user.role === 'staff') {
      // Delete existing categories
      await db.run('DELETE FROM trade_categories WHERE trade_id = ?', [id]);
      
      // Add new categories
      for (const categoryId of categories) {
        await db.run(
          'INSERT INTO trade_categories (trade_id, category_id) VALUES (?, ?)',
          [id, categoryId]
        );
      }
    }

    res.json({ message: 'Trade specialist updated successfully' });

  } catch (error) {
    console.error('Update trade specialist error:', error);
    res.status(500).json({ error: 'Failed to update trade specialist' });
  }
};

// Get all customers (staff only)
exports.getCustomers = async (req, res) => {
  try {
    const customers = await db.all(
      `SELECT c.*, 
              u.email, u.phone, u.first_name, u.last_name, u.created_at as user_created_at,
              COUNT(DISTINCT j.id) as total_jobs
       FROM customers c
       LEFT JOIN users u ON c.user_id = u.id
       LEFT JOIN jobs j ON c.id = j.customer_id
       WHERE u.is_active = 1
       GROUP BY c.id
       ORDER BY c.organization_name ASC`
    );

    res.json(customers);

  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to get customers' });
  }
};

// Get single customer (staff only or own customer data)
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    // Authorization
    if (req.user.role === 'customer' && req.user.customerId !== parseInt(id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const customer = await db.get(
      `SELECT c.*, 
              u.email, u.phone, u.first_name, u.last_name, u.created_at as user_created_at,
              COUNT(DISTINCT j.id) as total_jobs
       FROM customers c
       LEFT JOIN users u ON c.user_id = u.id
       LEFT JOIN jobs j ON c.id = j.customer_id
       WHERE c.id = ?
       GROUP BY c.id`,
      [id]
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get recent jobs
    customer.recent_jobs = await db.all(
      `SELECT j.id, j.job_number, j.title, s.name as status_name, j.created_at
       FROM jobs j
       LEFT JOIN job_statuses s ON j.status_id = s.id
       WHERE j.customer_id = ?
       ORDER BY j.created_at DESC
       LIMIT 10`,
      [id]
    );

    res.json(customer);

  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Failed to get customer' });
  }
};
