const AssignmentAnswer = require('../models/AssignmentAnswer')
const Assignment = require('../models/Assignment')
const Student = require('../models/Student')
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const {
  getGFS
} = require('../config/db');

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
  
    if (!assignmentAnswer) {
      return next(new ErrorResponse('There is no assignment with given id!', 400));
    }
  
    res
      .status(200)
      .json({ success: true, data: assignmentAnswer });
});

// @desc        create AssignmentAnswers
// @route       POST api/v1/assignment
// @access      Private student
exports.createAssignmentAnswer = asyncHandler(async (req, res, next) => {
    const assignment = await Assignment.findById(req.body.assignment);
    const gfs = getGFS();
    if (!assignment) {
        gfs.remove({_id: req.file.id, root: 'uploads'}, (err, gridStore) => {
            if(err){
                return next(new ErrorResponse('error when deleting old file!', 400));
            }
        });
      return next(new ErrorResponse('An error occured when creating AssignmentAnswer!', 400));
    }
    const student = await Student.findById(req.body.student);
  
    if (!student) {
      	gfs.remove({_id: req.file.id, root: 'uploads'}, (err, gridStore) => {
            if(err){
                return next(new ErrorResponse('error when deleting old file!', 400));
            }
      	});
		return next(new ErrorResponse('An error occured when creating AssignmentAnswer!', 400));
    }

    console.log('file: '+ req.file.id);
    req.body.file =  req.file.id;

    const assignmentAnswer = await AssignmentAnswer.create(req.body);

    res
      .status(201)
      .json({ success: true, data: assignmentAnswer});
});

// @desc        update AssignmentAnswers
// @route       PUT api/v1/assignment
// @access      Private student
exports.updateAssignmentAnswer = asyncHandler(async (req, res, next) => {
    const gfs = getGFS();
    console.log('AssignmentAnswer Update');
    if(req.file != null){
        console.log('Have a new file');
        req.body.file = req.file.id; 
    }

    const assignmentAnswerOld = await AssignmentAnswer.findById(req.params.id);
    const assignmentAnswer = await AssignmentAnswer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
      
    if(!assignmentAnswer){
        if(req.file != null){
            console.log('Couldnt update assignment deleting new uploaded file');
            gfs.remove({_id: req.file._id, root: 'uploads'}, (err, gridStore) => {
                if(err){
                    return next(new ErrorResponse('error when deleting new file!', 400));
                }
            });
        }
		return next(new ErrorResponse('Couldnt find given assignment id!', 400));
    }

	if(req.file != null){
		if(assignmentOld.file != null && assignmentOld.file != ''){
		  	console.log('Updated assignment deleting old file');
		  	gfs.remove({_id: assignmentAnswerOld.file, root: 'uploads'}, (err, gridStore) => {
			  	if(err){
					return next(new ErrorResponse('error when deleting old file!', 400));
			  	}
		  	});
		}
    }

    res
      .status(200)
      .json({ success: true, data: assignment});
});

// @desc        Delete AssignmentAnswer
// @route       DELETE api/v1/assignment/:id
// @access      Private Admin
exports.deleteAssignmentAnswer = asyncHandler(async (req, res, next) => {
	const gfs = getGFS();
  	console.log('delete assignment Answer: ' + gfs);

    const assignmentAnswer = await AssignmentAnswer.findByIdAndDelete(req.params.id);
  
    if (!assignmentAnswer) {
      return next(
        new ErrorResponse('An error occured when deleting AssignmentAnswer!', 400)
      );
    }

	gfs.remove({_id: assignment.file, root: 'uploads'}, (err, gridStore) => {
		if(err){
		  return next(new ErrorResponse('error when deleting old file!', 400));
		}
	});		

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