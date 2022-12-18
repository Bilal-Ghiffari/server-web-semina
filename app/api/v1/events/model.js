const mongoose = require('mongoose');

const tiketCategoriesSchema =  new mongoose.Schema({
    type: {
        type: String,
        required: [true, 'tipe tiket harus diisi']
    },
    price: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    statusTicketCategories: {
        type: Boolean,
        enum: [true, false],
        default: true
    },
    expired: {
        type: Date
    }

});

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        require: [true, 'judul harus diisi'],
        minlength: 3,
        maxlength: 50
    },
    date: {
        type: Date,
        required: [true, 'tanggal dan waktu harus diisi']
    },
    about: {
        type: String
    },
    tagline: {
        type: String,
        required: [true, 'tagline harus diisi']
    },
    keypoint: {
        type: String,
    },
    venueName: {
        type: String,
        required: [true, 'tempat acara harus diisi']
    },
    statusEvent: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Draft'
    },
    tickets: {
        type: [tiketCategoriesSchema],
        required: true
    },
    image: {
        type: mongoose.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    talent: {
        type: mongoose.Types.ObjectId,
        ref: 'Talent',
        required: true
    },
    organizer: {
        type: mongoose.Types.ObjectId,
        ref: 'Organizer',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Event', EventSchema);
