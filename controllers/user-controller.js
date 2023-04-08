import User from "../models/User.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const registerUser = async (req, res, next) => {
  //1.extracting token
  const extractedToken = req.headers.authorization.split(" ")[1];

  console.log(extractedToken);

  if (!extractedToken) {
    return res.status(404).json({ message: "Token not found" });
  }

  //2.veryfying the token and returning andmin id
  let adminId;
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` });
    } else {
      adminId = decrypted.id;
      return;
    }
  });

  //3.creating user
  const { firstname, lastname, username, password, status } = req.body;

  let user;
  try {
    user = new User({
      firstname,
      lastname,
      username,
      password,
      status,
      admin: adminId,
    });
    //4. using session to add the users into admin's addedUsers property while saving the new user
    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(adminId);

    session.startTransaction();
    await user.save({ session });
    adminUser.addedUsers.push(user);
    await adminUser.save({ session });
    await session.commitTransaction();
    /*
    await user.save();
    adminUser.addedUsers.push(user);
     await adminUser.save();
    
     */
  } catch (err) {
    console.log(err);
  }

  if (!user) {
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(201).json({ user });
};
