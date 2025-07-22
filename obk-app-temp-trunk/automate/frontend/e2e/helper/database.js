const { Client } = require("pg");

class Database {
  constructor(connectionString) {
    console.log("connectionString: ", connectionString);
    this.client = new Client({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Connected to PostgreSQL database");
    } catch (err) {
      console.error("Error connecting to PostgreSQL", err);
    }
  }

  async query(queryString) {
    try {
      console.log("query:", queryString);
      const result = await this.client.query(queryString);
      return result.rows;
    } catch (err) {
      console.error("Error executing query", err);
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log("Disconnected from PostgreSQL database");
    } catch (err) {
      console.error("Error disconnecting from PostgreSQL", err);
    }
  }
}

module.exports = Database;
