import "./loginpage.css";
import { useState } from "react";
import authapi from "../Api/authapi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { toast } from "react-toastify";
function LoginPage() {
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
    console.log(loginres.username);
    if (loginres) {
      toast.success("Pomyślnie zalogowano z Google");
      auth.login(loginres.username);
      navigate(localStorage.getItem("lastPath") || "/main");
      localStorage.removeItem("lastPath");
    } else {
      toast.error("Logowanie z Google nie powiodło się");
    }
  };
  const onError = () => {
    console.log("Login Failed");
    toast.error("Logowanie z Google nie powiodło się");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await authapi.login(login_input, password);
    console.log(res);
    if (res) {
      auth.login(res.username);
      navigate("/main");
      toast.success("Pomyślnie zalogowano");
    } else {
      toast.error("Zły login lub hasło");
    }
  };
  return (
    <>
      <form className="window" onSubmit={handleSubmit}>
        <h1>Logowanie</h1>
        <input
          name="email"
          type="text"
          placeholder="wpisz login lub email"
          value={login_input}
          onChange={(e) => setlogin(e.target.value)}
        />
        <input
          name="password"
          type="password"
          placeholder="wpisz hasło"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        <button type="submit">Zaloguj się</button>
        <a href="#">
          <p>Zapomniałem hasła</p>
        </a>
        <GoogleLogin onSuccess={onSuccess} onError={onError} />
        <a href="#" onClick={() => navigate("/register")}>
          <p>założ konto</p>
        </a>
      </form>
    </>
  );
}
export default LoginPage;
