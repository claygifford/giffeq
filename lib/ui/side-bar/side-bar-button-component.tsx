import React from 'react';
import styles from './side-bar-button.module.css';

type SideBarButtonProps = {
  children: React.ReactNode;
  onClick?;
  isSelected?: boolean;
  isOpen?: boolean;
};

export default function SideBarButtonComponent(props: SideBarButtonProps) {
  const { isSelected, children, onClick, isOpen } = props;

  return (
    <button
      onClick={onClick}
      type="submit"
      className={`${styles.SideBarButton} ${
        isSelected ? styles.SideBarButtonSelected : ''
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
