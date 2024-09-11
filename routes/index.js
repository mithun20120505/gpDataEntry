const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Handle Excel file upload
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Read the uploaded Excel file
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);

    // Assuming the data is in the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the sheet data to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Check if the JSON data is empty
    if (jsonData.length === 0) {
        return res.status(400).send('The uploaded file is empty or not formatted correctly.');
    }

    // Process the JSON data and save to the database
    // Assuming 'User' is a Mongoose model
    User.insertMany(jsonData, (err, docs) => {
        if (err) {
            return res.status(500).send('Error saving data to the database.');
        }
        res.status(200).send('Data uploaded successfully!');
    });
});

module.exports = router;
