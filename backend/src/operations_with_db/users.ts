import pool from "./connectdb";

export const getUserByEmail = async (email: string) => {
  try {
    const res = await pool.query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);
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
    if (res.rows.length === 0) return null;
    return res.rows[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};
export const getUserByGoogleId = async (google_id: string) => {
  try {
    const res = await pool.query(`SELECT check_google_id_exists($1);`, [
      google_id,
    ]);
    if (res.rows.length === 0) return false;
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
    const res = await pool.query("SELECT add_google_user($1,$2,$3);", [
      email,
      login,
      google_id,
    ]);
    if (res.rows.length === 0) {
      throw new Error("Nie udało się utworzyć użytkownika Google.");
    }
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
    const sql = `SELECT * FROM link_google_id_by_email($1, $2)`;

    const res = await pool.query(sql, [email, googleId]);

    return res.rows[0];
  } catch (error) {
    console.error("Błąd podczas powiązania konta Google:", error);

    throw error;
  }
};
