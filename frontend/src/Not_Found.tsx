import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
  const { t } = useTranslation();
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
      }}>
      <h1>{t("not_found.title")}</h1>
      <p>{t("not_found.message")}</p>
      <p>{t("not_found.redirect", { seconds: seconds })}</p>
      <button
        onClick={() => navigate("/main")}
        style={{ padding: "10px 20px", cursor: "pointer" }}>
        {t("not_found.back_btn")}
      </button>
    </div>
  );
};

export default NotFoundPage;
