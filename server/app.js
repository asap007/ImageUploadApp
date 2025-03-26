const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middleware/errors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Handle file uploads
app.use(fileUpload());

// Set body parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

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