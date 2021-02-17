const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    teacher: {
        type: mongoose.Schema.ObjectId,
        ref: 'Teacher',
        required: true
    },
    students: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Student'
        }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);
//Reverse populate with virtuals
SubjectSchema.virtual('assignments', {
    ref: 'Assignment',
    localField: '_id',
    foreignField: 'subject',
    justOne: false
  });
  /*SubjectSchema.virtual('students', {
    ref: 'Student',
    localField: 'students',
    foreignField: '_id',
    justOne: false
  });*/

  //Cascade delete projects when a user deleted
  SubjectSchema.pre('remove', async function (next) {
    await this.model('Assignment').deleteMany({ subject: this._id });
    next();
  });

module.exports = mongoose.model('Subject', SubjectSchema);