const mongoose = require('mongoose');

// Define User schema

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now },
    deletionDate: { type: Date, default: null }
});

const User = mongoose.model('User', userSchema);

module.exports = User;