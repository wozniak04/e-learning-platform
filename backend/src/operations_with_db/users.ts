import pool from "./connectdb";

export const getUserByEmail = async (email: string) => {
  try {
    const res = await pool.query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);
    console.log("getUserByEmail:", res.rows);
    if (res.rows.length === 0) return null;
    return res.rows[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};
export const getUserByLoginFromFront = async (login: string) => {
  try {
    const res = await pool.query("SELECT (login($1)).*;", [login]);
    if (res.rows.length === 0 || res.rows[0].id === null) return null;
    return res.rows[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};
export const getUserByGoogleId = async (google_id: string) => {
  try {
    const res = await pool.query(`SELECT (check_google_id_exists($1)).*;`, [
      google_id,
    ]);
    console.log("getUserByGoogleId:", res.rows[0]);
    if (res.rows.length === 0 || res.rows[0].id === null) {
      return null;
    }
    return res.rows[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const addGoogleUser = async (
  login: string,
  email: string,
  google_id: string
) => {
  try {
    const res = await pool.query("SELECT (add_google_user($1,$2,$3)).*;", [
      login,
      email,
      google_id,
    ]);
    //console.log("addGoogleUser:", res.rows);
    if (res.rows.length === 0 || res.rows[0].id === null) return null;
    return res.rows[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};
export const linkGoogleIdToExistingUser = async (
  email: string,
  googleId: string
) => {
  try {
    const res = await pool.query(
      `SELECT  (link_google_id_by_email($1, $2)).*;`,
      [email, googleId]
    );
    console.log("linkGoogleIdToExistingUser:", res.rows[0]);
    return res.rows[0];
  } catch (error) {
    console.error("Błąd podczas powiązania konta Google:", error);

    throw error;
  }
};

export const marklogin = async (userId: number): Promise<void> => {
  try {
    const res = await pool.query("SELECT (mark_user_login($1));", [userId]);

    if (res.rows.length === 0) {
      console.warn(
        `Nie znaleziono użytkownika o ID ${userId} do zaktualizowania.`
      );
    }
  } catch (err) {
    console.error("Błąd podczas oznaczania czasu logowania:", err);
    throw err;
  }
};
