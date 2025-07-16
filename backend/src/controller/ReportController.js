const ReportRepository = require('../repositories/ReportRepository');

const getTuitionReports = async (req, res) => {
  try {
    const { 
      class_id, 
      month, 
      year, 
      start_date, 
      end_date,
      group_by = 'class'
    } = req.query;
    
    const filters = {};
    if (class_id) filters.class_id = class_id;
    if (month && year) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
      filters.payment_date = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (start_date || end_date) {
      filters.payment_date = {};
      if (start_date) filters.payment_date.$gte = new Date(start_date);
      if (end_date) filters.payment_date.$lte = new Date(end_date);
    }

    const report = await ReportRepository.getTuitionReport(filters, group_by);
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const getMealFeeReports = async (req, res) => {
  try {
    const { 
      class_id, 
      student_id,
      month, 
      year, 
      start_date, 
      end_date,
      group_by = 'class'
    } = req.query;
    
    const filters = {};
    if (class_id) filters.class_id = class_id;
    if (student_id) filters.student_id = student_id;
    if (month && year) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
      filters.payment_date = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (start_date || end_date) {
      filters.payment_date = {};
      if (start_date) filters.payment_date.$gte = new Date(start_date);
      if (end_date) filters.payment_date.$lte = new Date(end_date);
    }

    const report = await ReportRepository.getMealFeeReport(filters, group_by);
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getTuitionReports,
  getMealFeeReports
};