const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    faculties: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Faculty'
        }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model('University', UniversitySchema);