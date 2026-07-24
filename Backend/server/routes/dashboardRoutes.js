const express = require('express');
const router = express.Router();
const {
  getCitizenStats,
  getOfficerStats,
  getHeadOfficerStats,
  getAdminStats,
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All dashboard routes require JWT authentication
router.use(protect);

router.route('/citizen')
  .get(authorize('Citizen'), getCitizenStats);

router.route('/officer')
  .get(authorize('Officer', 'HeadOfficer', 'Admin'), getOfficerStats);

router.route('/headofficer')
  .get(authorize('HeadOfficer', 'Admin'), getHeadOfficerStats);

router.route('/admin')
  .get(authorize('Admin'), getAdminStats);

module.exports = router;
