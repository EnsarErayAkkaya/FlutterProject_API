const express = require('express');
const {
    getAssignmentAnswers,
    getAssignmentAnswer,
    createAssignmentAnswer,
    updateAssignmentAnswer,
    deleteAssignmentAnswer,
    checkAssignmentAnswer
} = require('../controllers/assignmentAnswers');

const router = express.Router();

router.post(createAssignmentAnswer);
router.put('/:id', updateAssignmentAnswer);
router.put('/checkAssignmentAnswer/:id', checkAssignmentAnswer);
router.delete('/:id', deleteAssignmentAnswer);
router.get('/:id', getAssignmentAnswer);
router.get(getAssignmentAnswers);

module.exports = router;
