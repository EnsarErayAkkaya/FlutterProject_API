const Assignment = require('../models/Assignment')
const Subject = require('../models/Subject')
const Teacher = require('../models/Teacher')
const asyncHandler = require('../middleware/async')

// @desc        Get all assignments
// @route       GET api/v1/assignment
// @access      Private Admin
exports.getAssignments = asyncHandler(async (req, res, next) => {
    const assignments = await Assignment.find();
  
    if (!assignments) {
      return next(new ErrorResponse('There is no assignments on Db !', 400));
    }
  
    res
      .status(200)
      .json({ success: true, count: assignments.length, data: assignments });
});

// @desc        Get all assignments
// @route       GET api/v1/assignment
// @access      Private
exports.getAssignment = asyncHandler(async (req, res, next) => {
    const assignment = await Assignment.findById(req.params.id);
  
    if (!assignment) {
      return next(new ErrorResponse('There is no assignment with given id!', 400));
    }
  
    res
      .status(200)
      .json({ success: true, data: assignment });
});

// @desc        create assignments
// @route       POST api/v1/assignment
// @access      Private Admin
exports.createAssignment = asyncHandler(async (req, res, next) => {
    const subject = await Subject.findById(req.body.subject);
  
    if (!subject) {
      return next(new ErrorResponse('An error occured when creating subject!', 400));
    }

    const assignment = await Assignment.create(req.body);

    res
      .status(201)
      .json({ success: true, data: assignment});
});

// @desc        update assignments
// @route       PUT api/v1/assignment
// @access      Private Admin
exports.updateAssignment = asyncHandler(async (req, res, next) => {
    /*const teacher = await Teacher.findById(req.body.teacher);
  
    if (!teacher) {
      return next(new ErrorResponse('could not find teacher!', 400));
    }

    const assignment = await Assignment.findById(req.params.id);
    
    if(teacher != assignment.subject.teacher)
    {
        return next(new ErrorResponse('You cant update this assignment!', 400));
    }*/
    
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
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

// @desc        Delete Assignment
// @route       DELETE api/v1/assignment/:id
// @access      Private Admin
exports.deleteAssignment = asyncHandler(async (req, res, next) => {
    const teacher = await Teacher.findById(req.body.teacher);
  
    if (!teacher) {
      return next(new ErrorResponse('could not find teacher!', 400));
    }

    const subject = await Assignment.findById(req.params.id).select('subject');
    
    if(teacher != subject.teacher)
    {
        return next(new ErrorResponse('You cant delete this assignment!', 400));
    }

    const assignment = await Assignment.findByIdAndDelete(req.params.id);
  
    if (!assignment) {
      return next(
        new ErrorResponse('An error occured when deleting Assignment!', 400)
      );
    }
    res.status(200).json({ success: true, data: {} });
});