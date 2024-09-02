const express = require('express');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const Course = require('../models/CourseDomain.model');

const { upload, encodeBase64 } = require('../middleware/multer');

const router = express.Router();

// Create a new user
router.post('/', upload.fields([
    { name: 'signatureFile', maxCount: 1 },
    { name: 'photoFile', maxCount: 1 },
    { name: 'educationCertificateFile', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            firstName, lastName, mobile, email, maritalStatus, dob, gender,
            applyingFor, educationalQualification, theologicalQualification,
            presentAddress, ministryExperience, salvationExperience,
            username, password
        } = req.body;

        // Fetch course packages for a domain
        const course = await Course.findOne({ domain: applyingFor });
        if (!course) {
            return res.status(404).json({ error: `Course domain '${applyingFor}' not found in the database.` });
        }

        const newUser = new User({
            firstName,
            lastName,
            mobile,
            email,
            maritalStatus,
            dob,
            gender,
            applyingFor,
            packages: course.packages,
            educationalQualification,
            theologicalQualification,
            presentAddress,
            ministryExperience,
            salvationExperience,
            signatureFile: encodeBase64(req.files['signatureFile'][0].buffer),
            photoFile: encodeBase64(req.files['photoFile'][0].buffer),
            educationCertificateFile: encodeBase64(req.files['educationCertificateFile'][0].buffer),
            username,
            password
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Handle course purchase
router.post('/:userId/course', async (req, res) => {
  try {
      const { userId } = req.params;
      const { paidAmount } = req.body;

      
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      
      const course = await Course.findOne({ domain: user.applyingFor });
      if (!course) {
          return res.status(404).json({ error: 'Course not found' });
      }

      
      user.coursePurchased.push({
         
          courseDomain: course.domain,
          courseId: course._id,
          packages: course.packages,
          paidAmount,
          isPurchased: true,
      });

      await user.save();
      res.status(200).json({ message: 'Course purchased successfully', user });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


//Read/Get a user by ID
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a user by ID
router.put('/:userId', upload.fields([
    { name: 'signatureFile', maxCount: 1 },
    { name: 'photoFile', maxCount: 1 },
    { name: 'educationCertificateFile', maxCount: 1 }
]), async (req, res) => {
    try {
        const updates = req.body;

        if (req.files['signatureFile']) {
            updates.signatureFile = encodeBase64(req.files['signatureFile'][0].buffer);
        }
        if (req.files['photoFile']) {
            updates.photoFile = encodeBase64(req.files['photoFile'][0].buffer);
        }
        if (req.files['educationCertificateFile']) {
            updates.educationCertificateFile = encodeBase64(req.files['educationCertificateFile'][0].buffer);
        }

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const user = await User.findByIdAndUpdate(req.params.userId, updates, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a user by ID
router.delete('/:userId', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// List all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all course purchases for a user 
router.get('/:userId/courses', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ coursePurchased: user.coursePurchased });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a specific course purchase for a user 
router.get('/:userId/course/:courseId', async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const course = user.coursePurchased.find(c => c.courseId.toString() === courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course purchase not found' });
        }

        res.status(200).json({ course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a course purchase
router.put('/:userId/course/:courseId', async (req, res) => {
    try {
        const { userId, courseId } = req.params;
        const { paidAmount, packages } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const course = user.coursePurchased.find(c => c.courseId.toString() === courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course purchase not found' });
        }

        if (paidAmount) course.paidAmount = paidAmount;
        if (packages) course.packages = packages;

        await user.save();
        res.status(200).json({ message: 'Course purchase updated successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a course purchase 
router.delete('/:userId/course/:courseId', async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const courseIndex = user.coursePurchased.findIndex(c => c.courseId.toString() === courseId);
        if (courseIndex === -1) {
            return res.status(404).json({ error: 'Course purchase not found' });
        }

        user.coursePurchased.splice(courseIndex, 1);

        await user.save();
        res.status(200).json({ message: 'Course purchase deleted successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
