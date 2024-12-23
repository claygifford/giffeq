import React from "react";
import styles from "./side-bar-button.module.css";

type SideBarActionProps = {
  children: React.ReactNode;
  onClick?;
  isOpen?: boolean;
  classes?: string;
};

export default function SideBarActionComponent(props: SideBarActionProps) {
  const { children, onClick, isOpen, classes = "px-2 py-2" } = props;

  return (
    <button
      aria-label="Sidebar button"
      onClick={onClick}
      type="submit"
      className={`${styles.SideBarAction} ${classes} ${
        isOpen ? styles.SideBarActionOpen : styles.SideBarActionDefault
      }`}
    >
      <div
        className={`flex gap-4 font-medium ${
          isOpen
            ? styles.SideBarInnerActionOpen
            : styles.SideBarInnerActionDefault
        }`}
      >
        {children}
      </div>
    </button>
  );
}
