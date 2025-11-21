import mongoose from "mongoose";
import { Category } from "./models/category.model.js";
import { configDotenv } from "dotenv";
configDotenv();

const categories = [
  {name: "groceries"},
  {name: "leisure"},
  {name: "electronics"},
  {name: "utilities"},
  {name: "clothing"},
  {name: "health"},
  {name: "others"},
];


mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Category.insertMany(categories);
  mongoose.disconnect();

  console.log("Seeded the categories");
});
