const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(authenticateToken);

// Job routes
router.post('/', authorizeRole('customer', 'staff'), jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);
router.put('/:id', authorizeRole('staff'), jobController.updateJob);

// Attachment routes
router.post('/attachments', upload.array('files', 5), jobController.uploadAttachment);
router.delete('/attachments/:id', jobController.deleteAttachment);

module.exports = router;
