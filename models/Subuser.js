import mongoose from "mongoose";


const subUserSchema = new mongoose.Schema({

  username: {
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
    required: true,
  },
});

export default mongoose.model("SubUser", subUserSchema);
