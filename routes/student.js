const express = require('express');
const {
  getStudents,
  getStudent,
  register,
  login,
  forgotPassword,
  resetPassword,
  updateDetails
} = require('../controllers/students');

const router = express.Router();

const Student = require('../models/Student');
const advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(getStudents, advancedResults(Student))

router
  .route('/:id')
  .get(getStudent)
  
router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', updateDetails);

module.exports = router;
