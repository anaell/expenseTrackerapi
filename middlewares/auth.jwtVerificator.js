import jwt from "jsonwebtoken";

const jwtVerificator = async (req, res, next) => {
  const userToken = req.headers.authorization?.split(" ")[1];
  try {
    if (!userToken) return res.status(401).json({ error: "Unauthorized" });
    const decoded = await jwt.verify(userToken, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default jwtVerificator;
