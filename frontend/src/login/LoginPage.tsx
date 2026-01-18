import "./loginpage.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import authapi from "../Api/authapi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function LoginPage() {
  const { t } = useTranslation();
  const auth = useAuth();
  const [login_input, setlogin] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const onSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      console.log("No credential returned");
      return;
    }

    const loginres = await authapi.login_with_google(response.credential);
    if (loginres) {
      toast.success(t("auth.google_success"));
      auth.login(loginres.username);
      navigate(localStorage.getItem("lastPath") || "/main");
      localStorage.removeItem("lastPath");
    } else {
      toast.error(t("auth.google_error"));
    }
  };

  const onError = () => {
    toast.error(t("auth.google_error"));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await authapi.login(login_input, password);
    if (res) {
      auth.login(res.username);
      navigate("/main");
      toast.success(t("auth.login_success"));
    } else {
      toast.error(t("auth.invalid_credentials"));
    }
  };

  return (
    <>
      <form className="window" onSubmit={handleSubmit}>
        <h1>{t("auth.login_title")}</h1>
        <input
          name="email"
          type="text"
          placeholder={t("auth.login_placeholder")}
          value={login_input}
          onChange={(e) => setlogin(e.target.value)}
        />
        <input
          name="password"
          type="password"
          placeholder={t("auth.password_placeholder")}
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        <button type="submit">{t("auth.login_button")}</button>
        <a href="#">
          <p>{t("auth.forgot_password")}</p>
        </a>
        <GoogleLogin onSuccess={onSuccess} onError={onError} />
        <Link to="/register">
          <p>{t("auth.create_account")}</p>
        </Link>
      </form>
    </>
  );
}

export default LoginPage;
