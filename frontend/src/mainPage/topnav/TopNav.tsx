import "./topnav.css";
import { useState } from "react";
import Settings_popup from "./Settings_popup";
interface TopNavProps {
  username: string;
  wylogowanie: () => void;
}

function TopNav(props: TopNavProps) {
  const handlebuttonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Button clicked!", e.currentTarget.innerHTML);
  };
  const [activeSetting, setActiveSetting] = useState(false);
  const handleSettingsClick = () => {
    setActiveSetting(!activeSetting);
  };
  return (
    <div className="topnav">
      <div className="topnav__logo">MyApp</div>
      <div className="topnav__links">
        <button className="topnav__link" onClick={handlebuttonClick}>
          Home
        </button>
        <button className="topnav__link" onClick={handlebuttonClick}>
          About
        </button>
        <button onClick={handlebuttonClick} className="topnav__link">
          {props.username}
        </button>
        {/* przycisk ustawień */}
        <div className="topnav__settings">
          <button className="topnav__link" onClick={handleSettingsClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.63l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a6.98 6.98 0 0 0-1.7-.98l-.38-2.65A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42l-.38 2.65a6.98 6.98 0 0 0-1.7.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.63l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.63l2 3.46c.14.24.44.34.7.22l2.49-1c.5.38 1.05.69 1.7.98l.38 2.65c.05.27.27.42.5.42h4c.23 0 .45-.15.5-.42l.38-2.65c.65-.29 1.2-.6 1.7-.98l2.49 1c.26.11.56.02.7-.22l2-3.46a.5.5 0 0 0-.12-.63l-2.11-1.65zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
            </svg>
          </button>
          {activeSetting && <Settings_popup wylogowanie={props.wylogowanie} />}
        </div>
      </div>
    </div>
  );
}
export default TopNav;
