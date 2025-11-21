import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: [
      "groceries",
      "leisure",
      "electronics",
      "utilities",
      "clothing",
      "health",
      "others",
    ],
    // default: "Others",
    unique: true,
  },
});

CategorySchema.virtual("expenses", {
  ref: "Expenses",
  localField: "_id",
  foreignField: "category",
});

CategorySchema.set("toJSON", { virtuals: true });
CategorySchema.set("toObject", { virtuals: true });

export const Category = mongoose.model("Category", CategorySchema);
