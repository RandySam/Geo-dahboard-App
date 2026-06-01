import sunIcon from "/icons/sun.png";
import moonIcon from "/icons/moon.png";
import burgerIcon from "/icons/burger-bar.png";

import { useNavigate } from "react-router-dom";

type Props = {
  darkMode: boolean;

  setDarkMode: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  onMenuClick?: () => void;
};

export default function Header({
  darkMode,
  setDarkMode,
  onMenuClick,
}: Props) {

  const navigate =
    useNavigate();

  return (
    <header className="header">

      <div className="header-left">

        <button
          className="mobile-menu-btn"
          onClick={onMenuClick}
          aria-label="Open Menu"
        >
          <img
            src={burgerIcon}
            alt="Menu"
          />
        </button>

        <button
          className="back-button"
          onClick={() =>
            navigate("/")
          }
        >
          ← Landing Page
        </button>

        <div className="header-brand">

          <div>

            <h1>
              GeoBekasi
            </h1>

            <p>
              Kota Bekasi
            </p>

          </div>

        </div>

      </div>

      <div className="header-right">

        <button
          className="theme-toggle"
          onClick={() =>
            setDarkMode(
              !darkMode
            )
          }
          aria-label="Toggle Theme"
        >

          <img
            src={
              darkMode
                ? moonIcon
                : sunIcon
            }
            alt="Theme Icon"
            className="theme-icon"
          />

        </button>

      </div>

    </header>
  );
}