type Props = {
  title: string;

  icon: string;

  isOpen: boolean;

  onToggle: () => void;

  children: React.ReactNode;
};

export default function SidebarDropdown({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: Props) {
  return (
    <div className="sidebar-dropdown-wrapper">
      {/* =====================
          BUTTON
         ===================== */}
      <button
        className={`sidebar-dropdown-btn ${
          isOpen ? "active" : ""
        }`}
        onClick={onToggle}
      >
        <div className="sidebar-dropdown-left">
          <img
            src={icon}
            alt={title}
          />

          <span>{title}</span>
        </div>

        <span className="sidebar-dropdown-arrow">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* =====================
          CONTENT
         ===================== */}
      {isOpen && (
        <div className="sidebar-dropdown-content">
          {children}
        </div>
      )}
    </div>
  );
}