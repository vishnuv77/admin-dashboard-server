import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());



mongoose
  .connect("mongodb://localhost:27017/mydatabase")
  .then(() => console.log("database connection is successful"))
  .catch((err) => console.log(err));

app.listen(5000, () => console.log("Backend server is running on port 5000"));
