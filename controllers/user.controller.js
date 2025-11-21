import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { authValidator } from "../validator/auth.validator.js";
import jwtGenerator from "../utils/jwt-generator.js";
import { zodError } from "../utils/zoderror.js";

export const signup = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res
        .status(400)
        .json({ message: `Invalid input, 'email' and 'password' required` });

    const validatedUser = authValidator.parse(req.body);
    const { email: vemail, password: vpassword } = validatedUser;

    const existingUser = await User.findOne(vemail);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(vpassword, salt);

    const newUser = new User({ email: vemail, password: hashedPassword });
    await newUser.save();
    const jwtToken = jwtGenerator(newUser);
    res
      .status(201)
      .json({ token: jwtToken, message: "User created successfully" });
  } catch (error) {
    zodError(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const body = req.body;
  const { email, password } = body;

  try {
    if (!email || !password)
      return res
        .status(400)
        .json({ message: `Invalid input, 'email' and 'password' required` });

    const validatedUser = authValidator.parse(body);
    const { email: vemail, password: vpassword } = validatedUser;
    const existingUser = await User.findOne(vemail);
    if (!existingUser) {
      return res.status(401).json({ message: "User not found" });
    }
    const passwordMatches = await bcrypt.compare(
      vpassword,
      existingUser.password
    );

    if (!passwordMatches)
      return res.status(404).json({ message: "Invalid email or password" });

    const jwtToken = jwtGenerator(existingUser);
    res.status(200).json({ token: jwtToken, message: "login successful" });
  } catch (error) {
    zodError(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
