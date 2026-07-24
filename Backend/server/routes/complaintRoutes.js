const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getComplaintStats
} = require('../controllers/complaintController');

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  validateCreateComplaint,
  validateUpdateComplaint,
} = require('../middleware/complaintValidation');

// All complaint routes require authentication
router.use(protect);

// Endpoint paths matching:
// POST /api/complaints
// GET /api/complaints
router
  .route('/')
  .post(
    authorize('Citizen'),
    upload.single('beforeImage'),
    validateCreateComplaint,
    createComplaint
  )
  .get(getComplaints);

// Named routes MUST be defined before /:id to preventExpress route collision
router.get('/my', getComplaints);
if (typeof getComplaintStats === 'function') {
  router.get('/stats', getComplaintStats);
}

// Endpoint paths matching:
// GET /api/complaints/:id
// PUT /api/complaints/:id
// DELETE /api/complaints/:id
router
  .route('/:id')
  .get(getComplaintById)
  .put(
    upload.fields([
      { name: 'beforeImage', maxCount: 1 },
      { name: 'afterImage', maxCount: 1 },
    ]),
    validateUpdateComplaint,
    updateComplaint
  )
  .delete(deleteComplaint);

module.exports = router;
