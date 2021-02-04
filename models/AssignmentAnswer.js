const mongoose = require('mongoose');

const AssignmentAnswerSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Assignment'
    },
    student: {
        type: mongoose.Schema.ObjectId,
        required: 'Student'
    },
    answerFileURL: {
        type: String,
        required: [true, 'Insert a file link']
    },
    mark: {
        type: String,
        required: true
    },
    markDescription: {
        type: String,
        required: false
    },
    checked: Boolean,
    createdAt: {
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model('AssignmentAnswer', AssignmentAnswerSchema);