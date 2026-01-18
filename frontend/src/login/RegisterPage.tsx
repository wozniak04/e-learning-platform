import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./register.css";
import authapi from "../Api/authapi";
import { toast } from "react-toastify";

function RegisterPage() {
  const { t } = useTranslation();
  const [login_input, setlogin] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!login_input || !email || !password || !repeatPassword) {
      toast.error(t("auth.fill_all_fields"));
      return;
    }
    if (password !== repeatPassword) {
      toast.error(t("auth.passwords_dont_match"));
      return;
    }
    try {
      const res = await authapi.register(login_input, email, password);
      if (!res || res.status !== 201) {
        toast.error(res ? res.message : t("auth.registration_error"));
        return;
      }
      toast.success(t("auth.registration_success"));
      navigate("/login");
    } catch (error) {
      toast.error(t("auth.registration_error"));
      console.error(error);
    }
  };

  return (
    <form className="window" onSubmit={handleSubmit}>
      <h1>{t("auth.registration_title")}</h1>
      <input
        name="username"
        type="text"
        placeholder={t("auth.username_placeholder")}
        value={login_input}
        onChange={(e) => setlogin(e.target.value)}
      />
      <input
        name="email"
        type="email"
        placeholder={t("auth.email_placeholder")}
        value={email}
        onChange={(e) => setemail(e.target.value)}
      />
      <input
        name="password"
        type="password"
        placeholder={t("auth.password_placeholder")}
        value={password}
        onChange={(e) => setpassword(e.target.value)}
      />
      <input
        name="repeatPassword"
        type="password"
        placeholder={t("auth.repeat_password_placeholder")}
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
      />
      <button type="submit">{t("auth.register_button")}</button>
      <a href="/login">
        <p>{t("auth.have_account")}</p>
      </a>
    </form>
  );
}

export default RegisterPage;
