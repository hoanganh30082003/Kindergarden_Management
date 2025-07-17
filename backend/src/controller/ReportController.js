const ReportService = require('../service/ReportService');

const getTuitionReports = async (req, res) => {
  try {
    const report = await ReportService.getTuitionReports(req.query);
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
    const report = await ReportService.getMealFeeReports(req.query);
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