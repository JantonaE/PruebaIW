import { MongoClient, Db, type MongoClientOptions } from "mongodb";

if (!import.meta.env.MONGO_URI) {
  throw new Error('Invalid environment variable: "MONGODB_URI"');
}

const uri =
  import.meta.env.MONGO_URI +
  import.meta.env.MONGO_USERNAME +
  ":" +
  import.meta.env.MONGO_PASSWORD +
  "@" +
  import.meta.env.MONGO_HOST;
const dbName = import.meta.env.MONGO_DB;
const options = {};

let cachedMongo: Db;

const connectToDB = async () => {
  const mongo = await new MongoClient(uri, options as MongoClientOptions).connect();
  return mongo.db(dbName);
};

export const getDB = async () => {
  const mongo = await connectToDB();
  return mongo;
}

export const Users = async () => {
  const db = await getDB();
  return db.collection("Users");
  
};

