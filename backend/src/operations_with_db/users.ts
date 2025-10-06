import pool from "./connectdb";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const login = async (login_from_front: string, password_from_front: string) => {
  try {
    const res = await pool.query("SELECT (login($1)).*;", [login_from_front]);
    if (!res.rows.length || !res.rows[0].password_hash) {
      return null;
    }
    const isvalid = await bcrypt.compare(
      password_from_front,
      res.rows[0].password_hash
    );
    return isvalid
      ? {
          id: res.rows[0].id,
          login: res.rows[0].login,
          email: res.rows[0].email,
        }
      : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const register = async (email: string, login: string, password: string) => {
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
    return { succes: true, result: res.rows[0].add_user };
  } catch (err) {
    console.error("Register error: ", err);
    return {
      succes: false,
      message: "Registration failed due to an server error",
    };
  }
};

const hashPassword = async (password: string) => {
  const hashed_password = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS)
  );
  return hashed_password;
};

export default { login, register };
