const Folder = require('../models/Folder');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all folders
// @route   GET /api/v1/folders
// @access  Private
exports.getFolders = async (req, res, next) => {
    try {
        const folders = await Folder.find({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: folders.length,
            data: folders
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single folder
// @route   GET /api/v1/folders/:id
// @access  Private
exports.getFolder = async (req, res, next) => {
    try {
        const folder = await Folder.findOne({ _id: req.params.id, user: req.user.id });

        if (!folder) {
            return next(
                new ErrorResponse(`Folder not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: folder
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create folder
// @route   POST /api/v1/folders
// @access  Private
exports.createFolder = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const folder = await Folder.create(req.body);

        res.status(201).json({
            success: true,
            data: folder
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update folder
// @route   PUT /api/v1/folders/:id
// @access  Private
exports.updateFolder = async (req, res, next) => {
    try {
        let folder = await Folder.findById(req.params.id);

        if (!folder) {
            return next(
                new ErrorResponse(`Folder not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is folder owner
        if (folder.user.toString() !== req.user.id) {
            return next(
                new ErrorResponse(`User not authorized to update this folder`, 401)
            );
        }

        folder = await Folder.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: folder
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete folder
// @route   DELETE /api/v1/folders/:id
// @access  Private
exports.deleteFolder = async (req, res, next) => {
    try {
        const folder = await Folder.findById(req.params.id);

        if (!folder) {
            return next(
                new ErrorResponse(`Folder not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is folder owner
        if (folder.user.toString() !== req.user.id) {
            return next(
                new ErrorResponse(`User not authorized to delete this folder`, 401)
            );
        }

        await folder.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};