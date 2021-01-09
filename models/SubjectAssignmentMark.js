const mongoose = require('mongoose');

const SubjectAssignmentMarkSchema = new mongoose.Schema({
    subjectAssignment: {
        type: mongoose.Schema.ObjectId,
        ref: 'SubjectAssignment'
    },
    student: {
        type: mongoose.Schema.ObjectId,
        required: 'Student'
    },
    mark: {
        type: String,
        required: [true, 'Please enter a mark!']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model('SubjectAssignmentMark', SubjectAssignmentMarkSchema);