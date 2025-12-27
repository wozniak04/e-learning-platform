import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const [seconds, setSeconds] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/main", { replace: true });
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>404 - Strona nie znaleziona</h1>
      <p>Ups! Wygląda na to, że zabłądziłeś.</p>
      <p>
        Zostaniesz przekierowany do strony głównej za <strong>{seconds}</strong>{" "}
        s...
      </p>
      <button
        onClick={() => navigate("/main")}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        Wróć teraz
      </button>
    </div>
  );
};

export default NotFoundPage;
