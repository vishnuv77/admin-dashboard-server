import User from "../models/User.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res, next) => {
  //1.extracting token
  const extractedToken = req.headers.authorization.split(" ")[1];

  //console.log(extractedToken);

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

  const hashedPassword = bcrypt.hashSync(password);

  let user;
  try {
    user = new User({
      firstname,
      lastname,
      username,
      password: hashedPassword,
      status,
      admin: adminId,
    });
    //4. using session to add the users into admin's addedUsers property while saving the new user
    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(adminId);
    /*
    session.startTransaction();
    await user.save({ session });
    adminUser.addedUsers.push(user);
    await adminUser.save({ session });
    await session.commitTransaction();
    */

    await user.save();
    adminUser.addedUsers.push(user);
    await adminUser.save();
  } catch (err) {
    console.log(err);
  }

  if (!user) {
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(201).json({ user });
};

export const userLogin = async (req, res, next) => {
  const { username, password } = req.body;

  if (
    !username &&
    username.trim() === "" &&
    !password &&
    password.trim() === ""
  ) {
    return res.status(422).json("Invalid inputs");
  }

  let existingUser;

  try {
    existingUser = await User.findOne({ username });
  } catch (err) {
    console.log(err);
  }

  if (!existingUser) {
    return res.status(400).json({ message: "User not found" });
  }

  const passwordIsTrue = bcrypt.compareSync(password, existingUser.password);

  if (!passwordIsTrue) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });

  return res
    .status(200)
    .json({ message: "Successfully logged in", token, id: existingUser._id });
};

export const getAllUsers = async (req, res, next) => {
  const extractedToken = req.headers.authorization?.split(" ")[1];
  //console.log(extractedToken);

  if (!extractedToken) {
    return res.status(404).json({ message: "Token not found" });
  }

  try {
    const decodedToken = jwt.verify(extractedToken, process.env.SECRET_KEY);
    const adminId = decodedToken.id;

    const isAdmin = await Admin.exists({ _id: adminId });
    if (!isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users = await User.find();
    if (!users) {
      return res
        .status(500)
        .json({ message: "request failed users not found !" });
    }

    return res.status(200).json({ users });
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }
};

export const getUserById = async (req, res, next) => {
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
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Request faild user not found !" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }
};

export const deleteUser = async (req, res, next) => {
  const extractedToken = req.headers.authorization?.split(" ")[1];
  if (!extractedToken) {
    return res.status(401).json({ message: "Token not found!" });
  }
  //console.log(extractedToken);
  try {
    const decodedToken = jwt.verify(extractedToken, process.env.SECRET_KEY);
    const adminId = decodedToken.id;

    const isAdmin = await Admin.exists({ _id: adminId });

    if (!isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = req.params.id;
    //console.log(id);
    const user = await User.findByIdAndRemove(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Request failed unable to delete the user!" });
    }

    await Admin.updateOne({ addedUsers: id }, { $pull: { addedUsers: id } });

    return res.status(201).json({ message: "Deleted succesfully!" });
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }
};

export const updateUser = async (req, res, next) => {
  const extractedToken = req.headers.authorization?.split(" ")[1];
  if (!extractedToken) {
    return res.status(401).json({ message: "Token not found" });
  }

  const { firstname, lastname, username, password } = req.body;
  try {
    const decodedToken = jwt.verify(extractedToken, process.env.SECRET_KEY);
    const adminId = decodedToken.id;

    const isAdmin = await Admin.exists({ _id: adminId });

    if (!isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = req.params.id;
    console.log(id);
    const user = await User.findByIdAndUpdate(id, {
      firstname,
      lastname,
      username,
      password,
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Request failed unable to update the user" });
    }

    // update the user's details in the Admin's addedUsers property
   

    return res.status(200).json({ message: "Updated succesfully!" });
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }
};

/*
export const getAllUsers = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1];
  console.log(extractedToken);

  if (!extractedToken) {
    return res.status(404).json({ message: "Token not found" });
  }

  let adminId;
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decryptedToken) => {
    if (err) {
      return res.status(200).json({ message: `${err.message}` });
    } else {
      adminId = decryptedToken.id;
      return;
    }
  });

  const isAdmin = await Admin.exists({ _id: adminId });
  if (!isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let users;
  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }

  if (!users) {
    return res
      .status(500)
      .json({ message: "request failed users not found !" });
  }

  return res.status(200).json({ users });
};
*/
