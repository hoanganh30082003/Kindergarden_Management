const PaymentModel = require('../model/PaymentModel');
const mongoose = require('mongoose');

const updatePaymentByVnPay = async (paymentId) => {
  return await PaymentModel.findByIdAndUpdate(
    paymentId,
    { method: 'Online', status: 'Paid', payment_date: Date.now() },
    { new: true }
  );
}

const create = async (paymentData) => {
  return await PaymentModel.create(paymentData);
};

const findByStudentIds = async (studentIds) => {
  return await PaymentModel.find({ student_id: { $in: studentIds }, status: 'Pending' }).populate('student_id');
};

// const getPaymentById = async (paymentId) => {
//   return await PaymentModel.findById(paymentId).populate('student_id');
// };

const getPaidPaymentsByStudentId = async (studentIds) => {
  return await PaymentModel.find({ student_id: { $in: studentIds }, status: 'Paid' }).populate('student_id');
};

const getPaymentRecords = async (filters, page, limit) => {
  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: filters },
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
        from: 'accounts',
        localField: 'teacher.account_id',
        foreignField: '_id',
        as: 'teacher_account'
      }
    },
    { $unwind: '$teacher_account' },
    {
      $lookup: {
        from: 'parents',
        localField: 'student.parent_id',
        foreignField: '_id',
        as: 'parent'
      }
    },
    { $unwind: '$parent' },
    {
      $project: {
        payment_date: 1,
        amount: 1,
        payment_type: 1,
        method: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        'student.full_name': 1,
        'student._id': 1,
        'class.class_name': 1,
        'class._id': 1,
        'class.capacity': 1,
        'teacher.qualification': 1,
        'teacher.experience_years': 1,
        'teacher_account.system_name': 1,
        'teacher_account.email': 1,
        'parent.full_name': 1,
        'parent._id': 1
      }
    },
    { $sort: { payment_date: -1 } }
  ];

  const countPipeline = [...pipeline, { $count: 'total' }];
  const dataPipeline = [...pipeline, { $skip: skip }, { $limit: parseInt(limit) }];

  const [countResult, payments] = await Promise.all([
    PaymentModel.aggregate(countPipeline),
    PaymentModel.aggregate(dataPipeline)
  ]);

  const total = countResult[0]?.total || 0;

  return { payments, total };
};


const getPaymentById = async (paymentId) => {
  const objectId = new mongoose.Types.ObjectId(paymentId);

  const pipeline = [
    { $match: { _id: objectId } },
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
        from: 'accounts',
        localField: 'teacher.account_id',
        foreignField: '_id',
        as: 'teacher_account'
      }
    },
    { $unwind: '$teacher_account' },
    {
      $lookup: {
        from: 'parents',
        localField: 'student.parent_id',
        foreignField: '_id',
        as: 'parent'
      }
    },
    { $unwind: '$parent' },
    {
      $project: {
        payment_date: 1,
        amount: 1,
        payment_type: 1,
        method: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        'student._id': 1,
        'student.full_name': 1,
        'student.date_of_birth': 1,
        'student.gender': 1,
        'student.address': 1,
        'student.health_info': 1,
        'student.student_photo': 1,
        'class._id': 1,
        'class.class_name': 1,
        'class.capacity': 1,
        'class.create_at': 1,
        'class.update_at': 1,
        'teacher._id': 1,
        'teacher.qualification': 1,
        'teacher.experience_years': 1,
        'teacher.hired_date': 1,
        'teacher.note': 1,
        'teacher_account._id': 1,
        'teacher_account.system_name': 1,
        'teacher_account.email': 1,
        'teacher_account.phone': 1,
        'teacher_account.status': 1,
        'parent._id': 1,
        'parent.full_name': 1,
        'parent.email': 1,
        'parent.phone': 1
      }
    }
  ];

  const result = await PaymentModel.aggregate(pipeline);
  return result[0] || null;
};


const getTransactionHistory = async (filters, page, limit) => {
  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: filters },
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
        from: 'accounts',
        localField: 'teacher.account_id',
        foreignField: '_id',
        as: 'teacher_account'
      }
    },
    { $unwind: '$teacher_account' },
    {
      $project: {
        payment_date: 1,
        amount: 1,
        payment_type: 1,
        method: 1,
        status: 1,
        createdAt: 1,
        'student.full_name': 1,
        'student._id': 1,
        'class.class_name': 1,
        'class._id': 1,
        'class.capacity': 1,
        'teacher_account.system_name': 1,
        'teacher_account.username': 1
      }
    },
    { $sort: { payment_date: -1, createdAt: -1 } }
  ];

  const countPipeline = [...pipeline, { $count: 'total' }];
  const dataPipeline = [...pipeline, { $skip: skip }, { $limit: parseInt(limit) }];

  const [countResult, transactions] = await Promise.all([
    PaymentModel.aggregate(countPipeline),
    PaymentModel.aggregate(dataPipeline)
  ]);

  const total = countResult[0]?.total || 0;

  return { transactions, total };
};

module.exports = {
  getPaymentRecords,
  getTransactionHistory,
  updatePaymentByVnPay,
  create,
  findByStudentIds,
  getPaymentById,
  getPaidPaymentsByStudentId
};
