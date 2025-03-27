const Image = require('../models/Image');
const Folder = require('../models/Folder'); // Needed potentially for folder validation
const ErrorResponse = require('../utils/errorResponse');
const cloudinary = require('cloudinary').v2

// @desc    Get all images
// @route   GET /api/v1/images
// @route   GET /api/v1/folders/:folderId/images
// @access  Private
exports.getImages = async (req, res, next) => {
    try {
        let query;
        const recentLimit = 8; // How many recent images to show on home page

        // Note: The route GET /api/v1/folders/:folderId/images is likely handled by folders router now.
        // This controller function might now primarily serve GET /api/v1/images

        // If fetching general images (likely for the home page or an 'all images' view)
        query = Image.find({ user: req.user.id })
                     .sort({ createdAt: -1 }) // Sort by newest first
                     .limit(recentLimit);     // Limit to the N most recent

        const images = await query;

        res.status(200).json({
            success: true,
            count: images.length, // This will be max 'recentLimit'
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
        const userId = req.user.id;
        const folderId = req.body.folder || null;
        const imageName = req.body.name || file.name; // Use provided name or file name

        // Optional: Validate file type if needed (Cloudinary often handles this)
        // if (!file.mimetype.startsWith('image')) {
        //     return next(new ErrorResponse('Please upload an image file', 400));
        // }

        // Optional: Validate folder exists if folderId is provided
        if (folderId) {
            const folderExists = await Folder.findOne({ _id: folderId, user: userId });
            if (!folderExists) {
                return next(new ErrorResponse(`Folder not found with id ${folderId}`, 404));
            }
        }

        // ---> Upload to Cloudinary <---
        console.log(`Uploading file: ${file.name} to Cloudinary...`);
        const result = await cloudinary.uploader.upload(file.tempFilePath, { // Use tempFilePath from express-fileupload
            folder: `imagevault/${userId}`, // Organize by user ID in Cloudinary (optional)
            // public_id: `some_unique_name`, // Optional: Let Cloudinary generate
            resource_type: "auto", // Detect image, video, etc.
            // You can add tags, context, transformations here if needed
        });
        console.log('Cloudinary upload successful:', result.secure_url);

        // ---> Create Database Record <---
        const image = await Image.create({
            name: imageName,
            url: result.secure_url, // Store the Cloudinary URL
            cloudinaryPublicId: result.public_id, // Store the public_id for deletion
            folder: folderId,
            user: userId
        });

        res.status(200).json({
            success: true,
            data: image
        });

    } catch (err) {
        console.error('Upload error:', err);
        // Provide more specific error if possible
        if (err.http_code && err.message) {
             next(new ErrorResponse(`Cloudinary Error: ${err.message}`, err.http_code));
        } else {
             next(new ErrorResponse('File upload failed', 500));
        }
    }
    // Note: express-fileupload should automatically clean up temp files
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

        // ---> Delete from Cloudinary <---
        if (image.cloudinaryPublicId) {
            console.log(`Deleting image from Cloudinary: ${image.cloudinaryPublicId}`);
            try {
                const deleteResult = await cloudinary.uploader.destroy(image.cloudinaryPublicId);
                console.log('Cloudinary deletion result:', deleteResult);
                 // Check result.result for 'ok' or 'not found'
                if (deleteResult.result !== 'ok' && deleteResult.result !== 'not found') {
                     // Log error but potentially continue to delete from DB anyway
                     console.warn(`Cloudinary deletion failed or status unknown for ${image.cloudinaryPublicId}:`, deleteResult.result);
                }
            } catch (cloudinaryErr) {
                console.error(`Error deleting image ${image.cloudinaryPublicId} from Cloudinary:`, cloudinaryErr);
                // Decide if you want to stop the process or just log the error
                // For robustness, we might continue to remove the DB record even if Cloudinary fails
            }
        } else {
             console.warn(`Image ${image._id} missing cloudinaryPublicId, cannot delete from Cloudinary.`);
        }


        // ---> Delete from Database <---
        await image.deleteOne(); // Use deleteOne() instead of remove()

        res.status(200).json({
            success: true,
            data: {} // Send empty object on successful deletion
        });

    } catch (err) {
         console.error('Error during image deletion process:', err);
        next(err); // Pass to error handler
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
        }).sort({ createdAt: -1 }); // Also good to sort here

        res.status(200).json({
            success: true,
            count: images.length,
            data: images
        });
    } catch (err) {
        next(err);
    }
};