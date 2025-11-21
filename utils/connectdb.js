import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log("Connection to Database Successful");
    });
  } catch (error) {
    throw new Error("Error connecting to database");
  }
};

export default connectDB;
