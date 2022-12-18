const {signin} = require('../../../services/mongoose/auth');
const {StatusCodes} = require('http-status-codes');

const signinCMS = async (req, res, next) => {
    try {
        const result = await signin(req);
        res.status(StatusCodes.CREATED).json({
            data: {
                token: result.token,
                refreshToken: result.refreshToken,
                email: result.email,
                role: result.role,
            }
        })
    } catch (err) {
        next(err);
    }
}

module.exports = {signinCMS};