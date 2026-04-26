const mongoose = require('mongoose');

const InstallmentSchema = new mongoose.Schema({
    billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill' },
    title: String,
    totalAmount: Number,
    installmentCount: Number,
    perInstallment: Number,
    paid: { type: Number, default: 0 },
    payments: [{
        date: { type: Date, default: Date.now },
        amount: Number
    }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Installment', InstallmentSchema);
