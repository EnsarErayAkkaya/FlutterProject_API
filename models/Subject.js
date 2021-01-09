const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    teacher: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    students: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model('Subject', SubjectSchema);