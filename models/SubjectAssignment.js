const mongoose = require('mongoose');

const SubjectAssignmentSchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subject'
    },
    description: {
        type: String,
        required: [true, "Please explain assignment"]
    },
    fileURL: {
        type: String
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: (Date.now += (1 * 60 * 60 * 1000)) // add 1 hour
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model('SubjectAssignment', SubjectAssignmentSchema);