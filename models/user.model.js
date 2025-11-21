import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    expenses: {
      type: mongoose.Types.ObjectId,
      ref: "Expenses",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
