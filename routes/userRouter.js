const express = require('express');
const User = require('../models/User');
const Course = require('../models/CourseDomain.model');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, username, dob, email, applyingFor } = req.body;

        // Fetch course packages based on the selected course domain
        const course = await Course.findOne({ domain: applyingFor });
        if (!course) {
            return res.status(404).json({ error: `Course domain '${applyingFor}' not found in the database.` });
        }

        const newUser = new User({
            name,
            username,
            dob,
            email,
            applyingFor,
            packages: course.packages  // Save the packages in the user model
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
