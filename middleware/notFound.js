const notFound = (req, res) => res.status(400).send("Route doesn't exists");


module.exports = notFound