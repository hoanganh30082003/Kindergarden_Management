const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const studentController = require('../controller/StudentController');
const ParentController = require('../controller/ParentController');
const Parent = require("../model/ParentModel");
const User = require("../model/UserModel");
const Teacher = require("../model/TeacherModel");
const TuitionFee = require("../model/TuitionFeeModel");
const Class = require('../model/ClassModel'); // import model Class
const MealFee = require('../model/MealFeeModel');
const TeacherController = require('../controller/TeacherController');
const ClassController = require('../controller/ClassController');
const FeeController = require('../controller/FeeController');
const MealFeeController = require('../controller/MealFeeController');


router.get('/students', studentController.getAllStudents);
router.post('/students', studentController.createStudent);
router.put('/students/:id', studentController.updateStudent);
router.delete('/students/:id', studentController.deleteStudent);

// GET all parents
router.get("/parents", ParentController.getAllParents);
router.post("/parents", ParentController.createParent);
router.put("/parents/:id", ParentController.updateParent);
router.delete("/parents/:id", ParentController.deleteParent);
router.put("/parents/:id/status", ParentController.updateStatus);

// GET ALL TEACHERS
router.get("/teachers", TeacherController.getAllTeachers);
router.post("/teachers", TeacherController.createTeacher);

// Get all classes
router.get('/classes', async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tuition fees
router.get('/fees', FeeController.getAllFees);
router.post('/fees', FeeController.createFee);
router.put('/fees/:id', FeeController.updateFee);
router.delete('/fees/:id', FeeController.deleteFee);

// Get all meal fees
router.get('/meal-fees', MealFeeController.getAllMealFees);
router.post('/meal-fees', MealFeeController.createMealFee);
router.put('/meal-fees/:id/status', MealFeeController.updateMealFeeStatus);
router.delete('/meal-fees/:id', MealFeeController.deleteMealFee);

// Create class
router.post("/classes", async (req, res) => {
  try {
    const { class_name, capacity, teacher_id } = req.body;
    if (!class_name || !capacity || !teacher_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Kiểm tra teacher_id hợp lệ
    const teacher = await Teacher.findById(teacher_id).populate("user_id", "username");
    if (!teacher || !teacher.user_id) {
      return res.status(400).json({ error: "Invalid teacher_id: teacher not found or missing user" });
    }
    const newClass = new Class({
      class_name,
      capacity,
      teacher_id, // truyền trực tiếp, để Mongoose tự convert
    });
    const saved = await newClass.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all classes
router.get("/classes", ClassController.getAllClasses);
router.post("/classes", ClassController.createClass);
router.delete("/classes/:id", ClassController.deleteClass);


module.exports = router;
