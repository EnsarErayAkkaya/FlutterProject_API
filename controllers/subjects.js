const Subject = require('../models/Subject')
const Teacher = require('../models/Teacher')
const Student = require('../models/Student')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async')
ObjectID = require('mongodb').ObjectID

// @desc        Get all subjects
// @route       GET api/v1/subject
// @access      Private Admin
exports.getSubjects = asyncHandler(async (req, res, next) => {
    const subjects = await Subject.find();
  
    if (!subjects) {
      return next(new ErrorResponse('There is no subjects on Db !', 400));
    }
  
    res
      .status(200)
      .json({ success: true, count: subjects.length, data: subjects });
});

// @desc        Get teachers subjects
// @route       GET api/v1/subject/teacherSubjects/:id
// @access      Private 
exports.getTeachersSubjects = asyncHandler(async (req, res, next) => {
    const subjects = await Subject.find({teacher: req.params.id});
  
    if (!subjects) {
      return next(new ErrorResponse('There is no subjects on Db !', 400));
    }
  
    res
      .status(200)
      .json({ success: true, count: subjects.length, data: subjects });
});

// @desc        Get subject
// @route       GET api/v1/subject
// @access      Private
exports.getSubject = asyncHandler(async (req, res, next) => {
    const teacher = await Teacher.findById(req.params.id);
  
    if (!teacher) {
      return next(new ErrorResponse('could not find teacher!', 400));
    }

    const subject = await Subject.findById(req.params.id);
    
    if(teacher != subject.teacher)
    {
        return next(new ErrorResponse('You cant get this subject!', 400));
    }
  
    if (!subject) {
      return next(new ErrorResponse('There is no subject with given id!', 400));
    }
  
    res
      .status(200)
      .json({ success: true, data: subject });
});

// @desc        create subjects
// @route       POST api/v1/subject
// @access      Private Admin
exports.createSubject = asyncHandler(async (req, res, next) => {
    const teacher = await Teacher.findById(req.body.teacher);
  
    if (!teacher) {
      return next(new ErrorResponse('An error occured when creating Subject!', 400));
    }

    const subject = await Subject.create(req.body);

    res
      .status(201)
      .json({ success: true, data: subject});
});

// @desc        update subjects
// @route       PUT api/v1/subject
// @access      Private Admin
exports.updateSubject = asyncHandler(async (req, res, next) => {
    const teacher = await Teacher.findById(req.body.teacher);
  
    if (!teacher) {
      return next(new ErrorResponse('could not find teacher!', 400));
    }

    const subjectTeacher = await Subject.findById(req.params.id).select('teacher');
    
    if(teacher != subjectTeacher)
    {
        return next(new ErrorResponse('You cant update this subject!', 400));
    }

    const subject = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    if(!subject){
        return next(new ErrorResponse('Couldnt find given faculty id!', 400));
    }

    res
      .status(200)
      .json({ success: true, data: subject});
});

// @desc        Delete Subject
// @route       DELETE api/v1/subject/:id
// @access      Private Admin
exports.deleteSubject = asyncHandler(async (req, res, next) => {

    const teacher = await Teacher.findById(req.body.teacher);
  
    if (!teacher) {
      return next(new ErrorResponse('could not find teacher!', 400));
    }

    const subjectTeacher = await Subject.findById(req.params.id).select('teacher');
    
    if(teacher != subjectTeacher)
    {
        return next(new ErrorResponse('You cant delete this subject!', 400));
    }
    
    const subject = await Subject.findByIdAndDelete(req.params.id);
  
    if (!subject) {
      return next(
        new ErrorResponse('An error occured when deleting Subject!', 400)
      );
    }
    res.status(200).json({ success: true, data: {} });
});

// @desc        Add Student to Subject
// @route       POST api/v1/subject/addStudent
// @access      Private 
exports.addStudent = asyncHandler(async (req, res, next) => {
    const student = await Student.findById(req.body.student);

    if (!student) {
        return next(
          new ErrorResponse('this student couldnt found!', 400)
        );
    }

    const subject = await Subject.findById(req.body.subject);
  
    if (!subject) {
      return next(
        new ErrorResponse('Couldnt found the Subject!', 400)
      );
    }

    const teacher = await Teacher.findById(req.body.teacher);
  
    if (!teacher) {
      return next(new ErrorResponse('could not find teacher!', 400));
    }

    if(String(teacher['_id']) != String(subject['teacher']))
    {
        return next(new ErrorResponse('You cant add student to this subject!', 400));
    }
    var found = false;
    for (const index in subject.students) {
        if(String(student['_id']) == String(subject.students[index])){
            found = true;
            break;
        }
    };
    if(found) {
        return next(new ErrorResponse('This student Already added!', 400));
    }
    else {
        subject.students.push(student);
        subject.save();

        res.status(200).json({ success: true, data: subject });
    }
});

// @desc        Remove Student from Subject
// @route       POST api/v1/subject/removeStudent
// @access      Private 
exports.removeStudent = asyncHandler(async (req, res, next) => {
    const student = await Student.findById(req.body.student);

    if (!student) {
        return next(
          new ErrorResponse('this student couldnt found!', 400)
        );
    }

    const subject = await Subject.findById(req.body.subject);
  
    if (!subject) {
      return next(
        new ErrorResponse('Couldnt found the Subject!', 400)
      );
    }

    const teacher = await Teacher.findById(req.body.teacher);
  
    if (!teacher) {
      return next(new ErrorResponse('could not find teacher!', 400));
    }

    if(String(teacher['_id']) != String(subject['teacher']))
    {
        return next(new ErrorResponse('You cant remove student from this subject!', 400));
    }
    
    var found = false;
    for (const index in subject.students) {  
        if(String(student['_id']) == String(subject.students[index])){
            found = true;
            break;
        }
    };
    if(!found) {
        return next(new ErrorResponse('This student not exist in this subject!', 400));
    }
    else {
        subject.students.pull(student);
        subject.save();

        res.status(200).json({ success: true, data: subject });
    }
});