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
    answerFile: {
        type: String,
        required: [true, 'Insert a filename']
    },
    mark: {
        type: Number,
        default: 0,
        required: true
    },
    checked: {
        type: Boolean,
        default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model('AssignmentAnswer', AssignmentAnswerSchema);