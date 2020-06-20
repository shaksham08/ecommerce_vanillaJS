const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);
const Repository = require("./repository");
class UserRepository extends Repository {
  async create(attrs) {
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString("hex");
    const buff = await scrypt(attrs.password, salt, 64);
    const records = await this.getAll();
    const record = { ...attrs, password: `${buff.toString("hex")}.${salt}` };
    records.push(record);
    await this.writeAll(records);

    return record;
  }

  async comparePassword(saved, supplied) {
    const [hashed, salt] = saved.split(".");
    const hashedSupplied = await scrypt(supplied, salt, 64);
    return hashed === hashedSupplied.toString("hex");
  }
}

module.exports = new UserRepository("users.json");
