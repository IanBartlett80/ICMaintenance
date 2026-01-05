const fs = require('fs');
const path = require('path');
const db = require('../config/database');

/**
 * Database Schema for IC Maintenance Management System
 * 
 * This schema supports:
 * - Multi-tenant customer isolation
 * - Role-based access control (Customer, Staff, Trades)
 * - Complete job workflow from request to completion
 * - Quote management and comparison
 * - Trade specialist directory
 * - Reporting and analytics
 */

const schema = `
-- Users table (all user types: customers, staff, trades)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK(role IN ('customer', 'staff', 'trade')),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Customer organizations (residential, property management, sporting)
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  organization_name VARCHAR(255),
  organization_type VARCHAR(50) CHECK(organization_type IN ('residential', 'property_management', 'sporting_organization')),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Australia',
  billing_email VARCHAR(255),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Maintenance categories (aligned with building maintenance industry standards)
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Trade specialists/companies
CREATE TABLE IF NOT EXISTS trade_specialists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  abn VARCHAR(20),
  license_number VARCHAR(100),
  insurance_expiry DATE,
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  postal_code VARCHAR(20),
  service_areas TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_jobs_completed INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Trade specialist categories (many-to-many relationship)
CREATE TABLE IF NOT EXISTS trade_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trade_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trade_id) REFERENCES trade_specialists(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE(trade_id, category_id)
);

-- Priority levels for jobs
CREATE TABLE IF NOT EXISTS priority_levels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  response_time_hours INTEGER,
  color_code VARCHAR(7),
  sort_order INTEGER DEFAULT 0
);

-- Job status workflow
CREATE TABLE IF NOT EXISTS job_statuses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_final BOOLEAN DEFAULT 0
);

-- Main jobs/maintenance requests table
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  priority_id INTEGER NOT NULL,
  status_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location_address VARCHAR(500),
  preferred_date DATE,
  preferred_time VARCHAR(50),
  assigned_staff_id INTEGER,
  assigned_trade_id INTEGER,
  estimated_cost DECIMAL(10,2),
  final_cost DECIMAL(10,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  scheduled_date DATETIME,
  completed_date DATETIME,
  customer_notes TEXT,
  internal_notes TEXT,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (priority_id) REFERENCES priority_levels(id),
  FOREIGN KEY (status_id) REFERENCES job_statuses(id),
  FOREIGN KEY (assigned_staff_id) REFERENCES users(id),
  FOREIGN KEY (assigned_trade_id) REFERENCES trade_specialists(id)
);

-- Job attachments (photos, documents)
CREATE TABLE IF NOT EXISTS job_attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  uploaded_by INTEGER NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Quotes from trade specialists
CREATE TABLE IF NOT EXISTS quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  job_id INTEGER NOT NULL,
  trade_id INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  estimated_duration VARCHAR(100),
  estimated_start_date DATE,
  validity_days INTEGER DEFAULT 30,
  status VARCHAR(20) DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'withdrawn')),
  approved_by INTEGER,
  approved_at DATETIME,
  rejection_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (trade_id) REFERENCES trade_specialists(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Quote line items for detailed breakdown
CREATE TABLE IF NOT EXISTS quote_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_id INTEGER NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
);

-- Job history/audit trail
CREATE TABLE IF NOT EXISTS job_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  changed_by INTEGER NOT NULL,
  change_type VARCHAR(50) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  job_id INTEGER,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT 0,
  sent_email BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_jobs_customer ON jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status_id);
CREATE INDEX IF NOT EXISTS idx_jobs_assigned_staff ON jobs(assigned_staff_id);
CREATE INDEX IF NOT EXISTS idx_jobs_assigned_trade ON jobs(assigned_trade_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_quotes_job ON quotes(job_id);
CREATE INDEX IF NOT EXISTS idx_quotes_trade ON quotes(trade_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_job_history_job ON job_history(job_id);
`;

