const Repository = require("./repository");
class cartsRepository extends Repository {}

module.exports = new cartsRepository("carts.json");
