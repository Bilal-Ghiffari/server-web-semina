const Users = require('../../api/v1/users/model');
const {BadRequestError, UnauthorizedError} = require('../../errors');
const {createJwt, createTokenUser, createRefreshJwt} = require('../../utils');
const {createRefreshToken} = require('./refreshToken');

const signin = async (req) => {
    const {email, password} = req.body;

    if(!email || !password){
        throw new BadRequestError('please provide email and password');
    }

    const result = await Users.findOne({email});

    // check email
    if(!result){
        throw new UnauthorizedError('Invalid Credentials');
    }

    const isPasswordCorrect = await result.comparePassword(password);

    // check password
    if(!isPasswordCorrect){
        throw new UnauthorizedError('Invalid Credentials');
    }

    const token = createJwt({payload: createTokenUser(result)});

    const refreshToken = createRefreshJwt({payload: createTokenUser(result)});
    await createRefreshToken({
        refreshToken,
        user: result._id
    });

    console.log("refresh token", refreshToken);

    return {token, refreshToken ,role: result.role, email: result.email};
}

module.exports = {
    signin
}