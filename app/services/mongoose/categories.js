const Categories = require('../../api/v1/categories/model');
const {NotFoundError, BadRequestError} = require('../../errors');

const getAllCategories = async (req) => {
    const result = await Categories.find({organizer: req.user.organizer}).select('id, name');

    return result
}

const createCategories = async (req) => {
    const {name} = req.body;
    // validation
    //cari categories dengan field name
    const check = await Categories.findOne({name, organizer: req.user.organizer});

  // apa bila check true / data categories sudah ada maka kita tampilkan error bad request dengan message kategori nama duplikat
    if(check) throw new BadRequestError('kategori nama duplikat');
    const result = await Categories.create({name, organizer: req.user.organizer})

    return result;
}

const getOneCategories  = async (req) => {
    const {id} = req.params;
    
    const result = await Categories.findOne({_id: id, organizer: req.user.organizer});

    if(!result) throw new NotFoundError(`tidak ada kategori dengan id : ${id}`);
    
    return result;
}

const updateCategories = async (req) => {
    const {id} = req.params;
    const {name} = req.body;

    // cari categories dengan field name dan id selain dari yang dikirim dari params;
    // $ne memilih dokumen yang nilainya field tidak sama dengan yang ditentukan value;
    const check = await Categories.findOne({
        name,
        organizer: req.user.organizer,
        _id: {$ne: id} 
    });
    //apabila true / data name categories sudah ada maka kita kasih error
    if(check) throw new BadRequestError(('kategori nama duplikat'));

    const result = await Categories.findOneAndUpdate(
        {_id: id},
        {name, organizer: req.user.organizer},
        {new: true, runValidators: true}
    );

    // jika id result false / null maka akan menampilkan error not found
    if(!result) throw new NotFoundError(`tidak ada kategori dengan id : ${id}`);

    return result;
}

const deleteCategories = async (req) => {
    const {id} = req.params;

    const result = await Categories.findOne({
        _id: id,
        organizer: req.user.organizer
    });

    if(!result) throw new NotFoundError(`tidak ada kategori dengan id : ${id}`);
    result.remove();
    return result;
}

const checkingCategories = async (id) => {
    const result = await Categories.findOne({_id: id});
    if(!result) throw new NotFoundError(`tidak ada kategori dengan id : ${id}`);

    return result;
}

module.exports = {
    getAllCategories, 
    createCategories, 
    getOneCategories,
    updateCategories,
    deleteCategories,
    checkingCategories
}