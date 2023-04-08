import express from "express";
import { addAdmin, adminLogin } from "../controllers/admin-controllers";

const adminRouter = express.Router();

adminRouter.post("/add", addAdmin);
adminRouter.post("/login", adminLogin);

export default adminRouter;
