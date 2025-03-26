const express = require('express');
const { 
    getFolders,
    getFolder,
    createFolder,
    updateFolder,
    deleteFolder
} = require('../controllers/folders');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, getFolders)
    .post(protect, createFolder);

router.route('/:id')
    .get(protect, getFolder)
    .put(protect, updateFolder)
    .delete(protect, deleteFolder);

module.exports = router;