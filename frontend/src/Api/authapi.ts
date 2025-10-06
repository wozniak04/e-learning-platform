import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

async function login(email: string, password: string) {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/login`,
      { login: email, password },
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}
async function register(email: string, user_login: string, password: string) {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/register`,
      { email, login: user_login, password },
      { withCredentials: true }
    );
    return { status: res.status, message: res.data.message };
  } catch (error) {
    console.error(error);
    return false;
  }
}

export default { login, register };
