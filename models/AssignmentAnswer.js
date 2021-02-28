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
        type: mongoose.Schema.ObjectId,
        required: [true, 'Insert a file id']
    },
    mark: {
        type: Number,
        default: 0,
        required: true
    },
    markDescription: {
        type: String,
        required: false
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