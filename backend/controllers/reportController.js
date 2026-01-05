const db = require('../config/database');

// Dashboard statistics (role-specific)
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = {};

    if (req.user.role === 'customer') {
      // Customer dashboard stats
      const totalJobs = await db.get(
        'SELECT COUNT(*) as count FROM jobs WHERE customer_id = ?',
        [req.user.customerId]
      );

      const activeJobs = await db.get(
        `SELECT COUNT(*) as count FROM jobs j
         JOIN job_statuses s ON j.status_id = s.id
         WHERE j.customer_id = ? AND s.is_final = 0`,
        [req.user.customerId]
      );

      const completedJobs = await db.get(
        `SELECT COUNT(*) as count FROM jobs j
         JOIN job_statuses s ON j.status_id = s.id
         WHERE j.customer_id = ? AND s.name = 'Completed'`,
        [req.user.customerId]
      );

      const pendingApproval = await db.get(
        `SELECT COUNT(*) as count FROM jobs j
         JOIN job_statuses s ON j.status_id = s.id
         WHERE j.customer_id = ? AND s.name = 'Pending Approval'`,
        [req.user.customerId]
      );

      const totalSpent = await db.get(
        `SELECT COALESCE(SUM(final_cost), 0) as total FROM jobs 
         WHERE customer_id = ? AND final_cost IS NOT NULL`,
        [req.user.customerId]
      );

      stats.total_jobs = totalJobs.count;
      stats.active_jobs = activeJobs.count;
      stats.completed_jobs = completedJobs.count;
      stats.pending_approval = pendingApproval.count;
      stats.total_spent = totalSpent.total;

    } else if (req.user.role === 'staff') {
      // Staff dashboard stats
      const totalJobs = await db.get('SELECT COUNT(*) as count FROM jobs');
      const activeJobs = await db.get(
        `SELECT COUNT(*) as count FROM jobs j
         JOIN job_statuses s ON j.status_id = s.id
         WHERE s.is_final = 0`
      );

      const newJobs = await db.get(
        `SELECT COUNT(*) as count FROM jobs j
         JOIN job_statuses s ON j.status_id = s.id
         WHERE s.name = 'New'`
      );

      const awaitingQuotes = await db.get(
        `SELECT COUNT(*) as count FROM jobs j
         JOIN job_statuses s ON j.status_id = s.id
         WHERE s.name = 'Awaiting Quotes'`
      );

      const pendingApproval = await db.get(
        `SELECT COUNT(*) as count FROM jobs j
         JOIN job_statuses s ON j.status_id = s.id
         WHERE s.name = 'Pending Approval'`
      );

      const totalCustomers = await db.get('SELECT COUNT(*) as count FROM customers');
      const totalTrades = await db.get('SELECT COUNT(*) as count FROM trade_specialists WHERE is_active = 1');

      const revenue = await db.get(
        `SELECT COALESCE(SUM(final_cost), 0) as total FROM jobs 
         WHERE final_cost IS NOT NULL`
      );

      stats.total_jobs = totalJobs.count;
      stats.active_jobs = activeJobs.count;
      stats.new_jobs = newJobs.count;
      stats.awaiting_quotes = awaitingQuotes.count;
      stats.pending_approval = pendingApproval.count;
      stats.total_customers = totalCustomers.count;
      stats.total_trades = totalTrades.count;
      stats.total_revenue = revenue.total;

    } else if (req.user.role === 'trade') {
      // Trade specialist dashboard stats
      const assignedJobs = await db.get(
        `SELECT COUNT(*) as count FROM jobs 
         WHERE assigned_trade_id = ?`,
        [req.user.tradeId]
      );

      const activeJobs = await db.get(
        `SELECT COUNT(*) as count FROM jobs j
         JOIN job_statuses s ON j.status_id = s.id
         WHERE j.assigned_trade_id = ? AND s.is_final = 0`,
        [req.user.tradeId]
      );

      const completedJobs = await db.get(
        `SELECT COUNT(*) as count FROM jobs j
         JOIN job_statuses s ON j.status_id = s.id
         WHERE j.assigned_trade_id = ? AND s.name = 'Completed'`,
        [req.user.tradeId]
      );

      const pendingQuotes = await db.get(
        `SELECT COUNT(*) as count FROM quotes 
         WHERE trade_id = ? AND status = 'pending'`,
        [req.user.tradeId]
      );

      const approvedQuotes = await db.get(
        `SELECT COUNT(*) as count FROM quotes 
         WHERE trade_id = ? AND status = 'approved'`,
        [req.user.tradeId]
      );

      const earnings = await db.get(
        `SELECT COALESCE(SUM(j.final_cost), 0) as total FROM jobs j
         JOIN job_statuses s ON j.status_id = s.id
         WHERE j.assigned_trade_id = ? AND s.name = 'Completed'`,
        [req.user.tradeId]
      );

      stats.assigned_jobs = assignedJobs.count;
      stats.active_jobs = activeJobs.count;
      stats.completed_jobs = completedJobs.count;
      stats.pending_quotes = pendingQuotes.count;
      stats.approved_quotes = approvedQuotes.count;
      stats.total_earnings = earnings.total;
    }

    res.json(stats);

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard statistics' });
  }
};

