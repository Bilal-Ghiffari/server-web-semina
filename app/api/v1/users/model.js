const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'nama harus diisi'],
        minlength: 3,
        mixlength: 3,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email harus diisi'],
    },
    password: {
        type: String,
        required: [true, 'password harus diisi'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'organizer', 'owner'],
        default: 'admin'
    },
    organizer: {
        type: mongoose.Types.ObjectId,
        ref: 'Organizer',
        required: true
    }
}, {timestamps: true});

// sebelum masuk ke DB password akan dihash terlebih dahulu
userSchema.pre('save', async function(next){
    const User = this;
    if(User.isModified('password')){
        User.password = await bcrypt.hash(User.password, 12);
    }
    next();
});

// check password apakah password user sama dengan password yg telah dibuat sebelumnya
userSchema.methods.comparePassword = async function(canditatePassword){
    const User = this;
    const isMatch = await bcrypt.compare(canditatePassword, User.password);
    return isMatch;
}

module.exports = mongoose.model('User', userSchema);