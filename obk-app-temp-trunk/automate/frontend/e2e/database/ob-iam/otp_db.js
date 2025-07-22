const Database = require("../../helper/database");
const configs = require("../../configs");

class OtpDb {
  constructor() {
    this.database = new Database(configs.IAM_DB_URL);
  }

  async deleteOtp(identifier) {
    const query = `DELETE
    FROM
      public.otp o
    WHERE
      o.identifier = '${identifier}'`;
    await this.database.connect();
    await this.database.query(query);
    await this.database.disconnect();
  }
}

module.exports = OtpDb;
