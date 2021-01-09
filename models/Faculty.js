const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    departments:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Department'
        }
    ],
    university: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'University'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model('Faculty', FacultySchema);