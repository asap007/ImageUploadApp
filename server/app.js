// server/app.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middleware/errors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2; 

// Load env vars
dotenv.config();

// ---> Configure Cloudinary <---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Use https
});
console.log('Cloudinary configured.'); // Confirmation log

const app = express();

// Enable CORS
app.use(cors({
    origin: 'https://image-vault-ten.vercel.app/', // Keep your frontend origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Handle file uploads (still needed to receive the file)
app.use(fileUpload({
    useTempFiles: true, // Use temporary files for Cloudinary upload (optional, can upload buffer too)
    tempFileDir: '/tmp/' // Optional: specify temp dir if needed and permissions allow
}));

// Set body parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Import all routes
const auth = require('./routes/auth');
const folders = require('./routes/folders');
const images = require('./routes/images');

app.use('/api/v1/auth', auth);
app.use('/api/v1/folders', folders);
app.use('/api/v1/images', images);

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;