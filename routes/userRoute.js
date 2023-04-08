import express from "express";
import { getAllUsers, getUserById, registerUser, userLogin } from "../controllers/user-controller";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/userlogin", userLogin);
userRouter.get("/getall",getAllUsers);
userRouter.get("/getuser/:id",getUserById)

export default userRouter;
