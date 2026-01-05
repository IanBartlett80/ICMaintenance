const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Create a new job/maintenance request
exports.createJob = async (req, res) => {
  try {
    const {
      category_id,
      priority_id,
      title,
      description,
      location_address,
      preferred_date,
      preferred_time,
      customer_notes
    } = req.body;

    // For customers, use their customer_id, for staff creating on behalf, use provided customer_id
    let customerId;
    if (req.user.role === 'customer') {
      customerId = req.user.customerId;
    } else if (req.user.role === 'staff') {
      customerId = req.body.customer_id;
      if (!customerId) {
        return res.status(400).json({ error: 'customer_id required for staff' });
      }
    } else {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Validate required fields
    if (!category_id || !title || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate job number
    const jobNumber = 'JOB-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Get 'New' status
    const newStatus = await db.get("SELECT id FROM job_statuses WHERE name = 'New'");

    // Use provided priority or default to 'Medium'
    let priorityIdToUse = priority_id;
    if (!priorityIdToUse) {
      const defaultPriority = await db.get("SELECT id FROM priority_levels WHERE name = 'Medium'");
      priorityIdToUse = defaultPriority.id;
    }

    // Create job
    const result = await db.run(
      `INSERT INTO jobs (
        job_number, customer_id, category_id, priority_id, status_id,
        title, description, location_address, preferred_date, preferred_time, customer_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jobNumber,
        customerId,
        category_id,
        priorityIdToUse,
        newStatus.id,
        title,
        description,
        location_address || null,
        preferred_date || null,
        preferred_time || null,
        customer_notes || null
      ]
    );

    // Create job history entry
    await db.run(
      `INSERT INTO job_history (job_id, changed_by, change_type, new_value, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [result.id, req.user.userId, 'created', 'New', 'Job created']
    );

    // Get customer user_id for notification
    const customer = await db.get('SELECT user_id FROM customers WHERE id = ?', [customerId]);

    // Create notification for customer
    await db.run(
      `INSERT INTO notifications (user_id, job_id, type, title, message)
       VALUES (?, ?, ?, ?, ?)`,
      [
        customer.user_id,
        result.id,
        'job_created',
        'New Maintenance Request Submitted',
        `Your maintenance request "${title}" has been submitted successfully with job number ${jobNumber}.`
      ]
    );

    res.status(201).json({
      message: 'Job created successfully',
      jobId: result.id,
      jobNumber: jobNumber
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
};

// Get jobs (with filtering)
exports.getJobs = async (req, res) => {
  try {
    const { status, priority, category, customer_id, assigned_staff_id, assigned_trade_id } = req.query;
    
    let query = `
      SELECT j.*, 
             c.organization_name as customer_name,
             cat.name as category_name,
             p.name as priority_name, p.color_code as priority_color,
             s.name as status_name,
             u.first_name || ' ' || u.last_name as assigned_staff_name,
             t.company_name as assigned_trade_name
      FROM jobs j
      LEFT JOIN customers c ON j.customer_id = c.id
      LEFT JOIN categories cat ON j.category_id = cat.id
      LEFT JOIN priority_levels p ON j.priority_id = p.id
      LEFT JOIN job_statuses s ON j.status_id = s.id
      LEFT JOIN users u ON j.assigned_staff_id = u.id
      LEFT JOIN trade_specialists t ON j.assigned_trade_id = t.id
      WHERE 1=1
    `;

    const params = [];

    // Apply role-based filtering
    if (req.user.role === 'customer') {
      query += ' AND j.customer_id = ?';
      params.push(req.user.customerId);
    } else if (req.user.role === 'trade') {
      query += ' AND j.assigned_trade_id = ?';
      params.push(req.user.tradeId);
    }

    // Apply additional filters
    if (status) {
      query += ' AND j.status_id = ?';
      params.push(status);
    }
    if (priority) {
      query += ' AND j.priority_id = ?';
      params.push(priority);
    }
    if (category) {
      query += ' AND j.category_id = ?';
      params.push(category);
    }
    if (customer_id && req.user.role === 'staff') {
      query += ' AND j.customer_id = ?';
      params.push(customer_id);
    }
    if (assigned_staff_id && req.user.role === 'staff') {
      query += ' AND j.assigned_staff_id = ?';
      params.push(assigned_staff_id);
    }
    if (assigned_trade_id && req.user.role === 'staff') {
      query += ' AND j.assigned_trade_id = ?';
      params.push(assigned_trade_id);
    }

    query += ' ORDER BY j.created_at DESC';

    const jobs = await db.all(query, params);

    res.json(jobs);

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to get jobs' });
  }
};

// Get single job details
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await db.get(
      `SELECT j.*, 
              c.organization_name as customer_name,
              c.address_line1, c.address_line2, c.city, c.state, c.postal_code,
              cu.email as customer_email, cu.phone as customer_phone,
              cat.name as category_name, cat.description as category_description,
              p.name as priority_name, p.color_code as priority_color, p.response_time_hours,
              s.name as status_name,
              u.first_name || ' ' || u.last_name as assigned_staff_name,
              u.email as staff_email,
              t.company_name as assigned_trade_name,
              t.phone as trade_phone
       FROM jobs j
       LEFT JOIN customers c ON j.customer_id = c.id
       LEFT JOIN users cu ON c.user_id = cu.id
       LEFT JOIN categories cat ON j.category_id = cat.id
       LEFT JOIN priority_levels p ON j.priority_id = p.id
       LEFT JOIN job_statuses s ON j.status_id = s.id
       LEFT JOIN users u ON j.assigned_staff_id = u.id
       LEFT JOIN trade_specialists t ON j.assigned_trade_id = t.id
       WHERE j.id = ?`,
      [id]
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check authorization
    if (req.user.role === 'customer' && job.customer_id !== req.user.customerId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (req.user.role === 'trade' && job.assigned_trade_id !== req.user.tradeId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get attachments
    const attachments = await db.all(
      `SELECT a.*, u.first_name || ' ' || u.last_name as uploaded_by_name
       FROM job_attachments a
       LEFT JOIN users u ON a.uploaded_by = u.id
       WHERE a.job_id = ?
       ORDER BY a.uploaded_at DESC`,
      [id]
    );

    // Get quotes
    const quotes = await db.all(
      `SELECT q.*, t.company_name, t.rating,
              u.first_name || ' ' || u.last_name as approved_by_name
       FROM quotes q
       LEFT JOIN trade_specialists t ON q.trade_id = t.id
       LEFT JOIN users u ON q.approved_by = u.id
       WHERE q.job_id = ?
       ORDER BY q.amount ASC`,
      [id]
    );

    // Get history
    const history = await db.all(
      `SELECT h.*, u.first_name || ' ' || u.last_name as changed_by_name, u.role as changed_by_role
       FROM job_history h
       LEFT JOIN users u ON h.changed_by = u.id
       WHERE h.job_id = ?
       ORDER BY h.created_at DESC`,
      [id]
    );

    res.json({
      ...job,
      attachments,
      quotes,
      history
    });

  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({ error: 'Failed to get job' });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status_id,
      priority_id,
      assigned_staff_id,
      assigned_trade_id,
      scheduled_date,
      internal_notes,
      estimated_cost,
      final_cost
    } = req.body;

    // Check if job exists
    const job = await db.get('SELECT * FROM jobs WHERE id = ?', [id]);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check authorization
    if (req.user.role === 'customer') {
      return res.status(403).json({ error: 'Customers cannot update jobs directly' });
    }

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (status_id !== undefined) {
      updates.push('status_id = ?');
      params.push(status_id);
      
      // Log status change
      const oldStatus = await db.get('SELECT name FROM job_statuses WHERE id = ?', [job.status_id]);
      const newStatus = await db.get('SELECT name FROM job_statuses WHERE id = ?', [status_id]);
      
      await db.run(
        `INSERT INTO job_history (job_id, changed_by, change_type, old_value, new_value)
         VALUES (?, ?, ?, ?, ?)`,
        [id, req.user.userId, 'status_change', oldStatus.name, newStatus.name]
      );

      // Create notification for customer
      const customer = await db.get('SELECT user_id FROM customers WHERE id = ?', [job.customer_id]);
      await db.run(
        `INSERT INTO notifications (user_id, job_id, type, title, message)
         VALUES (?, ?, ?, ?, ?)`,
        [
          customer.user_id,
          id,
          'status_change',
          'Job Status Updated',
          `Your maintenance request ${job.job_number} status has been updated to ${newStatus.name}.`
        ]
      );
    }

    if (priority_id !== undefined) {
      updates.push('priority_id = ?');
      params.push(priority_id);
    }

    if (assigned_staff_id !== undefined) {
      updates.push('assigned_staff_id = ?');
      params.push(assigned_staff_id);
      
      await db.run(
        `INSERT INTO job_history (job_id, changed_by, change_type, new_value)
         VALUES (?, ?, ?, ?)`,
        [id, req.user.userId, 'staff_assigned', assigned_staff_id]
      );
    }

    if (assigned_trade_id !== undefined) {
      updates.push('assigned_trade_id = ?');
      params.push(assigned_trade_id);
      
      await db.run(
        `INSERT INTO job_history (job_id, changed_by, change_type, new_value)
         VALUES (?, ?, ?, ?)`,
        [id, req.user.userId, 'trade_assigned', assigned_trade_id]
      );

      // Notify trade specialist
      if (assigned_trade_id) {
        const trade = await db.get('SELECT user_id FROM trade_specialists WHERE id = ?', [assigned_trade_id]);
        await db.run(
          `INSERT INTO notifications (user_id, job_id, type, title, message)
           VALUES (?, ?, ?, ?, ?)`,
          [
            trade.user_id,
            id,
            'job_assigned',
            'New Job Assigned',
            `You have been assigned to job ${job.job_number}. Please review and submit a quote.`
          ]
        );
      }
    }

    if (scheduled_date !== undefined) {
      updates.push('scheduled_date = ?');
      params.push(scheduled_date);
    }

    if (internal_notes !== undefined) {
      updates.push('internal_notes = ?');
      params.push(internal_notes);
    }

    if (estimated_cost !== undefined) {
      updates.push('estimated_cost = ?');
      params.push(estimated_cost);
    }

    if (final_cost !== undefined) {
      updates.push('final_cost = ?');
      params.push(final_cost);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await db.run(
      `UPDATE jobs SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    res.json({ message: 'Job updated successfully' });

  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
};

// Upload job attachment
exports.uploadAttachment = async (req, res) => {
  try {
    const { job_id } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Check if job exists and user has access
    const job = await db.get('SELECT customer_id FROM jobs WHERE id = ?', [job_id]);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (req.user.role === 'customer' && job.customer_id !== req.user.customerId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Insert attachment records
    const attachmentIds = [];
    for (const file of files) {
      const result = await db.run(
        `INSERT INTO job_attachments (job_id, file_name, file_path, file_type, file_size, uploaded_by, description)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [job_id, file.originalname, file.path, file.mimetype, file.size, req.user.userId, req.body.description || null]
      );
      attachmentIds.push(result.id);
    }

    res.status(201).json({
      message: 'Files uploaded successfully',
      attachmentIds
    });

  } catch (error) {
    console.error('Upload attachment error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
};

// Delete job attachment
exports.deleteAttachment = async (req, res) => {
  try {
    const { id } = req.params;

    const attachment = await db.get(
      `SELECT a.*, j.customer_id 
       FROM job_attachments a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = ?`,
      [id]
    );

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    // Check authorization
    if (req.user.role === 'customer' && attachment.customer_id !== req.user.customerId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete file from filesystem
    const fs = require('fs');
    if (fs.existsSync(attachment.file_path)) {
      fs.unlinkSync(attachment.file_path);
    }

    // Delete database record
    await db.run('DELETE FROM job_attachments WHERE id = ?', [id]);

    res.json({ message: 'Attachment deleted successfully' });

  } catch (error) {
    console.error('Delete attachment error:', error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
};
