import "./topnav.css";
import { useState } from "react";
import Settings_popup from "./Settings_popup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSavedCoursesStore } from "../../store/Courses/savedCoursesStore";

function TopNav() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const cleanSavedCourses = useSavedCoursesStore((state) => state.clearStore);

  const [activeSetting, setActiveSetting] = useState(false);

  const handleLogout = () => {
    cleanSavedCourses();
    auth.logout();
    toast.success(t("auth.logout_success"));
  };

  const handleSettingsClick = () => {
    setActiveSetting(!activeSetting);
  };

  const handleCreateCourse = () => {
    navigate("/course/create");
  };

  return (
    <nav className="topnav">
      <div className="topnav__left">
        <Link to="/main" className="topnav__logo">
          Edu<span>Platform</span>
        </Link>
      </div>

      <div className="topnav__right">
        <Link to="/main" className="topnav__link-text">
          {t("top_nav.home")}
        </Link>

        <button className="topnav__btn-create" onClick={handleCreateCourse}>
          + {t("top_nav.create_course")}
        </button>

        <div className="topnav__divider"></div>

        <div className="topnav__user-section">
          <span className="topnav__username">
            {auth.isAuthenticated ? (
              auth.username
            ) : (
              <Link to="/login" className="login-link">
                {t("auth.login")}
              </Link>
            )}
          </span>

          <div className="topnav__settings">
            {auth.isAuthenticated && (
              <button className="settings-toggle" onClick={handleSettingsClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </button>
            )}

            {activeSetting && auth.isAuthenticated && (
              <Settings_popup wylogowanie={handleLogout} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;
