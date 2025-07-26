import pool from "./connectdb";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const login = async (login_from_front: string, password_from_front: string) => {
  try {
    const res = await pool.query("SELECT (login($1)).*;", [login_from_front]);
    if (!res.rows.length) {
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
  const hashed_password = await hashPassword(password);
  try {
    const res = await pool.query("SELECT add_user($1,$2,$3)", [
      email,
      hashed_password,
      login,
    ]);
    return res.rows[0].add_user;
  } catch (err) {
    console.error("Register error: ", err);
    return null;
  }
};

const hashPassword = async (password: string) => {
  const hashed_password = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS)
  );
  return hashed_password;
};

//login("test2", "testhaslo").then((res) => console.log(res));
//register("test2@wd.pl", "test2", "testhaslo").then((res) => console.log(res));
export default { login, register };
