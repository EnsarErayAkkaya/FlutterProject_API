const Student = require('../models/Student')
const Connection = require('../models/Connection')
const Teacher = require('../models/Teacher')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc        Get all Students
// @route       GET api/v1/Student
// @access      Private Admin
exports.getStudents = asyncHandler(async (req, res, next) => {
    const students = await Student.find();
  
    if (!students) {
      return next(new ErrorResponse('There is no Student on Db !', 400));
    }
  
    res
      .status(200)
      .json({ success: true, count: students.length, data: students });
});

// @desc        Get all Students by name
// @route       GET api/v1/Student/:name
// @access      Private Admin
exports.getStudentsByName = asyncHandler(async (req, res, next) => {
    //console.log(req.body);
    const regexName = new RegExp(`\\\w*${req.body.name}\\\w*`, 'i');
    const regexSurname = new RegExp(`\\\w*${req.body.surname}\\\w*`, 'i');
    
    const students = await Student.find(
      { name: regexName, surname: regexSurname },
      'name surname email'
    ).exec();
  
    if (!students) {
      return next(new ErrorResponse('There is no Student on Db !', 400));
    }
  
    res
      .status(200)
      .json({ success: true, count: students.length, data: students });
});

// @desc        Get Student
// @route       GET api/v1/Student/:id
// @access      Private Admin
exports.getStudent = asyncHandler(async (req, res, next) => {
    const Student = await Student.findById(req.params.id);
  
    if (!Student) {
      return next(new ErrorResponse('There is no Uni with given id!', 400));
    }
  
    res
      .status(200)
      .json({ success: true, data: Student });
});  

// @desc      Register student
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, surname, email, password, phoneNumber } = req.body;
  
    //Create student
    const student = await Student.create({
      name,
      surname,
      email,
      password
    });
  
    if (!student) {
      return next(new ErrorResponse('Error when creating student', 500));
    }  

    await student.save({ validateBeforeSave: false });
  
    res.status(201).json({ success: true });
  });
  
  // @desc      Login student
  // @route     POST /api/v1/auth/login
  // @access    Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
  
    // Validate emil & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }
  
    // Check for student
    const student = await Student.findOne({
      email
    }).select('+password')
      .populate(
        {
          path: 'subjects',
          select: '_id name teacher',
          populate:{ 
              path: 'assignments',
              select: '_id title description file startDate endDate'
            }
        }
      );
  
    if (!student) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
  
    // Check if password matches
    const isMatch = await student.matchPassword(password);
  
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    var teachers = await Connection.find({
        student : student._id
      })
        .select('teacher studentAns')
        .populate({
          path: 'teacher',
          select: 'name surname email',
        });
        
  
    res.status(200).json({
        success: true,
        data: {
            "_id": student._id,
            "name":student.name,
            "surname":student.surname,
            "email":student.email,
            "subjects":student.subjects,
            "teachers":teachers
        }
      });
  });
  
  // @desc      Forgot password
  // @route     POST /api/v1/auth/forgotpassword
  // @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const student = await Student.findOne({ email: req.body.email });
  
    if (!student) {
      return next(new ErrorResponse('There is no student with that email.', 404));
    }
  
    const resetToken = student.getResetPasswordToken();
  
    await student.save({ validateBeforeSave: false });
  
    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/resetpassword/${resetToken}`;
  
    const message = `Şifrenizi yenilemek için aşağıdaki linke tıklayınız: \n\n ${resetUrl}`;
  
    try {
        await sendEmail({
            email: student.email,
            subject: 'Plume reset password',
            message
        });
        res.status(200).json({ success: true });
        } 
    catch (error) {
        console.log(error);
        student.resetPasswordToken = undefined;
        student.resetPasswordExpire = undefined;
    
        await student.save({ validateBeforeSave: false });
    
        return next(new ErrorResponse('Email could not be sent', 500));
        }
  });
  
  // @desc      Reset password
  // @route     PUT /api/v1/auth/resetpassword/:resettoken
  // @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');
  
    const student = await Student.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
  
    if (!student) {
      return next(new ErrorResponse('Invalid token', 400));
    }
  
    // Set new password
    student.password = req.body.password;
    student.resetPasswordToken = undefined;
    student.resetPasswordExpire = undefined;

    await student.save();
  
    res.status(200).json({
        success: true,
      });
  });
  
  // @desc      Get current logged in student
  // @route     GET /api/v1/auth/me
  // @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    // student is already available in req due to the protect middleware
    const student = req.student;
  
    res.status(200).json({
      success: true,
      data: student
    });
  });
  
  // @desc      Update student details
  // @route     PUT /api/v1/auth/updatedetails
  // @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email
    };
  
    const student = await Student.findByIdAndUpdate(req.student.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });
  
    if (!student) {
      return next(new ErrorResponse('There is no student with that id', 404));
    }
  
    res.status(200).json({
      success: true,
      data: student
    });
  });
  getMyTeachers = async (studentId) => {
    const connections = await Connection.find(
      {
        student: studentId,
      }).select('teacher studentAns');

    //console.log(students);
    var teachers = connections.map(c => c.teacher.toString());
    //console.log(students)

    //console.log(students);
    var result= [];
    await Teacher.find({'_id': teachers}, function(err, docs){ 
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