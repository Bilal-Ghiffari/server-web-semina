const Orders = require('../../api/v1/orders/model');

const getAllOrders = async (req) => {
    // filter data
    const {limit = 10, page = 1, startDate, endDate} = req.query;
    let condition = {};

    // historyEvent.organizer diambil dari field model orders
    if(req.user.role !== 'owner'){
        condition = {...condition, 'historyEvent.organizer': req.user.organizer}
    }

    // setHourse = ubah jam
    // $gte = lebih besar atau lebih besar sama dengan >= method perbandingan pada mongodb
    // $lt = lebih kecil < method perbandingan pada mongodb
    if(startDate && endDate){
        const start = new Date(startDate)
        start.setHours(0, 0, 0);

        const end = new Date(endDate)
        end.setHours(23, 59, 59)

        console.log("start", startDate);
        console.log("end", endDate);
        condition = {...condition, date: {
            $gte: start,
            $lt: end
        }}
        console.log("condition", condition)
    }

    // limit() = Membatasi jumlah dokumen yang diteruskan ke tahap berikutnya.
    // skip() = Menentukan jumlah dokumen yang akan dilewati.
    const result = await Orders.find(condition)
    .limit(limit)
    .skip(limit * (page - 1));

    const count = await Orders.countDocuments(condition);

    return {
        data: result, 
        pages: Math.ceil(count / limit), 
        total: count    
    }
}

module.exports = {
    getAllOrders
};