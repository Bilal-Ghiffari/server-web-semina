const UserRefreshToken = require('../../api/v1/userRefreshToken/model');
const {
  isTokenvalidRefreshToken,
  createJwt,
  createTokenUser
} = require('../../utils');
const Users = require('../../api/v1/users/model');
const {NotFoundError} = require('../../errors');

const createRefreshToken = async (payload) => {
  const result = await UserRefreshToken.create(payload);
  return result;
};

const getUserRefreshToken = async (req) => {
  const {refreshToken} = req.params;
  const result = await UserRefreshToken.findOne({
    refreshToken
  });

  if(!result) throw new NotFoundError(`refreshToken tidak valid`);

  // verify refresh token
  const payload = isTokenvalidRefreshToken({token: result.refreshToken});

  const userCheck = await Users.findOne({email: payload.email});

  // generate token baru
  const token = createJwt({payload: createTokenUser(userCheck)});

  return token;
};

module.exports = {
  createRefreshToken,
  getUserRefreshToken
}