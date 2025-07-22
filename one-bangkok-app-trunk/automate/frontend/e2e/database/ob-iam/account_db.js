const Database = require("../../helper/database");
const configs = require("../../configs");

class AccountDb {
  constructor() {
    this.database = new Database(configs.IAM_DB_URL);
  }

  async deleteAccount(identifier) {
    const query = `DELETE
    FROM
        public.account
    WHERE
        id IN 
        (
        SELECT
            a.id
        FROM
            public.account a
        INNER JOIN public."identity" i ON
            (i.account_id = a.id)
        WHERE
            i.identifier = '${identifier}'
        );`;
    await this.database.connect();
    await this.database.query(query);
    await this.database.disconnect();
  }
}

module.exports = AccountDb;
