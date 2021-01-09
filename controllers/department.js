const Department = require('../models/Department')
const Faculty = require('../models/Faculty')
const asyncHandler = require('../middleware/async')

// @desc        Get all departments
// @route       GET api/v1/department
// @access      Private Admin
exports.getDepartments = asyncHandler(async (req, res, next) => {
    const departments = await Department.find();
  
    if (!departments) {
      return next(new ErrorResponse('There is no department on Db !', 400));
    }
  
    res
      .status(200)
      .json({ success: true, count: departments.length, data: departments });
});

// @desc        Get departments
// @route       GET api/v1/department/:id
// @access      Private Admin
exports.getDepartment = asyncHandler(async (req, res, next) => {
    const department = await Department.findById(req.params.id);
  
    if (!department) {
      return next(new ErrorResponse('There is no Department with given id!', 400));
    }
  
    res
      .status(200)
      .json({ success: true, data: department });
});  

// @desc        Create Department
// @route       POST api/v1/department
// @access      Private Admin
exports.createDepartment = asyncHandler(async (req, res, next) => {
    const faculty = await Faculty.findById(req.body.faculty);
    
    if(!faculty){
        return next(new ErrorResponse('Couldnt find given faculty id!', 400));
    }

    const department = await Department.create(req.body);
  
    if (!department) {
      return next(new ErrorResponse('An error occured when creating Department!', 400));
    }

    faculty.departments.push(department);
    faculty.save();

    res
      .status(201)
      .json({ success: true, data: department});
});

// @desc        Update Department
// @route       PUT api/v1/department/:id
// @access      Private Admin
exports.updateDepartment = asyncHandler(async (req, res, next) => {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
  
    if (!department) {
      return next(new ErrorResponse('An error occured when updating Department!', 400));
    }
  
    res
      .status(200)
      .json({ success: true, data: department});
});

// @desc        Delete Department
// @route       DELETE api/v1/department/:id
// @access      Private Admin
exports.deleteDepartment = asyncHandler(async (req, res, next) => {
    const department = await Department.findByIdAndDelete(req.params.id);
  
    if (!department) {
      return next(
        new ErrorResponse('An error occured when deleting department!', 400)
      );
    }
    res.status(200).json({ success: true, data: {} });
});

// @desc        Get Faculty from University
// @route       GET api/v1/faculty/:id
// @access      Private Admin
exports.getDepartmentsInFaculty = asyncHandler(async (req, res, next) => {
    const departments = await Department.find({
        faculty: req.params.id
    });
  
    if (!departments) {
      return next(
        new ErrorResponse('An error occured when getting departments!', 400)
      );
    }
    res.status(200).json({ success: true, data: departments });
});