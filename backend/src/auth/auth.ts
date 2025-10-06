import { Request, Response } from "express";
import operations from "../operations_with_db/users";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const loging = async (req: Request, res: Response) => {
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
    res.status(200).json({
      message: "Login successful",
      username: result.login,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const register = async (req: Request, res: Response) => {
  const { email, login, password } = req.body;
  if (!email || !login || !password) {
    return res
      .status(400)
      .json({ message: "Email, login, and password are required" });
  }
  try {
    const result = await operations.register(email, login, password);
    if (!result.succes) {
      return res.status(400).json({ message: result.message });
    }
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const logout = async (req: Request, res: Response) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful", succes: true });
};

export default { loging, register, logout };