// Job statistics report
exports.getJobStatistics = async (req, res) => {
  try {
    const { start_date, end_date, customer_id } = req.query;

    // Only staff can filter by customer_id
    const customerId = req.user.role === 'staff' ? customer_id : req.user.customerId;

    let dateFilter = '';
    const params = [];

    if (start_date && end_date) {
      dateFilter = ' AND j.created_at BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    // Jobs by status
    let statusQuery = `
      SELECT s.name, COUNT(*) as count
      FROM jobs j
      JOIN job_statuses s ON j.status_id = s.id
      WHERE 1=1
    `;

    if (customerId) {
      statusQuery += ' AND j.customer_id = ?';
      params.push(customerId);
    }

    statusQuery += dateFilter + ' GROUP BY s.name ORDER BY count DESC';

    const byStatus = await db.all(statusQuery, params);

    // Jobs by priority
    let priorityQuery = `
      SELECT p.name, p.color_code, COUNT(*) as count
      FROM jobs j
      JOIN priority_levels p ON j.priority_id = p.id
      WHERE 1=1
    `;

    const priorityParams = [...params];
    if (customerId && !statusQuery.includes('customer_id')) {
      priorityQuery += ' AND j.customer_id = ?';
    }

    priorityQuery += dateFilter + ' GROUP BY p.name ORDER BY p.sort_order';

    const byPriority = await db.all(priorityQuery, priorityParams);

    // Jobs by category
    let categoryQuery = `
      SELECT c.name, COUNT(*) as count
      FROM jobs j
      JOIN categories c ON j.category_id = c.id
      WHERE 1=1
    `;

    const categoryParams = [...params];
    if (customerId && !statusQuery.includes('customer_id')) {
      categoryQuery += ' AND j.customer_id = ?';
    }

    categoryQuery += dateFilter + ' GROUP BY c.name ORDER BY count DESC LIMIT 10';

    const byCategory = await db.all(categoryQuery, categoryParams);

    res.json({
      by_status: byStatus,
      by_priority: byPriority,
      by_category: byCategory
    });

  } catch (error) {
    console.error('Get job statistics error:', error);
    res.status(500).json({ error: 'Failed to get job statistics' });
  }
};

// Financial report
exports.getFinancialReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    if (req.user.role === 'customer') {
      // Customer financial report
      let query = `
        SELECT 
          COUNT(*) as total_jobs,
          COUNT(CASE WHEN s.name = 'Completed' THEN 1 END) as completed_jobs,
          COALESCE(SUM(CASE WHEN s.name = 'Completed' THEN j.final_cost END), 0) as total_spent,
          COALESCE(AVG(CASE WHEN s.name = 'Completed' THEN j.final_cost END), 0) as avg_job_cost
        FROM jobs j
        JOIN job_statuses s ON j.status_id = s.id
        WHERE j.customer_id = ?
      `;

      const params = [req.user.customerId];

      if (start_date && end_date) {
        query += ' AND j.created_at BETWEEN ? AND ?';
        params.push(start_date, end_date);
      }

      const summary = await db.get(query, params);

      // Spending by category
      let categoryQuery = `
        SELECT c.name, COALESCE(SUM(j.final_cost), 0) as total
        FROM jobs j
        JOIN categories c ON j.category_id = c.id
        JOIN job_statuses s ON j.status_id = s.id
        WHERE j.customer_id = ? AND s.name = 'Completed' AND j.final_cost IS NOT NULL
      `;

      const categoryParams = [req.user.customerId];

      if (start_date && end_date) {
        categoryQuery += ' AND j.created_at BETWEEN ? AND ?';
        categoryParams.push(start_date, end_date);
      }

      categoryQuery += ' GROUP BY c.name ORDER BY total DESC';

      const byCategory = await db.all(categoryQuery, categoryParams);

      res.json({
        summary,
        by_category: byCategory
      });

    } else if (req.user.role === 'staff') {
      // Staff financial report
      let query = `
        SELECT 
          COUNT(*) as total_jobs,
          COUNT(CASE WHEN s.name = 'Completed' THEN 1 END) as completed_jobs,
          COALESCE(SUM(CASE WHEN s.name = 'Completed' THEN j.final_cost END), 0) as total_revenue,
          COALESCE(AVG(CASE WHEN s.name = 'Completed' THEN j.final_cost END), 0) as avg_job_value,
          COALESCE(SUM(j.estimated_cost), 0) as total_estimated,
          COALESCE(SUM(j.final_cost), 0) as total_actual
        FROM jobs j
        JOIN job_statuses s ON j.status_id = s.id
        WHERE 1=1
      `;

      const params = [];

      if (start_date && end_date) {
        query += ' AND j.created_at BETWEEN ? AND ?';
        params.push(start_date, end_date);
      }

      const summary = await db.get(query, params);

      // Revenue by category
      let categoryQuery = `
        SELECT c.name, COALESCE(SUM(j.final_cost), 0) as revenue, COUNT(*) as jobs
        FROM jobs j
        JOIN categories c ON j.category_id = c.id
        JOIN job_statuses s ON j.status_id = s.id
        WHERE s.name = 'Completed' AND j.final_cost IS NOT NULL
      `;

      const categoryParams = [];

      if (start_date && end_date) {
        categoryQuery += ' AND j.created_at BETWEEN ? AND ?';
        categoryParams.push(start_date, end_date);
      }

      categoryQuery += ' GROUP BY c.name ORDER BY revenue DESC';

      const byCategory = await db.all(categoryQuery, categoryParams);

      // Top customers
      let customerQuery = `
        SELECT 
          c.organization_name,
          COUNT(*) as total_jobs,
          COALESCE(SUM(j.final_cost), 0) as total_spent
        FROM jobs j
        JOIN customers c ON j.customer_id = c.id
        JOIN job_statuses s ON j.status_id = s.id
        WHERE s.name = 'Completed' AND j.final_cost IS NOT NULL
      `;

      const customerParams = [];

      if (start_date && end_date) {
        customerQuery += ' AND j.created_at BETWEEN ? AND ?';
        customerParams.push(start_date, end_date);
      }

      customerQuery += ' GROUP BY c.id ORDER BY total_spent DESC LIMIT 10';

      const topCustomers = await db.all(customerQuery, customerParams);

      res.json({
        summary,
        by_category: byCategory,
        top_customers: topCustomers
      });
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }

  } catch (error) {
    console.error('Get financial report error:', error);
    res.status(500).json({ error: 'Failed to get financial report' });
  }
};

