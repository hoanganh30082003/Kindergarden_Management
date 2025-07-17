const ReportRepository = require('../repositories/ReportRepository');

exports.getTuitionReports = async (params) => {
  const { class_id, month, year, start_date, end_date, group_by = 'class' } = params;
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
  return await ReportRepository.getTuitionReport(filters, group_by);
};

exports.getMealFeeReports = async (params) => {
  const { class_id, student_id, month, year, start_date, end_date, group_by = 'class' } = params;
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
  return await ReportRepository.getMealFeeReport(filters, group_by);
};
