const express = require('express');
const {
  createConnection,
  studentAnswerConnectionRequest,
  deleteConnection,
  GetMyStudents,
  GetMyTeachers
} = require('../controllers/connection');

const router = express.Router();

const Connection = require('../models/Connection');

router.post('/createConnection', createConnection);
router.post('/answerConnectionRequest/:id', studentAnswerConnectionRequest);
router.delete('/', deleteConnection);
router.get('/getStudents/:id', GetMyStudents);
router.get('/getTeachers/:id', GetMyTeachers);

module.exports = router;
