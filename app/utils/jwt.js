const jwt = require('jsonwebtoken');
const {
    jwtSecret,
    jwtExpiration,
    jwtRefreshTokenSecret,
    jwtExpirationRefreshToken
} = require('../config');

// create jwt
const createJwt = ({payload}) => {
    const token = jwt.sign(payload, jwtSecret, {
        expiresIn: jwtExpiration
    });
    return token;
};

const createRefreshJwt = ({payload}) => {
    const token = jwt.sign(payload, jwtRefreshTokenSecret, {
        expiresIn: jwtExpirationRefreshToken
    });
    return token;
};

const isTokenvalid = ({token}) => jwt.verify(token, jwtSecret);
const isTokenvalidRefreshToken = ({token}) => jwt.verify(token, jwtRefreshTokenSecret);

module.exports = {
    createJwt,
    createRefreshJwt,
    isTokenvalid,
    isTokenvalidRefreshToken
}