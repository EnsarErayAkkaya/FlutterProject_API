const express = require('express');
const {
    getAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment
} = require('../controllers/assignments');

const router = express.Router();

router.post(createAssignment);
router.put('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);
router.get('/:id', getAssignment);
router.get(getAssignments);

module.exports = router;
