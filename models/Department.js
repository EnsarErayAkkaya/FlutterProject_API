const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    subjects:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Subject'
        }
    ],
    faculty: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Faculty'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model('Department', DepartmentSchema);