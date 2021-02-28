const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const Teacher = require('../models/Teacher')
const Student = require('../models/Student')
const Subject = require('../models/Subject')
const Connection = require('../models/Connection')

// @desc        Get all Teachers
// @route       GET api/v1/Teacher
// @access      Private Admin
exports.getTeachers = asyncHandler(async (req, res, next) => {
    const Teachers = await Teacher.find();
  
    if (!Teachers) {
      return next(new ErrorResponse('There is no Teacher on Db !', 400));
    }
  
    res
      .status(200)
      .json({ success: true, count: Teachers.length, data: Teachers });
});

// @desc        Get Teachers
// @route       GET api/v1/Teacher/:id
// @access      Private Admin
exports.getTeacher = asyncHandler(async (req, res, next) => {
    const Teacher = await Teacher.findById(req.params.id);
  
    if (!Teacher) {
      return next(new ErrorResponse('There is no Uni with given id!', 400));
    }
  
    res
      .status(200)
      .json({ success: true, data: Teacher });
});  

// @desc      Register teacher
// @route     POST /api/v1/teacher/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, surname, email, password } = req.body;
  
    //Create teacher
    const teacher = await Teacher.create({
      name,
      surname,
      email,
      password
    });
  
    if (!teacher) {
      return next(new ErrorResponse('Error when creating teacher', 500));
    }  
    
    await teacher.save({ validateBeforeSave: false });
  
    res.status(201).json({ success: true });
  });
  
  // @desc      Login teacher
  // @route     POST /api/v1/teacher/login
  // @access    Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
  
    // Validate emil & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }
  
    // Check for teacher
    const teacher = await Teacher.findOne({
      email
    }).select('+password')
      .populate(
        {
          path: 'subjects',
          select: '_id name surname students',
          populate:{ 
              path: 'assignments',
              select: '_id title description file startDate endDate'
            }
          }
        );
  
    if (!teacher) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
  
    // Check if password matches
    const isMatch = await teacher.matchPassword(password);
  
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
    //console.log(teacher);

    var students = await getMyStudents(teacher._id);

    res.status(200).json({
        success: true,
        data:{
            "_id": teacher._id,
            "name":teacher.name,
            "surname":teacher.surname,
            "email":teacher.email,
            "students":students[0],
            "subjects": teacher.subjects
        }
      });
  });
  
  // @desc      Forgot password
  // @route     POST /api/v1/teacher/forgotpassword
  // @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const teacher = await Teacher.findOne({ email: req.body.email });
  
    if (!teacher) {
      return next(new ErrorResponse('There is no teacher with that email.', 404));
    }
  
    const resetToken = teacher.getResetPasswordToken();
  
    await teacher.save({ validateBeforeSave: false });
  
    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/teacher/resetpassword/${resetToken}`;
  
    const message = `Şifrenizi yenilemek için aşağıdaki linke tıklayınız: \n\n ${resetUrl}`;
  
    try {
        await sendEmail({
            email: teacher.email,
            subject: 'Plume reset password',
            message
        });
        res.status(200).json({ success: true });
        } 
    catch (error) {
        console.log(error);
        teacher.resetPasswordToken = undefined;
        teacher.resetPasswordExpire = undefined;
    
        await teacher.save({ validateBeforeSave: false });
    
        return next(new ErrorResponse('Email could not be sent', 500));
        }
  });
  
  // @desc      Reset password
  // @route     PUT /api/v1/teacher/resetpassword/:resettoken
  // @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');
  
    const teacher = await Teacher.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
  
    if (!teacher) {
      return next(new ErrorResponse('Invalid token', 400));
    }
  
    // Set new password
    teacher.password = req.body.password;
    teacher.resetPasswordToken = undefined;
    teacher.resetPasswordExpire = undefined;

    await teacher.save();
  
    res.status(200).json({
        success: true,
      });
  });
  
  // @desc      Get current logged in teacher
  // @route     GET /api/v1/teacher/me
  // @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    // teacher is already available in req due to the protect middleware
    const teacher = req.teacher;
  
    res.status(200).json({
      success: true,
      data: teacher
    });
  });
  
  // @desc      Update teacher details
  // @route     PUT /api/v1/teacher/updatedetails
  // @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email
    };
  
    const teacher = await Teacher.findByIdAndUpdate(req.teacher.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });
  
    if (!teacher) {
      return next(new ErrorResponse('There is no teacher with that id', 404));
    }
  
    res.status(200).json({
      success: true,
      data: teacher
    });
  });

  getMyStudents = async (teacherid) => {
    const connections = await Connection.find(
      {
        teacher: teacherid,
        studentAns: 'Accepted'
      }).select('student');

    //console.log(students);
    var students = connections.map(c => c.student.toString());
    //console.log(students)

    //console.log(students);
    var result= [];
    await Student.find({'_id': students}, function(err, docs){ 
        if(err)
        {
            console.log(err.message)
            return next(new ErrorResponse(err, 400));
        }
        else{
            result.push(docs); 
        }
    }).select('name surname email');
    return result;
  };  