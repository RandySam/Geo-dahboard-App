import { useState } from "react";

import sunIcon from "/icons/sun.png";
import moonIcon from "/icons/moon.png";

type Props = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;

  showBatas: boolean;
  setShowBatas: (value: boolean) => void;

  showFasilitas: boolean;
  setShowFasilitas: (value: boolean) => void;

  showCluster: boolean;
  setShowCluster: (value: boolean) => void;
};

export default function MapMenu({
  darkMode,
  setDarkMode,
  showBatas,
  setShowBatas,
  showFasilitas,
  setShowFasilitas,
  showCluster,
  setShowCluster,
}: Props) {
  const [open, setOpen] =
    useState(false);

  return (
    <div
      className={`map-menu ${
        open ? "open" : ""
      }`}
    >
      {!open ? (
        <button
          className="menu-bubble"
          onClick={() =>
            setOpen(true)
          }
          aria-label="Open Map Menu"
        >
          ☰
        </button>
      ) : (
        <>
          <button
            className="menu-close"
            onClick={() =>
              setOpen(false)
            }
            aria-label="Close Map Menu"
          >
            ◀
          </button>

          <div className="theme-switch">
            <button
              className={
                !darkMode
                  ? "active"
                  : ""
              }
              onClick={() =>
                setDarkMode(false)
              }
              aria-label="Light Mode"
            >
              <img
                src={sunIcon}
                alt="Light Mode"
                className="theme-icon"
              />
            </button>

            <button
              className={
                darkMode
                  ? "active"
                  : ""
              }
              onClick={() =>
                setDarkMode(true)
              }
              aria-label="Dark Mode"
            >
              <img
                src={moonIcon}
                alt="Dark Mode"
                className="theme-icon"
              />
            </button>
          </div>

          <label>
            <span>
              Batas Wilayah
            </span>

            <input
              type="checkbox"
              checked={showBatas}
              onChange={() =>
                setShowBatas(
                  !showBatas
                )
              }
            />
          </label>

          <label>
            <span>
              Fasilitas
            </span>

            <input
              type="checkbox"
              checked={
                showFasilitas
              }
              onChange={() =>
                setShowFasilitas(
                  !showFasilitas
                )
              }
            />
          </label>

          <label>
            <span>
              Indikator Skor
            </span>

            <input
              type="checkbox"
              checked={showCluster}
              onChange={() =>
                setShowCluster(
                  !showCluster
                )
              }
            />
          </label>
        </>
      )}
    </div>
  );
}