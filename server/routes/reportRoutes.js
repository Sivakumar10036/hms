const express = require('express');
const {
  getAppointmentStats,
  getFinancialReports,
  getPatientDemographics
} = require('../controllers/reportController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/appointments', getAppointmentStats);
router.get('/financial', getFinancialReports);
router.get('/patients', getPatientDemographics);

module.exports = router;