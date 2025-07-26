import { Request, Response } from "express";
import operations from "../operations_with_db/users";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Function to handle user login
// It retrieves login and password from the request body, calls the login function from operations,
const loging = async (req: Request, res: Response) => {
  // and if successful, generates a JWT token and sets it as a cookie in the response.
  // If the login fails, it returns a 401 status with an error message.
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      return res
        .status(400)
        .json({ message: "Login and password are required" });
    }
    const result = await operations.login(login, password);
    if (!result) {
      return res.status(401).json({ message: "Invalid login or password" });
    }
    const token_jwt = jwt.sign(
      { sub: result.id, login: result.login, email: result.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
    // Set the JWT token as a cookie in the response
    res.cookie("jwt", token_jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60, // 1 hour
    });
    res.status(200).json({ message: "Login successful", user: result });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const register = async (req: Request, res: Response) => {
  const { email, login, password } = req.body;
  const result = await operations.register(email, login, password);
};
const logout = async (req: Request, res: Response) => {};

export default { loging, register, logout };
