const notFound = (req, res) => 
    res.status(404).send({msg: 'Route does not exits'})

module.exports = notFound;