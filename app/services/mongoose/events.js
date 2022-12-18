const Events = require('../../api/v1/events/model');
const {checkingImage} = require('./image');
const {checkingCategories} = require('./categories');
const {checkingTalents} = require('./talents');

const {BadRequestError, NotFoundError} = require('../../errors');

const getAllEvents = async (req) => {
    const {keyword, category, talent, status} = req.query;
    let condition = {organizer: req.user.organizer};

    if(keyword) {
        condition = {...condition, title: {$regex: keyword, $options: 'i'}}
    }

    if(category){
        condition = {...condition, category}
    }

    if(talent){
        condition = {...condition, talent}
    }

    if(['Draft', 'Published'].includes(status)){
        condition = {...condition, statusEvent: status}
    }

    const result = await Events.find(condition)
    .populate({path: 'image', select: '_id name'})
    .populate({path: 'category', select: '_id name'})
    .populate({
        path: 'talent',
        select: '_id name role image',
        populate: {path: 'image', select: '_id name'}
    });

    return result;
}

const createEvents = async (req) => {
    const {
        title,
        date,
        about,
        tagline,
        venueName,
        keyPoint,
        statusEvent,
        tickets,
        image,
        category,
        talent
    } = req.body

    // cari image,category dan talent dengan field id
    await checkingImage(image);
    await checkingCategories(category);
    await checkingTalents(talent);

    // cari Events dengan field name
    const check = await Events.findOne({title, organizer: req.user.organizer});

    // jika data events sudah ada maka kita tampilkan error duplicate
    if(check) throw new BadRequestError('judul event duplikat');

    const result = await Events.create({
        title,
        date,
        about,
        tagline,
        venueName,
        keyPoint,
        statusEvent,
        tickets,
        image,
        category,
        talent,
        organizer: req.user.organizer
    });

    return result;
};

const getOneEvents = async (req) => {
    const {id} = req.params;

    const result = await Events.findOne({_id: id, organizer: req.user.organizer})
    .populate({path: 'image', select: '_id name'})
    .populate({path: 'category', select: '_id nmae'})
    .populate({
        path: 'talent',
        select: '_id name role image',
        populate: {path: 'image', select: '_id name'}
    });

    if(!result) throw new NotFoundError(`tidak ada pembicara dengan id : ${id}`);

    return result;
};

const updateEvents = async (req) => {
    const {id} = req.params;
    const {
        title,
        date,
        about,
        tagline,
        venueName,
        keyPoint,
        statusEvent,
        tickets,
        image,
        category,
        talent
    } = req.body;

    await checkingImage(image);
    await checkingCategories(category);
    await checkingTalents(talent);

    // data event tidak ditemukan
    const checkEvent = await Events.findOne({_id: id, organizer: req.user.organizer});
    if(!checkEvent) throw new NotFoundError(`tidak ada acara dengan id : ${id}`);

    // cari Events dengan field name dan id tetapi selain dari id yang dikirim dari params
    const check = await Events.findOne({
        title,
        _id: {$ne: id}
    });

    if(check) throw new BadRequestError('jadul acara sudah terdaftar');
    const result = await Events.findOneAndUpdate(
        {_id: id},
        {
        title,
        date,
        about,
        tagline,
        venueName,
        keyPoint,
        statusEvent,
        tickets,
        image,
        category,
        talent,
        organizer: req.user.organizer
        },
        {new: true, runValidators: true}
    );

    // jika id dari events tidak ditemukkan maka tampilkan error
    if(!result) throw new NotFoundError(`tidak ada acara dengan id : ${id}`);

    return result;
}

const updateEventsStatus = async (req) => {
    const {id} = req.params;
    const {
        statusEvent,
    } = req.body;

    // check status
    if(!['Draft', 'Published'].includes(statusEvent)){
        throw new NotFoundError('status harus draft atau published')
    }

    // data event tidak ditemukan
    const checkEvent = await Events.findOne({_id: id, organizer: req.user.organizer});
    if(!checkEvent) throw new NotFoundError(`tidak ada acara dengan id : ${id}`);

    const result = await Events.findOneAndUpdate(
        {_id: id},
        {
        statusEvent,
        organizer: req.user.organizer,
        },
        {new: true, runValidators: true}
    );

    // jika id dari events tidak ditemukkan maka tampilkan error
    if(!result) throw new NotFoundError(`tidak ada acara dengan id : ${id}`);

    return result;
}

const deleteEvents = async (req) => {
    const {id} = req.params;
    const result = await Events.findOne({_id: id, organizer: req.user.organizer});

    if(!result) throw new NotFoundError(`tidak ada pembicara dengan id: ${id}`);
    result.delete();

    return result;
}

module.exports = {
    getAllEvents,
    createEvents,
    getOneEvents,
    updateEvents,
    deleteEvents,
    updateEventsStatus
}