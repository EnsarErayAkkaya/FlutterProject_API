const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subject'
    },
    description: {
        type: String,
        required: [true, "Please explain assignment"]
    },
    fileURL: {
        type: String,
        required: [true, 'Insert a file link']
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

//Reverse populate with virtuals
AssignmentSchema.virtual('assignmentMarks', {
    ref: 'AssignmentMark',
    localField: '_id',
    foreignField: 'assignment',
    justOne: false
  });

  //Cascade delete projects when a user deleted
  AssignmentSchema.pre('remove', async function (next) {
    await this.model('AssignmentAnswer').deleteMany({ assignment: this._id });
    next();
  });

module.exports = mongoose.model('Assignment', AssignmentSchema);