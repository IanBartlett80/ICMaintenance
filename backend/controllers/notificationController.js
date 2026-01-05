const db = require('../config/database');

// Get user notifications
exports.getNotifications = async (req, res) => {
  try {
    const { unread_only } = req.query;

    let query = `
      SELECT n.*, j.job_number
      FROM notifications n
      LEFT JOIN jobs j ON n.job_id = j.id
      WHERE n.user_id = ?
    `;

    const params = [req.user.userId];

    if (unread_only === 'true') {
      query += ' AND n.is_read = 0';
    }

    query += ' ORDER BY n.created_at DESC LIMIT 50';

    const notifications = await db.all(query, params);

    res.json(notifications);

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify notification belongs to user
    const notification = await db.get(
      'SELECT user_id FROM notifications WHERE id = ?',
      [id]
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.run(
      'UPDATE notifications SET is_read = 1, read_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    res.json({ message: 'Notification marked as read' });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await db.run(
      'UPDATE notifications SET is_read = 1, read_at = CURRENT_TIMESTAMP WHERE user_id = ? AND is_read = 0',
      [req.user.userId]
    );

    res.json({ message: 'All notifications marked as read' });

  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const result = await db.get(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
      [req.user.userId]
    );

    res.json({ unread_count: result.count });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify notification belongs to user
    const notification = await db.get(
      'SELECT user_id FROM notifications WHERE id = ?',
      [id]
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.run('DELETE FROM notifications WHERE id = ?', [id]);

    res.json({ message: 'Notification deleted successfully' });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};