async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Ensure database directory exists
    const dbDir = path.join(__dirname, '../../database');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log('Created database directory');
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Created uploads directory');
    }

    // Connect to database
    await db.connect();
    console.log('Connected to database');

    // Execute schema
    const statements = schema.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await db.run(statement);
      }
    }
    
    console.log('Database schema created successfully');
    
    // Insert default data
    await insertDefaultData();
    
    console.log('Database setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

async function insertDefaultData() {
  console.log('Inserting default data...');
  
  // Insert default categories
  const categories = [
    { name: 'Electrical', description: 'Electrical repairs, installations, and maintenance', icon: 'electrical' },
    { name: 'Plumbing', description: 'Plumbing repairs, installations, and drainage', icon: 'plumbing' },
    { name: 'HVAC', description: 'Air conditioning, heating, and ventilation', icon: 'hvac' },
    { name: 'Carpentry', description: 'Carpentry, woodwork, and structural repairs', icon: 'carpentry' },
    { name: 'Painting', description: 'Interior and exterior painting services', icon: 'painting' },
    { name: 'Roofing', description: 'Roof repairs, replacements, and gutter work', icon: 'roofing' },
    { name: 'Tiling', description: 'Floor and wall tiling services', icon: 'tiling' },
    { name: 'Landscaping', description: 'Garden maintenance and landscaping', icon: 'landscaping' },
    { name: 'Pest Control', description: 'Pest inspection and treatment services', icon: 'pest' },
    { name: 'Cleaning', description: 'Professional cleaning services', icon: 'cleaning' },
    { name: 'Locksmith', description: 'Lock repairs and security services', icon: 'locksmith' },
    { name: 'Glass & Glazing', description: 'Window and glass repairs', icon: 'glass' },
    { name: 'Flooring', description: 'Floor installation and repairs', icon: 'flooring' },
    { name: 'General Repairs', description: 'General maintenance and handyman services', icon: 'tools' }
  ];

  for (const category of categories) {
    try {
      await db.run(
        'INSERT OR IGNORE INTO categories (name, description, icon) VALUES (?, ?, ?)',
        [category.name, category.description, category.icon]
      );
    } catch (err) {
      console.log(`Category ${category.name} already exists or error:`, err.message);
    }
  }

  // Insert priority levels
  const priorities = [
    { name: 'Critical', description: 'Immediate safety hazard or emergency', response_time_hours: 2, color_code: '#DC2626', sort_order: 1 },
    { name: 'High', description: 'Urgent issue requiring prompt attention', response_time_hours: 24, color_code: '#EA580C', sort_order: 2 },
    { name: 'Medium', description: 'Important but not urgent', response_time_hours: 72, color_code: '#F59E0B', sort_order: 3 },
    { name: 'Low', description: 'Routine maintenance or minor issue', response_time_hours: 168, color_code: '#10B981', sort_order: 4 }
  ];

  for (const priority of priorities) {
    try {
      await db.run(
        'INSERT OR IGNORE INTO priority_levels (name, description, response_time_hours, color_code, sort_order) VALUES (?, ?, ?, ?, ?)',
        [priority.name, priority.description, priority.response_time_hours, priority.color_code, priority.sort_order]
      );
    } catch (err) {
      console.log(`Priority ${priority.name} already exists or error:`, err.message);
    }
  }

  // Insert job statuses
  const statuses = [
    { name: 'New', description: 'New request submitted by customer', sort_order: 1, is_final: 0 },
    { name: 'Under Review', description: 'Being reviewed by staff', sort_order: 2, is_final: 0 },
    { name: 'Awaiting Quotes', description: 'Waiting for trade specialist quotes', sort_order: 3, is_final: 0 },
    { name: 'Quotes Received', description: 'Quotes have been received from trades', sort_order: 4, is_final: 0 },
    { name: 'Pending Approval', description: 'Waiting for customer approval', sort_order: 5, is_final: 0 },
    { name: 'Approved', description: 'Quote approved by customer', sort_order: 6, is_final: 0 },
    { name: 'Scheduled', description: 'Job scheduled with trade specialist', sort_order: 7, is_final: 0 },
    { name: 'In Progress', description: 'Work is currently being performed', sort_order: 8, is_final: 0 },
    { name: 'Completed', description: 'Work has been completed', sort_order: 9, is_final: 1 },
    { name: 'Cancelled', description: 'Job cancelled', sort_order: 10, is_final: 1 }
  ];

  for (const status of statuses) {
    try {
      await db.run(
        'INSERT OR IGNORE INTO job_statuses (name, description, sort_order, is_final) VALUES (?, ?, ?, ?)',
        [status.name, status.description, status.sort_order, status.is_final]
      );
    } catch (err) {
      console.log(`Status ${status.name} already exists or error:`, err.message);
    }
  }

  console.log('Default data inserted successfully');
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('Setup completed. Closing database connection...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase, insertDefaultData };
