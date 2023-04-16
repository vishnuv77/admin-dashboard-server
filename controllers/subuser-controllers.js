import mongoose from "mongoose";
import Subuser from "../models/Subuser";
import User from "../models/User";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";
import bcrypt from "bcryptjs";

export const registerSubUser = async (req, res, next) => {
  const {
    firstname,
    lastname,
    email,
    password,
    status,
    menuAccess,
    contractAccess,
    servicesAccess,
  } = req.body;

  try {
    const subUser = new Subuser({
      firstname,
      lastname,
      email,
      password,
      status,
      menuAccess,
      contractAccess,
      servicesAccess,
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
  const {
    firstname,
    lastname,
    email,
    password,
    status,
    menuAccess,
    contractAccess,
    servicesAccess,
  } = req.body;

  try {
    const id = req.params.id;

    const subUser = await Subuser.findByIdAndUpdate(id, {
      firstname,
      lastname,
      email,
      password,
      status,
      menuAccess,
      contractAccess,
      servicesAccess,
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

export const subUserLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json("Invalid inputs");
  }

  let existingSubUser;

  try {
    existingSubUser = await Subuser.findOne({ email });
  } catch (err) {
    console.log(err);
  }

  if (!existingSubUser) {
    return res.status(400).json({ message: "subuser not found!" });
  }
  /*
  console.log(password);
  console.log(existingSubUser.password);
  */

  if (password !== existingSubUser.password) {
    return res.status(400).json({ message: "Invalid password!" });
  }

  const token = jwt.sign({ id: existingSubUser._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  return res.status(200).json({
    message: "Succesfully logged in !",
    token,
    id: existingSubUser._id,
  });
};

export const getSubUserById = async(req,res,next) =>{
  const extractedToken = req.headers.authorization?.split(" ")[1];
  if (!extractedToken) {
    return res.status(401).json({ message: "Token not found!" });
  }

  try {
    const decodedToken = jwt.verify(extractedToken, process.env.SECRET_KEY);
    const adminId = decodedToken.id;

    const isAdmin = await Admin.exists({ _id: adminId });
    if (!isAdmin) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    const id = req.params.id;
    const subuser = await Subuser.findById(id);

    if (!subuser) {
      return res
        .status(404)
        .json({ message: "Request faild user not found !" });
    }

    return res.status(200).json({ subuser });
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }

}
