import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  registerUser,
  updateUser,
  userLogin,
} from "../controllers/user-controller";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/userlogin", userLogin);
userRouter.get("/getall", getAllUsers);
userRouter.get("/getuser/:id", getUserById);
userRouter.delete("/delete/:id", deleteUser);
userRouter.put("/update/:id",updateUser)

export default userRouter;

