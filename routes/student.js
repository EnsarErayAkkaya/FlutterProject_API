const express = require('express');
const {
  getStudentsByName,
  getStudents,
  getStudent,
  register,
  login,
  forgotPassword,
  resetPassword,
  updateDetails,
  getSubjects
} = require('../controllers/students');

const router = express.Router();

const Student = require('../models/Student');
const advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(getStudents, advancedResults(Student))

router.get('/byName', getStudentsByName);

router
  .route('/:id')
  .get(getStudent)
  
router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', updateDetails);
router.get('/subjects/:id', getSubjects);

module.exports = router;
