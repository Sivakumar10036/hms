const express = require('express');
const {
  getBills,
  getBill,
  createBill,
  updateBill,
  recordPayment,
  generateInvoice
} = require('../controllers/billingController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin', 'patient'), getBills)
  .post(authorize('admin'), createBill);

router.route('/:id')
  .get(authorize('admin', 'patient'), getBill)
  .put(authorize('admin'), updateBill);

router.put('/:id/payment', authorize('admin'), recordPayment);
router.get('/:id/invoice', authorize('admin', 'patient'), generateInvoice);

module.exports = router;