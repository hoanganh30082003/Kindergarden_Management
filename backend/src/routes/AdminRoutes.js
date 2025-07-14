const express = require('express');
const router = express.Router();
const studentController = require('../controller/StudentController');
const Parent = require("../model/ParentModel");
const User = require("../model/UserModel");
const Teacher = require("../model/TeacherModel");
const TuitionFee = require("../model/TuitionFeeModel");
const Class = require('../model/ClassModel'); // import model Class

router.get('/students', studentController.getAllStudents);
router.post('/students', studentController.createStudent);
router.put('/students/:id', studentController.updateStudent);
router.delete('/students/:id', studentController.deleteStudent);

// GET all parents
router.get("/parents", async (req, res) => {
  try {
    const parents = await Parent.find().populate("user_id", "username email phone status");
    res.json(parents);
  } catch (err) {
    console.error("Error fetching parents:", err);
    res.status(500).json({ error: "Failed to fetch parents" });
  }
});

// POST create user + parent
router.post("/parents", async (req, res) => {
  try {
    const {
      username, password, email, phone,
      full_name, date_of_birth, gender,
      address, occupation, relationship
    } = req.body;

    // Create user
    const newUser = new User({
      username,
      password,
      email,
      phone,
      role: "Parent"
    });
    const savedUser = await newUser.save();

    // Create parent
    const newParent = new Parent({
      full_name,
      date_of_birth,
      gender,
      address,
      phone,
      email,
      occupation,
      relationship,
      user_id: savedUser._id
    });
    const savedParent = await newParent.save();

    res.status(201).json({ user: savedUser, parent: savedParent });
  } catch (err) {
    console.error("Error creating parent:", err);
    res.status(400).json({ error: err.message, details: err });

  }
});

// PUT update parent
router.put("/parents/:id", async (req, res) => {
  try {
    const updatedParent = await Parent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedParent);
  } catch (err) {
    console.error("Error updating parent:", err);
    res.status(400).json({ error: "Failed to update parent" });
  }
});

// DELETE parent + user
router.delete("/parents/:id", async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) return res.status(404).json({ error: "Parent not found" });

    await User.findByIdAndDelete(parent.user_id);
    await Parent.findByIdAndDelete(req.params.id);

    res.json({ message: "Parent and user deleted successfully" });
  } catch (err) {
    console.error("Error deleting parent:", err);
    res.status(500).json({ error: "Failed to delete parent" });
  }
}); 
// GET ALL TEACHERS
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("user_id", "-password");
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
});

// ADD NEW TEACHER
router.post("/teachers", async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      phone,
      qualification,
      experience_years,
      hired_date,
      note
    } = req.body;

    // Check duplicate username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Create user
    const newUser = new User({
      username,
      password,
      email,
      phone,
      role: "Teacher"
    });
    const savedUser = await newUser.save();

    // Create teacher profile
    const newTeacher = new Teacher({
      user_id: savedUser._id,
      qualification,
      experience_years,
      hired_date,
      note
    });
    const savedTeacher = await newTeacher.save();

    res.status(201).json(savedTeacher);
  } catch (err) {
    console.error("Error creating teacher:", err);
    res.status(400).json({ error: err.message, details: err });
  }

  
});

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
router.get('/fees', async (req, res) => {
  try {
    const fees = await TuitionFee.find().populate('class_id');
    res.json(fees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create tuition fee
router.post('/fees', async (req, res) => {
  try {
    const { class_id, monthly_fee, effective_date, note, payment_status } = req.body;
    const newFee = new TuitionFee({
      class_id,
      monthly_fee: mongoose.Types.Decimal128.fromString(monthly_fee.toString()),
      effective_date,
      note,
      payment_status: payment_status || 'Unpaid'
    });
    const saved = await newFee.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update tuition fee (e.g., status)
router.put('/fees/:id', async (req, res) => {
  try {
    const updated = await TuitionFee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

module.exports = router;

module.exports = router;
