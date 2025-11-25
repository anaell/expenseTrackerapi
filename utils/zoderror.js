import { ZodError } from "zod";

export const zodError = (error, res) => {
  if (error instanceof ZodError) {
    console.log(error);
    return res.status(400).json({ message: "Invalid input" });
  }
};
