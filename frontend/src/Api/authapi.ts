import axios from "axios";
import { getCsrfToken, getCsrfHeaders } from "./csrfHelper";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

async function login(email: string, password: string) {
  try {
    const tokencsrf = await getCsrfToken();
    const response = await axios.post(
      `${BACKEND_URL}/auth/login`,
      { login: email, password },
      {
        withCredentials: true,
        headers: getCsrfHeaders(tokencsrf),
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}
async function register(email: string, user_login: string, password: string) {
  try {
    const tokencsrf = await getCsrfToken();
    const res = await axios.post(
      `${BACKEND_URL}/auth/register`,
      { email, login: user_login, password },
      {
        withCredentials: true,
        headers: getCsrfHeaders(tokencsrf),
      }
    );
    return { status: res.status, message: res.data.message };
  } catch (error) {
    console.error(error);
    return false;
  }
}

const login_with_google = async (token: string) => {
  try {
    const tokencsrf = await getCsrfToken();
    const response = await axios.post(
      `${BACKEND_URL}/auth/login/google`,
      { token },
      {
        withCredentials: true,
        headers: getCsrfHeaders(tokencsrf),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};
export default { login, register, login_with_google };
