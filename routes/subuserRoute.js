import express from "express";
import {
  deleteSubUser,
  getAllSubUsers,
  registerSubUser,
  subUserLogin,
  updateSubUser,
} from "../controllers/subuser-controllers";

const subUserRouter = express.Router();

subUserRouter.post("/register", registerSubUser);
subUserRouter.get("/getall", getAllSubUsers);
subUserRouter.delete("/delete/:id", deleteSubUser);
subUserRouter.put("/update/:id", updateSubUser);
subUserRouter.post("/login",subUserLogin);

export default subUserRouter;
