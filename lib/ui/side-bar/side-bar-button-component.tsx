import React from "react";
import styles from "./side-bar-button.module.css";

type SideBarButtonProps = {
  children: React.ReactNode;
  onClick?;
  isSelected?: boolean;
  isOpen?: boolean;
  classes?: string;
};

export default function SideBarButtonComponent(props: SideBarButtonProps) {
  const {
    isSelected,
    children,
    onClick,
    isOpen,
    classes = "px-2 py-2",
  } = props;

  return (
    <button
      aria-label="Sidebar button"
      onClick={onClick}
      type="submit"
      className={`${styles.SideBarButton} ${classes} ${
        isSelected ? styles.SideBarButtonSelected : ""
      } ${isOpen ? styles.SideBarButtonOpen : styles.SideBarButtonDefault}`}
    >
      <div
        className={`flex gap-4 font-medium ${
          isOpen
            ? styles.SideBarInnerButtonOpen
            : styles.SideBarInnerButtonDefault
        }`}
      >
        {children}
      </div>
    </button>
  );
}
