const db = require('../config/database');

// Create a new quote
exports.createQuote = async (req, res) => {
  try {
    const { job_id, amount, description, estimated_duration, estimated_start_date, items } = req.body;

    // Verify user is a trade specialist
    if (req.user.role !== 'trade' && req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Only trade specialists or staff can create quotes' });
    }

    // Get trade_id
    let tradeId;
    if (req.user.role === 'trade') {
      tradeId = req.user.tradeId;
    } else if (req.user.role === 'staff') {
      tradeId = req.body.trade_id;
      if (!tradeId) {
        return res.status(400).json({ error: 'trade_id required for staff' });
      }
    }

    // Verify job exists
    const job = await db.get('SELECT * FROM jobs WHERE id = ?', [job_id]);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // For trade users, verify they're assigned to this job
    if (req.user.role === 'trade' && job.assigned_trade_id !== tradeId) {
      return res.status(403).json({ error: 'You are not assigned to this job' });
    }

    // Generate quote number
    const quoteNumber = 'QTE-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Create quote
    const result = await db.run(
      `INSERT INTO quotes (quote_number, job_id, trade_id, amount, description, estimated_duration, estimated_start_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [quoteNumber, job_id, tradeId, amount, description, estimated_duration, estimated_start_date]
    );

    const quoteId = result.id;

    // Insert quote items if provided
    if (items && Array.isArray(items)) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await db.run(
          `INSERT INTO quote_items (quote_id, description, quantity, unit_price, total_price, sort_order)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [quoteId, item.description, item.quantity, item.unit_price, item.total_price, i]
        );
      }
    }

    // Update job status to 'Quotes Received'
    const quotesReceivedStatus = await db.get("SELECT id FROM job_statuses WHERE name = 'Quotes Received'");
    await db.run('UPDATE jobs SET status_id = ? WHERE id = ?', [quotesReceivedStatus.id, job_id]);

    // Create job history
    await db.run(
      `INSERT INTO job_history (job_id, changed_by, change_type, new_value, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [job_id, req.user.userId, 'quote_submitted', quoteNumber, `Quote ${quoteNumber} submitted for $${amount}`]
    );

    // Notify staff
    const staffUsers = await db.all("SELECT id FROM users WHERE role = 'staff' AND is_active = 1");
    for (const staff of staffUsers) {
      await db.run(
        `INSERT INTO notifications (user_id, job_id, type, title, message)
         VALUES (?, ?, ?, ?, ?)`,
        [staff.id, job_id, 'quote_received', 'New Quote Received', `A new quote has been submitted for job ${job.job_number}.`]
      );
    }

    res.status(201).json({
      message: 'Quote created successfully',
      quoteId,
      quoteNumber
    });

  } catch (error) {
    console.error('Create quote error:', error);
    res.status(500).json({ error: 'Failed to create quote' });
  }
};

// Get quotes for a job
exports.getQuotesByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verify job exists and user has access
    const job = await db.get('SELECT customer_id, assigned_trade_id FROM jobs WHERE id = ?', [jobId]);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Authorization check
    if (req.user.role === 'customer' && job.customer_id !== req.user.customerId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const quotes = await db.all(
      `SELECT q.*, 
              t.company_name, t.rating, t.total_jobs_completed,
              u.first_name || ' ' || u.last_name as approved_by_name
       FROM quotes q
       LEFT JOIN trade_specialists t ON q.trade_id = t.id
       LEFT JOIN users u ON q.approved_by = u.id
       WHERE q.job_id = ?
       ORDER BY q.amount ASC`,
      [jobId]
    );

    // Get items for each quote
    for (const quote of quotes) {
      quote.items = await db.all(
        'SELECT * FROM quote_items WHERE quote_id = ? ORDER BY sort_order',
        [quote.id]
      );
    }

    // Customers should only see approved quotes or pending quotes (not rejected/withdrawn)
    if (req.user.role === 'customer') {
      const filteredQuotes = quotes.filter(q => q.status === 'approved' || q.status === 'pending');
      return res.json(filteredQuotes);
    }

    res.json(quotes);

  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({ error: 'Failed to get quotes' });
  }
};

// Get quote comparison for a job (staff only)
exports.getQuoteComparison = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Staff access required' });
    }

    const quotes = await db.all(
      `SELECT q.*, 
              t.company_name, t.rating, t.total_jobs_completed, t.license_number
       FROM quotes q
       LEFT JOIN trade_specialists t ON q.trade_id = t.id
       WHERE q.job_id = ? AND q.status != 'withdrawn'
       ORDER BY q.amount ASC`,
      [jobId]
    );

    if (quotes.length === 0) {
      return res.json({ quotes: [], comparison: null });
    }

    // Calculate comparison metrics
    const amounts = quotes.map(q => parseFloat(q.amount));
    const lowest = Math.min(...amounts);
    const highest = Math.max(...amounts);
    const average = amounts.reduce((a, b) => a + b, 0) / amounts.length;

    // Get recommended quote (lowest from verified trade with good rating)
    const recommendedQuote = quotes.find(q => 
      q.amount === lowest && 
      q.rating >= 4.0
    ) || quotes[0];

    const comparison = {
      total_quotes: quotes.length,
      lowest_amount: lowest,
      highest_amount: highest,
      average_amount: average.toFixed(2),
      price_range: highest - lowest,
      recommended_quote_id: recommendedQuote.id,
      savings: (highest - lowest).toFixed(2)
    };

    res.json({
      quotes,
      comparison
    });

  } catch (error) {
    console.error('Get quote comparison error:', error);
    res.status(500).json({ error: 'Failed to get quote comparison' });
  }
};

// Update quote status (approve/reject)
exports.updateQuoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejection_reason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get quote
    const quote = await db.get(
      `SELECT q.*, j.customer_id, j.job_number 
       FROM quotes q
       JOIN jobs j ON q.job_id = j.id
       WHERE q.id = ?`,
      [id]
    );

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    // Only customer or staff can approve/reject
    if (req.user.role === 'customer' && quote.customer_id !== req.user.customerId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.user.role === 'trade') {
      return res.status(403).json({ error: 'Trade specialists cannot approve/reject quotes' });
    }

    // Update quote
    await db.run(
      `UPDATE quotes SET status = ?, approved_by = ?, approved_at = CURRENT_TIMESTAMP, rejection_reason = ?
       WHERE id = ?`,
      [status, req.user.userId, rejection_reason || null, id]
    );

    // If approved, update job status and reject other quotes
    if (status === 'approved') {
      const approvedStatus = await db.get("SELECT id FROM job_statuses WHERE name = 'Approved'");
      await db.run(
        'UPDATE jobs SET status_id = ?, estimated_cost = ? WHERE id = ?',
        [approvedStatus.id, quote.amount, quote.job_id]
      );

      // Reject other pending quotes for this job
      await db.run(
        `UPDATE quotes SET status = 'rejected', rejection_reason = 'Another quote was approved'
         WHERE job_id = ? AND id != ? AND status = 'pending'`,
        [quote.job_id, id]
      );

      // Notify trade specialist
      const trade = await db.get('SELECT user_id FROM trade_specialists WHERE id = ?', [quote.trade_id]);
      await db.run(
        `INSERT INTO notifications (user_id, job_id, type, title, message)
         VALUES (?, ?, ?, ?, ?)`,
        [
          trade.user_id,
          quote.job_id,
          'quote_approved',
          'Quote Approved',
          `Your quote ${quote.quote_number} for job ${quote.job_number} has been approved!`
        ]
      );
    }

    // Create job history
    await db.run(
      `INSERT INTO job_history (job_id, changed_by, change_type, new_value, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [quote.job_id, req.user.userId, 'quote_' + status, quote.quote_number, `Quote ${status}`]
    );

    res.json({ message: `Quote ${status} successfully` });

  } catch (error) {
    console.error('Update quote status error:', error);
    res.status(500).json({ error: 'Failed to update quote status' });
  }
};

// Withdraw quote (trade specialist only)
exports.withdrawQuote = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'trade') {
      return res.status(403).json({ error: 'Only trade specialists can withdraw quotes' });
    }

    const quote = await db.get('SELECT * FROM quotes WHERE id = ? AND trade_id = ?', [id, req.user.tradeId]);

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    if (quote.status === 'approved') {
      return res.status(400).json({ error: 'Cannot withdraw an approved quote' });
    }

    await db.run("UPDATE quotes SET status = 'withdrawn' WHERE id = ?", [id]);

    // Notify staff
    const staffUsers = await db.all("SELECT id FROM users WHERE role = 'staff' AND is_active = 1");
    for (const staff of staffUsers) {
      await db.run(
        `INSERT INTO notifications (user_id, job_id, type, title, message)
         VALUES (?, ?, ?, ?, ?)`,
        [staff.id, quote.job_id, 'quote_withdrawn', 'Quote Withdrawn', `Quote ${quote.quote_number} has been withdrawn.`]
      );
    }

    res.json({ message: 'Quote withdrawn successfully' });

  } catch (error) {
    console.error('Withdraw quote error:', error);
    res.status(500).json({ error: 'Failed to withdraw quote' });
  }
};
