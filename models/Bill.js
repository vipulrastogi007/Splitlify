const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    total: { type: Number, required: true },
    items: [{
        name: String,
        price: Number,
        qty: Number
    }],
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    splitAmong: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    perPerson: Number,
    status: { type: String, enum: ['pending', 'settled'], default: 'pending' },
    category: String,
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // The owner of this bill record
});

module.exports = mongoose.model('Bill', BillSchema);
