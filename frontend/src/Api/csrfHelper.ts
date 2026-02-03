import axios from "axios";
import { BACKEND_URL } from "../variables";

export async function getCsrfToken(): Promise<string> {
    try {
        const response = await axios.get(`${BACKEND_URL}/auth/csrf-token`, {
            withCredentials: true,
        });
        return response.data.csrfToken;
    } catch (error) {
        console.error("Error getting CSRF token:", error);
        throw error;
    }
}

export function getCsrfHeaders(token: string) {
    return {
        "x-csrf-token": token,
    };
}
