import { Eventuals } from "./mongo";
import { ObjectId } from "mongodb";

export const createEventual = async (newEventual) => {
  const dbEventuals = await Eventuals();
  const eventual = await dbEventuals.insertOne(newEventual);
  return eventual;
};

export const getEventual = async (id) => {
  const dbEventuals = await Eventuals();
  const eventual = await dbEventuals.findOne({ "_id" : new ObjectId(id) });
  return eventual;
};

export const updateEventual = async (id, updatedEventual) => {
    const dbEventuals = await Eventuals();
    const eventual = await dbEventuals.updateOne(
      { "_id" : new ObjectId(id) },
      { $set: updatedEventual }
    );
    return eventual;
};

export const deleteEventual = async (id) => {
    const dbEventuals = await Eventuals();
    const eventual = await dbEventuals.deleteOne({ "_id" : new ObjectId(id) });
    return eventual;
};

export const findAllEventuals = async (query) => {
    const dbEventuals = await Eventuals();
    const eventuals = await dbEventuals.find(query).toArray();
    return eventuals;
}
