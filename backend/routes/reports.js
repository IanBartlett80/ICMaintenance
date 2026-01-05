const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

router.get('/dashboard', reportController.getDashboardStats);
router.get('/job-statistics', reportController.getJobStatistics);
router.get('/financial', reportController.getFinancialReport);
router.get('/performance', reportController.getPerformanceMetrics);

module.exports = router;
