import "./loginpage.css";
import { useState } from "react";
import login from "../Api/loginapi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function LoginPage() {
  const auth = useAuth();
  const [login_input, setlogin] = useState("");
  const [password, setpassword] = useState("");
  const [errormessage, seterrormessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(login);
    console.log(password);
    if (login(login_input, password)) {
      auth.login(login_input);
      navigate("/main");
    } else {
      seterrormessage("zły email lub hasło");
    }
  };
  return (
    <>
      <form className="window" onSubmit={handleSubmit}>
        <h1>Logowanie</h1>
        <h3>{errormessage}</h3>
        <input
          name="email"
          type="text"
          placeholder="wpisz email"
          value={login_input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setlogin(e.target.value)
          }
        />
        <input
          name="password"
          type="password"
          placeholder="wpisz hasło"
          value={password}
          prefix="*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setpassword(e.target.value)
          }
        />
        <button type="submit">Zaloguj się</button>
        <a href="#">
          <p>Zapomniałem hasła</p>
        </a>
      </form>
    </>
  );
}
export default LoginPage;
