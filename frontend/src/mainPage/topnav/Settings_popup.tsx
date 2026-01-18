import { useTranslation } from "react-i18next";

interface SettingsPopupProps {
  wylogowanie: () => void;
}

function Settings_popup(props: SettingsPopupProps) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <div className="topnav__popup">
      <div className="topnav__popup__section">
        <span className="topnav__popup__label">
          {t("settings.language", "Język")}
        </span>
        <div className="language-switcher">
          <button
            className={`lang-btn ${i18n.language === "pl" ? "active" : ""}`}
            onClick={() => changeLanguage("pl")}>
            PL
          </button>
          <button
            className={`lang-btn ${i18n.language === "en" ? "active" : ""}`}
            onClick={() => changeLanguage("en")}>
            EN
          </button>
        </div>
      </div>

      <div className="topnav__popup__divider"></div>

      <button
        className="topnav__popup__item logout-btn"
        onClick={() => props.wylogowanie()}>
        {t("settings.logout")}
      </button>
    </div>
  );
}

export default Settings_popup;
