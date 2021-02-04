const Connection = require('../models/Connection')
const Teacher = require('../models/Teacher')
const Student = require('../models/Student')
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
ObjectID = require('mongodb').ObjectID

// @desc        create Connection
// @route       POST api/v1/connections
// @access      Private Teacher
exports.createConnection = asyncHandler(async (req, res, next) => {
    const teacher = await Teacher.findById(req.body.teacher);
  
    if (!teacher) {
      return next(new ErrorResponse('An error occured when creating connection!', 400));
    }
    
    const student = await Student.findById(req.body.student);
  
    if (!student) {
      return next(new ErrorResponse('An error occured when creating connection!', 400));
    }

    const connection = await Connection.create(req.body);

    res
      .status(201)
      .json({ success: true, data: connection});
});

// @desc        student answer connection request
// @route       POST api/v1/connections
// @access      Private Student
exports.studentAnswerConnectionRequest = asyncHandler(async (req, res, next) => {
    if(String(req.body.studentAns) == 'Accepted'){
        //accept
        const connection = await Connection.findByIdAndUpdate(req.params.id,{
            studentAns: 'Accepted'
        });
        if(!connection)
        {
            return next(new ErrorResponse('An error occured when accepting request!', 400));
        }

        const teacher = await Teacher.findById(connection.teacher);
        const student = await Student.findById(connection.student);

        teacher.students.push(connection);
        student.teachers.push(connection);
        teacher.save();
        student.save();

        res
            .status(200)
            .json({ success: true});
    }
    else {
        // delete connection rejected
        const connection = await Connection.findByIdAndDelete(req.params.id);
        if(!connection)
        {
            return next(new ErrorResponse('An error occured when deleting request!', 400));
        }

        res
            .status(200)
            .json({ success: false});
    }
});

// @desc        Delete Connection
// @route       DELETE api/v1/connection/:id
// @access      Private
exports.deleteConnection = asyncHandler(async (req, res, next) => {
    const connection = await Connection.findById(req.params.id);

    if(!connection)
    {
        return next(new ErrorResponse('An error occured when deleting request!', 400));
    }

    const teacher = await Teacher.findById(connection.teacher);
    const student = await Student.findById(connection.student);

    teacher.students.pull(connection);
    student.teachers.pull(connection);
    teacher.save();
    student.save();
    
    await Connection.findByIdAndDelete(req.params.id);

    res
        .status(200)
        .json({ success: true});
});

// @desc        Get Teachers Students
// @route       GET api/v1/connection/GetMyStudents/:id
// @access      Private
exports.GetMyStudents = asyncHandler(async (req, res, next) => {
    const students = await Connection.find({teacher: req.params.id}).select('student');
    //const connections = Teacher.findById(req.params.id).select('students');

    const studentIDs = students.map(ObjectId);

    const result = Student.find({ _id: { $in: studentIDs } }).select("name, surname");

    res
        .status(200)
        .json({ success: true, count: result.count, data: result});
});

// @desc        Get Students Teachers
// @route       GET api/v1/connection/GetMyTeachers/:id
// @access      Private
exports.GetMyTeachers = asyncHandler(async (req, res, next) => {
    const teachers = await Connection.find({student: req.params.id}).select('teacher');

    const teacherIDs = teachers.map(ObjectId);

    const result = Teacher.find({ _id: { $in: teacherIDs } }).select("name surname");

    res
        .status(200)
        .json({ success: true,  count: result.count, data: result});
});