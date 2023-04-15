import mongoose from "mongoose";

const subUserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
  },
  mainuser: {
    type: mongoose.Types.ObjectId,
    ref: "User",

  },
});

export default mongoose.model("SubUser", subUserSchema);
