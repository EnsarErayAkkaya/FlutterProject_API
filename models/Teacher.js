const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const TeacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    surname: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 4,
        select: false
    },
    students: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Connection'
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Encrypt password using bcrypt
TeacherSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
    console.log('teacher schema pre save');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

  //Reverse populate with virtuals
  TeacherSchema.virtual('subjects', {
    ref: 'Subject',
    localField: '_id',
    foreignField: 'teacher',
    justOne: false
  });

  // Match user entered password to hashed password in database
  TeacherSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  // Generate and hash password token
  TeacherSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
  
    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; //10 minutes
  
    return resetToken;
  };

module.exports = mongoose.model('Teacher', TeacherSchema);
