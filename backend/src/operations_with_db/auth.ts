import pool from "./connectdb";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import {
  getUserByGoogleId,
  addGoogleUser,
  getUserByEmail,
  linkGoogleIdToExistingUser,
  marklogin,
} from "../operations_with_db/users";
import type {
  login_with_google,
  register_result,
  login_result,
} from "../types";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
dotenv.config();

const login = async (
  login_from_front: string,
  password_from_front: string
): Promise<login_result | null> => {
  try {
    const res = await pool.query("SELECT (login($1)).*;", [login_from_front]);
    if (!res.rows.length || !res.rows[0].password_hash) {
      return null;
    }
    const isvalid = await bcrypt.compare(
      password_from_front,
      res.rows[0].password_hash
    );
    if (isvalid) {
      await pool.query("SELECT update_last_login($1);", [login_from_front]);

      return {
        id: res.rows[0].id,
        login: res.rows[0].login,
        email: res.rows[0].email,
      };
    } else return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const register = async (
  email: string,
  login: string,
  password: string
): Promise<register_result> => {
  if (!email || !login || !password) {
    return {
      succes: false,
      message: "Email, login, and password are required",
    };
  }
  const existingEmail = await pool.query(
    "SELECT * FROM users WHERE email = $1;",
    [email]
  );
  const existingLogin = await pool.query(
    "SELECT * FROM users WHERE login = $1;",
    [login]
  );
  if (existingEmail.rows.length > 0) {
    return { succes: false, message: "Email already exists" };
  }
  if (existingLogin.rows.length > 0) {
    return { succes: false, message: "Login already exists" };
  }

  const hashed_password = await hashPassword(password);
  try {
    const res = await pool.query("SELECT add_user($1,$2,$3)", [
      login,
      hashed_password,
      email,
    ]);
    if (res.rows.length === 0)
      return {
        succes: true,
        message: "User registered successfully",
      };
    return {
      succes: false,
      message: "Registration failed",
    };
  } catch (err) {
    console.error("Register error: ", err);
    return {
      succes: false,
      message: "Registration failed due to an server error",
    };
  }
};

const hashPassword = async (password: string): Promise<string> => {
  const hashed_password = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS)
  );
  return hashed_password;
};

const login_with_google = async (
  token: string
): Promise<login_with_google | null> => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload: TokenPayload | undefined = ticket.getPayload();
    if (!payload) {
      return null;
    }
    const google_id = payload.sub as string;
    const email = payload.email as string;
    const login = payload.name as string;

    let user: login_with_google | null;
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
    return user;
  } catch (err) {
    console.error("Błąd podczas logowania z Google:", err);
    return null;
  }
};

export default { login, register, login_with_google };
