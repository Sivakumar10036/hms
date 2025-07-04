const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    let query;
    
    // Check user role
    if (req.user.role === 'patient') {
      query = Appointment.find({ patient: req.user.profileId });
    } else if (req.user.role === 'doctor') {
      query = Appointment.find({ doctor: req.user.profileId });
    } else {
      query = Appointment.find();
    }
    
    // Populate patient and doctor details
    query = query.populate('patient', 'firstName lastName phone email')
                 .populate('doctor', 'firstName lastName specialization');
    
    const appointments = await query;
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName phone email')
      .populate('doctor', 'firstName lastName specialization');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    // Check if user has permission to view this appointment
    if (req.user.role === 'patient' && appointment.patient._id.toString() !== req.user.profileId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this appointment'
      });
    }
    
    if (req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user.profileId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this appointment'
      });
    }
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res, next) => {
  try {
    // Add patient ID if user is patient
    if (req.user.role === 'patient') {
      req.body.patient = req.user.profileId;
    }
    
    // Check if doctor is available
    const doctor = await Doctor.findById(req.body.doctor);
    if (!doctor || !doctor.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Doctor not available'
      });
    }
    
    // Check if patient exists
    const patient = await Patient.findById(req.body.patient);
    if (!patient || !patient.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      doctor: req.body.doctor,
      date: req.body.date,
      time: req.body.time,
      status: { $ne: 'Cancelled' }
    });
    
    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Doctor already has an appointment at this time'
      });
    }
    
    const appointment = await Appointment.create(req.body);
    
    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    // Check permissions
    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user.profileId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }
    
    if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user.profileId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }
    
    // Check for conflicting appointments if time is being changed
    if (req.body.date || req.body.time) {
      const conflictingAppointment = await Appointment.findOne({
        _id: { $ne: req.params.id },
        doctor: appointment.doctor,
        date: req.body.date || appointment.date,
        time: req.body.time || appointment.time,
        status: { $ne: 'Cancelled' }
      });
      
      if (conflictingAppointment) {
        return res.status(400).json({
          success: false,
          message: 'Doctor already has an appointment at this time'
        });
      }
    }
    
    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    // Check permissions
    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user.profileId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this appointment'
      });
    }
    
    if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user.profileId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this appointment'
      });
    }
    
    // Instead of deleting, set status to Cancelled
    appointment.status = 'Cancelled';
    await appointment.save();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};