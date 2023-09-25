import React, { Children } from 'react';
import styles from './button.module.css';

type ButtonProps = {
  type?: string;
  children: React.ReactNode;
  onClick?;
  variant?: "standard" | "sidebar" | "action";
  size?: "lg" | "md" | "sm";
  disabled?: boolean;
  labelText?: string;
};

export default function ButtonComponent(props: ButtonProps) {
  const {
    labelText,
    type,
    children,
    onClick,
    variant = 'standard',
    size = 'md',
    disabled,
  } = props;

  const variantClass = (() => {
    switch (variant) {
      case 'sidebar':
        return styles.SideBar;
      case 'standard':
        return styles.Standard;
      case 'action':
        return `${styles.Action} ${
          size === 'md' ? styles.ActionMd : styles.ActionSm
        }`;
    }
  })();

  return (
    <button    
      aria-label={labelText}
      onClick={onClick}
      type="submit"
      className={variantClass}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
