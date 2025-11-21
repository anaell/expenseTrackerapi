import jwt from "jsonwebtoken";

const jwtGenerator = (user) => {
  try {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    return token;
  } catch (error) {
    res
      .status(500)
      .json({ error: "Token not generated, Something went wrong" });
  }
};

export default jwtGenerator;
