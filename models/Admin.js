import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    addedUsers: [{
      type:mongoose.Types.ObjectId,
      ref:"User"
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
