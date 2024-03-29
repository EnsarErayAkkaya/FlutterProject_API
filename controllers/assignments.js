const Assignment = require('../models/Assignment')
const Subject = require('../models/Subject')
const Teacher = require('../models/Teacher')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse');
const {
    getGFS
} = require('../config/db');

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
    const gfs = getGFS();
    const subject = await Subject.findById(req.body.subject);

    console.log('startDate: ' + req.body.startDate);
    console.log('endDate: ' + req.body.endDate);

    if (!subject) {
        gfs.remove({ filename: req.file.filename, root: 'uploads' }, (err, gridStore) => {
            if (err) {
                //return next(new ErrorResponse('error when deleting old file!', 400));
            }
        });
        return next(new ErrorResponse('An error occured when creating Assignment!', 400));
    }
    console.log('file: ' + req.file.filename);
    req.body.file = req.file.filename; 

    const assignment = await Assignment.create(req.body);

    res
        .status(201)
        .json({ success: true, data: assignment });
});

// @desc        update assignments
// @route       PUT api/v1/assignment
// @access      Private Admin
exports.updateAssignment = asyncHandler(async (req, res, next) => {
    const gfs = getGFS();
    console.log('Assignment Update');
    if (req.file != null) {
        console.log('Have a new file');
        req.body.file = req.file.filename;
    }

    const assignmentOld = await Assignment.findById(req.params.id);
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!assignment) {
        if (req.file != null) {
            console.log('Couldnt update assignment deleting new uploaded file');
            gfs.remove({ filename: req.file.filename, root: 'uploads' }, (err, gridStore) => {
                if (err) {
                    return next(new ErrorResponse('error when deleting new file!', 400));
                }
            });
        }
        return next(new ErrorResponse('Couldnt update assignment!', 400));
    }

    if (req.file != null) {
        if (assignmentOld.file != null && assignmentOld.file != '') {
            console.log('Updated assignment deleting old file');
            gfs.remove({ filename: assignmentOld.file, root: 'uploads' }, (err, gridStore) => {
                if (err) {
                    return next(new ErrorResponse('error when deleting old file!', 400));
                }
            });
        }
    }

    res
        .status(200)
        .json({ success: true, data: assignment });
});

// @desc        Delete Assignment
// @route       DELETE api/v1/assignment/:id
// @access      Private Admin
exports.deleteAssignment = asyncHandler(async (req, res, next) => {
    const gfs = getGFS();
    //console.log('here: ' + gfs);
    const teacher = await Teacher.findById(req.body.teacher);

    if (!teacher) {
        return next(new ErrorResponse('could not find teacher!', 400));
    }

    const subject = await Subject.findById(req.body.subject);

    //console.log(String(subject['teacher']));
    if ((String(teacher['_id']) != String(subject['teacher']))) {
        return next(new ErrorResponse('You cant delete this assignment!', 400));
    }

    const assignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!assignment) {
        return next(
            new ErrorResponse('An error occured when deleting Assignment!', 400)
        );
    }

    gfs.remove({ filename: assignment.file, root: 'uploads' }, (err, gridStore) => {
        if (err) {
            return next(new ErrorResponse('error when deleting old file!', 400));
        }
    });

    res.status(200).json({ success: true, data: {} });
});

// @desc        Download Assignment file
// @route       GET api/v1/assignment/downlad/:id
// @access      Private
exports.downloadAssignment = asyncHandler(async (req, res, next) => {
    const gfs = getGFS();
    console.log("download assignment with filename: " + req.params.filename);

    gfs.findOne({ filename: req.params.filename, root: 'uploads' }, function (err, file) {
        console.log("file found");
        if (err) {
            return res.status(400).send(err);
        }
        else if (!file) {
            console.log('Error on the database looking for the file.')
            return res.status(404).send('Error on the database looking for the file.');
        }
        console.log("continue downloading");
        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');

        var readstream = gfs.createReadStream({
            filename: req.params.filename,
            root: 'uploads'
        });

        readstream.on("error", function (err) {
            res.end();
        });
        console.log("pipe");
        readstream.pipe(res);
    });
});