const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);

class UserRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("File Name not Entered");
    }
    this.filename = filename;

    try {
      fs.accessSync(filename, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      fs.writeFile(this.filename, "[]", function (err) {
        if (err) throw err;
        console.log("File is created successfully.");
      });
    }
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
  }

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

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();

    return records.find((record) => {
      return record.id === id;
    });
  }

  async delete(id) {
    const records = await this.getAll();
    const filtededRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filtededRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => {
      return record.id === id;
    });

    if (!record) {
      throw new Error(`Record with ${id} not found`);
    }

    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();
    for (let record of records) {
      let found = true;
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
}

module.exports = new UserRepository("users.json");
