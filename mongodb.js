const { MongoClient } = require('mongodb');

class MongoDB {
  constructor(connectionString, dbName) {
    this.connectionString = connectionString;
    this.dbName = dbName;
    this.client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    this.db = null;
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      throw error;
    }
  }

  async close() {
    await this.client.close();
    console.log('Closed MongoDB connection');
  }

  // You can add more methods for interacting with your MongoDB here
}

module.exports = MongoDB;
