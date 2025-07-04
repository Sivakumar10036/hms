const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private/Admin
exports.getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find();
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
exports.getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create patient
// @route   POST /api/patients
// @access  Private/Admin
exports.createPatient = async (req, res, next) => {
  try {
    const patient = await Patient.create(req.body);
    
    res.status(201).json({
      success: true,
      data: patient
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private/Admin
exports.deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get patient medical history
// @route   GET /api/patients/:id/history
// @access  Private
exports.getMedicalHistory = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).select('medicalHistory');
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: patient.medicalHistory
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add to patient medical history
// @route   POST /api/patients/:id/history
// @access  Private/Doctor
exports.addMedicalHistory = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    patient.medicalHistory.push(req.body.record);
    await patient.save();
    
    res.status(200).json({
      success: true,
      data: patient.medicalHistory
    });
  } catch (err) {
    next(err);
  }
};