const express = require('express');
const {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  getMedicalHistory,
  addMedicalHistory
} = require('../controllers/patientController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin', 'doctor'), getPatients)
  .post(authorize('admin'), createPatient);

router.route('/:id')
  .get(authorize('admin', 'doctor', 'patient'), getPatient)
  .put(authorize('admin', 'patient'), updatePatient)
  .delete(authorize('admin'), deletePatient);

router.route('/:id/history')
  .get(authorize('admin', 'doctor', 'patient'), getMedicalHistory)
  .post(authorize('admin', 'doctor'), addMedicalHistory);

module.exports = router;