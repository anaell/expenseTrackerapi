export const zodError = (error) => {
  if (error instanceof ZodError) {
    console.log(error);
    return res.status(400).json({ message: "Invalid input" });
  }
};
