const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    urlDb: process.env.URL_MONGODB_DEV,
    jwtSecret: process.env.JWT_SECRET_KEY,
    jwtRefreshTokenSecret: process.env.JWT_SECRET_KEY_REFRESH_TOKEN,
    jwtExpiration: process.env.JWT_EXPIRATION,
    jwtExpirationRefreshToken: process.env.JWT_EXPIRATION_REFRESH_TOKEN,
    gmail: process.env.GMAIL,
    password: process.env.PASSWORD
};