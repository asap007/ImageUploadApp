const Image = require('../models/Image');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const fs = require('fs');

// @desc    Get all images
// @route   GET /api/v1/images
// @route   GET /api/v1/folders/:folderId/images
// @access  Private
exports.getImages = async (req, res, next) => {
    try {
        let query;

        if (req.params.folderId) {
            query = Image.find({ 
                folder: req.params.folderId,
                user: req.user.id 
            });
        } else {
            query = Image.find({ user: req.user.id });
        }

        const images = await query;

        res.status(200).json({
            success: true,
            count: images.length,
            data: images
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single image
// @route   GET /api/v1/images/:id
// @access  Private
exports.getImage = async (req, res, next) => {
    try {
        const image = await Image.findOne({ _id: req.params.id, user: req.user.id });

        if (!image) {
            return next(
                new ErrorResponse(`Image not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: image
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Upload image
// @route   POST /api/v1/images
// @access  Private
exports.uploadImage = async (req, res, next) => {
    try {
        if (!req.files?.file) {
            return next(new ErrorResponse('Please upload a file', 400));
        }

        const file = req.files.file;
        const uploadPath = path.join(__dirname, '../uploads');

        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        // Generate unique filename
        const filename = `image_${Date.now()}${path.extname(file.name)}`;
        const filePath = path.join(uploadPath, filename);

        await file.mv(filePath);

        const image = await Image.create({
            name: req.body.name || path.parse(file.name).name,
            url: `/uploads/${filename}`,
            folder: req.body.folder || null,
            user: req.user.id
        });

        res.status(200).json({
            success: true,
            data: image
        });
    } catch (err) {
        console.error('Upload error:', err);
        next(new ErrorResponse('File upload failed', 500));
    }
};

// @desc    Update image
// @route   PUT /api/v1/images/:id
// @access  Private
exports.updateImage = async (req, res, next) => {
    try {
        let image = await Image.findById(req.params.id);

        if (!image) {
            return next(
                new ErrorResponse(`Image not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is image owner
        if (image.user.toString() !== req.user.id) {
            return next(
                new ErrorResponse(`User not authorized to update this image`, 401)
            );
        }

        image = await Image.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: image
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete image
// @route   DELETE /api/v1/images/:id
// @access  Private
exports.deleteImage = async (req, res, next) => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image) {
            return next(
                new ErrorResponse(`Image not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is image owner
        if (image.user.toString() !== req.user.id) {
            return next(
                new ErrorResponse(`User not authorized to delete this image`, 401)
            );
        }

        // Delete file from uploads folder
        if (fs.existsSync(`.${image.url}`)) {
            fs.unlinkSync(`.${image.url}`);
        }

        await image.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Search images
// @route   GET /api/v1/images/search?q=query
// @access  Private
exports.searchImages = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q) {
            return next(new ErrorResponse(`Please provide a search query`, 400));
        }

        const images = await Image.find({
            user: req.user.id,
            name: { $regex: q, $options: 'i' }
        });

        res.status(200).json({
            success: true,
            count: images.length,
            data: images
        });
    } catch (err) {
        next(err);
    }
};

exports.getImagesByFolder = async (req, res, next) => {
    try {
        const images = await Image.find({
            folder: req.params.folderId,
            user: req.user.id
        });

        res.status(200).json({
            success: true,
            count: images.length,
            data: images
        });
    } catch (err) {
        next(err);
    }
};