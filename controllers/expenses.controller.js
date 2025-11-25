import { Expenses } from "../models/expenses.model.js";
// import { User } from "../models/user.model.js";
import { zodError } from "../utils/zoderror.js";
import {
  expenseValidator,
  updateExpenseValidator,
} from "../validator/expense.validator.js";

// export const getAllUserExpenses = async (req, res) => {
//   /**
//    * get the user from the jwt token
//    * get all the users expenses.
//    */
//   try {
//     const userId = req.user.id;

//     // const userExpenses = await User.findById(userId).populate("expenses");
//     const userExpenses = await Expenses.find({ user: userId });

//     res.status(200).json({ expenses: userExpenses.expenses });
//   } catch (error) {
//     zodError(error, res);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

export const getSingleExpense = async (req, res) => {
  const { id: expenseId } = req.params;
  const userId = req.user.id;

  try {
    const expense = await Expenses.findById(expenseId);

    if (expense.user !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({ data: expense });
  } catch (error) {
    zodError(error, res);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createExpense = async (req, res) => {
  /**
   * get user from the jwt token
   * get expense from the req and validate it
   * save the expense and include the user
   * return the saved expense
   */

  const userId = req.user.id;
  const expense = req.body;

  try {
    if (!expense) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const validatedExpense = expenseValidator.parse(expense);

    const saveExpense = await Expenses.create({
      ...validatedExpense,
      user: userId,
    });
    res
      .status(201)
      .json({ data: saveExpense, message: "Expense added successfully" });
  } catch (error) {
    zodError(error, res);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllUserExpensesByCategory = async (req, res) => {
  // const category = req.body;
  const { id: categoryId } = req.params;
  const userId = req.user.id;

  try {
    const expenses = await Expenses.find({
      category: categoryId,
      user: userId,
    });
    res.status(200).json({ data: expenses });
  } catch (error) {
    zodError();
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteExpense = async (req, res) => {
  const { id: expenseId } = req.params;
  const userId = req.user.id;

  try {
    const getExpense = await Expenses.findById(expenseId);
    if (!getExpense) {
      return res.status(404).json({ message: "Entity not found" });
    }
    if (getExpense.user !== userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }
    await Expenses.findByIdAndDelete(expenseId);
    res.status(204);
  } catch (error) {
    zodError();
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateExpense = async (req, res) => {
  const { id: expenseId } = req.params;
  const userId = req.user.id;
  const expense = req.body;
  try {
    const getExpense = await Expenses.findById(expenseId);

    if (!getExpense) {
      return res.status(404).json({ message: "Entity not found" });
    }
    if (getExpense.user !== userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    const vexpense = updateExpenseValidator.parse(expense);

    const update = await Expenses.findByIdAndUpdate(expenseId, vexpense, {
      new: true,
    });
    res
      .status(200)
      .json({ data: update, message: "Expense updated successfully" });
    Expenses.find({});
  } catch (error) {
    zodError();
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllUserExpensesIncludesFilter = async (req, res) => {
  try {
    const { filter, startDate, endDate } = req.query;
    const userId = req.user.id;

    let dateQuery = {};

    // --- 1. FILTER: past week / month / 3 months ----
    if (filter) {
      const now = new Date();

      switch (filter) {
        case "week":
          dateQuery = {
            createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) },
          };
          break;
        case "month":
          dateQuery = {
            createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) },
          };
          break;
        case "3months":
          dateQuery = {
            createdAt: { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) },
          };
          break;
        default:
          return res.status(400).json({ message: "Unknown filter type" });
      }
    }

    // --- 2. CUSTOM DATE RANGE ----
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        return res.status(400).json({ message: "Invalid query" });
      }
      dateQuery = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    // If no filter or date range is provided, return everything
    const expenses = await Expense.find({ ...dateQuery, user: userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ data: expenses });
  } catch (error) {
    zodError();
    res.status(500).json({ message: "Something went wrong" });
  }
};
