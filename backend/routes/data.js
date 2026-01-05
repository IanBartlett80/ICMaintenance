const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Category routes
router.get('/categories', dataController.getCategories);
router.post('/categories', authorizeRole('staff'), dataController.createCategory);
router.put('/categories/:id', authorizeRole('staff'), dataController.updateCategory);

// Priority and status routes
router.get('/priorities', dataController.getPriorities);
router.get('/statuses', dataController.getStatuses);

// Trade specialist routes
router.get('/trade-specialists', dataController.getTradeSpecialists);
router.get('/trade-specialists/:id', dataController.getTradeSpecialistById);
router.post('/trade-specialists', authorizeRole('staff'), dataController.createTradeSpecialist);
router.put('/trade-specialists/:id', authorizeRole('staff', 'trade'), dataController.updateTradeSpecialist);

// Customer routes
router.get('/customers', authorizeRole('staff'), dataController.getCustomers);
router.get('/customers/:id', authorizeRole('staff', 'customer'), dataController.getCustomerById);

module.exports = router;
