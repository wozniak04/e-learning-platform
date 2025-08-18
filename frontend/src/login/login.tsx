import "./loginpage.css";
import { useState } from "react";
import authapi from "../Api/authapi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function LoginPage() {
  const auth = useAuth();
  const [login_input, setlogin] = useState("");
  const [password, setpassword] = useState("");
  const [errormessage, seterrormessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await authapi.login(login_input, password);
    console.log(res);
    if (res) {
      auth.login(res.username);
      navigate("/main");
    } else {
      seterrormessage("zły login lub hasło");
    }
  };
  return (
    <>
      <form className="window" onSubmit={handleSubmit}>
        <h1>Logowanie</h1>
        {errormessage && <div className="error-message">{errormessage}</div>}
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
        <a href="#" onClick={() => navigate("/register")}>
          <p>założ konto</p>
        </a>
      </form>
    </>
  );
}
export default LoginPage;
