const {UnauthenticatedError, UnauthorizedError} = require('../errors');
const {isTokenvalid} = require('../utils/index');

const authenticateUser = async (req, res, next) => {
    try {
        let token;

        //check header
        const authHeader = req.headers.authorization;
        if(authHeader && authHeader.startsWith('Bearer')){
            token = authHeader.split(' ')[1]
        }

        // token not found
        if(!token){
            throw new UnauthenticatedError('Authentication invalid');
        }

        // check token valid atau tidak
        const payload = isTokenvalid({token});

        req.user = {
            id: payload.userId,
            name: payload.name,
            email: payload.email,
            role: payload.role,
            organizer: payload.organizer,
        };

        next();
    } catch (err) {
        next(err);
    }
}

const authenticateParticipant = async (req, res, next) => {
    try {
        let token;
        // check header
        const authHeader = req.headers.authorization;

        if(authHeader && authHeader.startsWith('Bearer')){
            token = authHeader.split(' ')[1];
        }

        if(!token){
            throw new UnauthenticatedError('Authentication invalid');
        }

        const payload = invalidToken({token});
        req.participant = {
            id: payload.pasticipantId,
            email: payload.email,
            lastName: payload.lastName,
            firstName: payload.firstName,
        };

        next();
    } catch (err) {
        next(err);
    }
}

// untuk mengasih akses kesection tertentu
const authorizeRoles = (...roles) => {
    console.log(...roles);
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            throw new UnauthorizedError('Unauthorized to access this route');
        }
        next();
    }
}

module.exports = {
    authenticateUser,
    authorizeRoles,
    authenticateParticipant
}