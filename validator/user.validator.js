import z from "zod";

export const userValidator = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z.string().min(1, { error: "Password is required" }),
  expenses: z.array(z.string()).optional(),
  name: z.string().optional(),
});
