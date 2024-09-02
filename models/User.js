const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    applyingFor: { type: String, required: true },
    packages: [{ type: String }]  // Add this field to store course packages
});


const User = mongoose.model('User1', userSchema);

module.exports = User;
