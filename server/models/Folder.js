const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter folder name'],
        trim: true,
        maxlength: [100, 'Folder name cannot exceed 100 characters']
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Folder', folderSchema);