const express = require('express');

const {
    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentsInFaculty
} = require('../controllers/Department');

const router = express.Router();

router
  .route('/')
  .get(getDepartments)
  .post(createDepartment)

router
  .route('/:id')
  .get(getDepartment)
  .put(updateDepartment)
  .delete(deleteDepartment);

router
  .route('/getDepartmentsInFaculty/:id')
  .get(getDepartmentsInFaculty);
module.exports = router;