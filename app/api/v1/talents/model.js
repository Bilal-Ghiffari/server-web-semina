const mongoose = require('mongoose');
const {model, Schema} = mongoose;

let talentShema = Schema({
    name: {
        type: String,
        required: [true, 'nama harus diisi']
    },
    role: {
        type: String,
        default: '-'
    },
    // untuk membuat relasi pada mongodb kita perlu membuat types ObjectId dan perlu ada ref ke model yg dituju
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

module.exports = model('Talent', talentShema);