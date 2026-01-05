const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function seedData() {
  try {
    console.log('Starting data seeding...');
    
    await db.connect();

    // Create sample staff user
    const staffPassword = await bcrypt.hash('staff123', 10);
    const staffResult = await db.run(
      'INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      ['staff@icmaintenance.com', staffPassword, 'staff', 'John', 'Smith', '0412345678']
    );
    console.log('✓ Staff user created');

    // Create sample customer
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customerResult = await db.run(
      'INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      ['customer@example.com', customerPassword, 'customer', 'Jane', 'Doe', '0423456789']
    );

    await db.run(
      `INSERT INTO customers (user_id, organization_name, organization_type, address_line1, city, state, postal_code)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [customerResult.id, 'ABC Property Management', 'property_management', '123 Main Street', 'Sydney', 'NSW', '2000']
    );
    console.log('✓ Customer user created');

    // Create sample trade specialist
    const tradePassword = await bcrypt.hash('trade123', 10);
    const tradeResult = await db.run(
      'INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      ['trade@example.com', tradePassword, 'trade', 'Bob', 'Builder', '0434567890']
    );

    const tradeSpecResult = await db.run(
      `INSERT INTO trade_specialists (user_id, company_name, abn, license_number, address_line1, city, state, postal_code, rating, is_verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tradeResult.id, 'Quality Electrical Services', '12345678901', 'ELEC12345', '456 Trade St', 'Sydney', 'NSW', '2000', 4.5, 1]
    );

    // Associate trade with categories
    const electricalCat = await db.get("SELECT id FROM categories WHERE name = 'Electrical'");
    await db.run('INSERT INTO trade_categories (trade_id, category_id) VALUES (?, ?)', [tradeSpecResult.id, electricalCat.id]);
    
    console.log('✓ Trade specialist created');

    // Create sample jobs
    const customer = await db.get('SELECT id FROM customers LIMIT 1');
    const newStatus = await db.get("SELECT id FROM job_statuses WHERE name = 'New'");
    const mediumPriority = await db.get("SELECT id FROM priority_levels WHERE name = 'Medium'");
    const plumbingCat = await db.get("SELECT id FROM categories WHERE name = 'Plumbing'");

    await db.run(
      `INSERT INTO jobs (job_number, customer_id, category_id, priority_id, status_id, title, description, location_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'JOB-' + Date.now() + '-SAMPLE1',
        customer.id,
        plumbingCat.id,
        mediumPriority.id,
        newStatus.id,
        'Leaking kitchen tap repair',
        'The kitchen tap has been leaking for the past week and needs urgent attention.',
        '123 Main Street, Sydney NSW 2000'
      ]
    );

    console.log('✓ Sample job created');

    console.log('\n========================================');
    console.log('Seed data created successfully!');
    console.log('========================================');
    console.log('\nTest Accounts:');
    console.log('----------------------------');
    console.log('Staff Account:');
    console.log('  Email: staff@icmaintenance.com');
    console.log('  Password: staff123');
    console.log('');
    console.log('Customer Account:');
    console.log('  Email: customer@example.com');
    console.log('  Password: customer123');
    console.log('');
    console.log('Trade Account:');
    console.log('  Email: trade@example.com');
    console.log('  Password: trade123');
    console.log('========================================\n');

  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  } finally {
    await db.close();
  }
}

// Run if executed directly
if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = seedData;
