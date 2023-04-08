import Admin from "../models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const addAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json("Invalid inputs");
  }

  let admin;
  const hashedPassword = bcrypt.hashSync(password);

  try {
    admin = new Admin({ email, password: hashedPassword });
    admin = await admin.save();
  } catch (err) {
    console.log(err);
  }

  if (!admin) {
    return res.status(500).json({ message: "Unable to add admin!" });
  }

  return res
    .status(200)
    .json({ message: "Admin registered succesfully", admin });
};

export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json("Invalid inputs");
  }

  let existingAdmin;

  try {
    existingAdmin = await Admin.findOne({ email });
  } catch (err) {
    console.log(err);
  }

  if (!existingAdmin) {
    return res.status(400).json({ message: "Admin not found!" });
  }

  const passwordIsTrue = bcrypt.compareSync(password, existingAdmin.password);

  if (!passwordIsTrue) {
    return res.status(400).json({ message: "Invalid password!" });
  }

  const token = jwt.sign({ id: existingAdmin._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  return res
    .status(200)
    .json({ message: "Succesfully logged in !", token, id: existingAdmin._id });
};
