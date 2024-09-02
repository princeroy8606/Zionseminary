const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage setup
const storage = multer.memoryStorage();

const upload = multer({ storage });

const encodeBase64 = (fileBuffer) => {
    return fileBuffer.toString('base64');
};

module.exports = { upload, encodeBase64 };
