const Payment = require('../model/PaymentModel');
const mongoose = require('mongoose');

const getTuitionReport = async (filters, groupBy) => {
  const tuitionFilters = { ...filters, payment_type: 'Tuition' };
  
  let groupField;
  let lookupStage;
  let projectStage;

  if (groupBy === 'class') {
    groupField = '$class._id';
    lookupStage = [
      {
        $lookup: {
          from: 'students',
          localField: 'student_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $lookup: {
          from: 'classes',
          localField: 'student.class_id',
          foreignField: '_id',
          as: 'class'
        }
      },
      { $unwind: '$class' },
      {
        $lookup: {
          from: 'teachers',
          localField: 'class.teacher_id',
          foreignField: '_id',
          as: 'teacher'
        }
      },
      { $unwind: '$teacher' },
      {
        $lookup: {
          from: 'users',
          localField: 'teacher.user_id',
          foreignField: '_id',
          as: 'teacher_user'
        }
      },
      { $unwind: '$teacher_user' }
    ];
    projectStage = {
      class_id: '$_id',
      class_name: { $first: '$payments.class.class_name' },
      class_capacity: { $first: '$payments.class.capacity' },
      teacher_name: { $first: '$payments.teacher_user.system_name' },
      teacher_username: { $first: '$payments.teacher_user.username' },
      total_amount: 1,
      total_payments: 1,
      paid_count: 1,
      pending_count: 1,
      failed_count: 1,
      students: 1
    };
  } else if (groupBy === 'month') {
    groupField = {
      year: { $year: '$payment_date' },
      month: { $month: '$payment_date' }
    };
    lookupStage = [
      {
        $lookup: {
          from: 'students',
          localField: 'student_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $lookup: {
          from: 'classes',
          localField: 'student.class_id',
          foreignField: '_id',
          as: 'class'
        }
      },
      { $unwind: '$class' }
    ];
    projectStage = {
      year: '$_id.year',
      month: '$_id.month',
      total_amount: 1,
      total_payments: 1,
      paid_count: 1,
      pending_count: 1,
      failed_count: 1,
      classes: 1
    };
  }

  const pipeline = [
    { $match: tuitionFilters },
    ...lookupStage,
    {
      $group: {
        _id: groupField,
        total_amount: {
          $sum: { $toDouble: '$amount' }
        },
        total_payments: { $sum: 1 },
        paid_count: {
          $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, 1, 0] }
        },
        pending_count: {
          $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
        },
        failed_count: {
          $sum: { $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0] }
        },
        payments: { $push: '$$ROOT' }
      }
    },
    {
      $project: projectStage
    },
    { $sort: groupBy === 'month' ? { year: -1, month: -1 } : { class_name: 1 } }
  ];

  const summary = await Payment.aggregate([
    { $match: tuitionFilters },
    {
      $group: {
        _id: null,
        grand_total: { $sum: { $toDouble: '$amount' } },
        total_transactions: { $sum: 1 },
        total_paid: {
          $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, 1, 0] }
        },
        total_pending: {
          $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
        },
        total_failed: {
          $sum: { $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0] }
        }
      }
    }
  ]);

  const details = await Payment.aggregate(pipeline);

  return {
    summary: summary[0] || {
      grand_total: 0,
      total_transactions: 0,
      total_paid: 0,
      total_pending: 0,
      total_failed: 0
    },
    details
  };
};

const getMealFeeReport = async (filters, groupBy) => {
  const mealFilters = { ...filters, payment_type: 'Meal' };
  
  let groupField;
  let lookupStage;
  let projectStage;

  if (groupBy === 'class') {
    groupField = '$class._id';
    lookupStage = [
      {
        $lookup: {
          from: 'students',
          localField: 'student_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $lookup: {
          from: 'classes',
          localField: 'student.class_id',
          foreignField: '_id',
          as: 'class'
        }
      },
      { $unwind: '$class' },
      {
        $lookup: {
          from: 'teachers',
          localField: 'class.teacher_id',
          foreignField: '_id',
          as: 'teacher'
        }
      },
      { $unwind: '$teacher' },
      {
        $lookup: {
          from: 'users',
          localField: 'teacher.user_id',
          foreignField: '_id',
          as: 'teacher_user'
        }
      },
      { $unwind: '$teacher_user' }
    ];
    projectStage = {
      class_id: '$_id',
      class_name: { $first: '$payments.class.class_name' },
      class_capacity: { $first: '$payments.class.capacity' },
      teacher_name: { $first: '$payments.teacher_user.system_name' },
      teacher_username: { $first: '$payments.teacher_user.username' },
      total_amount: 1,
      total_payments: 1,
      paid_count: 1,
      pending_count: 1,
      failed_count: 1,
      students: 1
    };
  } else if (groupBy === 'student') {
    groupField = '$student._id';
    lookupStage = [
      {
        $lookup: {
          from: 'students',
          localField: 'student_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $lookup: {
          from: 'classes',
          localField: 'student.class_id',
          foreignField: '_id',
          as: 'class'
        }
      },
      { $unwind: '$class' },
      {
        $lookup: {
          from: 'teachers',
          localField: 'class.teacher_id',
          foreignField: '_id',
          as: 'teacher'
        }
      },
      { $unwind: '$teacher' },
      {
        $lookup: {
          from: 'users',
          localField: 'teacher.user_id',
          foreignField: '_id',
          as: 'teacher_user'
        }
      },
      { $unwind: '$teacher_user' }
    ];
    projectStage = {
      student_id: '$_id',
      student_name: { $first: '$payments.student.full_name' },
      class_name: { $first: '$payments.class.class_name' },
      class_capacity: { $first: '$payments.class.capacity' },
      teacher_name: { $first: '$payments.teacher_user.system_name' },
      total_amount: 1,
      total_payments: 1,
      paid_count: 1,
      pending_count: 1,
      failed_count: 1
    };
  }

  const pipeline = [
    { $match: mealFilters },
    ...lookupStage,
    {
      $group: {
        _id: groupField,
        total_amount: {
          $sum: { $toDouble: '$amount' }
        },
        total_payments: { $sum: 1 },
        paid_count: {
          $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, 1, 0] }
        },
        pending_count: {
          $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
        },
        failed_count: {
          $sum: { $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0] }
        },
        payments: { $push: '$$ROOT' }
      }
    },
    {
      $project: projectStage
    },
    { $sort: groupBy === 'student' ? { student_name: 1 } : { class_name: 1 } }
  ];

  const summary = await Payment.aggregate([
    { $match: mealFilters },
    {
      $group: {
        _id: null,
        grand_total: { $sum: { $toDouble: '$amount' } },
        total_transactions: { $sum: 1 },
        total_paid: {
          $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, 1, 0] }
        },
        total_pending: {
          $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
        },
        total_failed: {
          $sum: { $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0] }
        }
      }
    }
  ]);

  const details = await Payment.aggregate(pipeline);

  return {
    summary: summary[0] || {
      grand_total: 0,
      total_transactions: 0,
      total_paid: 0,
      total_pending: 0,
      total_failed: 0
    },
    details
  };
};

module.exports = {
  getTuitionReport,
  getMealFeeReport
};