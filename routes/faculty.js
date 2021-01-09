const express = require('express');

const {
    getFaculties,
    getFaculty,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    getFaculitiesInUniversity
} = require('../controllers/Faculty');

const router = express.Router();

router
  .route('/')
  .get(getFaculties)
  .post(createFaculty)

router
  .route('/:id')
  .get(getFaculty)
  .put(updateFaculty)
  .delete(deleteFaculty);

router
    .route('/getFaculitiesInUniversity/:id')
    .get(getFaculitiesInUniversity);

module.exports = router;