const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firebaseId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    avatar: String,
    upiId: String,
    settings: {
        darkMode: { type: Boolean, default: false },
        appLock: { type: Boolean, default: false },
        pin: String
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', UserSchema);
