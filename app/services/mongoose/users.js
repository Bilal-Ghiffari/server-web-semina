const Users = require('../../api/v1/users/model');
const Organizers = require('../../api/v1/organizers/model');

const {BadRequestError} = require('../../errors');

const createOrganizer = async (req) => {
    const {organizer, role, name, email, password, confirmPassword} = req.body;

    if(password != confirmPassword){
        throw new  BadRequestError('password dan konfirmasi password tidak cocok'); 
    }

    const result = await Organizers.create({organizer});

    const users = await Users.create({
        name,
        email,
        password,
        organizer: result._id,
        role,
    });

    delete users._doc.password;
    return users;
}

const createUser = async (req) => {
    const {name, email, password, role, confirmPassword} = req.body;

    if(password != confirmPassword){
        throw new BadRequestError('password dan konfirmasi password tidak cocok');
    }

    const result = await Users.create({
        name,
        organizer: req.user.organizer,
        email,
        password,
        confirmPassword,
        role,
    });

    return result;
}

const getAllUser = async (req) => {
    const {role} = req.query;

    const result = await Users.find({role});

    return result;
}

module.exports = {
    createOrganizer,
    createUser,
    getAllUser
};