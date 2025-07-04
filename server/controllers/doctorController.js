const Doctor = require('../models/Doctor');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({ isActive: true });
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create doctor
// @route   POST /api/doctors
// @access  Private/Admin
exports.createDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.create(req.body);
    
    res.status(201).json({
      success: true,
      data: doctor
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private/Admin
exports.updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete doctor (set inactive)
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
exports.deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get doctor availability
// @route   GET /api/doctors/:id/availability
// @access  Public
exports.getAvailability = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('availability');
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: doctor.availability
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update doctor availability
// @route   PUT /api/doctors/:id/availability
// @access  Private/Doctor
exports.updateAvailability = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { availability: req.body.availability },
      { new: true }
    );
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: doctor.availability
    });
  } catch (err) {
    next(err);
  }
};