import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../auth/jwtblacklist";
import { EXPIRATION_SECONDS } from "../values";

export const getUserIdFromRequest = async (
  req: Request
): Promise<number | null> => {
  const token = req.cookies.jwt;
  if (!token) {
    return null;
  }
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload & {
      login: string;
      email: string;
      sub: string;
      jti: string;
      exp: number;
    };
    if (await isTokenBlacklisted(payload.jti)) {
      return null;
    }
    return parseInt(payload.sub);
  } catch (err) {
    return null;
  }
};

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload & {
      login: string;
      email: string;
      sub: string;
      jti: string;
      exp: number;
    };

    req.user = payload;

    if (await isTokenBlacklisted(payload.jti)) {
      return res.status(407).json({ message: "Token is blacklisted" });
    }
    const newToken = jwt.sign(
      {
        sub: payload.sub,
        login: payload.login,
        email: payload.email,
        jti: payload.jti,
        exp: payload.exp,
      },
      process.env.JWT_SECRET as string
    );
    res.cookie("jwt", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: EXPIRATION_SECONDS,
    });
    next();
  } catch (err) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
