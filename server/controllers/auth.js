const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendTokenResponse = require('../utils/sendTokenResponse');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "Email already in use"
            });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        // Create token
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token
        });
    } catch (err) {
        // Handle duplicate key error specifically
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                error: "Email already in use"
            });
        }
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    try {
        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Create token
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
};