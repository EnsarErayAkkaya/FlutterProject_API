const express = require('express');
const {
  getTeachers,
  getTeacher,
  register,
  login,
  forgotPassword,
  resetPassword,
  updateDetails
} = require('../controllers/teachers');

const router = express.Router();

const Teacher = require('../models/Teacher');
const advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(getTeachers, advancedResults(Teacher))

router
  .route('/:id')
  .get(getTeacher)

router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', updateDetails);

module.exports = router;
