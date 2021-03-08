const express = require('express');
const {
  getSubjects,
  getTeachersSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  addStudent,
  removeStudent,
  leaveSubject
} = require('../controllers/subjects');

const router = express.Router();

const Subject = require('../models/Subject');
const advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(getSubjects, advancedResults(Subject))
  .post(createSubject);

router
  .route('/:id')
  .get(getSubject)
  .put(updateSubject)
  .delete(deleteSubject);

router
  .route('/addStudent')
  .post(addStudent);

router
  .route('/removeStudent')
  .post(removeStudent);

router
  .route('/leave')
  .post(leaveSubject);

router
    .route('/teacherSubjects/:id')
    .get(getTeachersSubjects);

module.exports = router;
