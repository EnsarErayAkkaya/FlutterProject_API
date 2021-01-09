const express = require('express');

const {
    getUniversities,
    getUniversity,
    createUniversity,
    updateUniversity,
    deleteUniversity
} = require('../controllers/university');

const router = express.Router();

router
  .route('/')
  .get(getUniversities)
  .post(createUniversity)

router
  .route('/:id')
  .get(getUniversity)
  .put(updateUniversity)
  .delete(deleteUniversity);
module.exports = router;