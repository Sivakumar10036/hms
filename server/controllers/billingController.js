const Billing = require('../models/Billing');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// @desc    Get all bills
// @route   GET /api/billing
// @access  Private/Admin
exports.getBills = async (req, res, next) => {
  try {
    let query;
    
    // Check user role
    if (req.user.role === 'patient') {
      query = Billing.find({ patient: req.user.profileId });
    } else {
      query = Billing.find();
    }
    
    // Populate patient details
    query = query.populate('patient', 'firstName lastName phone email')
                 .populate('appointment', 'date time reason');
    
    const bills = await query;
    
    res.status(200).json({
      success: true,
      count: bills.length,
      data: bills
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single bill
// @route   GET /api/billing/:id
// @access  Private
exports.getBill = async (req, res, next) => {
  try {
    const bill = await Billing.findById(req.params.id)
      .populate('patient', 'firstName lastName phone email')
      .populate('appointment', 'date time reason');
    
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }
    
    // Check permissions
    if (req.user.role === 'patient' && bill.patient._id.toString() !== req.user.profileId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this bill'
      });
    }
    
    res.status(200).json({
      success: true,
      data: bill
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create bill
// @route   POST /api/billing
// @access  Private/Admin
exports.createBill = async (req, res, next) => {
  try {
    // Check if patient exists
    const patient = await Patient.findById(req.body.patient);
    if (!patient || !patient.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Check if appointment exists if provided
    if (req.body.appointment) {
      const appointment = await Appointment.findById(req.body.appointment);
      if (!appointment) {
        return res.status(400).json({
          success: false,
          message: 'Appointment not found'
        });
      }
    }
    
    // Calculate total amount if not provided
    if (!req.body.totalAmount && req.body.services) {
      req.body.totalAmount = req.body.services.reduce(
        (total, service) => total + (service.cost || 0), 0
      );
    }
    
    const bill = await Billing.create(req.body);
    
    res.status(201).json({
      success: true,
      data: bill
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update bill
// @route   PUT /api/billing/:id
// @access  Private/Admin
exports.updateBill = async (req, res, next) => {
  try {
    let bill = await Billing.findById(req.params.id);
    
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }
    
    // Recalculate total amount if services are being updated
    if (req.body.services) {
      req.body.totalAmount = req.body.services.reduce(
        (total, service) => total + (service.cost || 0), 0
      );
    }
    
    bill = await Billing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: bill
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Record payment
// @route   PUT /api/billing/:id/payment
// @access  Private/Admin
exports.recordPayment = async (req, res, next) => {
  try {
    let bill = await Billing.findById(req.params.id);
    
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }
    
    const { amount, method } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid payment amount'
      });
    }
    
    bill.paidAmount += amount;
    bill.paymentMethod = method || bill.paymentMethod;
    
    // Update payment status
    if (bill.paidAmount >= bill.totalAmount) {
      bill.paymentStatus = 'Paid';
    } else if (bill.paidAmount > 0) {
      bill.paymentStatus = 'Partial';
    }
    
    await bill.save();
    
    res.status(200).json({
      success: true,
      data: bill
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate invoice
// @route   GET /api/billing/:id/invoice
// @access  Private
exports.generateInvoice = async (req, res, next) => {
  try {
    const bill = await Billing.findById(req.params.id)
      .populate('patient', 'firstName lastName phone email address')
      .populate('appointment', 'date time reason');
    
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }
    
    // Check permissions
    if (req.user.role === 'patient' && bill.patient._id.toString() !== req.user.profileId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this invoice'
      });
    }
    
    // In a real application, you would generate a PDF here
    // For simplicity, we'll return the bill data formatted for an invoice
    const invoice = {
      invoiceNumber: bill._id,
      dateIssued: bill.dateIssued,
      dueDate: bill.dueDate,
      patient: bill.patient,
      services: bill.services,
      subtotal: bill.totalAmount,
      paidAmount: bill.paidAmount,
      balanceDue: bill.totalAmount - bill.paidAmount,
      paymentStatus: bill.paymentStatus
    };
    
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (err) {
    next(err);
  }
};