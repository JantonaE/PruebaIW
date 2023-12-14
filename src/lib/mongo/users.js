import { Users } from "./mongo";
import { ObjectId } from "mongodb";

export const createUser = async (newUser) => {
  const dbUsers = await Users();
  const user = await dbUsers.insertOne(newUser);
  return user;
};

export const getUser = async (id) => {
  const dbUsers = await Users();
  const user = await dbUsers.findOne({ "_id" : new ObjectId(id) });
  return user;
};

export const updateUser = async (id, updatedUser) => {
    const dbUsers = await Users();
    const user = await dbUsers.updateOne(
      { "_id" : new ObjectId(id) },
      { $set: updatedUser }
    );
    return user;
};

export const deleteUser = async (id) => {
    const dbUsers = await Users();
    const user = await dbUsers.deleteOne({ "_id" : new ObjectId(id) });
    return user;
};

export const findAllUsers = async (query) => {
    const dbUsers = await Users();
    const users = await dbUsers.find(query).toArray();
    return users;
}
