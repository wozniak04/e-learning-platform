interface SettingsPopupProps {
  wylogowanie: () => void;
}

function Settings_popup(props: SettingsPopupProps) {
  const handleProfileClick = () => {
    console.log("Profile clicked");
  };
  return (
    <div className="topnav__popup">
      <button
        className="topnav__popup__item"
        onClick={() => handleProfileClick()}
      >
        Profile
      </button>
      <button
        className="topnav__popup__item"
        onClick={() => console.log("help clicked")}
      >
        Help
      </button>
      <button
        className="topnav__popup__item"
        onClick={() => props.wylogowanie()}
      >
        Log out
      </button>
    </div>
  );
}
export default Settings_popup;
