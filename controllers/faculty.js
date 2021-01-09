const Faculty = require('../models/Faculty')
const University = require('../models/University')
const asyncHandler = require('../middleware/async')

// @desc        Get all faculties
// @route       GET api/v1/faculty
// @access      Private Admin
exports.getFaculties = asyncHandler(async (req, res, next) => {
    const faculties = await Faculty.find();
  
    if (!faculties) {
      return next(new ErrorResponse('There is no faculty on Db !', 400));
    }
  
    res
      .status(200)
      .json({ success: true, count: faculties.length, data: faculties });
});

// @desc        Get faculties
// @route       GET api/v1/faculty/:id
// @access      Private Admin
exports.getFaculty = asyncHandler(async (req, res, next) => {
    const faculty = await Faculty.findById(req.params.id);
  
    if (!faculty) {
      return next(new ErrorResponse('There is no Faculty with given id!', 400));
    }
  
    res
      .status(200)
      .json({ success: true, data: faculty });
});  

// @desc        Create Faculty
// @route       POST api/v1/faculty
// @access      Private Admin
exports.createFaculty = asyncHandler(async (req, res, next) => {
    const university = await University.findById(req.body.university);
    
    if(!university){
        return next(new ErrorResponse('Couldnt find given university id!', 400));
    }

    const faculty = await Faculty.create(req.body);
  
    if (!faculty) {
      return next(new ErrorResponse('An error occured when creating Faculty!', 400));
    }

    university.faculties.push(faculty);
    university.save();
  
    res
      .status(201)
      .json({ success: true, data: faculty});
});

// @desc        Update Faculty
// @route       PUT api/v1/faculty/:id
// @access      Private Admin
exports.updateFaculty = asyncHandler(async (req, res, next) => {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
  
    if (!faculty) {
      return next(new ErrorResponse('An error occured when updating Faculty!', 400));
    }
  
    res
      .status(200)
      .json({ success: true, data: faculty});
});

// @desc        Delete Faculty
// @route       DELETE api/v1/faculty/:id
// @access      Private Admin
exports.deleteFaculty = asyncHandler(async (req, res, next) => {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
  
    if (!faculty) {
      return next(
        new ErrorResponse('An error occured when deleting faculty!', 400)
      );
    }
    res.status(200).json({ success: true, data: {} });
});

// @desc        Get Faculty from University
// @route       GET api/v1/faculty/:id
// @access      Private Admin
exports.getFaculitiesInUniversity = asyncHandler(async (req, res, next) => {
    const faculties = await Faculty.find({
        university: req.params.id
    });
  
    if (!faculties) {
      return next(
        new ErrorResponse('An error occured when getting faculties!', 400)
      );
    }
    res.status(200).json({ success: true, data: faculties });
});