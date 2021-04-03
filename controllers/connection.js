const Connection = require('../models/Connection')
const Teacher = require('../models/Teacher')
const Student = require('../models/Student')
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
var mongoose = require('mongoose');

// @desc        create Connection
// @route       POST api/v1/connections
// @access      Private Teacher
exports.createConnection = asyncHandler(async (req, res, next) => {
    const teacher = await Teacher.findById(req.body.teacher);
  
    if (!teacher) {
      return next(new ErrorResponse('Teacher not found! An error occured when creating connection!', 400));
    }
    
    const student = await Student.findById(req.body.student);
  
    if (!student) {
      return next(new ErrorResponse('Student not found! An error occured when creating connection!', 400));
    }

    const conn = await Connection.findOne(
        {
            teacher: req.body.teacher,
            student: req.body.student,
        }
    );

    if(conn)
    {
        return next(new ErrorResponse('Connection already created', 400));
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

        const connections = await Connection.find({
            student : student._id
        })
        .select('teacher studentAns')
        .populate({
            path: 'teacher',
            select: 'name surname email',
        });

        res
            .status(200)
            .json({ success: true, data: connections});
    }
    else {
        // delete connection rejected
        const connection = await Connection.findByIdAndDelete(req.params.id);
        if(!connection)
        {
            return next(new ErrorResponse('An error occured when deleting request!', 400));
        }

        const connections = await Connection.find({
                student : connection.student
        })
        .select('teacher studentAns')
        .populate({
            path: 'teacher',
            select: 'name surname email',
        });

        res
            .status(200)
            .json({ success: true, data: connections});
    }
});

// @desc        Delete Connection
// @route       DELETE api/v1/connection/:id
// @access      Private
exports.deleteConnection = asyncHandler(async (req, res, next) => {
    const connection = await Connection.findOne(
        {
            teacher: req.body.teacher,
            student: req.body.student,
        }
    );
    console.log(connection);

    if(!connection)
    {
        return next(new ErrorResponse('An error occured when deleting request!', 400));
    }

    const teacher = await Teacher.findById(connection.teacher);
    const student = await Student.findById(connection.student);

    
    console.log(teacher);
    console.log(student);

    teacher.students.pull(connection);
    student.teachers.pull(connection);
    teacher.save();
    student.save();
    
    var res = await Connection.findByIdAndDelete(connection._id);
    if(!res)
    {
        return next(new ErrorResponse('An error occured when deleting request!', 400));
    }
    console.log('connection deleted');

    res
        .status(200)
        .json({ success: true});
});

// @desc        Get Teachers Students
// @route       GET api/v1/connection/GetStudents/:id
// @access      Private
exports.GetMyStudents = asyncHandler(async (req, res, next) => {
    /*const connections = await Connection.find({teacher: req.params.id}).select('student');

    var students = connections.map(c => c.student.toString());
    //console.log(students);
    var result = [];
    await Student.find({'_id': students}, function(err, docs){ 
        if(err)
        {
            console.log(err.message)
            return next(new ErrorResponse(err, 400));
        }
        else{
            result.push(docs); 
        }
    }).select('name surname email');*/

    const connections = await Connection.find({
        teacher : req.params.id
      })
        .select('student')
        .populate({
          path: 'student',
          select: 'name surname email',
        });
    let students = [];
    connections.map((c) => {
        students.push(c.student);
    });

    res
        .status(200)
        .json({ success: true, data: students});
});

// @desc        Get Students Teachers
// @route       GET api/v1/connection/GetMyTeachers/:id
// @access      Private
exports.GetMyTeachers = asyncHandler(async (req, res, next) => {
    console.log("fetch connections");
    const connections = await Connection.find({
        student : req.params.id
      })
        .select('teacher studentAns')
        .populate({
          path: 'teacher',
          select: 'name surname email',
        });

    res
        .status(200)
        .json({ success: true, data: connections});
});

/*
// @desc        Get Students Teachers
// @route       GET api/v1/connection/myConnectionRequests/:id
// @access      Private
exports.GetMyConnectionRequests = asyncHandler(async (req, res, next) => {
    const connections = await Connection.find(
        {
            student: req.params.id,
            studentAns: ''
        }
    ).select('teacher');
    if(!connections){
        return next(new ErrorResponse('An error occured when getting connections!', 400));
    }

    res
        .status(200)
        .json({ success: true,  count: connections.count, data: connections});
});*/