import mongoose from "mongoose";
import Subuser from "../models/Subuser";
import User from "../models/User";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";

export const registerSubUser = async (req, res, next) => {
  const { firstname, lastname, email, password, status } = req.body;

  try {
    const subUser = new Subuser({
      firstname,
      lastname,
      email,
      password,
      status,
    });

    /*const session = await mongoose.startSession();
        session.startTransaction();
        await subUser.save({session})
        mainUser.addedSubUsers.push(subUser)
        await mainUser.save({session})
        await session.commitTransaction()*/

    await subUser.save();

    if (!subUser) {
      return res
        .status(404)
        .json({ message: "Request failed unable to create user" });
    }

    return res.status(201).json({ message: "Subuser registered succesfully!" });
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }
};

export const getAllSubUsers = async (req, res, next) => {
  try {
    const subUsers = await Subuser.find();

    if (!subUsers || subUsers.length === 0) {
      return res.status(404).json({ message: "No sub users found" });
    }

    return res.status(200).json({ subUsers });
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }
};

export const deleteSubUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const subUser = await Subuser.findByIdAndRemove(id);

    if (!subUser) {
      return res
        .status(404)
        .json({ message: "Request failed unable to delete the sub user!" });
    }
    /*
    await User.updateOne(
      { addedSubUsers: id },
      { $pull: { addedSubUsers: id } }
    );*/
    return res.status(201).json({ message: "Deleted succesfully!" });
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }
};

export const updateSubUser = async (req, res, next) => {
  const { firstname, lastname, email, password, status } = req.body;

  try {
    const id = req.params.id;

    const subUser = await Subuser.findByIdAndUpdate(id, {
      firstname,
      lastname,
      email,
      password,
      status,
    });
    if (!subUser) {
      return res
        .status(404)
        .json({ message: "Request failed! unable to update the sub user!" });
    }
    /*
    await User.updateOne(
      { addedSubUsers: id },
      { $set: { "addedSubUsers.$": subUser } }
    );*/
    return res.status(200).json({ message: "Updated succesfully!" });
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }
};
