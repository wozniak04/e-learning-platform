import "./topnav.css";
import { useState } from "react";
import Settings_popup from "./Settings_popup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "react-toastify";
function TopNav() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [activeSetting, setActiveSetting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    auth.logout();
    toast.success("Wylogowano pomyślnie");
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

      <div className="topnav__center">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") console.log("enter " + searchQuery);
            }}
          />
          <button className="search-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className="topnav__right">
        <Link to="/main" className="topnav__link-text">
          Home
        </Link>

        <button className="topnav__btn-create" onClick={handleCreateCourse}>
          + Create Course
        </button>

        <div className="topnav__divider"></div>

        <div className="topnav__user-section">
          <span className="topnav__username">
            {auth.isAuthenticated ? (
              auth.username
            ) : (
              <Link to="/login" className="login-link">
                Login
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
