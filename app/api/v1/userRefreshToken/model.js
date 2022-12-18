const mongoose = require('mongoose');

const userRefreshTokenSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('UserRefreshToken', userRefreshTokenSchema);