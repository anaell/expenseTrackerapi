import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getAllUserExpensesByCategory,
  getAllUserExpensesIncludesFilter,
  getSingleExpense,
  updateExpense,
} from "../controllers/expenses.controller";

const router = Router();

router.get("/:id", getSingleExpense);
router.get("", getAllUserExpensesIncludesFilter);
router.get("/category/:id", getAllUserExpensesByCategory);
router.post("", createExpense);
router.delete("/:id", deleteExpense);
router.put("/:id", updateExpense);

export default router;
