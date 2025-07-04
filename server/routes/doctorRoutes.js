const express = require('express');
const {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAvailability,
  updateAvailability
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .get(getDoctors)
  .post(protect, authorize('admin'), createDoctor);

router.route('/:id')
  .get(getDoctor)
  .put(protect, authorize('admin', 'doctor'), updateDoctor)
  .delete(protect, authorize('admin'), deleteDoctor);

router.route('/:id/availability')
  .get(getAvailability)
  .put(protect, authorize('admin', 'doctor'), updateAvailability);

module.exports = router;