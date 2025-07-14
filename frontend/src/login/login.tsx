import "./loginpage.css";
import { useState } from "react";
import login from "../Api/loginapi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function LoginPage() {
  const auth = useAuth();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [errormessage, seterrormessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email);
    console.log(password);
    if (login(email, password)) {
      auth.login(email);
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
          type="email"
          placeholder="wpisz email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setemail(e.target.value)
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
