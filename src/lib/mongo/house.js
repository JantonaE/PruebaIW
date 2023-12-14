import { Houses } from "./mongo";
import { ObjectId } from "mongodb";

export const createHouse = async (newHouse) => {
  const dbHouses = await Houses();
  const house = await dbHouses.insertOne(newHouse);
  return house;
};

export const getHouse = async (id) => {
  const dbHouses = await Houses();
  const house = await dbHouses.findOne({ "_id" : new ObjectId(id) });
  return house;
};

export const updateHouse = async (id, updatedHouse) => {
    const dbHouses = await Houses();
    const house = await dbHouses.updateOne(
      { "_id" : new ObjectId(id) },
      { $set: updatedHouse }
    );
    return house;
};

export const deleteHouse = async (id) => {
    const dbHouses = await Houses();
    const house = await dbHouses.deleteOne({ "_id" : new ObjectId(id) });
    return house;
};

export const findAllHouses = async (query) => {
    const dbHouses = await Houses();
    const houses = await dbHouses.find(query).toArray();
    return houses;
}
