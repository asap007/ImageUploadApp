const express = require('express');
const {
    getImages,
    getImage,
    uploadImage,
    updateImage,
    deleteImage,
    searchImages,
} = require('../controllers/images');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, getImages)
    .post(protect, uploadImage);

router.route('/search')
    .get(protect, searchImages);

router.route('/:id')
    .get(protect, getImage)
    .put(protect, updateImage)
    .delete(protect, deleteImage);

module.exports = router;