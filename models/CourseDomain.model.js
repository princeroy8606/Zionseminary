

//const CourseDomain = mongoose.model('CourseDomain', courseDomainSchema);



const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    domain: { type: String, required: true, unique: true },
    packages: [{ type: String, required: true }]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
