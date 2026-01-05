const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Quote routes
router.post('/', authorizeRole('trade', 'staff'), quoteController.createQuote);
router.get('/job/:jobId', quoteController.getQuotesByJob);
router.get('/job/:jobId/comparison', authorizeRole('staff'), quoteController.getQuoteComparison);
router.put('/:id/status', authorizeRole('customer', 'staff'), quoteController.updateQuoteStatus);
router.put('/:id/withdraw', authorizeRole('trade'), quoteController.withdrawQuote);

module.exports = router;
