const express = require('express');
const {
    getFolders,
    getFolder,
    createFolder,
    updateFolder,
    deleteFolder
} = require('../controllers/folders');

// ---> ADD THIS IMPORT <---
const { getImagesByFolder } = require('../controllers/images'); // Import the controller

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, getFolders)
    .post(protect, createFolder);

router.route('/:id')
    .get(protect, getFolder)
    .put(protect, updateFolder)
    .delete(protect, deleteFolder);

router.route('/:folderId/images')
    .get(protect, getImagesByFolder);

module.exports = router;