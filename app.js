import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import adminRouter from "./routes/adminRoute";
import userRouter from "./routes/userRoute";
import dotenv from "dotenv";
import subUserRouter from "./routes/subuserRoute";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/subuser", subUserRouter);


mongoose
  .connect("mongodb://localhost:27017/mydatabase")
  .then(() => console.log("database connection is successful"))
  .catch((err) => console.log(err));

app.listen(5000, () => console.log("Backend server is running on port 5000"));
