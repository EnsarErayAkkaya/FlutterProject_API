const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subject'
    },
    title: {
        type: String,
        required: [true, "Please add a title"],
    },
    description: {
        type: String,
        required: [true, "Please explain assignment"]
    },
    fileId: {
        type: String,
        required: [false, 'Insert a file link']
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: () => new Date(+new Date() + 60*60*1000)
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

  var minuteFromNow = function(){
    var timeObject = new Date();
    timeObject.setTime(timeObject.getTime() + 1000 * 60);
    return timeObject;
};
module.exports = mongoose.model('Assignment', AssignmentSchema);