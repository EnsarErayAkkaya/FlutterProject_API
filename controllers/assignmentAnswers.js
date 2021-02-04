const AssignmentAnswer = require('../models/AssignmentAnswer')
const Subject = require('../models/Subject')
const Student = require('../models/Student')
const asyncHandler = require('../middleware/async');
const Assignment = require('../models/Assignment');

// @desc        Get all AssignmentAnswers
// @route       GET api/v1/assignment
// @access      Private Admin
exports.getAssignmentAnswers = asyncHandler(async (req, res, next) => {
    const assignmentAnswers = await AssignmentAnswer.find();
  
    if (!assignmentAnswers) {
      return next(new ErrorResponse('There is no AssignmentAnswers on Db !', 400));
    }
  
    res
      .status(200)
      .json({ success: true, count: assignmentAnswers.length, data: assignmentAnswers });
});


// @desc        Get all AssignmentAnswers
// @route       GET api/v1/assignment
// @access      Private Admin
exports.getAssignmentAnswer = asyncHandler(async (req, res, next) => {
    const assignmentAnswer = await AssignmentAnswer.findById(req.params.id);
  
    if (!assignment) {
      return next(new ErrorResponse('There is no assignment with given id!', 400));
    }
  
    res
      .status(200)
      .json({ success: true, data: assignment });
});

// @desc        create AssignmentAnswers
// @route       POST api/v1/assignment
// @access      Private student
exports.createAssignmentAnswer = asyncHandler(async (req, res, next) => {
    const assignment = await Assignment.findById(req.body.assignment);
  
    if (!assignment) {
      return next(new ErrorResponse('An error occured when creating AssignmentAnswer!', 400));
    }

    const assignmentAnswer = await AssignmentAnswer.create(req.body);

    res
      .status(201)
      .json({ success: true, data: assignmentAnswer});
});

// @desc        update AssignmentAnswers
// @route       PUT api/v1/assignment
// @access      Private student
exports.updateAssignmentAnswer = asyncHandler(async (req, res, next) => {
    const assignment = await AssignmentAnswer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    if(!assignment){
        return next(new ErrorResponse('Couldnt find given assignment id!', 400));
    }

    res
      .status(200)
      .json({ success: true, data: assignment});
});

// @desc        Delete AssignmentAnswer
// @route       DELETE api/v1/assignment/:id
// @access      Private Admin
exports.deleteAssignmentAnswer = asyncHandler(async (req, res, next) => {
    const assignmentAnswer = await AssignmentAnswer.findByIdAndDelete(req.params.id);
  
    if (!assignmentAnswer) {
      return next(
        new ErrorResponse('An error occured when deleting AssignmentAnswer!', 400)
      );
    }
    res.status(200).json({ success: true, data: {} });
});

// @desc        Check AssignmentAnswer
// @route       PUT api/v1/assignment/:id
// @access      Private
exports.checkAssignmentAnswer = asyncHandler(async (req, res, next) => {
    const assignmentAnswer = await AssignmentAnswer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    res
      .status(200)
      .json({ success: true, data: assignmentAnswer});
});