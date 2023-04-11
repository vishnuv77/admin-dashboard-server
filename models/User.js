import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required:true,
    },
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
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
