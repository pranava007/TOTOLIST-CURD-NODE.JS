const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectId

let database;

async function getdatabase() {
  const Client = await MongoClient.connect("mongodb://127.0.0.1:27017");

  database = Client.db("library");

  if (!database) {
    console.log("Not Work");
  }

  return database;
}

module.exports = {
  getdatabase,
  ObjectID,
};
