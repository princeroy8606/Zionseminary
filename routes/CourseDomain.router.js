const express = require('express');
const router = express.Router();
const Course = require('../models/CourseDomain.model');



// Create a new course
router.post('/', async (req, res) => {
    try {
        const { domain, packages } = req.body;

        const newCourse = new Course({
            domain,
            packages
        });

        await newCourse.save();
        res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a specific course by ID 
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a course by ID 
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { domain, packages } = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { domain, packages },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a course by ID (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCourse = await Course.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json({ message: 'Course deleted successfully', course: deletedCourse });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
