import { Request, Response } from "express";
import operations from "../operations_with_db/auth";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import { blacklistToken } from "./jwtblacklist";
import { EXPIRATION_SECONDS } from "../values";
import {
  getUserByLoginFromFront,
  getUserByGoogleId,
  addGoogleUser,
  getUserByEmail,
  linkGoogleIdToExistingUser,
  marklogin,
} from "../operations_with_db/users";
import { OAuth2Client, TokenPayload } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

dotenv.config();
const loging = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      return res
        .status(400)
        .json({ message: "Login and password are required" });
    }
    const result = await getUserByLoginFromFront(login);
    if (!result) {
      return res.status(401).json({ message: "Invalid login or password" });
    }
    const token_jwt = jwt.sign(
      {
        sub: result.id,
        login: result.login,
        email: result.email,
        jti: crypto.randomUUID(),
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
    marklogin(result.id);
    res.cookie("jwt", token_jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * EXPIRATION_SECONDS, // 1h
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
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(200)
      .json({ message: "No token provided logout succesful" });
  }
  const payload = jwt.decode(token) as jwt.JwtPayload & {
    jti: string;
    exp: number;
  };
  if (payload && payload.jti && payload.exp) {
    try {
      await blacklistToken(payload.jti, payload.exp);
      console.log(`Token with jti ${payload.jti} blacklisted on logout.`);
    } catch (err) {
      console.error("Błąd podczas blacklistowania tokena przy logout:", err);
    }
  }
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful", succes: true });
};

const loging_with_google = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    return res
      .status(400)
      .json({ message: "Login, email, and google_id are required" });
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload: TokenPayload | undefined = ticket.getPayload();
    if (!payload) {
      return res
        .status(500)
        .json({ message: "Błąd weryfikacji tokena Google." });
    }
    const google_id = payload.sub as string;
    const email = payload.email as string;
    const login = payload.name as string;

    let user;
    const existingUser = await getUserByGoogleId(google_id);

    if (existingUser) {
      console.log("uzytkonik istnieje");
      user = existingUser;
    } else {
      console.log("tworze nowego uzytkonika google");
      const existingEmailUser = await getUserByEmail(email);

      if (existingEmailUser) {
        user = await linkGoogleIdToExistingUser(email, google_id);
      } else user = await addGoogleUser(login, email, google_id);
    }

    const token_jwt = jwt.sign(
      {
        sub: user.id,
        login: user.login,
        email: user.email,
        jti: crypto.randomUUID(),
      },

      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    marklogin(user.id);
    res.cookie("jwt", token_jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * EXPIRATION_SECONDS,
    });

    res.status(200).json({
      message: "Login with Google successful",
      username: user.login,
    });
  } catch (error) {
    console.error("Login with Google error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { loging, register, logout, loging_with_google };
