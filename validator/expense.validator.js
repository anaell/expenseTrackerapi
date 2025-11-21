import z from "zod";

export const expenseValidator = z.object({
  category: z.enum(
    [
      "Groceries",
      "Leisure",
      "Electronics",
      "Utilities",
      "Clothing",
      "Health",
      "Others",
    ],
    { error: "Invalid category" }
  ),
  amount: z.number().min(0, { error: "amount is required" }),
  detail: z.string().min(1, { error: "detail is required" }),
});

export const updateExpenseValidator = expenseValidator.partial();
