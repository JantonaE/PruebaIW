import { Logs } from "./mongo";
import { ObjectId } from "mongodb";

export const createLog = async (newLog) => {
  const dbLogs = await Logs();
  const log = await dbLogs.insertOne(newLog);
  return log;
};

export const getLog = async (id) => {
  const dbLogs = await Logs();
  const log = await dbLogs.findOne({ "_id" : new ObjectId(id) });
  return log;
};

export const updateLog = async (id, updatedLog) => {
    const dbLogs = await Logs();
    const log = await dbLogs.updateOne(
      { "_id" : new ObjectId(id) },
      { $set: updatedLog }
    );
    return log;
};

export const deleteLog = async (id) => {
    const dbLogs = await Logs();
    const log = await dbLogs.deleteOne({ "_id" : new ObjectId(id) });
    return log;
};

export const findAllLogs = async (query) => {
    const dbLogs = await Logs();
    const logs = await dbLogs.find(query).toArray();
    return logs;
}