// Performance metrics (staff only)
exports.getPerformanceMetrics = async (req, res) => {
  try {
    if (req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Staff access required' });
    }

    const { start_date, end_date } = req.query;

    let dateFilter = '';
    const params = [];

    if (start_date && end_date) {
      dateFilter = ' AND j.created_at BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    // Average time to completion
    const avgTimeToCompletion = await db.get(
      `SELECT AVG(julianday(j.completed_date) - julianday(j.created_at)) as avg_days
       FROM jobs j
       JOIN job_statuses s ON j.status_id = s.id
       WHERE s.name = 'Completed' AND j.completed_date IS NOT NULL` + dateFilter,
      params
    );

    // Average time to first quote
    const avgTimeToQuote = await db.get(
      `SELECT AVG(julianday(q.created_at) - julianday(j.created_at)) as avg_days
       FROM jobs j
       JOIN quotes q ON j.id = q.job_id
       WHERE q.id = (SELECT MIN(id) FROM quotes WHERE job_id = j.id)` + dateFilter,
      params
    );

    // Jobs by completion rate
    const completionRate = await db.get(
      `SELECT 
        COUNT(*) as total_jobs,
        COUNT(CASE WHEN s.name = 'Completed' THEN 1 END) as completed_jobs,
        ROUND(CAST(COUNT(CASE WHEN s.name = 'Completed' THEN 1 END) AS FLOAT) / COUNT(*) * 100, 2) as completion_percentage
       FROM jobs j
       JOIN job_statuses s ON j.status_id = s.id
       WHERE 1=1` + dateFilter,
      params
    );

    // Top performing trade specialists
    const topTrades = await db.all(
      `SELECT 
        t.company_name,
        t.rating,
        COUNT(j.id) as completed_jobs,
        AVG(julianday(j.completed_date) - julianday(j.scheduled_date)) as avg_completion_days
       FROM trade_specialists t
       LEFT JOIN jobs j ON t.id = j.assigned_trade_id
       LEFT JOIN job_statuses s ON j.status_id = s.id
       WHERE s.name = 'Completed'` + dateFilter.replace('j.created_at', 'j.completed_date') +
      ` GROUP BY t.id
        ORDER BY completed_jobs DESC
        LIMIT 10`,
      params
    );

    res.json({
      avg_time_to_completion_days: avgTimeToCompletion.avg_days?.toFixed(1) || 0,
      avg_time_to_first_quote_days: avgTimeToQuote.avg_days?.toFixed(1) || 0,
      completion_rate: completionRate,
      top_performing_trades: topTrades
    });

  } catch (error) {
    console.error('Get performance metrics error:', error);
    res.status(500).json({ error: 'Failed to get performance metrics' });
  }
};
