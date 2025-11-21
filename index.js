import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import connectDB from "./utils/connectdb.js";
import userRoutes from "./routes/user.route.js";
import expenseRoutes from "./routes/expenses.route.js";
import jwtVerificator from "./middlewares/auth.jwtVerificator.js";

configDotenv();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", userRoutes);
app.use("/expenses", jwtVerificator, expenseRoutes);

app.listen(process.env.PORT, () =>
  console.log(
    `Server has started on port 5420. Access on http://localhost:5420`
  )
);
