const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bcrypt = require('bcryptjs');



const CoursePurchasedSchema = new mongoose.Schema({
  
  courseDomain: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  packages: [{ type: String, required: true }],
  paidAmount: { type: Number, required: true },
  isPurchased: { type: Boolean, required: true, default: false },
});

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    maritalStatus: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    applyingFor: { type: String, required: true },
    packages: [{ type: String, required: true }],
    educationalQualification: { type: String, required: true },
    theologicalQualification: { type: String, required: true },
    presentAddress: { type: String, required: true },
    ministryExperience: { type: String, required: true },
    salvationExperience: { type: String, required: true },
    signatureFile: { type: String, required: true },  // base64 encoded string
    photoFile: { type: String, required: true },      // base64 encoded string
    educationCertificateFile: { type: String, required: true },  // base64 encoded string
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    coursePurchased: [CoursePurchasedSchema],
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
