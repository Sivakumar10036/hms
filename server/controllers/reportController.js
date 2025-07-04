const Appointment = require('../models/Appointment');
const Billing = require('../models/Billing');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Get appointment statistics
// @route   GET /api/reports/appointments
// @access  Private/Admin
exports.getAppointmentStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const match = {};
    
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }
    
    const stats = await Appointment.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$count' },
          statuses: { $push: { status: '$_id', count: '$count' } }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          statuses: 1
        }
      }
    ]);
    
    const doctorStats = await Appointment.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$doctor',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'doctors',
          localField: '_id',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      { $unwind: '$doctor' },
      {
        $project: {
          _id: 0,
          doctor: { firstName: 1, lastName: 1, specialization: 1 },
          count: 1
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        summary: stats[0] || { total: 0, statuses: [] },
        topDoctors: doctorStats
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get financial reports
// @route   GET /api/reports/financial
// @access  Private/Admin
exports.getFinancialReports = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const match = {};
    
    if (startDate || endDate) {
      match.dateIssued = {};
      if (startDate) match.dateIssued.$gte = new Date(startDate);
      if (endDate) match.dateIssued.$lte = new Date(endDate);
    }
    
    const financialStats = await Billing.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$paymentStatus',
          totalAmount: { $sum: '$totalAmount' },
          paidAmount: { $sum: '$paidAmount' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalCollected: { $sum: '$paidAmount' },
          statuses: { 
            $push: { 
              status: '$_id', 
              totalAmount: '$totalAmount',
              paidAmount: '$paidAmount',
              count: '$count'
            } 
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalCollected: 1,
          outstanding: { $subtract: ['$totalRevenue', '$totalCollected'] },
          statuses: 1
        }
      }
    ]);
    
    const monthlyRevenue = await Billing.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: '$dateIssued' },
            month: { $month: '$dateIssued' }
          },
          revenue: { $sum: '$totalAmount' },
          collected: { $sum: '$paidAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          period: {
            $dateToString: {
              format: '%Y-%m',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: 1
                }
              }
            }
          },
          revenue: 1,
          collected: 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        summary: financialStats[0] || {
          totalRevenue: 0,
          totalCollected: 0,
          outstanding: 0,
          statuses: []
        },
        monthlyRevenue
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get patient demographics
// @route   GET /api/reports/patients
// @access  Private/Admin
exports.getPatientDemographics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const match = {};
    
    if (startDate || endDate) {
      match.admissionDate = {};
      if (startDate) match.admissionDate.$gte = new Date(startDate);
      if (endDate) match.admissionDate.$lte = new Date(endDate);
    }
    
    const demographics = await Patient.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 },
          averageAge: {
            $avg: {
              $divide: [
                { $subtract: [new Date(), '$dateOfBirth'] },
                365 * 24 * 60 * 60 * 1000
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          gender: '$_id',
          count: 1,
          averageAge: { $round: ['$averageAge', 1] }
        }
      }
    ]);
    
    const bloodTypeStats = await Patient.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$bloodType',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          bloodType: '$_id',
          count: 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        demographics,
        bloodTypeStats
      }
    });
  } catch (err) {
    next(err);
  }
};