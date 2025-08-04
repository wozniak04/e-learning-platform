import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateJWT = (
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
    };

    req.user = payload;
    const newToken = jwt.sign(
      {
        sub: payload.sub,
        login: payload.login,
        email: payload.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.cookie("jwt", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60,
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
