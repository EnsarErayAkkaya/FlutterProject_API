const University = require('../models/University')
const asyncHandler = require('../middleware/async')

// @desc        Get all universities
// @route       GET api/v1/university
// @access      Private Admin
exports.getUniversities = asyncHandler(async (req, res, next) => {
    const universities = await University.find();
  
    if (!universities) {
      return next(new ErrorResponse('There is no university on Db !', 400));
    }
  
    res
      .status(200)
      .json({ success: true, count: universities.length, data: universities });
});

// @desc        Get universities
// @route       GET api/v1/university/:id
// @access      Private Admin
exports.getUniversity = asyncHandler(async (req, res, next) => {
    const university = await University.findById(req.params.id);
  
    if (!university) {
      return next(new ErrorResponse('There is no Uni with given id!', 400));
    }
  
    res
      .status(200)
      .json({ success: true, data: university });
});  

// @desc        Create University
// @route       POST api/v1/university
// @access      Private Admin
exports.createUniversity = asyncHandler(async (req, res, next) => {
    const university = await University.create(req.body);
  
    if (!university) {
      return next(new ErrorResponse('An error occured when creating University!', 400));
    }
  
    res
      .status(201)
      .json({ success: true, data: university});
});

// @desc        Update University
// @route       PUT api/v1/university/:id
// @access      Private Admin
exports.updateUniversity = asyncHandler(async (req, res, next) => {
    const university = await University.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
  
    if (!university) {
      return next(new ErrorResponse('An error occured when updating University!', 400));
    }
  
    res
      .status(200)
      .json({ success: true, data: university});
});

// @desc        Delete University
// @route       DELETE api/v1/university/:id
// @access      Private Admin
exports.deleteUniversity = asyncHandler(async (req, res, next) => {
    const university = await University.findByIdAndDelete(req.params.id);
  
    if (!university) {
      return next(
        new ErrorResponse('An error occured when deleting university!', 400)
      );
    }
    res.status(200).json({ success: true, data: {} });
  });