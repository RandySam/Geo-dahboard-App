import sunIcon from "/icons/sun.png";
import moonIcon from "/icons/moon.png";

import { useNavigate } from "react-router-dom";

type Props = {
  darkMode: boolean;

  setDarkMode: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

export default function Header({
  darkMode,
  setDarkMode,
}: Props) {

  const navigate =
    useNavigate();

  return (
    <header className="header">

      <div className="header-left">

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
              MagnetAktivitas
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