const Talents = require('../../api/v1/talents/model');
const {checkingImage} = require('./image');

const {NotFoundError, BadRequestError} = require('../../errors')

const getAllTalents = async (req) => {
    // filter query / search
    const {keyword} = req.query;

    let condition = {organizer: req.user.organizer};
    if(keyword){
        condition = {
            ...condition,
            name: {
                // regex mencari nama yg sesuai difilter
                $regex: keyword,
                // options 'i' tidak memperdulikan huruf besar maupun kecil
                $options: 'i'
            }
        }
    }

    const result = await Talents.find(condition)
    .populate({
        path: 'image',
        select: '_id name'
    })
    .select('_id name role image');

    return result;
}

const createTalents = async (req) => {
    const {name, role, image} = req.body;

    // cari image dengan field image
    await checkingImage(image);

    // cari talents dengan field name
    const check = await Talents.findOne({name, organizer: req.user.organizer});

    // jika data talents sudah ada akan dikasih error duplicate
    if(check) throw new BadRequestError('pembicara sudah terdaftar');

    const result = await Talents.create({name, role, image, organizer: req.user.organizer});

    return result;
}

const getOneTalents = async (req) => {
    const {id} = req.params;
    const result = await Talents.findOne({_id: id, organizer: req.user.organizer})
    .populate({
        path: 'image',
        select: '_id name'
    })
    .select('_id name role image');

    if(!result) throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

    return result;
}

const updateTalents = async (req) => {
    const {id} = req.params;
    const {name, image, role} = req.body;

    // cari image dengan field image
    await checkingImage(image);

    // cari data talents dengan field name jika suda ada kasih error duplicate
    const check = await Talents.findOne({
        name,
        organizer: req.user.organizer,
        _id: {$ne: id}
    });

    // jika data talents ada yang sama maka akan dkasih error duplicate
    if(check) throw new BadRequestError('pembicara sudah terdaftar');

    const result = await Talents.findOneAndUpdate(
        {_id: id},
        {name, role, image, organizer: req.user.organizer},
        {new: true, runValidators: true}
    );

    if(!result) throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

    return result;
}

const deleteTalents = async (req) => {
    const {id} = req.params;
    const result = await Talents.findOne({_id: id, organizer: req.user.organizer});

    if(!result) throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

    await result.remove();
    return result;
}

const checkingTalents = async (id) => {
    const result = await Talents.findOne({_id: id});
    if(!result) throw new  NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

    return result;
}

module.exports = {
    getAllTalents,
    getOneTalents,
    createTalents,
    updateTalents,
    deleteTalents,
    checkingTalents
}