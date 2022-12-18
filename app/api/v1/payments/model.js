const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, 'tipe pembayaran harus diisi'],
        minlength: 3,
        maxlength: 50
    },
    image: {
        type: mongoose.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    organizer: {
        type: mongoose.Types.ObjectId,
        ref: 'Organizer',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Payment', PaymentSchema);