import mongoose from "mongoose";
import Subuser from "../models/Subuser";
import User from "../models/User";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";

export const registerSubUser = async (req, res, next) => {
  const extractedToken = req.headers.authorization?.split(" ")[1];
  if (!extractedToken) {
    return res.status(401).json({ message: "Token not found" });
  }

  const { username, password, status } = req.body;

  try {
    const decodedToken = jwt.verify(extractedToken, process.env.SECRET_KEY);
    const userId = decodedToken.id;

    const isMainUser = await User.exists({ _id: userId });

    if (!isMainUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const subUser = new Subuser({
      username,
      password,
      status,
      mainuser: userId,
    });
    const mainUser = await User.findById(userId);
    /*const session = await mongoose.startSession();
        session.startTransaction();
        await subUser.save({session})
        mainUser.addedSubUsers.push(subUser)
        await mainUser.save({session})
        await session.commitTransaction()*/

    await subUser.save();
    mainUser.addedSubUsers.push(subUser);
    await mainUser.save();

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
  const extractedToken = req.headers.authorization?.split(" ")[1];
  if (!extractedToken) {
    return res.status(404).json({ message: "Token Not Found" });
  }

  try {
    const decodedToken = jwt.verify(extractedToken, process.env.SECRET_KEY);
    const userId = decodedToken?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isMainUser = await User.exists({ _id: userId });

    if (!isMainUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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
  const extractedToken = req.headers.authorization?.split(" ")[1];

  if (!extractedToken) {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
    const decodedToken = jwt.verify(extractedToken, process.env.SECRET_KEY);
    const userId = decodedToken.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isMainUser = await User.exists({ _id: userId });

    if (!isMainUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = req.params.id;

    const subUser = await Subuser.findByIdAndRemove(id);

    if (!subUser) {
      return res
        .status(404)
        .json({ message: "Request failed unable to delete the sub user!" });
    }

    await User.updateOne(
      { addedSubUsers: id },
      { $pull: { addedSubUsers: id } }
    );
    return res.status(201).json({ message: "Deleted succesfully!" });
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }
};

export const updateSubUser = async (req, res, next) => {
  const extractedToken = req.headers.authorization?.split(" ")[1];
  if (!extractedToken) {
    return res.status(401).json({ message: "Token not found" });
  }

  const { username, password, status } = req.body;

  try {
    const decodedToken = jwt.verify(extractedToken, process.env.SECRET_KEY);
    const userId = decodedToken.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    const isMainUser = await User.exists({ _id: userId });

    if (!isMainUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = req.params.id;

    const subUser = await Subuser.findByIdAndUpdate(id, {
      username,
      password,
      status,
    });
    if (!subUser) {
      return res
        .status(404)
        .json({ message: "Request failed! unable to update the sub user!" });
    }

    await User.updateOne(
      { addedSubUsers: id },
      { $set: { "addedSubUsers.$": subUser } }
    );
    return res.status(200).json({ message: "Updated succesfully!" });
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }
};
