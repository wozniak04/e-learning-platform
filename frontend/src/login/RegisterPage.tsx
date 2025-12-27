import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";
import authapi from "../Api/authapi";
import { toast } from "react-toastify";
function RegisterPage() {
  const [login_input, setlogin] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!login_input || !email || !password || !repeatPassword) {
      toast.error("Wypełnij wszystkie pola.");

      return;
    }
    if (password !== repeatPassword) {
      toast.error("Hasła się nie zgadzają.");

      return;
    }
    try {
      const res = await authapi.register(login_input, email, password);
      if (!res || res.status !== 201) {
        console.log(res);
        toast.error(res ? res.message : "Błąd rejestracji.");
        return;
      }
      toast.success("Rejestracja udana! Możesz się zalogować.");
      navigate("/login");
    } catch (error) {
      toast.error("Błąd rejestracji.");
      console.error(error);
    }
  };

  return (
    <form className="window" onSubmit={handleSubmit}>
      <h1>Rejestracja</h1>
      <input
        name="username"
        type="text"
        placeholder="Wpisz nazwę użytkownika"
        value={login_input}
        onChange={(e) => setlogin(e.target.value)}
      />
      <input
        name="email"
        type="email"
        placeholder="Wpisz email"
        value={email}
        onChange={(e) => setemail(e.target.value)}
      />
      <input
        name="password"
        type="password"
        placeholder="Wpisz hasło"
        value={password}
        onChange={(e) => setpassword(e.target.value)}
      />
      <input
        name="repeatPassword"
        type="password"
        placeholder="Powtórz hasło"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
      />
      <button type="submit">Zarejestruj się</button>
      <a href="/login">
        <p>Masz już konto? Zaloguj się</p>
      </a>
    </form>
  );
}

export default RegisterPage;
