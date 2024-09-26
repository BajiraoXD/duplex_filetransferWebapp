const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb+srv://nilaysharma2002:Nilay%@medi-mantra.ketkjri.mongodb.net/login-tut");
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;



// Define file schema and model
const fileSchema = new mongoose.Schema({
    filename: String,
    path: String
});
const File = mongoose.model('File', fileSchema);
app.get('/', (req, res) => {
    res.redirect('/user-report');
});
// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload'); // Store uploads in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Keep original filename
    }
});
const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    const { filename, path } = req.file;
    const newFile = new File({ filename, path });
    await newFile.save();
    res.redirect('/user-report');
});

// Download endpoint
app.get('/download/:filename', async (req, res) => {
    const { filename } = req.params;
    const file = await File.findOne({ filename });
    if (!file) {
        return res.status(404).send('File not found');
    }
    res.download(file.path); // Download file
});

// Route for user-report page
app.get('/user-report', (req, res) => {
    res.render('user-report.ejs');
});

// Route for doctor-report page
app.get('/doctor-report', async (req, res) => {
    const files = await File.find({});
    res.render('doctor-report.ejs', { files });
});

// Set the view engine to render EJS templates
app.set('view engine', 'ejs');

// Start the server
const port = 8000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
