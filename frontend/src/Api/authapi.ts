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
    return false;
  }
}

export default { login };
